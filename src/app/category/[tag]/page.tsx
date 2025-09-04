import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchWebsitesByTag, Website } from '@/lib/supabase/websites';

type WebsiteWithTags = Website & {
  submitted_by?: string;
  [key: string]: string | number | boolean | string[] | undefined;
};
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

  // Function to capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  };

  // Function to get tag description
  const getTagDescription = (tag: string) => {
    const descriptions: Record<string, string> = {
      // Industry Tags
      'saas': 'Discover top-notch SaaS website designs and templates to inspire your next project.',
      'ecommerce': 'Explore stunning e-commerce website designs that drive sales and engagement.',
      'finance': 'Find modern financial website designs that build trust and user confidence.',
      'healthcare': 'Explore clean and professional healthcare website designs.',
      'education': 'Discover educational platform designs that enhance learning experiences.',
      'technology': 'Browse cutting-edge technology website designs.',
      'marketing': 'Find marketing website designs that convert visitors into customers.',
      'design': 'Explore beautiful design agency and creative studio websites.',
      'startup': 'Discover modern startup website designs that make an impact.',
      'agency': 'Browse creative agency websites with stunning portfolios.',
      'nonprofit': 'Find inspiring nonprofit and charity website designs.',
      'real-estate': 'Explore real estate website designs that showcase properties beautifully.',
      'food-beverage': 'Discover mouth-watering restaurant and food website designs.',
      'fitness': 'Find energetic fitness and wellness website designs.',
      'travel': 'Explore travel and tourism website designs that inspire adventure.',
      'entertainment': 'Discover engaging entertainment and media website designs.',
      'media': 'Browse modern media and publishing website designs.',
      'consulting': 'Find professional consulting firm website designs.',
      'legal': 'Discover trustworthy legal and law firm website designs.',
      'retail': 'Explore attractive retail and e-commerce website designs.',
      'fashion': 'Browse stylish fashion and clothing website designs.',
      'beauty': 'Discover beautiful beauty and cosmetics website designs.',
      'home-services': 'Find professional home service business websites.',
      'automotive': 'Explore modern automotive and car dealer website designs.',
      'ai': 'Explore AI-powered website and application designs.',
      'ui-ux': 'Discover cutting-edge UI/UX designs that create seamless user experiences.',
      
      // Product Types
      'landing-page': 'Browse high-converting landing page designs for your next campaign.',
      'dashboard': 'Explore modern dashboard designs with great data visualization.',
      'mobile-app': 'Check out modern mobile app designs with great user interfaces.',
      'web-app': 'Explore innovative web application designs for various industries.',
      'blog': 'Find beautiful blog designs that enhance readability and user experience.',
      'portfolio': 'Get inspired by creative portfolio websites that showcase work effectively.',
      'personal': 'Discover personal website and portfolio designs that stand out.',
      'docs': 'Explore clean and organized documentation website designs.',
      'pricing': 'Find effective pricing page designs that convert.',
      'auth': 'Browse modern authentication page designs.',
      'onboarding': 'Discover effective user onboarding flow designs.',
      'careers': 'Explore engaging careers and job board website designs.',
      'contact': 'Find creative contact page designs.',
      'about': 'Discover compelling about page designs that tell a story.',
      'case-studies': 'Browse professional case study page designs.',
      'help-center': 'Explore user-friendly help center and support page designs.',
      'knowledge-base': 'Find well-organized knowledge base designs.',
      'status-page': 'Browse clean and functional status page designs.',
      'blog-platform': 'Discover modern blog platform designs.',
      'checkout': 'Explore high-converting checkout page designs.',
      'booking': 'Find intuitive booking and reservation system designs.',
      'directory': 'Browse well-structured directory website designs.',
      'newsletter': 'Discover effective newsletter and subscription page designs.',
      'community': 'Explore engaging community and forum website designs.',
      
      // Style Tags
      'minimal': 'Discover clean and minimal website designs that focus on content.',
      'bold': 'Browse bold and impactful website designs that make a statement.',
      'dark-mode': 'Explore beautiful dark mode website designs.',
      'light-mode': 'Discover clean and bright light mode website designs.',
      'gradient': 'Find websites with beautiful gradient color schemes.',
      '3d': 'Immerse in stunning 3D website designs that push creative boundaries.',
      'motion': 'Discover websites with smooth animations and micro-interactions.',
      'illustration': 'Browse websites with custom illustrations and artwork.',
      'photography': 'Explore photography-focused website designs.',
      'typography': 'Discover websites with exceptional typography and text treatments.',
      'neumorphism': 'Browse modern neumorphic UI designs.',
      'glassmorphism': 'Explore websites using the glassmorphism design trend.',
      'brutalist': 'Discover bold and unconventional brutalist website designs.',
      'vintage': 'Browse retro and vintage-inspired website designs.',
      'modern': 'Explore contemporary and modern website designs.',
      'retro': 'Discover nostalgic retro website designs.',
      'futuristic': 'Browse futuristic and sci-fi inspired website designs.',
      'playful': 'Find fun and playful website designs.',
      'corporate': 'Discover professional corporate website designs.',
      'elegant': 'Browse sophisticated and elegant website designs.',
      'hand-drawn': 'Explore websites with hand-drawn elements and illustrations.',
      'geometric': 'Discover websites with geometric patterns and shapes.',
      'abstract': 'Browse abstract and artistic website designs.',
      'creative': 'Discover highly creative and experimental website designs.'
    };

    return descriptions[tag.toLowerCase()] || `Browse our collection of ${capitalizeFirstLetter(tag)} designs and get inspired for your next project.`;
  };

  return (
    <div className="min-h-screen bg-white text-black w-full">
      <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">{capitalizeFirstLetter(tag)}</h1>
        <p className="text-base text-gray-600 max-w-xl mx-auto">
          {getTagDescription(tag)}
        </p>
      </div>
      
      <Tabs defaultValue="websites" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-auto grid-cols-2 p-1 bg-gray-100 rounded-3xl border border-gray-200 shadow-sm">
            <TabsTrigger 
              value="websites"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-3xl px-6 py-2 text-sm font-medium transition-colors"
            >
              Websites ({websites.length})
            </TabsTrigger>
            <TabsTrigger 
              value="designs"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-3xl px-6 py-2 text-sm font-medium transition-colors"
            >
              Designs ({designs.length})
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="websites">
          <Suspense fallback={<div>Loading websites...</div>}>
            {websites.length > 0 ? (
              <DesignGrid 
                initialWebsites={websites as unknown as WebsiteWithTags[]}
                contentType="website"
                activeCategory={tag}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No websites found with this tag.</p>
              </div>
            )}
          </Suspense>
        </TabsContent>
        
        <TabsContent value="designs">
          <Suspense fallback={<div>Loading designs...</div>}>
            {designs.length > 0 ? (
              <DesignsGrid 
                activeCategory={tag}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No designs found with this tag.</p>
              </div>
            )}
          </Suspense>
        </TabsContent>
      </Tabs>
      </div>
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
