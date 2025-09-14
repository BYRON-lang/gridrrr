'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Design } from '@/lib/supabase/designs';
import { useInfiniteDesigns } from '@/lib/hooks/useDesigns';
import { fetchDesignsByTag } from '@/lib/supabase/designs';
import Footer from './Footer';
// Loading placeholder component
const BlurPlaceholder = () => (
  <div className="aspect-[4/3] bg-gray-100 animate-pulse overflow-hidden">
    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 opacity-50" />
  </div>
);

interface DesignsGridProps {
  activeCategory: string;
}

const DesignsGrid: React.FC<DesignsGridProps> = ({ 
  activeCategory 
}) => {
  const [isLoadingMore] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastDesignRef = useRef<HTMLDivElement>(null);

  // Use the infinite loading hook with caching
  const [taggedDesigns, setTaggedDesigns] = useState<Design[]>([]);
  const [isLoadingTagged, setIsLoadingTagged] = useState(false);
  const [tagError, setTagError] = useState<Error | null>(null);

  // Check if we're filtering by a tag (from category page)
  const isTagFilter = activeCategory && activeCategory !== 'all' && activeCategory !== 'Filter';

  // Fetch designs by tag if we're on a tag page
  React.useEffect(() => {
    if (isTagFilter) {
      const fetchTaggedDesigns = async () => {
        setIsLoadingTagged(true);
        try {
          const designs = await fetchDesignsByTag(activeCategory);
          setTaggedDesigns(designs);
          setTagError(null);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setTagError(error);
          console.error('Error fetching designs by tag:', error);
        } finally {
          setIsLoadingTagged(false);
        }
      };
      
      fetchTaggedDesigns();
    }
  }, [activeCategory, isTagFilter]);

  // Log active category and tag filter status
  console.log('DesignsGrid - activeCategory:', activeCategory, 'isTagFilter:', isTagFilter);

  // Use the standard infinite loading for non-tag filters
  const {
    data: designs,
    hasMore,
    isLoading,
    isLoadingMore: hookIsLoadingMore,
    error,
    loadMore
  } = useInfiniteDesigns({
    pageSize: 20,
    category: !isTagFilter ? (activeCategory === 'all' || activeCategory === 'Filter' ? undefined : activeCategory) : undefined,
    status: 'all', // Fetch all designs regardless of status
    enabled: !isTagFilter // Only enable infinite loading if not filtering by tag
  });

  // Log designs data when it changes
  React.useEffect(() => {
    console.log('Designs data updated:', {
      designsCount: designs?.length || 0,
      isLoading,
      error,
      hasMore
    });
  }, [designs, isLoading, error, hasMore]);

  // Auto-load more when scrolling to bottom
  useEffect(() => {
    if (!hasMore || isLoading || isLoadingMore || hookIsLoadingMore) return;

    const currentObserver = observer.current;
    const currentLoadingRef = loadingRef.current;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        console.log('Loading more designs...');
        loadMore();
      }
    };

    const options = {
      root: null,
      rootMargin: '200px', // Start loading when within 200px of viewport
      threshold: 0.01,
    };

    // Disconnect previous observer if it exists
    if (currentObserver) {
      currentObserver.disconnect();
    }

    // Create new observer
    const newObserver = new IntersectionObserver(handleObserver, options);
    observer.current = newObserver;
    
    // Observe the loading ref if it exists
    if (currentLoadingRef) {
      newObserver.observe(currentLoadingRef);
    }

    return () => {
      if (newObserver) {
        newObserver.disconnect();
      }
    };
  }, [hasMore, isLoading, isLoadingMore, hookIsLoadingMore, loadMore]);

  // Memoize filtered designs to prevent unnecessary re-renders
  const filteredDesigns = useMemo(() => {
    const sourceDesigns = isTagFilter ? (taggedDesigns || []) : (designs || []);
    console.log('Filtering designs - isTagFilter:', isTagFilter, 'sourceDesigns count:', sourceDesigns?.length || 0);
    
    const result = sourceDesigns.map(design => ({
      ...design,
      src: design.image_url || '/placeholder.jpg',
    }));
    
    console.log('Filtered designs result count:', result.length);
    return result;
  }, [designs, taggedDesigns, isTagFilter]);

  const DesignItem = React.memo(function DesignItem({ design }: { design: Design }) {
    const [isImageLoading, setIsImageLoading] = useState(true);
    
    return (
      <div className="group relative aspect-[4/3] overflow-hidden cursor-zoom-in border border-gray-200 hover:border-gray-300 transition-all duration-300">
        <Link href={`/design/${design.id}`} className="block w-full h-full">
          <div className={`absolute inset-0 transition-opacity duration-300 ${isImageLoading ? 'opacity-100' : 'opacity-0'}`}>
            <BlurPlaceholder />
          </div>
          <Image
            src={design.image_url || '/placeholder.jpg'}
            alt={design.title}
            fill
            className={`object-cover group-hover:brightness-90 transition-all duration-300 cursor-zoom-in ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33.33vw, 25vw"
            priority={false}
            onLoadingComplete={() => setIsImageLoading(false)}
            loading="lazy"
          />
          <div className={`absolute inset-0 p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 ${
            isImageLoading ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
          }`}>
            {/* Arrow in top right corner */}
            <div className="flex justify-end">
              <div className="bg-gray-600 hover:bg-gray-700 text-white p-1.5 rounded-3xl cursor-pointer transition-all duration-200 hover:scale-110">
                <ArrowRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            
            {/* Title at the bottom left with solid grey container */}
            <div className="w-full flex justify-start">
              <div className="bg-gray-600 text-white text-xs font-medium px-3 py-1.5 rounded-3xl w-40 truncate">
                {design.title}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  });
  
  // Add display name for the memoized component
  (DesignItem as React.NamedExoticComponent).displayName = 'DesignItem';

  const renderDesignItem = useCallback((design: Design) => (
    <DesignItem key={design.id} design={design} />
  ), [DesignItem]);

  // Show error state
  if (error || tagError) {
    return (
      <div className="mt-8 flex flex-col justify-center items-center h-64">
        <p className="text-red-500 text-lg">Error loading designs. Please try again.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show initial loading state with blurry placeholders
  if ((isLoading || isLoadingTagged) && (!filteredDesigns || filteredDesigns.length === 0)) {
    return (
      <div className="mt-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[...Array(8)].map((_, index) => (
            <BlurPlaceholder key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Show empty state
  if (!isLoading && (!filteredDesigns || filteredDesigns.length === 0)) {
    return (
      <div className="mt-8 flex flex-col justify-center items-center h-64">
        <p className="text-gray-500 text-lg">No designs found for this category.</p>
        <p className="text-gray-400 text-sm mt-2">Try selecting a different category or check back later.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 pb-24 sm:pb-32">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {filteredDesigns.map((design, index) => (
          <div 
            key={design.id} 
            ref={index === filteredDesigns.length - 1 ? lastDesignRef : null}
          >
            {renderDesignItem(design)}
          </div>
        ))}
      </div>
      
      {/* Loading indicator at the bottom */}
      {(isLoadingMore || hookIsLoadingMore) && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            Loading more designs...
          </div>
        </div>
      )}
      
      {/* Intersection observer target - only render if there are more items to load */}
      {hasMore && !isLoading && !isLoadingMore && !hookIsLoadingMore && (
        <div 
          ref={loadingRef} 
          className="h-1 w-full"
          style={{ marginTop: '-100px', pointerEvents: 'none' }}
        />
      )}
      
      {/* Loading more placeholders */}
      {(isLoadingMore || hookIsLoadingMore) && (
        <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[...Array(4)].map((_, index) => (
            <BlurPlaceholder key={`loading-${index}`} />
          ))}
        </div>
      )}
      
      <Footer />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(DesignsGrid);