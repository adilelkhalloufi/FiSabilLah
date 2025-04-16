import { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { apiRoutes } from '../routes/apiRoutes';

const TagsPage = () => {
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [islamicTags, setIslamicTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [addingTag, setAddingTag] = useState(false);

  // Fetch tags from database
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        axios.get(apiRoutes.tags).then((res) => setIslamicTags(res.data));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags. Please try again later.');
        setIsLoading(false);
        
        // Fallback to hardcoded tags if API fails
        setIslamicTags([]);
      }
    };

    fetchTags();
  }, []);

  // Handle adding a new tag
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    try {
      setAddingTag(true);
      let TheTag = "#" + newTag.trim();
      await axios.post(apiRoutes.tags, { name: TheTag });
      setIslamicTags(prev => [...prev, TheTag]);
      setNewTag('');
      setAddingTag(false);
    } catch (err) {
      console.error('Error adding tag:', err);
      // Add the tag locally even if the API fails
      setIslamicTags(prev => [...prev,  "#" + newTag.trim()]);
      setNewTag('');
      setAddingTag(false);
    }
  };

  // Toggle tag selection
  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Handle copy to clipboard
  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag)
      .then(() => {
        setCopiedTag(tag);
        setTimeout(() => setCopiedTag(null), 2000); // Reset after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Copy selected tags
  const handleCopySelected = () => {
    if (selectedTags.length === 0) return;
    
    const tagsToCopy = selectedTags.join(' ');
    navigator.clipboard.writeText(tagsToCopy)
      .then(() => {
        setCopiedTag('selected');
        setTimeout(() => setCopiedTag(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy selected tags:', err);
      });
  };

  // Filter tags based on search query
  const filteredTags = islamicTags.filter(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Copy all tags
  const handleCopyAll = () => {
    const allTags = islamicTags.join(' ');
    navigator.clipboard.writeText(allTags)
      .then(() => {
        setCopiedTag('all');
        setTimeout(() => setCopiedTag(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy all: ', err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Islamic Tags</h1>
            <div className="flex space-x-3">
              <button
                onClick={handleCopySelected}
                disabled={selectedTags.length === 0}
                className={`${selectedTags.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center`}
              >
                {copiedTag === 'selected' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied {selectedTags.length}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copy Selected ({selectedTags.length})
                  </>
                )}
              </button>
              <button
                onClick={handleCopyAll}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
              >
                {copiedTag === 'all' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied All
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copy All Tags
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Select tags by clicking on them, then copy your selection. Click directly on the tag text to copy individual tags.
          </p>

          {/* Search and Add Tag bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="search"
                className="block w-full p-3 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Search for tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex">
              <input
                type="text"
                className="block p-3 text-sm border border-gray-300 rounded-l-lg bg-white focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Add new tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim() || addingTag}
                className={`${!newTag.trim() || addingTag ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'} text-white px-4 rounded-r-lg transition duration-300 flex items-center justify-center`}
              >
                {addingTag ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-3 text-gray-600">Loading tags...</span>
            </div>
          )}

          {/* Error message */}
          {error && !isLoading && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tags grid */}
          {!isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTags.map((tag, index) => (
                <div 
                  key={index}
                  className={`
                    p-3 rounded-lg cursor-pointer text-center transition-all duration-200
                    ${copiedTag === tag ? 
                      'bg-green-100 border border-green-300' : 
                      selectedTags.includes(tag) ?
                      'bg-blue-50 border border-blue-300 shadow-sm' :
                      'bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTagSelection(tag)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                    <span 
                      className="text-emerald-800 font-medium ml-2 flex-grow text-center cursor-pointer"
                      onClick={() => handleCopyTag(tag)}
                    >
                      {tag}
                    </span>
                    {copiedTag === tag && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && filteredTags.length === 0 && (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500">No tags found matching your search</h3>
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

          {/* Selected tags summary */}
          {selectedTags.length > 0 && (
            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-blue-800">Selected Tags ({selectedTags.length})</h3>
                <button 
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag, index) => (
                  <div key={index} className="bg-white px-3 py-1 rounded-full border border-blue-200 flex items-center">
                    <span className="text-sm text-blue-800">{tag}</span>
                    <button 
                      onClick={() => toggleTagSelection(tag)}
                      className="ml-2 text-blue-400 hover:text-blue-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional information */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">How to Use Islamic Tags</h2>
            <p className="text-gray-600 mb-4">
              Using relevant hashtags can help increase the visibility of your Islamic content on social media platforms. Here are some tips:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Use a mix of popular and niche hashtags to reach a broad yet targeted audience</li>
              <li>Don't overuse hashtags - most platforms work best with 5-15 relevant tags</li>
              <li>Consider adding tags in both English and Arabic to reach different audiences</li>
              <li>Location-specific tags can help when sharing content related to specific Islamic events</li>
              <li>Research trending Islamic tags during special occasions like Ramadan or Eid</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsPage;
