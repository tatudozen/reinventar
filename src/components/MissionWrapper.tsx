import React, { ReactNode, useState } from 'react';
import { MentorVideo } from './MentorVideo';

interface MissionWrapperProps {
  children: ReactNode;
  videoTitle: string;
  videoDescription: string;
  videoId?: string;
  videoUrl?: string; // Optional hardcoded fallback
}

export function MissionWrapper({ children, videoTitle, videoDescription, videoId, videoUrl }: MissionWrapperProps) {
  const [showVideo, setShowVideo] = useState(true);

  if (showVideo) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4">
        <MentorVideo 
          title={videoTitle} 
          description={videoDescription} 
          videoId={videoId}
          videoUrl={videoUrl}
          onComplete={() => setShowVideo(false)} 
        />
      </div>
    );
  }

  return <>{children}</>;
}
