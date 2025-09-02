'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { fetchApprovedWebsites, Website } from '@/lib/supabase/websites';
import Footer from './Footer';
import DesignItemSkeleton from './DesignItemSkeleton';

// Base design interface that extends Website with additional UI-specific properties
interface Design extends Website {
  type: 'design' | 'website';
  author: string;
  authorAvatar: string;
  views: number;
  likes: number;
  date: string;
  src: string;
}

interface DesignGridProps {
  contentType: 'all' | 'design' | 'website';
  activeCategory: string;
}

const DesignGrid: React.FC<DesignGridProps> = ({ contentType, activeCategory }) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch and filter designs based on content type and active category
  const loadDesigns = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (isLoading || (pageNum > 1 && !hasMore)) return;
    
    console.log(`Fetching page ${pageNum} with content type: ${contentType}, category: ${activeCategory}`);
    setIsLoading(true);
    try {
      const pageSize = 12; // Number of items per page
      const result = await fetchApprovedWebsites(pageNum, pageSize);
      
      console.log('API Response:', {
        page: pageNum,
        items: result.data?.length,
        hasMore: result.hasMore,
        data: result.data
      });
      
      if (result.error) {
        console.error('Error loading websites:', result.error);
        return;
      }
      
      const websiteDesigns: Design[] = result.data.map(website => ({
        ...website,
        type: 'website' as const,
        src: website.preview_video_url || website.image_url || '/placeholder.jpg',
        tags: website.tags || [],
        author: website.submitted_by || 'Anonymous',
        authorAvatar: '',
        views: 0,
        likes: 0,
        date: new Date(website.created_at).toLocaleDateString(),
      }));
      
      // Filter designs by content type and category
      let filteredDesigns = websiteDesigns;
      
      console.log('Before filtering - Total designs:', filteredDesigns.length);
      
      // Filter by content type if not 'all'
      if (contentType !== 'all') {
        filteredDesigns = filteredDesigns.filter(design => {
          // Only include if type matches the content type filter
          return design.type === contentType;
        });
      }

      // Filter by active category if not 'all' or 'Filter'
      if (activeCategory && activeCategory !== 'all' && activeCategory !== 'Filter') {
        console.log('Filtering by category:', activeCategory);
        filteredDesigns = filteredDesigns.filter(design => {
          if (!design.tags || !Array.isArray(design.tags)) {
            console.warn('Invalid tags for design:', design.id, design.tags);
            return false;
          }
          
          const hasCategory = design.tags.some(tag => 
            tag.toLowerCase() === activeCategory.toLowerCase()
          );
          
          console.log(`Design ${design.id} (${design.title}) has tag ${activeCategory}:`, hasCategory);
          return hasCategory;
        });
        
        console.log('After category filtering - Remaining designs:', filteredDesigns.length);
      }
      
      setDesigns(prev => reset ? filteredDesigns : [...prev, ...filteredDesigns]);
      setHasMore(result.data.length === pageSize);
    } catch (error) {
      console.error('Error loading websites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [contentType, activeCategory, isLoading]);
  
  // Initial load and reset when filters change
  useEffect(() => {
    setPage(1);
    setDesigns([]); // Clear existing designs when filters change
    setHasMore(true); // Reset hasMore when filters change
    loadDesigns(1, true);
  }, [contentType, activeCategory]);
  
  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || isLoading) return;
    
    const currentObserver = observer.current;
    const observerCallback: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setPage(prev => {
          // Only trigger load if we're not already loading and there are more items
          if (!isLoading && hasMore) {
            loadDesigns(prev + 1);
            return prev + 1;
          }
          return prev;
        });
      }
    };
    
    const options = {
      root: null,
      rootMargin: '200px', // Start loading when within 200px of the viewport
      threshold: 0.1,
    };
    
    if (loadMoreRef.current) {
      // Disconnect any existing observer
      if (currentObserver) {
        currentObserver.disconnect();
      }
      
      // Create new observer
      const newObserver = new IntersectionObserver(observerCallback, options);
      newObserver.observe(loadMoreRef.current);
      observer.current = newObserver;
    }
    
    // Cleanup function
    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [hasMore, isLoading, loadDesigns]);

  const renderDesignItem = (design: Design, index: number) => (
    <div className="group relative aspect-[4/3] overflow-hidden cursor-zoom-in border border-gray-200 hover:border-gray-300 transition-all duration-200 rounded-lg">
      <Link href={`/website/${design.id}`} className="block w-full h-full">
        {design.preview_video_url ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300 cursor-zoom-in"
          >
            <source src={design.preview_video_url} type="video/mp4" />
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
  );

  if (designs.length === 0 && isLoading) {
    return (
      <div className="mt-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[...Array(8)].map((_, index) => (
            <DesignItemSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (designs.length === 0 && !isLoading) {
    return (
      <div className="mt-8 flex justify-center items-center h-64">
        <p className="text-gray-500">No designs found. Try a different filter.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 pb-24 sm:pb-32">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {designs.map((design, index) => (
          <div key={`${design.id}-${index}`} className="group relative aspect-[4/3] overflow-hidden cursor-zoom-in border border-gray-200 hover:border-gray-300 transition-all duration-200 rounded-lg">
            <Link href={`/website/${design.id}`} className="block w-full h-full">
              {design.preview_video_url ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300 cursor-zoom-in"
                >
                  <source src={design.preview_video_url} type="video/mp4" />
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
        ))}
      </div>
      
      {/* Load more trigger */}
      <div ref={loadMoreRef} className="w-full py-6">
        {isLoading && (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {[...Array(4)].map((_, index) => (
              <DesignItemSkeleton key={`loading-${index}`} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default DesignGrid;
