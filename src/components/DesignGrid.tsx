'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
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
  contentType: 'design' | 'website'; // Removed 'all' as per requirements
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
    if (isLoading) return;
    
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
      
      // Map all results to website type since we're only showing websites now
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
      
      // Filter designs by active category if not 'all' or 'Filter'
      let filteredDesigns = [...websiteDesigns];
      
      console.log('Before filtering - Total designs:', filteredDesigns.length);

      if (activeCategory && activeCategory !== 'all' && activeCategory !== 'Filter') {
        console.log('Filtering by category:', activeCategory);
        filteredDesigns = filteredDesigns.filter(design => {
          if (!design.tags || !Array.isArray(design.tags)) {
            return false;
          }
          return design.tags.some(tag => 
            tag.toLowerCase() === activeCategory.toLowerCase()
          );
        });
        
        console.log('After category filtering - Remaining designs:', filteredDesigns.length);
      }
      
      setDesigns(prev => {
        if (reset) return filteredDesigns;
        // Only add new items that don't already exist in the array
        const existingIds = new Set(prev.map(d => d.id));
        const newItems = filteredDesigns.filter(d => !existingIds.has(d.id));
        return [...prev, ...newItems];
      });
      
      setPage(pageNum);
      setHasMore(result.hasMore && result.data.length === pageSize);
    } catch (error) {
      console.error('Error loading websites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [contentType, activeCategory, isLoading, hasMore]);
  
  // Initial load and reset when filters change
  useEffect(() => {
    setDesigns([]);
    setPage(1);
    setHasMore(true);
    
    const timer = setTimeout(() => {
      loadDesigns(1, true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [activeCategory, contentType]);
  
  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || isLoading) return;
    
    const currentObserver = observer.current;
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          loadDesigns(page + 1);
        }
      });
    };
    
    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    };
    
    if (loadMoreRef.current) {
      const newObserver = new IntersectionObserver(observerCallback, options);
      newObserver.observe(loadMoreRef.current);
      observer.current = newObserver;
      
      return () => {
        if (newObserver) {
          newObserver.disconnect();
        }
      };
    }
  }, [hasMore, isLoading, loadDesigns, page]);

  const renderDesignItem = useCallback((design: Design) => (
    <div className="group relative aspect-[4/3] overflow-hidden cursor-zoom-in border border-gray-200 hover:border-gray-300 transition-all duration-200 rounded-lg">
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
            <img 
              src={design.image_url || '/placeholder.jpg'} 
              alt={design.title}
              className="w-full h-full object-cover"
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
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {designs.map((design) => (
          <div key={design.id} className="w-full">
            {renderDesignItem(design)}
          </div>
        ))}
      </div>
      
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
