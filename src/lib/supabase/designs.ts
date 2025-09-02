import { supabase } from './client';

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
