// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import {
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
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSimpleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Login failed');

      const { token } = await res.json();
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: decoded.email }),
        credentials: 'include',
      });

      const { token } = await res.json();
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      setError('Google sign-in failed.');
    }
  };

  return (
    <BrandContainer>
      <BrandCard className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="large" />
        </div>
        
        <BrandHeading className="text-center mb-2">
          Sign in to Photo2Profit
        </BrandHeading>
        
        <BrandText className="text-center mb-6">
          Turn your photos into profitable listings with AI
        </BrandText>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-in cancelled.')}
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSimpleLogin} className="space-y-4">
          <BrandInput
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <BrandButton type="submit" disabled={loading || !email} className="w-full">
            {loading ? <><BrandSpinner size="small" className="mr-2" /> Signing in...</> : 'Sign In'}
          </BrandButton>
        </form>

        <BrandText className="text-center mt-6 text-xs text-gray-500">
          By signing in, you agree to our Terms of Service
        </BrandText>
      </BrandCard>
    </BrandContainer>
  );
}
