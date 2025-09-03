import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchWebsitesByTag } from '@/lib/supabase/websites';
import { fetchDesignsByTag } from '@/lib/supabase/designs';
import DesignGrid from '@/components/DesignGrid';
import DesignsGrid from '@/components/DesignsGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  
  // Fetch both websites and designs in parallel
  const [websites, designs] = await Promise.all([
    fetchWebsitesByTag(tag),
    fetchDesignsByTag(tag)
  ]);

  if (!websites.length && !designs.length) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-black container mx-auto px-4 py-12">
      <h1 className="text-4xl text-center font-bold mb-8">{tag}</h1>
      
      <Tabs defaultValue="websites" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs mb-8">
          <TabsTrigger value="websites">
            Websites ({websites.length})
          </TabsTrigger>
          <TabsTrigger value="designs">
            Designs ({designs.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="websites">
          <Suspense fallback={<div>Loading websites...</div>}>
            <DesignGrid 
              initialWebsites={websites}
              showLoadMore={false}
              showFilter={false}
              contentType="website"
              activeCategory="all"
            />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="designs">
          <Suspense fallback={<div>Loading designs...</div>}>
            <DesignsGrid 
              initialDesigns={designs}
              showLoadMore={false}
              activeCategory="all"
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `${tag} - Gridrr`,
    description: `Browse ${tag} websites and designs on Gridrr.`
  };
}
