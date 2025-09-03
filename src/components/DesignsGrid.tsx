'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { fetchDesigns, Design } from '@/lib/supabase/designs';
import Footer from './Footer';
import DesignSkeleton from './DesignSkeleton';

interface DesignsGridProps {
  activeCategory: string;
  initialDesigns?: Design[];
}

const DesignsGrid: React.FC<DesignsGridProps> = ({ 
  activeCategory, 
  initialDesigns = []
}) => {
  const [loading, setLoading] = useState(false);
  const [designs, setDesigns] = useState<Design[]>(initialDesigns);
  const [filteredDesigns, setFilteredDesigns] = useState<Design[]>([]);

  // Filter designs based on active category
  const filterDesigns = useCallback((designsToFilter: Design[]) => {
    return designsToFilter.filter(design => {
      // Filter by active category if not 'all'
      if (activeCategory !== 'all' && activeCategory !== 'Filter' && design.tags) {
        // Since the Design interface defines tags as string[], we can safely use it as an array
        if (!Array.isArray(design.tags)) {
          return false;
        }
        
        // Filter using the tags array directly
        return design.tags.some(tag => 
          typeof tag === 'string' && 
          tag.toLowerCase() === activeCategory.toLowerCase()
        );
      }
      
      return true;
    });
  }, [activeCategory]);

  // Initial data loading
  useEffect(() => {
    const loadDesigns = async () => {
      try {
        setLoading(true);
        const result = await fetchDesigns();
        
        const designsWithExtras = result.map(design => ({
          ...design,
          src: design.image_url || '/placeholder.jpg',
        }));
        
        setDesigns(designsWithExtras);
        setFilteredDesigns(filterDesigns(designsWithExtras));
      } catch (_error) {
        // Error is handled by the UI state (loading will be set to false)
      } finally {
        setLoading(false);
      }
    };
    
    loadDesigns();
  }, [filterDesigns]);

  // Update filtered designs when activeCategory or designs change
  useEffect(() => {
    setFilteredDesigns(filterDesigns(designs));
  }, [activeCategory, designs, filterDesigns]);

  const renderDesignItem = (design: Design) => (
    <div key={design.id} className="group relative aspect-[4/3] overflow-hidden cursor-zoom-in border border-gray-200 hover:border-gray-300 transition-all duration-200">
      <Link href={`/design/${design.id}`} className="block w-full h-full">
        <Image
          src={design.image_url || '/placeholder.jpg'}
          alt={design.title}
          fill
          className="object-cover group-hover:brightness-90 transition-all duration-300 cursor-zoom-in"
          sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33.33vw, 25vw"
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
  );

  if (loading && filteredDesigns.length === 0) {
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

  if (filteredDesigns.length === 0) {
    return (
      <div className="mt-8 flex flex-col justify-center items-center h-64">
        <p className="text-gray-500 text-lg">No designs found for this category.</p>
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
      <Footer />
    </div>
  );
};

export default DesignsGrid;