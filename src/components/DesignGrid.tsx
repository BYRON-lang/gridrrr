'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { fetchAllWebsites as fetchApprovedWebsites, Website } from '@/lib/supabase/websites';

type WebsiteWithTags = Omit<Website, 'tags'> & {
  submitted_by?: string;
  tags?: string | string[];
  [key: string]: string | number | boolean | string[] | undefined; // More specific type for dynamic properties
};
import Footer from './Footer';
import DesignItemSkeleton from './DesignItemSkeleton';

// Base design interface that extends Website with additional UI-specific properties
interface Design {
  id: string;
  title: string;
  url: string;
  description?: string;
  built_with?: string;
  preview_video_url: string;
  twitter_handle?: string;
  instagram_handle?: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  image_url?: string;
  type: 'design' | 'website';
  author: string;
  authorAvatar: string;
  views: number;
  likes: number;
  date: string;
  src: string;
  submitted_by?: string;
}

interface DesignGridProps {
  contentType: 'design' | 'website';
  activeCategory: string;
  initialWebsites?: WebsiteWithTags[];
  showLoadMore?: boolean;
}

const DesignGrid: React.FC<DesignGridProps> = ({ 
  contentType, 
  activeCategory, 
  initialWebsites = [],
  showLoadMore = true
}) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(showLoadMore);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const requestInProgress = useRef<boolean>(false);

  // Initialize with initialWebsites if provided
  useEffect(() => {
    if (initialWebsites.length > 0) {
      const initialDesigns = initialWebsites.map((website: WebsiteWithTags) => {
        // Safely handle tags which could be string, string[], or undefined
        const tags: string[] = [];
        const websiteTags = website.tags;
        
        if (websiteTags) {
          // Handle array of tags
          if (Array.isArray(websiteTags)) {
            websiteTags.forEach(tag => {
              if (typeof tag === 'string' && tag.trim() !== '') {
                tags.push(tag.trim());
              }
            });
          } 
          // Handle string of tags (comma-separated)
          else if (typeof websiteTags === 'string') {
            const tagStrings = websiteTags.split(',');
            tagStrings.forEach(tag => {
              const trimmed = tag.trim();
              if (trimmed) {
                tags.push(trimmed);
              }
            });
          }
        }
        
        return {
          id: website.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
          title: website.title || 'Untitled',
          url: website.url || '#',
          description: website.description,
          built_with: website.built_with,
          preview_video_url: website.preview_video_url || '',
          twitter_handle: website.twitter_handle,
          instagram_handle: website.instagram_handle,
          created_at: website.created_at || new Date().toISOString(),
          updated_at: website.updated_at || new Date().toISOString(),
          image_url: website.image_url,
          type: 'website' as const,
          src: website.preview_video_url || website.image_url || '/placeholder.jpg',
          tags: tags,
          author: website.submitted_by || 'Anonymous',
          authorAvatar: `https://unavatar.io/twitter/${website.twitter_handle || 'anonymous'}`,
          views: Math.floor(Math.random() * 1000),
          likes: Math.floor(Math.random() * 100),
          date: website.created_at 
            ? new Date(website.created_at).toLocaleDateString() 
            : new Date().toLocaleDateString(),
          submitted_by: website.submitted_by
        };
      });
      
      setDesigns(initialDesigns);
    }
  }, [initialWebsites]);

  // Filter designs based on active category
  const filterDesigns = useCallback((designsToFilter: Design[]) => {
    // If no category is selected or 'all' is selected, show all designs
    if (!activeCategory || activeCategory === 'all' || activeCategory === 'Filter') {
      return designsToFilter;
    }
    
    const activeCategoryLower = activeCategory.trim().toLowerCase();
    
    return designsToFilter.filter(design => {
      // If design has no tags, don't show it when a category is selected
      if (!design.tags || !Array.isArray(design.tags)) {
        return false;
      }
      
      // Normalize all tags to lowercase and trim whitespace
      const normalizedTags = design.tags
        .filter((tag): tag is string => typeof tag === 'string')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag !== '');
      
      // Check for exact match first, then try partial matches
      return normalizedTags.some(tag => {
        // Try exact match
        if (tag === activeCategoryLower) return true;
        
        // Try partial match (either tag contains category or category contains tag)
        if (tag.includes(activeCategoryLower) || activeCategoryLower.includes(tag)) {
          return true;
        }
        
        // Try splitting multi-word tags and check each word
        const tagWords = tag.split(/\s+/);
        const categoryWords = activeCategoryLower.split(/\s+/);
        
        // Check if any word in the tag matches any word in the category
        return tagWords.some(tagWord => 
          categoryWords.some(catWord => 
            tagWord === catWord || 
            tagWord.includes(catWord) || 
            catWord.includes(tagWord)
          )
        );
      });
    });
  }, [activeCategory]);
  
  // Get filtered designs based on active category
  const filteredDesigns = useMemo(() => {
    return filterDesigns(designs);
  }, [designs, filterDesigns]);

  // Fetch designs from the API
  const loadDesigns = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (isLoading || requestInProgress.current) {
      return;
    }
    
    requestInProgress.current = true;
    setIsLoading(true);
    
    try {
      const pageSize = 12;
      const result = await fetchApprovedWebsites(pageNum, pageSize);
      
      if (result.error) {
        return;
      }
      
      // Map the API response to Design objects
      const websiteDesigns: Design[] = result.data.map(website => {
        if (!website.id) {
          console.warn('Website missing ID, skipping:', website);
          return null;
        }

        // Ensure tags is always an array of strings
        const tags: string[] = [];
        const websiteTags = website.tags;
        
        if (websiteTags) {
          if (Array.isArray(websiteTags)) {
            // Handle array of tags
            websiteTags.forEach(tag => {
              if (typeof tag === 'string' && tag.trim() !== '') {
                tags.push(tag.trim());
              }
            });
          } else if (typeof websiteTags === 'string') {
            // Handle comma-separated string of tags
            const tagStrings = (websiteTags as string).split(',');
            tagStrings.forEach(tag => {
              const trimmed = tag.trim();
              if (trimmed) {
                tags.push(trimmed);
              }
            });
          }
        }
        
        const design: Design = {
          id: website.id,
          title: website.title || 'Untitled',
          url: website.url || '#',
          description: website.description,
          built_with: website.built_with,
          preview_video_url: website.preview_video_url || '',
          twitter_handle: website.twitter_handle,
          instagram_handle: website.instagram_handle,
          created_at: website.created_at || new Date().toISOString(),
          updated_at: website.updated_at || new Date().toISOString(),
          image_url: website.image_url,
          type: 'website',
          src: website.preview_video_url || website.image_url || '/placeholder.jpg',
          tags: tags,
          author: website.submitted_by || 'Anonymous',
          authorAvatar: `https://unavatar.io/twitter/${website.twitter_handle || 'anonymous'}`,
          views: 0,
          likes: 0,
          date: website.created_at ? new Date(website.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
          submitted_by: website.submitted_by
        };
        
        return design;
      }).filter((design): design is Design => design !== null);
      
      // Store all fetched designs, we'll filter them in the render
      setDesigns(prev => {
        if (reset) {
          return websiteDesigns;
        }
        // For pagination, only add new designs that aren't already in the list
        const existingIds = new Set(prev.map((design: Design) => design.id));
        const newDesigns = websiteDesigns.filter((design: Design) => !existingIds.has(design.id));
        return [...prev, ...newDesigns];
      });
      
      setHasMore(!!(result.hasMore && result.data.length === pageSize));
    } catch (_error) {
      // Error is handled by the UI state (isLoading will be set to false)
    } finally {
      setIsLoading(false);
      requestInProgress.current = false;
    }
  }, [isLoading]);

  // Reset and reload when activeCategory or contentType changes
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      if (isMounted) {
        setDesigns([]);
        setPage(1);
        setHasMore(true);
        await loadDesigns(1, true);
      }
    };
    
    // Only reload if we're not already loading
    if (!isLoading) {
      loadInitialData();
    }
    
    return () => {
      isMounted = false;
    };
  }, [activeCategory, contentType, isLoading]);

  // Set up intersection observer for infinite loading
  useEffect(() => {
    if (!showLoadMore || !loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage(prevPage => {
            const nextPage = prevPage + 1;
            loadDesigns(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [hasMore, isLoading, loadDesigns]);

  const renderDesignItem = useCallback((design: Design) => (
    <div key={design.id} className="group relative aspect-[4/3] overflow-hidden cursor-zoom-in border border-gray-200 hover:border-gray-300 transition-all duration-200 rounded-lg">
      <Link href={`/website/${design.id}`} className="block w-full h-full">
        {design.preview_video_url ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            webkit-playsinline="true"
            x5-playsinline="true"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="false"
            className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300 cursor-zoom-in"
            onError={(e) => {
              console.log('Video error:', e);
              // Fallback to image if video fails
              const videoElement = e.target as HTMLVideoElement;
              videoElement.style.display = 'none';
            }}
          >
            <source src={design.preview_video_url} type="video/mp4" />
            <source src={design.preview_video_url} type="video/webm" />
            {/* Fallback to image if video doesn't load */}
            <Image
              src={design.image_url || '/placeholder.jpg'}
              alt={design.title}
              fill
              className="object-cover"
              sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33.33vw, 25vw"
            />
          </video>
        ) : (
          <Image
            src={design.image_url || '/placeholder.jpg'}
            alt={design.title}
            fill
            className="object-cover group-hover:brightness-90 transition-all duration-300 cursor-zoom-in"
            sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33.33vw, 25vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 sm:p-4 flex flex-col justify-between">
          <div className="flex justify-end">
            <div className="bg-white/90 hover:bg-white text-black p-1.5 rounded-full cursor-pointer transition-all duration-200 hover:scale-110">
              <ArrowUpRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <div className="text-white">
            <h3 className="font-medium text-xs sm:text-sm line-clamp-2">{design.title}</h3>
          </div>
        </div>
      </Link>
    </div>
  ), []);

  if (designs.length === 0 && isLoading) {
    return (
      <div className="mt-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[...Array(8)].map((_, index) => (
            <DesignItemSkeleton key={index} index={index} />
          ))}
        </div>
      </div>
    );
  }

  if (designs.length === 0 && !isLoading) {
    return (
      <div className="mt-8 flex justify-center items-center h-64">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[...Array(8)].map((_, index) => (
            <DesignItemSkeleton key={index} index={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pb-24 sm:pb-32">
      {filteredDesigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No designs match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {filteredDesigns.map(renderDesignItem)}
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-4">
          {[...Array(4)].map((_, index) => (
            <DesignItemSkeleton key={`skeleton-${index}`} index={index} />
          ))}
        </div>
      )}
      
      {/* Load more trigger */}
      {hasMore && <div ref={loadMoreRef} className="h-10 w-full" />}
      
      <Footer />
    </div>
  );
} // Added missing closing brace for the component
export default DesignGrid;
