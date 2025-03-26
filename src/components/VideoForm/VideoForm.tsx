import React, { useState } from 'react';

interface VideoFormData {
  title: string;
  url: string;
  description: string;
}

interface VideoFormProps {
  subjectId: string;
  onSubmit: (data: VideoFormData & { subjectId: string; createdAt: number }) => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ subjectId, onSubmit }) => {
  const [videoData, setVideoData] = useState<VideoFormData>({
    title: '',
    url: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...videoData,
      subjectId,
      createdAt: Date.now()
    });
    setVideoData({ title: '', url: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Video Title"
        value={videoData.title}
        onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="url"
        placeholder="YouTube URL"
        value={videoData.url}
        onChange={(e) => setVideoData(prev => ({ ...prev, url: e.target.value }))}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Video Description"
        value={videoData.description}
        onChange={(e) => setVideoData(prev => ({ ...prev, description: e.target.value }))}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Add Video
      </button>
    </form>
  );
};

export default VideoForm;