/**
 * Authentication Modal Component
 *
 * Provides sign in, sign up, and password reset functionality in a modal
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AuthModal({ isOpen, onClose, defaultTab = 'signin' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, error } = useAuth();

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage(''); // Clear messages when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (activeTab === 'signin') {
        await signInWithEmail(formData.email, formData.password);
        onClose();
      } else if (activeTab === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match');
          return;
        }
        if (formData.password.length < 6) {
          setMessage('Password must be at least 6 characters');
          return;
        }
        await signUpWithEmail(formData.email, formData.password, formData.displayName);
        onClose();
      } else if (activeTab === 'reset') {
        await resetPassword(formData.email);
        setMessage('Password reset email sent! Check your inbox.');
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-diamond text-rose-dark">
            {activeTab === 'signin' && 'Welcome Back'}
            {activeTab === 'signup' && 'Join Photo2Profit'}
            {activeTab === 'reset' && 'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        {activeTab !== 'reset' && (
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'signin'
                  ? 'border-b-2 border-rose text-rose-dark'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'signup'
                  ? 'border-b-2 border-rose text-rose-dark'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose"
              required
            />
          </div>

          {activeTab !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose"
                required
                minLength={6}
              />
            </div>
          )}

          {activeTab === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose"
                required
                minLength={6}
              />
            </div>
          )}

          {/* Error/Success Message */}
          {(error || message) && (
            <div className={`text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>
              {error || message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-rose hover:bg-rose-dark text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                {activeTab === 'signin' && 'Sign In'}
                {activeTab === 'signup' && 'Create Account'}
                {activeTab === 'reset' && 'Send Reset Email'}
              </>
            )}
          </button>

          {/* Google Sign In */}
          {activeTab !== 'reset' && (
            <>
              <div className="text-center text-sm text-gray-500 my-4">
                <span>or</span>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </>
          )}

          {/* Footer Links */}
          <div className="text-center text-sm">
            {activeTab === 'signin' && (
              <button
                type="button"
                onClick={() => setActiveTab('reset')}
                className="text-rose hover:text-rose-dark"
              >
                Forgot your password?
              </button>
            )}
            {activeTab === 'reset' && (
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className="text-rose hover:text-rose-dark"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
