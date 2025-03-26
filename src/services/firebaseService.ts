import { ref, set, get, push, remove, query, orderByChild, onValue } from 'firebase/database';
import { db } from '../config/firebase';

export const firebaseService = {
  // Chikh methods
  async addChikh(data: any) {
    console.log('addChikh', data);
    const newChikhRef = push(ref(db, 'chikhs'));
    await set(newChikhRef, { ...data, createdAt: Date.now() });
    return newChikhRef.key;
  },

  subscribeToChikhs(callback: (chikhs: any[]) => void) {
    const chikhsRef = ref(db, 'chikhs');
    return onValue(chikhsRef, (snapshot) => {
      const data = snapshot.val();
      const chikhsList = data ? Object.entries(data).map(([id, chikh]: [string, any]) => ({
        id,
        ...chikh
      })) : [];
      callback(chikhsList);
    });
  },

  // Subject methods
  async addSubject(data: any) {
    const newSubjectRef = push(ref(db, 'subjects'));
    await set(newSubjectRef, { ...data, createdAt: Date.now() });
    return newSubjectRef.key;
  },

  subscribeToSubjects(chikhId: string, callback: (subjects: any[]) => void) {
    const subjectsRef = ref(db, 'subjects');
    return onValue(subjectsRef, (snapshot) => {
      const data = snapshot.val();
      const subjectsList = data ? Object.entries(data)
        .map(([id, subject]: [string, any]) => ({
          id,
          ...subject
        }))
        .filter(subject => subject.chikhId === chikhId) : [];
      callback(subjectsList);
    });
  },

  // Video methods
  async addVideo(data: any) {
    const newVideoRef = push(ref(db, 'videos'));
    await set(newVideoRef, { ...data, createdAt: Date.now() });
    return newVideoRef.key;
  },

  subscribeToVideos(subjectId: string, callback: (videos: any[]) => void) {
    const videosRef = ref(db, 'videos');
    return onValue(videosRef, (snapshot) => {
      const data = snapshot.val();
      const videosList = data ? Object.entries(data)
        .map(([id, video]: [string, any]) => ({
          id,
          ...video
        }))
        .filter(video => video.subjectId === subjectId) : [];
      callback(videosList);
    });
  }
};
