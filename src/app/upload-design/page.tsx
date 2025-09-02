'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitWorkModal } from '@/components/SubmitWorkModal';

export default function UploadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    // Close modal and redirect to home after a short delay
    setIsModalOpen(false);
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Submit Your Work</h1>
          <p className="mt-4 text-xl text-gray-600">
            Share your design with our community
          </p>
          
          <div className="mt-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Submit Your Design
            </button>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Submission Guidelines</h3>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>• High-quality images only (PNG, JPG, GIF)</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Include multiple angles if applicable</li>
                <li>• No watermarks or logos</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What Happens Next?</h3>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>• Our team will review your submission</li>
                <li>• You'll receive an email once it's live</li>
                <li>• We may reach out for more details</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <SubmitWorkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
