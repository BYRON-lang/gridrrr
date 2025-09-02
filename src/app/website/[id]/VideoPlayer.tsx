'use client';

import { useState, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  // Generate a random pastel color
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  };

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [bgColor] = useState(getRandomPastelColor());
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video load
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Video with loading state */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundColor: bgColor }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={handleVideoLoad}
          aria-label={`Preview of ${title}`}
        />
      </div>
      
      {/* Loading overlay */}
      {!isVideoLoaded && (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: bgColor }}
        />
      )}
    </div>
  );
}
