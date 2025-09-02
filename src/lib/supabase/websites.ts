import { supabase } from './client';

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
