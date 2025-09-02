'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Filters from '@/components/Filters';
import DesignGrid from '@/components/DesignGrid';
import DesignsGrid from '@/components/DesignsGrid';
import { SubmitWorkModal } from '@/components/SubmitWorkModal';

export default function Home() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [contentType, setContentType] = useState<'website' | 'design'>('website');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  return (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-4 pt-32 font-sans">
        <h1 className="text-3xl font-bold text-gray-500 mt-2">Gridrr</h1>
        <p className="text-black text-3xl font-semibold max-w-2xl leading-tight">
          Curated design inspirations<br />
          to transform your ideas<br />
          into stunning visual stories
        </p>
        <div className="mt-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Submit Your Work
            </button>
            <SubmitWorkModal 
              isOpen={isSubmitModalOpen} 
              onClose={() => setIsSubmitModalOpen(false)} 
            />
            <span className="text-gray-500 text-sm">20 Submissions yesterday</span>
          </div>
          <div className="mt-3 text-gray-500 text-sm">
            Need A Job? <a href="https://jobs.gridrr.com" className="text-black hover:underline font-medium">Find A Job</a>
          </div>
          
          <Filters 
            contentType={contentType}
            onTypeChange={setContentType} 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          {contentType === 'website' ? (
            <DesignGrid 
              contentType="website" 
              activeCategory={activeCategory}
            />
          ) : (
            <DesignsGrid 
              activeCategory={activeCategory}
            />
          )}
        </div>
      </header>
    </div>
  );
}
