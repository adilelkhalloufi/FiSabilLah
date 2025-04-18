import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiRoutes } from '../routes/apiRoutes';
import Header from '../components/Header';

interface Video {
  id: string;
  title: string;
  file_path: string;
  status: string;
}

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
}

interface ScheduledPost {
  id: string;
  video_id: string;
  social_account_id: string;
  title: string;
  caption: string;
  hashtags: string;
  scheduled_at: string;
  status: 'pending' | 'published' | 'failed';
  created_at?: string;
  updated_at?: string;
  video?: Video;
  social_account?: SocialAccount;
}

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800'
};

const ScheduledPostsPage = () => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [formData, setFormData] = useState<Omit<ScheduledPost, 'id' | 'created_at' | 'updated_at' | 'video' | 'social_account'>>({
    video_id: '',
    social_account_id: '',
    title: '',
    caption: '',
    hashtags: '',
    scheduled_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Tomorrow
    status: 'pending'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchScheduledPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiRoutes.scheduledPosts);
      setScheduledPosts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching scheduled posts:', err);
      setError('Failed to load scheduled posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get(apiRoutes.videos);
      setVideos(response.data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const fetchSocialAccounts = async () => {
    try {
      const response = await axios.get(apiRoutes.socialAccounts);
      setSocialAccounts(response.data);
    } catch (err) {
      console.error('Error fetching social accounts:', err);
    }
  };

  const createScheduledPost = async (data: Omit<ScheduledPost, 'id' | 'created_at' | 'updated_at' | 'video' | 'social_account'>) => {
    try {
      setLoading(true);
      const response = await axios.post(apiRoutes.scheduledPosts, data);
      setScheduledPosts(prev => [...prev, response.data]);
      return true;
    } catch (err) {
      console.error('Error creating scheduled post:', err);
      setError('Failed to create scheduled post. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateScheduledPost = async (id: string, data: Omit<ScheduledPost, 'id' | 'created_at' | 'updated_at' | 'video' | 'social_account'>) => {
    try {
      setLoading(true);
      const response = await axios.put(apiRoutes.getScheduledPost(id), data);
      setScheduledPosts(prev => prev.map(post => post.id === id ? response.data : post));
      return true;
    } catch (err) {
      console.error('Error updating scheduled post:', err);
      setError('Failed to update scheduled post. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteScheduledPost = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(apiRoutes.getScheduledPost(id));
      setScheduledPosts(prev => prev.filter(post => post.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting scheduled post:', err);
      setError('Failed to delete scheduled post. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledPosts();
    fetchVideos();
    fetchSocialAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;

    if (editingId) {
      success = await updateScheduledPost(editingId, formData);
      if (success) setEditingId(null);
    } else {
      success = await createScheduledPost(formData);
    }

    if (success) {
      setFormData({
        video_id: '',
        social_account_id: '',
        title: '',
        caption: '',
        hashtags: '',
        scheduled_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        status: 'pending'
      });
      setIsFormVisible(false);
    }
  };

  const handleEdit = (post: ScheduledPost) => {
    // Format the date to local ISO string for datetime-local input
    const formattedDate = new Date(post.scheduled_at).toISOString().slice(0, 16);
    
    setFormData({
      video_id: post.video_id,
      social_account_id: post.social_account_id,
      title: post.title || '',
      caption: post.caption || '',
      hashtags: post.hashtags || '',
      scheduled_at: formattedDate,
      status: post.status
    });
    setEditingId(post.id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this scheduled post?')) {
      await deleteScheduledPost(id);
    }
  };

  // Filter posts by platform if selected
  const filteredPosts = selectedPlatform === 'all' 
    ? scheduledPosts
    : scheduledPosts.filter(post => post.social_account?.platform === selectedPlatform);

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Scheduled Posts</h1>
        <button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            if (!isFormVisible) {
              setEditingId(null);
              setFormData({
                video_id: '',
                social_account_id: '',
                title: '',
                caption: '',
                hashtags: '',
                scheduled_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
                status: 'pending'
              });
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          {isFormVisible ? 'Cancel' : 'Schedule New Post'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Filter by platform */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Platform</label>
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">All Platforms</option>
          <option value="tiktok">TikTok</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="youtube">YouTube</option>
        </select>
      </div>

      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? 'Edit Scheduled Post' : 'Schedule New Post'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video</label>
                <select
                  name="video_id"
                  value={formData.video_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select a Video</option>
                  {videos.map(video => (
                    <option key={video.id} value={video.id}>{video.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Social Account</label>
                <select
                  name="social_account_id"
                  value={formData.social_account_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select an Account</option>
                  {socialAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)} - @{account.username}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  value={formData.scheduled_at}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <textarea
                  name="caption"
                  value={formData.caption}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hashtags</label>
                <input
                  type="text"
                  name="hashtags"
                  value={formData.hashtags}
                  onChange={handleInputChange}
                  placeholder="#viral #trending"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
              >
                {editingId ? 'Update' : 'Schedule'}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-transform hover:scale-[1.01] hover:shadow-lg">
                <div className="border-b border-gray-100 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                    <div className="flex space-x-2 mt-1">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[post.status]}`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                      {post.social_account && (
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800`}>
                          {post.social_account.platform.charAt(0).toUpperCase() + post.social_account.platform.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Scheduled for:</p>
                    <p className="text-sm text-gray-600">{formatDateTime(post.scheduled_at)}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-3">{post.caption}</p>
                  {post.hashtags && (
                    <p className="text-blue-500 text-sm mb-3">{post.hashtags}</p>
                  )}
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {post.video?.title && (
                        <span>Video: {post.video.title}</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {post.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleEdit(post)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md transition duration-300"
                            disabled={loading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-md transition duration-300"
                            disabled={loading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500">No scheduled posts found</h3>
              <p className="text-gray-400 mt-1">
                {selectedPlatform !== 'all' 
                  ? `No posts scheduled for ${selectedPlatform}. Try a different platform or schedule a new post.`
                  : `Click 'Schedule New Post' to create one.`}
              </p>
              {selectedPlatform !== 'all' && (
                <button 
                  onClick={() => setSelectedPlatform('all')}
                  className="mt-4 text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  Show All Platforms
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduledPostsPage;
