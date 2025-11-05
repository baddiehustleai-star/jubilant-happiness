import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/photo2profit-logo.svg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in with Google: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-blush px-6">
      <img src={logo} alt="Photo2Profit Logo" className="w-32 mb-4 drop-shadow-xl" />
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-diamond text-center mb-6 text-dark">
          Welcome Back
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full cta disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Log In'}
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 font-medium"
          >
            Continue with Google
          </button>
        </div>
        <p className="text-center mt-4 text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-rose font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
