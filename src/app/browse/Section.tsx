'use client';

import Link from 'next/link';
import { useMemo } from 'react';

interface SectionProps {
  title: string;
  tags: string[];
  tagCounts: { [key: string]: number };
}

export default function Section({ title, tags, tagCounts }: SectionProps) {
  // Memoize the tag items to prevent unnecessary re-renders
  const tagItems = useMemo(() => {
    return tags.map(tag => {
      // Try exact match first
      let count = 0;
      if (tag in tagCounts) {
        count = tagCounts[tag];
      } else {
        // Try case-insensitive match
        const lowercaseTag = tag.toLowerCase();
        const matchingTag = Object.keys(tagCounts).find(
          key => key.toLowerCase() === lowercaseTag
        );
        if (matchingTag) {
          count = tagCounts[matchingTag];
        }
      }
      
      return {
        name: tag,
        count,
        slug: encodeURIComponent(tag.toLowerCase())
      };
    });
  }, [tags, tagCounts]);
  
  return (
    <section className="mt-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          {tagItems.map(({ name, count, slug }) => (
            <Link
              key={name}
              href={`/category/${slug}`}
              className="group flex items-center justify-between text-gray-700 hover:text-black transition-colors duration-150 py-2 text-base leading-relaxed border-b border-transparent hover:border-gray-200"
            >
              <span className="group-hover:underline">{name}</span>
              {count > 0 && (
                <span className="text-sm text-gray-400 group-hover:text-gray-600 font-mono">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
