import { Metadata } from 'next';
import Section from './Section';
import { getTagCounts } from './actions';

export const metadata: Metadata = {
  title: 'Browse - Gridrr',
  description: 'Browse tags to discover curated websites on Gridrr.',
};

// Define our tag categories
const industryTags = [
  'SaaS', 'E-commerce', 'Finance', 'Healthcare', 'Education', 'Technology', 'Marketing', 'Design', 'Startup', 'Agency', 'Nonprofit', 'Real Estate', 'Food & Beverage', 'Fitness', 'Travel', 'Entertainment', 'Media', 'Consulting', 'Legal', 'Manufacturing', 'Retail', 'Fashion', 'Beauty', 'Home Services', 'Automotive', 'AI', 'UI/UX'
];

const productTags = [
  'Landing Page', 'Dashboard', 'Mobile App', 'Web App', 'Blog', 'Portfolio', 'Personal', 'Docs', 'Marketing', 'Pricing', 'Auth', 'Onboarding', 'Careers', 'Contact', 'About', 'Case Studies', 'Help Center', 'Knowledge Base', 'Status Page', 'Blog Platform', 'Checkout', 'Booking', 'Directory', 'Newsletter', 'Community'
];

const styleTags = [
  'Minimal', 'Bold', 'Dark Mode', 'Light Mode', 'Gradient', '3D', 'Motion', 'Illustration', 'Photography', 'Typography', 'Neumorphism', 'Glassmorphism', 'Brutalist', 'Vintage', 'Modern', 'Retro', 'Futuristic', 'Playful', 'Corporate', 'Elegant', 'Hand-drawn', 'Geometric', 'Abstract', 'Creative'
];

// Section component has been moved to a separate client component file

export default async function BrowsePage() {
  const tagCounts = await getTagCounts();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl font-black text-black mb-6 tracking-tight">
            Browse
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
            Select a tag to see curated designs and websites related to it.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          <Section
            key="industry"
            title="Industries"
            tags={industryTags}
            tagCounts={tagCounts}
          />
          <Section
            key="product"
            title="Product Types"
            tags={productTags}
            tagCounts={tagCounts}
          />
          <Section
            key="style"
            title="Visual Styles"
            tags={styleTags}
            tagCounts={tagCounts}
          />
        </div>
      </div>
    </div>
  );
}