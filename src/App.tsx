import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ChikhList from './components/ChikhList/ChikhList';
import ChikhDetail from './components/ChikhDetail/ChikhDetail';
import VideoList from './components/VideoList/VideoList';
import ChikhForm from './components/ChikhForm/ChikhForm';
import SubjectForm from './components/SubjectForm/SubjectForm';
import VideoForm from './components/VideoForm/VideoForm';
import { firebaseService } from './services/firebaseService';

const App = () => {
  const [selectedChikh, setSelectedChikh] = useState(null);
  
  return (
    <div className="w-full h-full bg-gray-50">
      <Router>
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="text-center py-12">
                  <h1 className="text-4xl font-bold text-gray-800">Welcome to Fi SabilLah</h1>
                  <p className="mt-4 text-gray-600">Manage and explore Islamic lectures</p>
                </div>
              } 
            />
            
            <Route 
              path="/chikhs" 
              element={
                <div className="grid md:grid-cols-2 gap-6">
                  <ChikhList 
                    chikhs={[]} 
                    onSelectChikh={setSelectedChikh} 
                  />
                  {selectedChikh && (
                    <ChikhDetail 
                      chikh={selectedChikh}
                      subjects={[]}
                      videos={[]}
                    />
                  )}
                </div>
              } 
            />
            
            <Route 
              path="/subjects" 
              element={
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Subject grid will be implemented later */}
                </div>
              } 
            />
            
            <Route 
              path="/videos" 
              element={
                <VideoList videos={[]} />
              } 
            />
            
            <Route 
              path="/add/chikh" 
              element={
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold mb-4">Add New Chikh</h2>
                  <ChikhForm onSubmit={firebaseService.addChikh} />
                </div>
              } 
            />
            
            <Route 
              path="/add/subject" 
              element={
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold mb-4">Add New Subject</h2>
                  <SubjectForm chikhId="" onSubmit={firebaseService.addSubject} />
                </div>
              } 
            />
            
            <Route 
              path="/add/video" 
              element={
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold mb-4">Add New Video</h2>
                  <VideoForm subjectId="" onSubmit={firebaseService.addVideo} />
                </div>
              } 
            />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
