import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiRoutes, IMAGE_URL } from '../routes/apiRoutes';
import Header from '../components/Header';

interface Chikh {
  id: string;
  name: string;
  description: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

const ChikhisPage = () => {
  const [chikhis, setChikhis] = useState<Chikh[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formData, setFormData] = useState<Omit<Chikh, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);

      // Preview the image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, image: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const fetchChikhis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiRoutes.chikhis);
      setChikhis(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching chikhis:', err);
      setError('Failed to load scholars. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const createChikhi = async (data: Omit<Chikh, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);

      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', data.name);
      formDataToSend.append('description', data.description);

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await axios.post(apiRoutes.chikhis, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setChikhis(prev => [...prev, response.data]);
      return true;
    } catch (err) {
      console.error('Error creating chikhi:', err);
      setError('Failed to create scholar. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateChikhi = async (id: string, data: Omit<Chikh, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);

      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      
      // Explicitly set all required fields to ensure they're included
      formDataToSend.append('name', data.name || '');
      formDataToSend.append('description', data.description || '');
      
      // Add _method field to properly handle PUT requests through FormData
      // Some backends require this for proper method detection with multipart/form-data
      formDataToSend.append('_method', 'PUT');
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      // Log the formData for debugging
      console.log('Updating with data:', {
        id,
        name: data.name,
        description: data.description,
        hasImageFile: !!imageFile
      });
      
      // Use POST with _method: PUT for better compatibility with FormData
      const response = await axios.post(`${apiRoutes.chikhis}/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setChikhis(prev => prev.map(chikh => chikh.id === id ? response.data : chikh));
      return true;
    } catch (err) {
      console.error('Error updating chikhi:', err);
      setError('Failed to update scholar. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteChikhi = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${apiRoutes.chikhis}/${id}`);
      setChikhis(prev => prev.filter(chikh => chikh.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting chikhi:', err);
      setError('Failed to delete scholar. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChikhis();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;

    if (editingId) {
      success = await updateChikhi(editingId, formData);
      if (success) setEditingId(null);
    } else {
      success = await createChikhi(formData);
    }

    if (success) {
      setFormData({
        name: '',
        description: '',
        image: '',
      });
      setImageFile(null);
      setIsFormVisible(false);
    }
  };

  const handleEdit = (chikh: Chikh) => {
    // Make sure to copy all required fields from the existing chikh
    setFormData({
      name: chikh.name || '',  // Ensure it's never null
      description: chikh.description || '',  // Ensure it's never null
      image: chikh.image || '',
    });
    setImageFile(null);
    setEditingId(chikh.id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this scholar?')) {
      await deleteChikhi(id);
    }
  };

  // Filter chikhis based on search query
  const filteredChikhis = chikhis.filter(chikh => 
    chikh.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chikh.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Header/>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Islamic Scholars</h1>
        <button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            if (!isFormVisible) {
              setEditingId(null);
              setFormData({
                name: '',
                description: '',
                image: '',
              });
              setImageFile(null);
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          {isFormVisible ? 'Cancel' : 'Add Scholar'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Search input */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-3 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Search scholars by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? 'Edit Scholar' : 'Add New Scholar'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="h-40 w-auto object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChikhis.length > 0 ? (
            filteredChikhis.map((chikh) => (
              <div key={chikh.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-transform hover:scale-[1.02] hover:shadow-lg">
                {chikh.image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={IMAGE_URL + chikh.image} 
                      alt={chikh.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{chikh.name}</h3>
                  <p className="text-gray-600 mb-4">{chikh.description}</p>
               
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(chikh)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md transition duration-300"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(chikh.id)}
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
            <div className="col-span-3 text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500">No scholars found matching your search</h3>
              <p className="text-gray-400 mt-1">Try a different search term or clear the search</p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {!loading && chikhis.length === 0 && !searchQuery && (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="text-lg font-medium text-gray-500">No scholars added yet</h3>
          <p className="text-gray-400 mt-1">Click 'Add Scholar' to get started</p>
        </div>
      )}
    </div>
  );
};

export default ChikhisPage;
