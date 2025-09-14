'use client';

import { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  // Use a stable color based on the video URL
  const getStableColor = (str: string) => {
    // Simple hash function to generate a consistent number from the URL
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 85%)`;
  };

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [bgColor] = useState(() => getStableColor(videoUrl));
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video load
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        console.log('Autoplay prevented:', e);
        // On mobile, show the video even if autoplay fails
        setIsVideoLoaded(true);
      });
    }
  };

  // Handle video error
  const handleVideoError = () => {
    console.log('Video failed to load');
    setVideoError(true);
  };

  // Try to play video on user interaction (mobile workaround)
  useEffect(() => {
    const handleUserInteraction = () => {
      if (videoRef.current && !isVideoLoaded) {
        videoRef.current.play().catch(e => console.log('Play failed:', e));
      }
    };

    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [isVideoLoaded]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Video with loading state */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundColor: bgColor, transition: 'opacity 300ms' }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="false"
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          aria-label={`Preview of ${title}`}
        />
      </div>
      
      {/* Loading overlay */}
      {!isVideoLoaded && !videoError && (
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundColor: bgColor,
            transition: 'opacity 300ms'
          }}
        />
      )}

      {/* Error state - show a play button */}
      {videoError && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            backgroundColor: bgColor,
            transition: 'opacity 300ms'
          }}
        >
          <div className="text-center">
            <div className="text-gray-500 mb-2">Video unavailable</div>
            <button 
              onClick={() => {
                setVideoError(false);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
