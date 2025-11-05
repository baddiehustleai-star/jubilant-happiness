import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BrandContainer,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandButton,
  BrandInput,
  BrandBadge,
  Logo,
} from '../components/branding';

export default function Login() {
  const navigate = useNavigate();
  const { signin, signup, isDemoMode } = useAuth();

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
        await signup(email, password);
      } else {
        await signin(email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-gradient flex items-center justify-center py-12 px-4">
      <BrandContainer size="sm">
        <div className="max-w-md w-full mx-auto">
          {isDemoMode && (
            <div className="text-center mb-6">
              <BrandBadge variant="warning" size="lg">
                🎭 Demo Mode Active
              </BrandBadge>
              <BrandText size="sm" variant="white" className="mt-2">
                Any email/password will work in demo mode!
              </BrandText>
            </div>
          )}

          <div className="text-center mb-8">
            <Logo size="md" variant="white" className="mx-auto mb-6" />
            <BrandHeading level={2} variant="white" className="mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </BrandHeading>
            <BrandText variant="white" size="lg">
              {isSignUp ? 'Start your AI-powered reselling journey' : 'Sign in to your account'}
            </BrandText>
          </div>

          <BrandCard variant="glass" padding="lg">
            <form className="space-y-6" onSubmit={handleEmailAuth}>
              <BrandInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />

              <BrandInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <BrandText size="sm" className="text-red-600">
                    {error}
                  </BrandText>
                </div>
              )}

              <BrandButton type="submit" variant="primary" disabled={loading} className="w-full">
                {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </BrandButton>
            </form>

            <div className="text-center mt-6">
              <BrandButton variant="ghost" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </BrandButton>
            </div>

            {isDemoMode && (
              <div className="text-center mt-4">
                <BrandButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEmail('demo@photo2profit.com');
                    setPassword('demo123');
                  }}
                >
                  🎮 Use Demo Credentials
                </BrandButton>
              </div>
            )}
          </BrandCard>

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
