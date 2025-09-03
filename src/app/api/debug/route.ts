import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Test websites table
    const { data: websites, error: websitesError } = await supabase
      .from('websites')
      .select('*')
      .limit(5);

    if (websitesError) throw websitesError;

    // Test designs table
    const { data: designs, error: designsError } = await supabase
      .from('designs')
      .select('*')
      .limit(5);

    if (designsError) throw designsError;

    // Get tag counts
    const { data: websiteTags, error: websiteTagsError } = await supabase
      .from('websites')
      .select('tags');
    
    if (websiteTagsError) throw websiteTagsError;

    const { data: designTags, error: designTagsError } = await supabase
      .from('designs')
      .select('tags')
      .eq('status', 'approved');
    
    if (designTagsError) throw designTagsError;

    return NextResponse.json({
      success: true,
      websites: {
        count: websites?.length || 0,
        sample: websites,
        tags: websiteTags?.flatMap(w => w.tags || []) || []
      },
      designs: {
        count: designs?.length || 0,
        sample: designs,
        tags: designTags?.flatMap(d => d.tags || []) || []
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
