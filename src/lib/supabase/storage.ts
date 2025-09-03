import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Storage configuration
export const storageConfig = {
  bucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET,
  region: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_REGION,
};

// Initialize storage bucket
const initializeStorage = async () => {
  try {
    if (!storageConfig.bucket) {
      console.error('Storage bucket not configured');
      return;
    }

    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return;
    }

    const bucketExists = buckets.some(bucket => bucket.name === storageConfig.bucket);
    
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(storageConfig.bucket, {
        public: false,
        allowedMimeTypes: ['image/*', 'video/*', 'application/pdf'],
        fileSizeLimit: 1024 * 1024 * 50, // 50MB
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        return;
      }
      console.log(`Bucket '${storageConfig.bucket}' created successfully`);
    }

  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Initialize storage when this module is imported
if (typeof window !== 'undefined') {
  initializeStorage();
}

// Upload file to storage
export const uploadFile = async (file: File, path: string) => {
  try {
    if (!storageConfig.bucket) {
      throw new Error('Storage bucket not configured');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${path}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(storageConfig.bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(storageConfig.bucket)
      .getPublicUrl(data.path);

    return { path: data.path, url: publicUrl };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export default storageConfig;
