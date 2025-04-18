import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiRoutes } from '../routes/apiRoutes';
import Header from '../components/Header';

interface SocialAccount {
  id: string;
  user_id: string;
  platform: 'tiktok' | 'instagram' | 'facebook' | 'youtube';
  platform_user_id: string;
  username: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

const platformIcons: Record<string, string> = {
  tiktok: 'https://img.icons8.com/color/48/000000/tiktok--v1.png',
  instagram: 'https://img.icons8.com/color/48/000000/instagram-new--v1.png',
  facebook: 'https://img.icons8.com/color/48/000000/facebook-new.png',
  youtube: 'https://img.icons8.com/color/48/000000/youtube-play.png'
};

const SocialAccountsPage = () => {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [formData, setFormData] = useState<Omit<SocialAccount, 'id' | 'user_id' | 'created_at' | 'updated_at'>>({
    platform: 'tiktok',
    platform_user_id: '',
    username: '',
    access_token: '',
    refresh_token: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchSocialAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiRoutes.socialAccounts);
      setSocialAccounts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching social accounts:', err);
      setError('Failed to load social accounts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const createSocialAccount = async (data: Omit<SocialAccount, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const response = await axios.post(apiRoutes.socialAccounts, data);
      setSocialAccounts(prev => [...prev, response.data]);
      return true;
    } catch (err) {
      console.error('Error creating social account:', err);
      setError('Failed to connect social account. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSocialAccount = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(apiRoutes.getSocialAccount(id));
      setSocialAccounts(prev => prev.filter(account => account.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting social account:', err);
      setError('Failed to disconnect social account. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await createSocialAccount(formData);

    if (success) {
      setFormData({
        platform: 'tiktok',
        platform_user_id: '',
        username: '',
        access_token: '',
        refresh_token: '',
      });
      setIsFormVisible(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to disconnect this social account?')) {
      await deleteSocialAccount(id);
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return 'bg-black text-white';
      case 'instagram':
        return 'bg-purple-600 text-white';
      case 'facebook':
        return 'bg-blue-600 text-white';
      case 'youtube':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Connected Social Accounts</h1>
        <button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            if (!isFormVisible) {
              setEditingId(null);
              setFormData({
                platform: 'tiktok',
                platform_user_id: '',
                username: '',
                access_token: '',
                refresh_token: '',
              });
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          {isFormVisible ? 'Cancel' : 'Connect Account'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Connect New Social Account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform User ID</label>
                <input
                  type="text"
                  name="platform_user_id"
                  value={formData.platform_user_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                <input
                  type="password"
                  name="access_token"
                  value={formData.access_token}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refresh Token (Optional)</label>
                <input
                  type="password"
                  name="refresh_token"
                  value={formData.refresh_token}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
              >
                Connect
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialAccounts.length > 0 ? (
            socialAccounts.map((account) => (
              <div key={account.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-transform hover:scale-[1.02] hover:shadow-lg">
                <div className={`px-6 py-4 ${getPlatformColor(account.platform)} flex items-center justify-between`}>
                  <div className="flex items-center">
                    <img 
                      src={platformIcons[account.platform]} 
                      alt={account.platform} 
                      className="w-6 h-6 mr-2"
                    />
                    <h3 className="text-xl font-bold">{account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}</h3>
                  </div>
                  <span className="bg-white text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Connected
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 font-medium mb-1">@{account.username}</p>
                  <p className="text-gray-500 text-sm mb-4">ID: {account.platform_user_id}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Connected: {new Date(account.created_at || '').toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-md transition duration-300 flex items-center"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500">No social accounts connected</h3>
              <p className="text-gray-400 mt-1">Click 'Connect Account' to add your first social platform</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialAccountsPage;
