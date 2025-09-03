import { supabase } from './client';

export interface TagCount {
  tag: string;
  count: number;
  normalizedTag?: string; // Optional normalized version of the tag for case-insensitive matching
}

export interface Website {
  id: string;
  title: string;
  url: string;
  description?: string;
  built_with?: string;
  preview_video_url: string;
  twitter_handle?: string;
  instagram_handle?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  image_url?: string;
}

export const fetchApprovedWebsites = async (page: number = 1, pageSize: number = 12) => {
  const from = (page - 1) * pageSize;
  
  try {
    const { data, error, count } = await supabase
      .from('websites')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error('Error fetching websites:', error);
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
      hasMore: data ? data.length === pageSize : false,
    };
  } catch (error) {
    console.error('Error in fetchApprovedWebsites:', error);
    return {
      data: [],
      count: 0,
      hasMore: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const fetchWebsiteById = async (id: string): Promise<Website | null> => {
  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching website:', error);
    return null;
  }

  // Ensure tags is properly formatted as an array of strings
  if (data.tags) {
    try {
      if (typeof data.tags === 'string') {
        // Try to parse as JSON first
        try {
          data.tags = JSON.parse(data.tags);
        } catch {
          // If JSON parsing fails, try splitting by comma
          data.tags = data.tags
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0);
        }
      }
      
      // Ensure it's an array
      if (!Array.isArray(data.tags)) {
        data.tags = [];
      }
      
      // Filter out any non-string values and trim whitespace
      data.tags = data.tags
        .filter((tag: unknown): tag is string => typeof tag === 'string')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);
    } catch {
      console.error('Error parsing tags');
      data.tags = [];
    }
  } else {
    data.tags = [];
  }

  return data;
};

export const fetchWebsitesByTag = async (tag: string): Promise<Website[]> => {
  try {
    // First get all websites
    const { data: websites, error } = await supabase
      .from('websites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!websites) return [];

    // Normalize the search tag to lowercase for case-insensitive comparison
    const normalizedSearchTag = tag.toLowerCase().trim();
    
    // Filter websites that have the specified tag
    return websites.filter(website => {
      if (!website.tags) return false;
      
      // Handle both string (comma-separated) and array formats
      const tags = typeof website.tags === 'string' 
        ? website.tags.split(',').map((t: string) => t.trim().toLowerCase())
        : website.tags.map((t: string) => t.trim().toLowerCase());
      
      return tags.includes(normalizedSearchTag);
    });
  } catch (error) {
    console.error('Error in fetchWebsitesByTag:', error);
    return [];
  }
};

interface WebsiteWithTags {
  tags?: string[] | null;
}

export const fetchWebsiteTagCounts = async (): Promise<TagCount[]> => {
  console.log('Starting fetchWebsiteTagCounts...');
  try {
    // First get all websites with their tags
    console.log('Fetching websites from database...');
    const { data: websites, error } = await supabase
      .from('websites')
      .select('tags');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Websites from database:', websites);
    if (!websites || websites.length === 0) {
      console.log('No websites found in database');
      return [];
    }

    // Count tag occurrences
    const tagCounts = new Map<string, number>();
    
    console.log('Processing website tags...');
    websites.forEach((website: { tags: unknown }, index: number) => {
      console.log(`Website ${index + 1}:`, website);
      
      // Handle both string (comma-separated) and array formats
      let tags: string[] = [];
      
      if (typeof website.tags === 'string') {
        // Split by comma and clean up the tags
        tags = website.tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0); // Remove empty strings
      } else if (Array.isArray(website.tags)) {
        // If it's already an array, use it as is
        tags = (website.tags as string[]).filter((tag: string) => typeof tag === 'string' && tag.trim().length > 0);
      }
      
      console.log(`  Tags for website ${index + 1}:`, tags);
      
      // Count each tag
      tags.forEach((tag: string) => {
        const normalizedTag = tag.trim();
        if (normalizedTag) {  // Only process non-empty strings
          const currentCount = tagCounts.get(normalizedTag) || 0;
          console.log(`  Processing tag '${normalizedTag}': current count = ${currentCount} + 1`);
          tagCounts.set(normalizedTag, currentCount + 1);
        }
      });
    });

    // Convert to array of { tag, count } objects and sort by count descending
    const result = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ 
        tag, 
        count,
        normalizedTag: tag.toLowerCase().trim() // Add normalized version for better matching
      }))
      .sort((a, b) => b.count - a.count);
    
    console.log('Final tag counts:', result);
    return result;
  } catch (error) {
    console.error('Error in fetchWebsiteTagCounts:', error);
    return [];
  }
};
