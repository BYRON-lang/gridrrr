import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchDesignById } from '@/lib/supabase/designs';
import { Metadata } from 'next';

export const revalidate = 3600; // Revalidate at most every hour

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const design = await fetchDesignById(params.id);

  if (!design) {
    return {
      title: 'Design Not Found | Gridrr',
      description: 'The requested design could not be found.',
    };
  }

  return {
    title: `${design.title} by ${design.designer_name} | Gridrr`,
    description: design.description || `Check out ${design.title} by ${design.designer_name} on Gridrr - a curated collection of design inspirations.`,
    openGraph: {
      title: `${design.title} by ${design.designer_name} | Gridrr`,
      description: design.description || `Check out ${design.title} by ${design.designer_name} on Gridrr - a curated collection of design inspirations.`,
      type: 'website',
      url: `https://gridrr.com/design/${params.id}`,
      images: design.image_url ? [design.image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${design.title} by ${design.designer_name} | Gridrr`,
      description: design.description || `Check out ${design.title} by ${design.designer_name} on Gridrr - a curated collection of design inspirations.`,
      images: design.image_url ? [design.image_url] : [],
    },
  };
}

export default async function DesignDetail({ params }: { params: { id: string } }) {
  const design = await fetchDesignById(params.id);

  if (!design) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="relative bg-gray-100">
          <div className="aspect-[4/3] relative border border-gray-200">
            <Image
              src={design.image_url}
              alt={design.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{design.title}</h1>
              <p className="text-lg text-gray-700">Designed by {design.designer_name}</p>
            </div>
            {/* Portfolio button removed as there's no website field in the design data structure */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-6">{design.description}</p>
                
                {design.tools_used && design.tools_used.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Tools Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {design.tools_used.map((tool) => (
                        <span 
                          key={tool}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {design.tags && design.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {design.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Designer Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Designer</dt>
                    <dd className="mt-1 text-sm text-gray-900">{design.designer_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Submitted on</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(design.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </dd>
                  </div>
                </dl>

                {(design.twitter_handle || design.instagram_handle) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Follow the Designer</h4>
                    <div className="flex space-x-4">
                      {design.twitter_handle && (
                        <a
                          href={`https://twitter.com/${design.twitter_handle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-900"
                        >
                          <span className="sr-only">Twitter</span>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                      )}
                      {design.instagram_handle && (
                        <a
                          href={`https://instagram.com/${design.instagram_handle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-900"
                        >
                          <span className="sr-only">Instagram</span>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
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
  // We'll use dynamic rendering for designs
  return [];
}
