import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white px-4 py-6 lg:py-8 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-xl text-white focus:outline-none"
        >
          <i className={`fas ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} transition-transform duration-300`}></i>
        </button>
      </div>
      
      <div className="flex-grow flex justify-center">
        <Link to="/">
          <img src="/assets/navbar/logo.png" alt="Esportive Logo" className="h-8 lg:h-10" />
        </Link>
      </div>
      
      <div className="flex items-center relative">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full border-2 border-red-600"
                />
              ) : (
                <i className="fas fa-user-circle text-2xl text-white"></i>
              )}
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 top-10 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
                <div className="px-4 py-2 text-sm text-white border-b border-gray-700">
                  {user.name}
                </div>
                <Link 
                  to="/tournaments" 
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Tournaments
                </Link>
                {user.isAdmin && (
                  <Link 
                    to="/publish-tournament" 
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Publish Tournament
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-2xl text-white focus:outline-none">
            <i className="fas fa-user-circle"></i>
          </Link>
        )}
      </div>

      {/* Side Menu */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 h-full bg-black z-40 pt-24 w-64">
          <div className="flex flex-col h-full p-8 text-white">
            <ul>
              <li className="mb-2">
                <a href="mailto:support@esportive.in" className="text-xl font-semibold block py-2 hover:text-gray-400">
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="mailto:work@esportive.in" className="text-xl font-semibold block py-2 hover:text-gray-400">
                  Work With Us
                </a>
              </li>
              <li className="mb-2">
                <div className="text-xl font-semibold py-2">Our Socials</div>
                <ul className="pl-4 mt-1 space-y-2">
                  <li><a href="https://instagram.com" className="text-base block hover:text-gray-400" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                  <li><a href="https://discord.com" className="text-base block hover:text-gray-400" target="_blank" rel="noopener noreferrer">Discord</a></li>
                  <li><a href="https://youtube.com" className="text-base block hover:text-gray-400" target="_blank" rel="noopener noreferrer">YouTube</a></li>
                  <li><a href="https://x.com" className="text-base block hover:text-gray-400" target="_blank" rel="noopener noreferrer">X</a></li>
                  <li><a href="https://whatsapp.com/channel/0029VacNiAqEUJt4LBNfRV27" className="text-base block hover:text-gray-400" target="_blank" rel="noopener noreferrer">WhatsApp Channel</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Navbar;