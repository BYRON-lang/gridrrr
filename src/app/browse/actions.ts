'use server';

import { fetchWebsiteTagCounts } from '@/lib/supabase/websites';
import { fetchDesignTagCounts } from '@/lib/supabase/designs';

interface TagCounts {
  [key: string]: number;
}

export async function getTagCounts(): Promise<TagCounts> {
  try {
    console.log('Fetching tag counts...');
    const [websiteTagCounts, designTagCounts] = await Promise.all([
      fetchWebsiteTagCounts(),
      fetchDesignTagCounts()
    ]);

    console.log('Website tag counts:', websiteTagCounts);
    console.log('Design tag counts:', designTagCounts);

    // Create a map to store normalized tag to original tag mapping and counts
    const tagMap = new Map<string, { originalTag: string; count: number }>();
    
    // Process website tags
    if (Array.isArray(websiteTagCounts)) {
      websiteTagCounts.forEach(item => {
        if (item && typeof item === 'object' && 'tag' in item && 'count' in item) {
          // Use normalized tag as the key
          const normalizedTag = item.normalizedTag || item.tag.toLowerCase().trim();
          const existing = tagMap.get(normalizedTag);
          
          if (existing) {
            // If tag already exists, add to the count
            existing.count += item.count;
          } else {
            // Otherwise, add new entry
            tagMap.set(normalizedTag, {
              originalTag: item.tag, // Keep the original casing for display
              count: item.count
            });
          }
        }
      });
    }
    
    // Process design tags
    if (Array.isArray(designTagCounts)) {
      designTagCounts.forEach(item => {
        if (item && typeof item === 'object' && 'tag' in item && 'count' in item) {
          // Use normalized tag as the key
          const normalizedTag = item.normalizedTag || item.tag.toLowerCase().trim();
          const existing = tagMap.get(normalizedTag);
          
          if (existing) {
            // If tag already exists, add to the count
            existing.count += item.count;
          } else {
            // Otherwise, add new entry
            tagMap.set(normalizedTag, {
              originalTag: item.tag, // Keep the original casing for display
              count: item.count
            });
          }
        }
      });
    }

    // Convert the map to the expected format
    const combinedTagCounts: TagCounts = {};
    tagMap.forEach(({ originalTag, count }) => {
      combinedTagCounts[originalTag] = count;
    });

    console.log('Combined tag counts:', combinedTagCounts);
    return combinedTagCounts;
  } catch (error) {
    console.error('Error in getTagCounts:', error);
    return {};
  }
}

export async function getTagCount(tagCounts: TagCounts, tag: string): Promise<number> {
  'use server';
  
  // Try exact match first
  if (tag in tagCounts) {
    return tagCounts[tag];
  }
  
  // Try case-insensitive match
  const lowercaseTag = tag.toLowerCase();
  const matchingTag = Object.keys(tagCounts).find(
    key => key.toLowerCase() === lowercaseTag
  );
  
  return matchingTag ? tagCounts[matchingTag] : 0;
}
