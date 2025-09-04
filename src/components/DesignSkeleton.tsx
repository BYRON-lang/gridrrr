import React from 'react';

const DesignSkeleton: React.FC = () => {
  return (
    <div className="group relative aspect-[4/3] overflow-hidden border border-gray-200 animate-pulse">
      {/* Main image skeleton */}
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      
      {/* Overlay content skeleton */}
      <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between opacity-30">
        {/* Top right icon */}
        <div className="flex justify-end">
          <div className="bg-gray-300 w-6 h-6 sm:w-8 sm:h-8 rounded"></div>
        </div>
        
        {/* Bottom content */}
        <div className="space-y-2">
          <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-2 sm:h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default React.memo(DesignSkeleton);
