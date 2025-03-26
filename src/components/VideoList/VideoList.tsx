import React, { useEffect, useState } from 'react';
import { firebaseService } from '../../services/firebaseService';

interface Video {
  id: string;
  title: string;
  url: string;
  description: string;
  subjectId: string;
}

interface VideoListProps {
  subjectId: string;
}

const VideoList: React.FC<VideoListProps> = ({ subjectId }) => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const unsubscribe = firebaseService.subscribeToVideos(subjectId, setVideos);
    return () => unsubscribe();
  }, [subjectId]);

  const getYouTubeEmbedUrl = (url: string): string => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="space-y-4 mt-4">
      {videos.map(video => (
        <div key={video.id} className="border rounded p-3">
          <h4 className="font-bold">{video.title}</h4>
          <div className="aspect-w-16 aspect-h-9 mt-2">
            <iframe
              src={getYouTubeEmbedUrl(video.url)}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <p className="text-sm text-gray-600 mt-2">{video.description}</p>
        </div>
      ))}
    </div>
  );
};

export default VideoList;