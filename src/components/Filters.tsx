'use client';

import React, { useEffect } from 'react';
import { 
  FunnelIcon,
  RectangleGroupIcon,
  ChartBarIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  BriefcaseIcon,
  PhotoIcon,
  VideoCameraIcon,
  CubeIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

interface FiltersProps {
  contentType: 'all' | 'design' | 'website';
  onTypeChange: (type: 'all' | 'design' | 'website') => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ 
  contentType = 'all',
  onTypeChange = () => {},
  activeCategory = 'all',
  onCategoryChange = () => {}
}) => {
  
  useEffect(() => {
    onTypeChange(contentType);
  }, [contentType, onTypeChange]);
  
  const handleFilterClick = (filterName: string) => {
    onCategoryChange(filterName === activeCategory ? 'all' : filterName);
  };
  
  const filterColors = {
    'Filter': 'bg-purple-600 hover:bg-purple-700',
    'Portfolios': 'bg-blue-600 hover:bg-blue-700',
    'Websites': 'bg-green-600 hover:bg-green-700',
    'Mobile': 'bg-red-600 hover:bg-red-700',
    'AI': 'bg-pink-600 hover:bg-pink-700',
    'UI/UX': 'bg-indigo-600 hover:bg-indigo-700',
    '3D': 'bg-yellow-600 hover:bg-yellow-700',
    'SaaS': 'bg-cyan-600 hover:bg-cyan-700',
    'Motion': 'bg-orange-600 hover:bg-orange-700',
    'Photography': 'bg-rose-600 hover:bg-rose-700',
    'Dashboard': 'bg-teal-600 hover:bg-teal-700'
  };

  const filters = [
    { name: 'Filter', icon: <FunnelIcon className="h-5 w-5" /> },
    { name: 'Portfolios', icon: <BriefcaseIcon className="h-5 w-5" /> },
    { name: 'Websites', icon: <CodeBracketIcon className="h-5 w-5" /> },
    { name: 'Mobile', icon: <DevicePhoneMobileIcon className="h-5 w-5" /> },
    { name: 'AI', icon: <SparklesIcon className="h-5 w-5" /> },
    { name: 'UI/UX', icon: <RectangleGroupIcon className="h-5 w-5" /> },
    { name: '3D', icon: <CubeIcon className="h-5 w-5" /> },
    { name: 'SaaS', icon: <CloudIcon className="h-5 w-5" /> },
    { name: 'Motion', icon: <VideoCameraIcon className="h-5 w-5" /> },
    { name: 'Photography', icon: <PhotoIcon className="h-5 w-5" /> },
    { name: 'Dashboard', icon: <ChartBarIcon className="h-5 w-5" /> }
  ];

  return (
    <div className="mb-8 mt-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-3 px-1 sm:px-4 no-scrollbar">
          {/* Content Type Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full flex-shrink-0">
            {(['website', 'design'] as const).map((type) => {
              const isActive = contentType === type;
              const buttonText = type === 'website' ? 'Websites' : 'Designs';
              const baseClasses = 'px-5 py-1.5 rounded-full text-sm font-medium transition-colors';
              const activeClasses = isActive 
                ? 'bg-white text-black shadow-sm' 
                : 'text-gray-600 hover:bg-gray-200/50';
              
              return (
                <button
                  key={type}
                  onClick={() => onTypeChange(type)}
                  className={`${baseClasses} ${activeClasses}`}
                >
                  {buttonText}
                </button>
              );
            })}
          </div>
          
          {/* Vertical Divider */}
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          
          {/* Hide scrollbar for Chrome, Safari and Opera */}
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          {filters.map((filter, index) => {
            const isActive = activeCategory === filter.name;
            return (
              <button 
                key={index}
                onClick={() => handleFilterClick(filter.name)}
                className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl sm:rounded-3xl text-sm sm:text-base font-medium transition-all whitespace-nowrap ${
                  isActive 
                    ? `${filterColors[filter.name as keyof typeof filterColors] || 'bg-gray-600'} text-white shadow-md`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                {filter.icon}
                <span>{filter.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filters;
