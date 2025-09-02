import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchWebsiteById } from '@/lib/supabase/websites';

export const revalidate = 3600; // Revalidate at most every hour

export default async function WebsiteDetail({ params }: { params: { id: string } }) {
  const website = await fetchWebsiteById(params.id);

  if (!website) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="aspect-video bg-white relative border border-gray-200 flex items-center justify-center">
            {website.preview_video_url ? (
              <video
                src={website.preview_video_url}
                className="max-w-full max-h-full object-contain"
                autoPlay
                loop
                muted
                playsInline
                aria-label={`Preview of ${website.title}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white">
                <span className="text-gray-500">No preview available</span>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">{website.title}</h1>
                <a 
                  href={website.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-block"
                >
                  {website.url.replace(/^https?:\/\//, '')}
                </a>
              </div>
              <a
                href={`${website.url}${website.url.includes('?') ? '&' : '?'}ref=gridrr`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors text-center whitespace-nowrap"
              >
                Visit Website
              </a>
            </div>

            <div className="prose max-w-none">
              {website.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">About</h2>
                  <p className="text-gray-700">{website.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Details</h2>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Added on</dt>
                      <dd>
                        {new Date(website.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                    {website.built_with && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Built with</dt>
                        <dd>{website.built_with}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {website.tags && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        // Ensure tags is an array of strings
                        const tagsArray = Array.isArray(website.tags) 
                          ? website.tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim() !== '')
                          : [];
                            
                        return tagsArray.map((tag) => (
                          <span 
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 mt-8">
                {website.twitter_handle && (
                  <a
                    href={`https://twitter.com/${website.twitter_handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-400"
                    aria-label="Twitter"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                )}
                {website.instagram_handle && (
                  <a
                    href={`https://instagram.com/${website.instagram_handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-pink-500"
                    aria-label="Instagram"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.415-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.415-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.023.047 1.351.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.047-1.023.058-1.351.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
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
