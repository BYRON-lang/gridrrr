import React from 'react';

const DesignItemSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] bg-gray-200 rounded-lg"></div>
      <div className="mt-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default DesignItemSkeleton;
