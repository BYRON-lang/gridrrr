export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Last updated: August 30, 2024
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>
                By accessing or using Gridrr ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. User Responsibilities</h2>
            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>When using Gridrr, you agree to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Submit only original work that you own or have the right to share</li>
                <li>Not submit any content that is illegal, offensive, or infringes on others' rights</li>
                <li>Not use the platform for any unauthorized commercial purposes</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Intellectual Property</h2>
            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>
                You retain all rights to the content you submit to Gridrr. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to display, distribute, and promote your content on our platform.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Content Moderation</h2>
            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>
                We reserve the right to remove any content that violates these terms or that we find inappropriate for any reason. We may also suspend or terminate accounts that repeatedly violate our terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>
                Gridrr is provided "as is" without any warranties. We are not responsible for any damages resulting from your use of the platform, including but not limited to lost profits, data loss, or business interruption.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Changes to Terms</h2>
            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>
                We may update these terms from time to time. We will notify users of significant changes by posting the new terms on this page and updating the "Last updated" date.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
            <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p>
                <a href="mailto:legal@gridrr.com" className="text-blue-600 hover:underline">legal@gridrr.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
