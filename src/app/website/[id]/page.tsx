import { notFound } from 'next/navigation';
import { fetchWebsiteById } from '@/lib/supabase/websites';
import VideoPlayer from './VideoPlayer';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate at most every hour

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const website = await fetchWebsiteById(params.id);
  const baseUrl = 'https://gridrr.com';
  const pageUrl = `${baseUrl}/website/${params.id}`;

  if (!website) {
    return {
      title: 'Website Not Found | Gridrr',
      description: 'The requested website could not be found.',
      openGraph: {
        title: 'Website Not Found | Gridrr',
        description: 'The requested website could not be found.',
        images: [`${baseUrl}/og-default.jpg`],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Website Not Found | Gridrr',
        description: 'The requested website could not be found.',
        images: [`${baseUrl}/og-default.jpg`],
      },
    };
  }

  // Use video URL if available, otherwise use image URL
  const mediaUrl = website.preview_video_url || website.image_url;
  const mediaType = website.preview_video_url ? 'video' : 'image';

  const metadata: Metadata = {
    title: `${website.title} | Gridrr`,
    description: website.description || `Check out ${website.title} on Gridrr - a curated collection of design inspirations.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${website.title} | Gridrr`,
      description: website.description || `Check out ${website.title} on Gridrr - a curated collection of design inspirations.`,
      type: 'website',
      url: pageUrl,
      siteName: 'Gridrr',
      ...(mediaUrl && {
        [mediaType === 'video' ? 'videos' : 'images']: [
          {
            url: mediaUrl,
            width: 1200,
            height: 630,
            alt: website.title,
            ...(mediaType === 'video' ? {
              type: 'video/mp4',
              secureUrl: mediaUrl,
            } : {}),
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${website.title} | Gridrr`,
      description: website.description || `Check out ${website.title} on Gridrr - a curated collection of design inspirations.`,
      images: [{
        url: website.image_url 
          ? website.image_url.startsWith('http') 
            ? website.image_url 
            : new URL(website.image_url, baseUrl).toString()
          : new URL('/og-default.jpg', baseUrl).toString(),
        alt: website.title,
        width: 1200,
        height: 630,
      }],
      site: '@gridrr',
      creator: website.twitter_handle ? `@${website.twitter_handle.replace('@', '')}` : '@gridrr',
    },
  };

  return metadata;
}

export default async function WebsiteDetail({ params }: { params: { id: string } }) {
  const website = await fetchWebsiteById(params.id);
  
  // Ensure tags is treated as an array
  const tags = Array.isArray(website?.tags) 
    ? website.tags 
    : typeof website?.tags === 'string' 
      ? website.tags.split(',').map(tag => tag.trim()) 
      : [];

  if (!website) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="aspect-video bg-white relative">
            {website.preview_video_url ? (
              <VideoPlayer 
                videoUrl={website.preview_video_url}
                title={website.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-500">No preview available</span>
              </div>
            )}
          </div>
          <div className="w-full px-8 py-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 mt-2 max-w-2xl">
                <h1 className="text-2xl font-semibold text-gray-900">{website.title}</h1>
                <a 
                  href={website.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white px-6 py-2 rounded-3xl mt-4 hover:bg-gray-800 transition-colors"
                >
                  Visit
                </a>
                <div className="mt-6 text-sm text-gray-500">
                  <div>Featured On</div>
                  <div className="mb-4">{new Date(website.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div>Built With</div>
                  <div className="font-medium text-gray-700 mb-4">{website.built_with || 'Not Available'}</div>
                  <div className="font-medium text-gray-700">0 Views</div>
                </div>
              </div>
              <div className="md:w-64 flex-shrink-0 space-y-6 mx-auto mt-8 md:mt-0">
                <div>
                  <div className="text-sm text-gray-500">Category</div>
                  <div className="mt-2 space-y-1">
                    {tags.length > 0 ? (
                      tags.map((tag: string, index: number) => (
                        <Link 
                          key={index} 
                          href={`/category/${tag.toLowerCase()}`}
                          className="block text-sm font-medium text-gray-700 hover:text-black transition-colors"
                        >
                          {tag}
                        </Link>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No tags</span>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-2">Follow {website.title}</div>
                  <div className="flex space-x-3">
                    {website.twitter_handle && (
                      <a 
                        href={`https://twitter.com/${website.twitter_handle.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Twitter"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    )}
                    {website.instagram_handle && (
                      <a 
                        href={`https://instagram.com/${website.instagram_handle.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Instagram"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.415-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // Return empty array to disable static generation at build time
  // Uncomment and modify the code below to enable static generation
  /*
  const { data: websites } = await supabase
    .from('websites')
    .select('id')
    .eq('is_approved', true);
    
  return websites?.map((website) => ({
    id: website.id,
  })) || [];
  */
  return [];
}
