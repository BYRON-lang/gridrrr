import React from 'react';

// Array of muted colors for the skeleton containers
const randomColors = [
  'bg-red-200',
  'bg-orange-200', 
  'bg-yellow-200',
  'bg-green-200',
  'bg-teal-200',
  'bg-blue-200',
  'bg-indigo-200',
  'bg-purple-200',
  'bg-pink-200',
  'bg-rose-200',
  'bg-amber-200',
  'bg-lime-200',
  'bg-emerald-200',
  'bg-cyan-200',
  'bg-sky-200',
  'bg-violet-200',
  'bg-fuchsia-200',
  'bg-gray-200',
  'bg-slate-200',
  'bg-zinc-200',
  'bg-neutral-200',
  'bg-stone-200'
];

interface DesignItemSkeletonProps {
  index?: number;
}

const DesignItemSkeleton: React.FC<DesignItemSkeletonProps> = ({ index = 0 }) => {
  // Use deterministic color selection based on index to avoid hydration mismatch
  const getColorByIndex = (idx: number) => {
    return randomColors[idx % randomColors.length];
  };

  return (
    <div className="group relative aspect-[4/3] overflow-hidden cursor-zoom-in border border-gray-200 hover:border-gray-300 transition-all duration-200 rounded-lg">
      <div className={`w-full h-full ${getColorByIndex(index)} opacity-80`}></div>
    </div>
  );
};

export default DesignItemSkeleton;
