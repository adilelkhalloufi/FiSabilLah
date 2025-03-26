import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { ref, onValue } from 'firebase/database';

interface AppContextType {
  chikhs: any[];
  subjects: any[];
  videos: any[];
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chikhs, setChikhs] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up real-time listeners
    const chikhsRef = ref(db, 'chikhs');
    const subjectsRef = ref(db, 'subjects');
    const videosRef = ref(db, 'videos');

    const unsubscribeChikhs = onValue(chikhsRef, (snapshot) => {
      const data = snapshot.val();
      setChikhs(data ? Object.entries(data) : []);
    });

    // Add other listeners...

    return () => {
      unsubscribeChikhs();
    };
  }, []);

  return (
    <AppContext.Provider value={{ chikhs, subjects, videos, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
