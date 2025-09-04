import { NextRequest, NextResponse } from 'next/server';
import { fetchDesignsPaginated } from '@/lib/supabase/designs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const category = searchParams.get('category') || undefined;

    // Validate parameters
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Invalid page or pageSize parameters' },
        { status: 400 }
      );
    }

    const result = await fetchDesignsPaginated(page, pageSize, category);

    // Set cache headers for better performance
    const response = NextResponse.json(result);
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );
    response.headers.set('X-Total-Count', result.count.toString());
    response.headers.set('X-Has-More', result.hasMore.toString());

    return response;
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch designs' },
      { status: 500 }
    );
  }
}

// Enable static optimization for this route
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds