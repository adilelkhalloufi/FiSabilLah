import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiRoutes } from '../routes/apiRoutes';
import Header from '../components/Header';

interface Subject {
  id: string;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

const SubjectPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formData, setFormData] = useState<Omit<Subject, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiRoutes.subjects);
      setSubjects(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('Failed to load subjects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (data: Omit<Subject, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const response = await axios.post(apiRoutes.subjects, data);
      setSubjects(prev => [...prev, response.data]);
      return true;
    } catch (err) {
      console.error('Error creating subject:', err);
      setError('Failed to create subject. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (id: string, data: Omit<Subject, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const response = await axios.put(`${apiRoutes.subjects}/${id}`, data);
      setSubjects(prev => prev.map(subject => subject.id === id ? response.data : subject));
      return true;
    } catch (err) {
      console.error('Error updating subject:', err);
      setError('Failed to update subject. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${apiRoutes.subjects}/${id}`);
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting subject:', err);
      setError('Failed to delete subject. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;

    if (editingId) {
      success = await updateSubject(editingId, formData);
      if (success) setEditingId(null);
    } else {
      success = await createSubject(formData);
    }

    if (success) {
      setFormData({
        name: '',
        description: '',
      });
      setIsFormVisible(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setFormData({
      name: subject.name || '',
      description: subject.description || '',
    });
    setEditingId(subject.id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject? This will also delete all related videos.')) {
      await deleteSubject(id);
    }
  };

  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subjects</h1>
        <button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            if (!isFormVisible) {
              setEditingId(null);
              setFormData({
                name: '',
                description: '',
              });
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          {isFormVisible ? 'Cancel' : 'Add Subject'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

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
            placeholder="Search subjects by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? 'Edit Subject' : 'Add New Subject'}
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
                   
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
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
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-transform hover:scale-[1.02] hover:shadow-lg">
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{subject.name}</h3>
                  <p className="text-gray-600 mb-4">{subject.description}</p>
               
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(subject)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md transition duration-300"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(subject.id)}
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
              <h3 className="text-lg font-medium text-gray-500">No subjects found matching your search</h3>
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

      {!loading && subjects.length === 0 && !searchQuery && (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="text-lg font-medium text-gray-500">No subjects added yet</h3>
          <p className="text-gray-400 mt-1">Click 'Add Subject' to get started</p>
        </div>
      )}
    </div>
  );
};

export default SubjectPage;
