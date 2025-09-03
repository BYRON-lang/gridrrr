import { notFound } from 'next/navigation';
import { fetchWebsitesByTag } from '@/lib/supabase/websites';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

export const revalidate = 3600; // Revalidate at most every hour

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  
  return {
    title: `${tag} Websites`,
    description: `Discover the best ${tag.toLowerCase()} websites and designs on Gridrr. Curated collection of ${tag.toLowerCase()} inspiration for designers and developers.`,
    openGraph: {
      title: `${tag} Websites - Gridrr`,
      description: `Discover the best ${tag.toLowerCase()} websites and designs on Gridrr. Curated collection of ${tag.toLowerCase()} inspiration for designers and developers.`,
      type: 'website',
      url: `https://gridrr.com/websites/${params.tag}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tag} Websites - Gridrr`,
      description: `Discover the best ${tag.toLowerCase()} websites and designs on Gridrr. Curated collection of ${tag.toLowerCase()} inspiration for designers and developers.`,
    },
  };
}

export default async function WebsitesByTag({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const websites = await fetchWebsitesByTag(tag);

  if (!websites || websites.length === 0) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{tag} Websites</h1>
          <p className="text-gray-600">
            Discover {websites.length} amazing {tag.toLowerCase()} websites and designs
          </p>
        </div>

        {/* Websites Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {websites.map((website) => (
            <div key={website.id} className="group relative aspect-[4/3] overflow-hidden cursor-zoom-in border border-gray-200 hover:border-gray-300 transition-all duration-200 rounded-lg">
              <Link href={`/website/${website.id}`} className="block w-full h-full">
                {website.preview_video_url ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    webkit-playsinline="true"
                    x5-playsinline="true"
                    x5-video-player-type="h5"
                    x5-video-player-fullscreen="false"
                    className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300 cursor-zoom-in"
                    onError={(e) => {
                      console.log('Video error:', e);
                      const videoElement = e.target as HTMLVideoElement;
                      videoElement.style.display = 'none';
                    }}
                  >
                    <source src={website.preview_video_url} type="video/mp4" />
                    <source src={website.preview_video_url} type="video/webm" />
                    <div className="w-full h-full relative">
                      <Image
                        src={website.image_url || '/placeholder.jpg'}
                        alt={website.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                      />
                    </div>
                  </video>
                ) : (
                  <div className="w-full h-full relative">
                    <Image
                      src={website.image_url || '/placeholder.jpg'}
                      alt={website.title}
                      fill
                      className="object-cover group-hover:brightness-90 transition-all duration-300 cursor-zoom-in"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 sm:p-4 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <div className="bg-white/90 hover:bg-white text-black p-1.5 rounded-full cursor-pointer transition-all duration-200 hover:scale-110">
                      <ArrowUpRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                  </div>
                  <div className="text-white">
                    <h3 className="font-medium text-xs sm:text-sm line-clamp-2">{website.title}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Back to all websites */}
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            ← Back to all websites
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // Common tags to pre-generate
  const commonTags = [
    'SaaS',
    'Landing Page',
    'Portfolio',
    'E-commerce',
    'Blog',
    'Agency',
    'Dashboard',
    'Mobile App',
    'Web App',
    'Startup',
    'Corporate',
    'Personal',
    'Creative',
    'Minimal',
    'Modern',
    'Vintage',
    'Dark',
    'Light',
    'Gradient',
    'Typography'
  ];

  return commonTags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}
