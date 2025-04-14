import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiRoutes } from '../routes/apiRoutes';

interface Video {
  id: string;
  url: string;
  platform?: string;
  description: string;
  thumbnail?: string;
  chikhi_id: string;
  subject_id: string;
  chikhi?: {
    id: string;
    name: string;
  };
  subject?: {
    id: string;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface Chikh {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

const VideoPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [chikhis, setChikhis] = useState<Chikh[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formData, setFormData] = useState<Omit<Video, 'id' | 'created_at' | 'updated_at' | 'chikhi' | 'subject'>>({
    url: '',
    platform: 'YouTube',
    description: '',
    chikhi_id: '',
    subject_id: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterChikhiId, setFilterChikhiId] = useState<string>('');
  const [filterSubjectId, setFilterSubjectId] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiRoutes.videos);
      setVideos(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchChikhis = async () => {
    try {
      const response = await axios.get(apiRoutes.chikhis);
      setChikhis(response.data);
    } catch (err) {
      console.error('Error fetching chikhis:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(apiRoutes.subjects);
      setSubjects(response.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const createVideo = async (data: Omit<Video, 'id' | 'created_at' | 'updated_at' | 'chikhi' | 'subject'>) => {
    try {
      setLoading(true);
      const response = await axios.post(apiRoutes.videos, data);
      setVideos(prev => [...prev, response.data]);
      return true;
    } catch (err) {
      console.error('Error creating video:', err);
      setError('Failed to create video. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateVideo = async (id: string, data: Omit<Video, 'id' | 'created_at' | 'updated_at' | 'chikhi' | 'subject'>) => {
    try {
      setLoading(true);
      const response = await axios.put(`${apiRoutes.videos}/${id}`, data);
      setVideos(prev => prev.map(video => video.id === id ? response.data : video));
      return true;
    } catch (err) {
      console.error('Error updating video:', err);
      setError('Failed to update video. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${apiRoutes.videos}/${id}`);
      setVideos(prev => prev.filter(video => video.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting video:', err);
      setError('Failed to delete video. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Generate YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;
  };

  useEffect(() => {
    fetchVideos();
    fetchChikhis();
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;

    if (editingId) {
      success = await updateVideo(editingId, formData);
      if (success) setEditingId(null);
    } else {
      success = await createVideo(formData);
    }

    if (success) {
      setFormData({
        url: '',
        platform: 'YouTube',
        description: '',
        chikhi_id: '',
        subject_id: '',
      });
      setIsFormVisible(false);
    }
  };

  const handleEdit = (video: Video) => {
    setFormData({
      url: video.url || '',
      platform: video.platform || 'YouTube',
      description: video.description || '',
      chikhi_id: video.chikhi_id || '',
      subject_id: video.subject_id || '',
    });
    setEditingId(video.id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      await deleteVideo(id);
    }
  };

  // Filter videos based on search query and filters
  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Convert both to strings for consistent comparison
    const videoChikhiId = String(video.chikhi_id);
    const videoSubjectId = String(video.subject_id);
    const selectedChikhiId = String(filterChikhiId);
    const selectedSubjectId = String(filterSubjectId);
    
    // Compare as strings, but still respect empty filter state
    const matchesChikhi = !filterChikhiId || videoChikhiId === selectedChikhiId;
    const matchesSubject = !filterSubjectId || videoSubjectId === selectedSubjectId;
    
    return matchesSearch && matchesChikhi && matchesSubject;
  });

  // Get chikhi and subject names for a video
  const getChikhiName = (chikhiId: string) => {
    const chikhi = chikhis.find(c => c.id === chikhiId);
    return chikhi ? chikhi.name : 'Unknown Scholar';
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  // Render YouTube embed
  const renderVideoEmbed = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    
    return (
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
          className="w-full h-full rounded-lg"
        ></iframe>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Videos</h1>
        <button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            if (!isFormVisible) {
              setEditingId(null);
              setFormData({
                url: '',
                platform: 'YouTube',
                description: '',
                chikhi_id: '',
                subject_id: '',
              });
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          {isFormVisible ? 'Cancel' : 'Add Video'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Search and filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-3 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <select
            className="block w-full p-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-emerald-500 focus:border-emerald-500"
            value={filterChikhiId}
            onChange={(e) => setFilterChikhiId(e.target.value)}
          >
            <option value="">All Scholars</option>
            {chikhis.map(chikhi => (
              <option key={chikhi.id} value={chikhi.id}>{chikhi.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            className="block w-full p-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-emerald-500 focus:border-emerald-500"
            value={filterSubjectId}
            onChange={(e) => setFilterSubjectId(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? 'Edit Video' : 'Add New Video'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Vimeo">Vimeo</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scholar</label>
                <select
                  name="chikhi_id"
                  value={formData.chikhi_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select a Scholar</option>
                  {chikhis.map(chikhi => (
                    <option key={chikhi.id} value={chikhi.id}>{chikhi.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  name="subject_id"
                  value={formData.subject_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select a Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              {formData.url && formData.platform === 'YouTube' && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                  {renderVideoEmbed(formData.url)}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !isFormVisible ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-transform hover:scale-[1.01] hover:shadow-lg">
                <div className="p-5">
                  {video.platform === 'YouTube' && renderVideoEmbed(video.url)}
                  
                  <div className="flex justify-between mb-3">
                    <div className="flex space-x-2">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {getChikhiName(video.chikhi_id)}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {getSubjectName(video.subject_id)}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{video.description}</h3>
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mb-4 block truncate">
                    {video.url}
                  </a>
               
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(video)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md transition duration-300"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-md transition duration-300"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500">No videos found</h3>
              <p className="text-gray-400 mt-1">Try different search criteria or add a new video</p>
              {(searchQuery || filterChikhiId || filterSubjectId) && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterChikhiId('');
                    setFilterSubjectId('');
                  }}
                  className="mt-4 text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {!loading && videos.length === 0 && !searchQuery && !filterChikhiId && !filterSubjectId && (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-500">No videos added yet</h3>
          <p className="text-gray-400 mt-1">Click 'Add Video' to get started</p>
        </div>
      )}
    </div>
  );
};

export default VideoPage;
