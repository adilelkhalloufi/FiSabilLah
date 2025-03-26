import React, { useEffect, useState } from 'react';
import { firebaseService } from '../../services/firebaseService';
import SubjectForm from '../SubjectForm/SubjectForm';
import VideoList from '../VideoList/VideoList';

interface Chikh {
  id: string;
  name: string;
  description: string;
}

interface Subject {
  id: string;
  name: string;
  description: string;
}

interface Video {
  id: string;
  subjectId: string;
  title: string;
  url: string;
  description: string;
}

interface ChikhDetailProps {
  chikh: Chikh | null;
  subjects: Subject[];
  videos: Video[];
}

const ChikhDetail: React.FC<ChikhDetailProps> = ({ chikh }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (!chikh) return;

    const unsubscribeSubjects = firebaseService.subscribeToSubjects(
      chikh.id,
      setSubjects
    );

    return () => unsubscribeSubjects();
  }, [chikh]);

  useEffect(() => {
    const videoSubscriptions = subjects.map(subject =>
      firebaseService.subscribeToVideos(subject.id, (newVideos) => {
        setVideos(prev => {
          const otherVideos = prev.filter(v => v.subjectId !== subject.id);
          return [...otherVideos, ...newVideos];
        });
      })
    );

    return () => videoSubscriptions.forEach(unsub => unsub());
  }, [subjects]);

  if (!chikh) return null;

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{chikh.name}</h2>
        <p className="text-gray-600">{chikh.description}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-3">Subjects</h3>
        <SubjectForm chikhId={chikh.id} />
        
        <div className="mt-4 space-y-3">
          {subjects.map(subject => (
            <div key={subject.id} className="border p-4 rounded">
              <h4 className="font-bold">{subject.name}</h4>
              <p className="text-sm text-gray-600">{subject.description}</p>
              <VideoList videos={videos.filter(v => v.subjectId === subject.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChikhDetail;