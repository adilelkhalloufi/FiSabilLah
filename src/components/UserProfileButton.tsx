import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

const UserProfileButton: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-sm pr-2">{user?.name}</span>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                <div className="font-medium">{user?.name}</div>
                <div className="text-gray-500 truncate">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowAuthModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          Sign In
        </button>
      )}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default UserProfileButton;
