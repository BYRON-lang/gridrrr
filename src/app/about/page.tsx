export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <h1 className="text-xl font-semibold text-gray-900 md:w-1/4 break-words">
            About
          </h1>
          <div className="md:w-3/4">
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Learn more about our platform, mission, and the team behind our design showcase. 
              We're dedicated to bringing you the best in design inspiration and resources.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 md:w-1/4 break-words">
            Who Created Gridrr
          </h2>
          <div className="md:w-3/4">
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
              Gridrr was developed by Byron Kennedy Pfukwa in October 2024.
            </p>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Gridrr was created to be a premier destination for design inspiration and collaboration. The platform aims to showcase exceptional design work from talented creators worldwide, fostering a community where designers can gain exposure, connect with potential clients, and find inspiration for their next project. Our mission is to elevate the design community by providing a space that celebrates creativity, innovation, and professional growth in the design industry.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 md:w-1/4 break-words">
            Our Mission
          </h2>
          <div className="md:w-3/4">
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              At Gridrr, our mission is to empower designers by providing a platform that celebrates creativity, fosters collaboration, and connects talent with opportunity. We believe in the transformative power of great design and are committed to building a community where creativity thrives and designers can grow professionally.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 md:w-1/4 break-words">
            What We Offer
          </h2>
          <div className="md:w-3/4">
            <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm md:text-base">
              <li><span className="font-medium">Showcase Platform:</span> A beautiful space to display your best work</li>
              <li><span className="font-medium">Community:</span> Connect with fellow designers and potential clients</li>
              <li><span className="font-medium">Inspiration:</span> Discover innovative design from around the world</li>
              <li><span className="font-medium">Opportunities:</span> Find freelance work or full-time positions</li>
              <li><span className="font-medium">Resources:</span> Access tools and knowledge to grow your skills</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 md:w-1/4 break-words">
            Our Values
          </h2>
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Creativity', description: 'We celebrate original thinking and innovative design solutions.' },
                { title: 'Community', description: 'We believe in the power of connection and collaboration.' },
                { title: 'Quality', description: 'We showcase only the highest standard of design work.' },
                { title: 'Inclusivity', description: 'We welcome designers of all backgrounds and experience levels.' },
                { title: 'Growth', description: 'We support continuous learning and professional development.' },
                { title: 'Integrity', description: 'We maintain transparency and honesty in all our interactions.' }
              ].map((value, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-1">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Showcase Your Work</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            No account needed to submit your designs. Share your work with our community and get the recognition you deserve.
          </p>
          <button className="bg-black text-white px-6 py-2 rounded-3xl text-sm font-medium hover:bg-gray-800 transition-colors">
            Submit Your Work
          </button>
        </div>
      </div>
    </div>
  );
}
