// src/pages/Login.jsx
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  BrandSection,
  BrandContainer,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandButton,
  BrandInput,
  BrandSpinner,
  Logo
} from '../components/branding';

export default function Login() {
  const navigate = useNavigate();
  const auth = getAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      
      // User-friendly error messages
      let message = 'Authentication failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email. Please sign up.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/email-already-in-use') {
        message = 'Email already in use. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google auth error:', error);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login for testing
  const handleDemoLogin = () => {
    setEmail('demo@photo2profit.com');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-luxury-gradient flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <BrandContainer size="sm">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Logo size="md" variant="white" className="mx-auto mb-6" />
            <BrandHeading level={2} variant="white" className="mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </BrandHeading>
            <BrandText variant="white" size="lg">
              {isSignUp 
                ? 'Start your AI-powered reselling journey' 
                : 'Sign in to your account'
              }
            </BrandText>
          </div>

          {/* Auth Form */}
          <BrandCard variant="glass" padding="lg">
            <form className="space-y-6" onSubmit={handleEmailAuth}>
              <div className="space-y-4">
                <BrandInput
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  error={error && error.includes('email') ? error : ''}
                />
                
                <BrandInput
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  helper={isSignUp ? "Password should be at least 6 characters" : ""}
                  error={error && error.includes('password') ? error : ''}
                />
              </div>

              {/* General Error */}
              {error && !error.includes('email') && !error.includes('password') && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <BrandText size="sm" className="text-red-600">
                    {error}
                  </BrandText>
                </div>
              )}

              {/* Submit Button */}
              <BrandButton
                type="submit"
                variant="primary"
                size="default"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <BrandSpinner size="sm" className="mr-2" />
                    Processing...
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </BrandButton>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Auth Button */}
              <BrandButton
                type="button"
                variant="outline"
                size="default"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </div>
              </BrandButton>
            </form>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center mt-6">
              <BrandButton
                variant="ghost"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </BrandButton>
            </div>

            {/* Demo Login */}
            <div className="text-center mt-4">
              <BrandButton
                variant="ghost"
                size="sm"
                onClick={handleDemoLogin}
              >
                🎮 Use Demo Credentials
              </BrandButton>
            </div>
          </BrandCard>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <BrandCard variant="glass" padding="sm">
              <div className="text-center">
                <div className="text-2xl mb-2">🤖</div>
                <BrandText size="sm" variant="white" weight="medium">
                  AI Listings
                </BrandText>
              </div>
            </BrandCard>
            
            <BrandCard variant="glass" padding="sm">
              <div className="text-center">
                <div className="text-2xl mb-2">📷</div>
                <BrandText size="sm" variant="white" weight="medium">
                  Photo Upload
                </BrandText>
              </div>
            </BrandCard>
            
            <BrandCard variant="glass" padding="sm">
              <div className="text-center">
                <div className="text-2xl mb-2">🛒</div>
                <BrandText size="sm" variant="white" weight="medium">
                  Multi-Platform
                </BrandText>
              </div>
            </BrandCard>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <BrandButton
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white/80 hover:text-white"
            >
              ← Back to Home
            </BrandButton>
          </div>
        </div>
      </BrandContainer>
    </div>
  );
}