'use client';

import Link from 'next/link';

interface TagsDropdownProps {
  className?: string;
}

export default function TagsDropdown({ className = '' }: TagsDropdownProps) {
  return (
    <div className={`relative ${className}`}>
      <Link
        href="/browse"
        className="px-0 py-0 bg-transparent text-lg font-semibold text-gray-800 hover:text-black transition-colors"
      >
        Browse
      </Link>
    </div>
  );
}
