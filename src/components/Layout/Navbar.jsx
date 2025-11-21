import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog, FaImages, FaCrown } from 'react-icons/fa';

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getPlanBadge = () => {
    if (!userProfile?.plan) return null;

    const planColors = {
      free: 'bg-gray-100 text-gray-600',
      pro: 'bg-gradient-to-r from-rose to-gold text-white',
      business: 'bg-gradient-to-r from-gold to-rose-dark text-white',
    };

    const planNames = {
      free: 'Free',
      pro: 'Pro',
      business: 'Business',
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${planColors[userProfile.plan]}`}
      >
        {userProfile.plan === 'pro' || userProfile.plan === 'business' ? (
          <FaCrown className="mr-1 text-xs" />
        ) : null}
        {planNames[userProfile.plan]}
      </span>
    );
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-rose/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={currentUser ? '/dashboard' : '/'}
            className="flex items-center space-x-2 group"
            onClick={closeMobileMenu}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-rose via-gold to-rose-dark rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-sm">P2P</span>
            </div>
            <span className="font-diamond text-xl bg-gradient-to-r from-rose-dark via-rose to-gold bg-clip-text text-transparent">
              Photo2Profit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentUser ? (
              // Authenticated Navigation
              <>
                <Link
                  to="/dashboard"
                  className="text-dark hover:text-rose transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="text-dark hover:text-rose transition-colors font-medium"
                >
                  Upload
                </Link>
                <Link
                  to="/gallery"
                  className="text-dark hover:text-rose transition-colors font-medium"
                >
                  Gallery
                </Link>
                <Link
                  to="/pricing"
                  className="text-dark hover:text-rose transition-colors font-medium"
                >
                  Pricing
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blush/50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-rose to-gold rounded-full flex items-center justify-center">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-white text-sm" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-dark truncate max-w-24">
                        {currentUser.displayName || 'User'}
                      </span>
                      {getPlanBadge()}
                    </div>
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-rose/10 py-1 z-50">
                      <Link
                        to="/account"
                        className="flex items-center px-4 py-2 text-sm text-dark hover:bg-blush/20 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaCog className="mr-3 text-rose" />
                        Account Settings
                      </Link>
                      <Link
                        to="/gallery"
                        className="flex items-center px-4 py-2 text-sm text-dark hover:bg-blush/20 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaImages className="mr-3 text-rose" />
                        My Photos
                      </Link>
                      <hr className="my-1 border-rose/10" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Public Navigation
              <>
                <Link
                  to="/pricing"
                  className="text-dark hover:text-rose transition-colors font-medium"
                >
                  Pricing
                </Link>
                <a
                  href="#features"
                  className="text-dark hover:text-rose transition-colors font-medium"
                >
                  Features
                </a>
                <a href="#demo" className="text-dark hover:text-rose transition-colors font-medium">
                  Demo
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blush/50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-6 h-6 text-rose" />
            ) : (
              <FaBars className="w-6 h-6 text-rose" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-rose/10 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-2">
              {currentUser ? (
                // Authenticated Mobile Menu
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-dark hover:bg-blush/20 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/upload"
                    className="px-4 py-2 text-dark hover:bg-blush/20 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Upload Photos
                  </Link>
                  <Link
                    to="/gallery"
                    className="px-4 py-2 text-dark hover:bg-blush/20 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    My Gallery
                  </Link>
                  <Link
                    to="/pricing"
                    className="px-4 py-2 text-dark hover:bg-blush/20 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/account"
                    className="px-4 py-2 text-dark hover:bg-blush/20 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Account Settings
                  </Link>
                  <hr className="my-2 border-rose/10" />
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                // Public Mobile Menu
                <>
                  <Link
                    to="/pricing"
                    className="px-4 py-2 text-dark hover:bg-blush/20 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Pricing
                  </Link>
                  <a
                    href="#features"
                    className="px-4 py-2 text-dark hover:bg-blush/20 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Features
                  </a>
                  <a
                    href="#demo"
                    className="px-4 py-2 text-dark hover:bg-blush/20 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Try Demo
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
