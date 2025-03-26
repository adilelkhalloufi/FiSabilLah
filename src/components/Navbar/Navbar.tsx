import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const isActive = (path: string): string => {
    return location.pathname === path ? 'bg-primary-700 text-white' : 'text-primary-50 hover:bg-primary-700 hover:text-white';
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-white">Fi SabilLah</span>
          </Link>
          <div className="flex space-x-1">
            {[
              { path: '/chikhs', label: 'Chikhs' },
              { path: '/subjects', label: 'Subjects' },
              { path: '/videos', label: 'Videos' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(path)}`}
              >
                {label}
              </Link>
            ))}
            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 rounded-md text-sm font-medium text-primary-50 hover:bg-primary-700 hover:text-white transition-colors duration-200"
              >
                Add New +
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to="/add/chikh"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Add New Chikh
                    </Link>
                    <Link
                      to="/add/subject"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Add New Subject
                    </Link>
                    <Link
                      to="/add/video"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Add New Video
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;