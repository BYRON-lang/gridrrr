'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { Design } from '@/lib/supabase/designs';
import { useInfiniteDesigns } from '@/lib/hooks/useDesigns';
import { fetchDesignsByTag } from '@/lib/supabase/designs';
import Footer from './Footer';
import DesignSkeleton from './DesignSkeleton';

interface DesignsGridProps {
  activeCategory: string;
}

const DesignsGrid: React.FC<DesignsGridProps> = ({ 
  activeCategory 
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Use the infinite loading hook with caching
  const [taggedDesigns, setTaggedDesigns] = React.useState<Design[]>([]);
  const [isLoadingTagged, setIsLoadingTagged] = React.useState(false);
  const [tagError, setTagError] = React.useState<Error | null>(null);

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

  // Use the standard infinite loading for non-tag filters
  const {
    data: designs,
    count,
    hasMore,
    isLoading,
    isLoadingMore: hookIsLoadingMore,
    error,
    loadMore
  } = useInfiniteDesigns({
    pageSize: 20,
    category: !isTagFilter ? (activeCategory === 'all' || activeCategory === 'Filter' ? undefined : activeCategory) : undefined,
    enabled: !isTagFilter // Only enable infinite loading if not filtering by tag
  });

  // Handle load more with loading state
  const handleLoadMore = useCallback(async () => {
    if (hasMore && !hookIsLoadingMore) {
      setIsLoadingMore(true);
      await loadMore();
      setIsLoadingMore(false);
    }
  }, [hasMore, hookIsLoadingMore, loadMore]);

  // Memoize filtered designs to prevent unnecessary re-renders
  const filteredDesigns = useMemo(() => {
    const sourceDesigns = isTagFilter ? taggedDesigns : designs;
    return sourceDesigns.map(design => ({
      ...design,
      src: design.image_url || '/placeholder.jpg',
    }));
  }, [designs, taggedDesigns, isTagFilter]);

  const renderDesignItem = useCallback((design: Design) => (
    <div key={design.id} className="group relative aspect-[4/3] overflow-hidden cursor-zoom-in border border-gray-200 hover:border-gray-300 transition-all duration-200">
      <Link href={`/design/${design.id}`} className="block w-full h-full">
        <Image
          src={design.image_url || '/placeholder.jpg'}
          alt={design.title}
          fill
          className="object-cover group-hover:brightness-90 transition-all duration-300 cursor-zoom-in"
          sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33.33vw, 25vw"
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 sm:p-4 flex flex-col justify-between">
          <div className="flex justify-end">
            <div className="bg-white/90 hover:bg-white text-black p-1.5 cursor-pointer transition-all duration-200 hover:scale-110">
              <ArrowUpRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <div className="text-white">
            <h3 className="font-medium text-xs sm:text-sm line-clamp-2">{design.title}</h3>
            <p className="text-xs mt-1 opacity-80">{design.designer_name}</p>
          </div>
        </div>
      </Link>
    </div>
  ), []);

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

  // Show initial loading state
  if ((isLoading || isLoadingTagged) && filteredDesigns.length === 0) {
    return (
      <div className="mt-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[...Array(8)].map((_, index) => (
            <DesignSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Show empty state
  if (!isLoading && filteredDesigns.length === 0) {
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
        {filteredDesigns.map((design) => (
          <div key={design.id}>
            {renderDesignItem(design)}
          </div>
        ))}
      </div>
      
      {/* Load more section */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore || hookIsLoadingMore}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoadingMore || hookIsLoadingMore ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              `Load More (${count - filteredDesigns.length} remaining)`
            )}
          </button>
        </div>
      )}
      
      {/* Loading more skeleton */}
      {(isLoadingMore || hookIsLoadingMore) && (
        <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[...Array(4)].map((_, index) => (
            <DesignSkeleton key={`loading-${index}`} />
          ))}
        </div>
      )}
      
      <Footer />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(DesignsGrid);