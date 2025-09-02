'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Modal } from './ui/Modal';
import { supabase, uploadFile } from '@/lib/supabase/storage';

interface SubmitWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitWorkModal({ isOpen, onClose }: SubmitWorkModalProps) {
  const [submissionType, setSubmissionType] = useState('website');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [submissionName, setSubmissionName] = useState('');
  const [yourName, setYourName] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [codedBy, setCodedBy] = useState('');
  // Design specific state
  const [designerName, setDesignerName] = useState('');
  const [toolsUsed, setToolsUsed] = useState('');
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDesignImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setDesignImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const submissionData = {
        user_id: null,
        submission_type: submissionType,
        title: submissionName,
        description: '',
        contact_email: email,
        twitter_handle: twitter || null,
        instagram_handle: instagram || null,
        submitted_by: submissionType === 'website' ? yourName : designerName,
        status: 'pending'
      };

      // Create submission record
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert(submissionData)
        .select('id')
        .single();

      if (submissionError) throw submissionError;

      if (submissionType === 'website') {
        // Handle website submission
        const { error: websiteError } = await supabase
          .from('website_submissions')
          .insert({
            submission_id: submission.id,
            url: websiteUrl,
            built_with: codedBy || null,
            created_at: new Date().toISOString()
          });

        if (websiteError) throw websiteError;

      } else if (submissionType === 'design') {
        if (!designImage) {
          throw new Error('Please upload a design image');
        }

        // Upload image to storage using the storage utility
        const fileExt = designImage.name.split('.').pop();
        const { url: publicUrl } = await uploadFile(designImage, `designs/${submission.id}`);

        // Create design submission
        const { error: designError } = await supabase
          .from('design_submissions')
          .insert({
            submission_id: submission.id,
            tools_used: toolsUsed || null,
            preview_url: publicUrl,
            file_url: publicUrl,
            file_type: fileExt,
            created_at: new Date().toISOString()
          });

        if (designError) throw designError;

        // Create media record
        const { error: mediaError } = await supabase
          .from('submission_media')
          .insert({
            submission_id: submission.id,
            media_type: `image/${fileExt}`,
            url: publicUrl,
            is_primary: true,
            created_at: new Date().toISOString()
          });

        if (mediaError) throw mediaError;
      }

      // Reset form on success
      setSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
        setSuccess(false);
      }, 2000);

    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmissionType('website');
    setWebsiteUrl('');
    setSubmissionName('');
    setYourName('');
    setEmail('');
    setInstagram('');
    setTwitter('');
    setCodedBy('');
    setDesignerName('');
    setToolsUsed('');
    setDesignImage(null);
    setImagePreview('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {submissionType === 'website' 
              ? 'Website submitted successfully! We\'ll review it soon.'
              : 'Design submitted successfully! We\'ll review it soon.'}
          </div>
        )}
        <div className="p-6 text-black relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors focus:outline-none text-sm font-medium"
          >
            Close
          </button>
          <h2 className="text-2xl font-bold text-left mb-6">Submit</h2>
          <p className="text-sm text-gray-700 mb-4">
            If accepted, your website or UI design will be published to the gallery and added to the weekly newsletter. A few things to know:
          </p>
          <ul className="text-sm text-gray-700 space-y-2 mb-6 list-disc pl-5">
            <li>It can take 4-5 days for me to review the website.</li>
            <li>Due to the amount of submissions and to keep a high standard, most submissions are not accepted.</li>
            <li>Don&apos;t be disappointed, please try it again with your next project.</li>
          </ul>
          
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">What are you submitting? <span className="text-red-500">*</span></p>
            <div className="flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                  checked={submissionType === 'website'}
                  onChange={() => setSubmissionType('website')}
                />
                <span className="ml-2 text-gray-700">Website</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                  checked={submissionType === 'design'}
                  onChange={() => setSubmissionType('design')}
                />
                <span className="ml-2 text-gray-700">UI/UX Design</span>
              </label>
            </div>
            
            {submissionType === 'website' && (
              <div className="mt-4">
                <label htmlFor="website-url" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="website-url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                  placeholder="https://example.com"
                  required={submissionType === 'website'}
                />
                
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="submission-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name of Website <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="submission-name"
                      value={submissionName}
                      onChange={(e) => setSubmissionName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                      placeholder="Enter the name of your website"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="your-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="your-name"
                      value={yourName}
                      onChange={(e) => setYourName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="coded-by" className="block text-sm font-medium text-gray-700 mb-1">
                      Code By <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="coded-by"
                      value={codedBy}
                      onChange={(e) => setCodedBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                      placeholder="Name of the developer/coder"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                        Twitter (optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">@</span>
                        </div>
                        <input
                          type="text"
                          id="twitter"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                          placeholder="username"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram (optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">@</span>
                        </div>
                        <input
                          type="text"
                          id="instagram"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                          placeholder="username"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Design Section */}
            {submissionType === 'design' && (
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="design-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name of Design <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="design-name"
                    value={submissionName}
                    onChange={(e) => setSubmissionName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                    placeholder="Enter the name of your design"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="designer-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Designer's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="designer-name"
                    value={designerName}
                    onChange={(e) => setDesignerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                    placeholder="Enter designer's name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="design-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="design-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="design-twitter" className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">@</span>
                      </div>
                      <input
                        type="text"
                        id="design-twitter"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                        placeholder="username"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="design-instagram" className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">@</span>
                      </div>
                      <input
                        type="text"
                        id="design-instagram"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                        placeholder="username"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="tools-used" className="block text-sm font-medium text-gray-700 mb-1">
                    Tools Used <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="tools-used"
                    value={toolsUsed}
                    onChange={(e) => setToolsUsed(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm mb-4"
                    placeholder="e.g., Figma, Photoshop, Illustrator"
                    required
                  />
                  <p className="text-xs text-gray-500 mb-4">List the tools you used for this design (comma separated)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Design <span className="text-red-500">*</span>
                  </label>
                  {!imagePreview ? (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                              required={!imagePreview}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 relative h-64 w-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain border border-gray-300 rounded-md"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 focus:outline-none"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              className={`w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span>
                  Submit {submissionType === 'website' ? 'Website' : 'Design'}
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}