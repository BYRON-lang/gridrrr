import { supabase } from './client';

export interface TagCount {
  tag: string;
  count: number;
  normalizedTag?: string; // Optional normalized version of the tag for case-insensitive matching
}

export interface Design {
  id: string;
  title: string;
  description: string | null;
  designer_name: string;
  designer_email: string;
  twitter_handle: string | null;
  instagram_handle: string | null;
  tools_used: string[];
  tags: string[];
  image_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const fetchDesigns = async (): Promise<Design[]> => {
  console.log('Starting fetchDesigns function');
  
  // First, let's check if we can access the designs table at all
  const { data: allData, error: allError } = await supabase
    .from('designs')
    .select('count');
    
  if (allError) {
    console.error('Error accessing designs table:', allError);
    throw allError;
  }
  
  console.log('Total designs in table:', allData);
  
  // Now try to fetch approved designs
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    // Try without the status filter first to see if we get any results
    // .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching designs:', error);
    throw error;
  }
  
  console.log('Designs fetched from Supabase:', data ? data.length : 0);
  if (data && data.length > 0) {
    console.log('First design:', data[0]);
  }

  return data || [];
};

export const fetchDesignById = async (id: string): Promise<Design | null> => {
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching design ${id}:`, error);
    return null;
  }

  return data;
};

export const fetchDesignsByUser = async (email: string): Promise<Design[]> => {
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('designer_email', email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching designs for user ${email}:`, error);
    return [];
  }

  return data || [];
};

export const fetchApprovedDesigns = async (page: number = 1, pageSize: number = 12) => {
  const from = (page - 1) * pageSize;
  
  try {
    const { data, error, count } = await supabase
      .from('designs')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error('Error fetching approved designs:', error);
      throw error;
    }

    return {
      data: data || [],
      count: count || 0
    };
  } catch (error) {
    console.error('Error in fetchApprovedDesigns:', error);
    throw error;
  }
};

export const fetchDesignsByTag = async (tag: string): Promise<Design[]> => {
  try {
    // First get all approved designs
    const { data: designs, error } = await supabase
      .from('designs')
      .select('*')
      .eq('status', 'approved');

    if (error) throw error;
    if (!designs) return [];

    // Normalize the search tag to lowercase for case-insensitive comparison
    const normalizedSearchTag = tag.toLowerCase().trim();
    
    // Filter designs that have the specified tag
    return designs.filter(design => {
      if (!design.tags) return false;
      
      // Handle both string (comma-separated) and array formats
      const tags = typeof design.tags === 'string' 
        ? design.tags.split(',').map((t: string) => t.trim().toLowerCase())
        : design.tags.map((t: string) => t.trim().toLowerCase());
      
      return tags.includes(normalizedSearchTag);
    });
  } catch (error) {
    console.error('Error fetching designs by tag:', error);
    return [];
  }
};

export const fetchDesignTagCounts = async (): Promise<TagCount[]> => {
  console.log('Starting fetchDesignTagCounts...');
  try {
    // First get all approved designs with their tags
    console.log('Fetching designs from database...');
    const { data: designs, error } = await supabase
      .from('designs')
      .select('tags')
      .eq('status', 'approved');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Designs from database:', designs);
    if (!designs || designs.length === 0) {
      console.log('No designs found in database');
      return [];
    }

    // Count tag occurrences
    const tagCounts = new Map<string, number>();
    
    console.log('Processing design tags...');
    designs.forEach((design: { tags: unknown }, index: number) => {
      console.log(`Design ${index + 1}:`, design);
      
      // Handle both string (comma-separated) and array formats
      let tags: string[] = [];
      
      if (typeof design.tags === 'string') {
        // Split by comma and clean up the tags
        tags = (design.tags as string)
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0); // Remove empty strings
      } else if (Array.isArray(design.tags)) {
        // If it's already an array, use it as is
        tags = (design.tags as string[]).filter((tag: string) => typeof tag === 'string' && tag.trim().length > 0);
      }
      
      console.log(`  Tags for design ${index + 1}:`, tags);
      
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
    
    console.log('Final design tag counts:', result);
    return result;
  } catch (error) {
    console.error('Error in fetchDesignTagCounts:', error);
    return [];
  }
};
