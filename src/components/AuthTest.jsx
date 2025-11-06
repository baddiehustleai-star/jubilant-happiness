// src/components/AuthTest.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  BrandContainer,
  BrandSection,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandButton,
  BrandInput,
  BrandBadge,
  BrandSpinner
} from './branding';

const AuthTest = () => {
  const { user, loading, signup, signin, signInWithGoogle, logout } = useAuth();
  const [email, setEmail] = useState('test@photo2profit.com');
  const [password, setPassword] = useState('test123456');
  const [testResults, setTestResults] = useState([]);
  const [isTestingAuth, setIsTestingAuth] = useState(false);

  const addTestResult = (test, status, message) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testEmailSignUp = async () => {
    setIsTestingAuth(true);
    try {
      await signup(email, password);
      addTestResult('Email Sign Up', 'success', 'Account created successfully');
    } catch (error) {
      addTestResult('Email Sign Up', 'error', error.message);
    }
    setIsTestingAuth(false);
  };

  const testEmailSignIn = async () => {
    setIsTestingAuth(true);
    try {
      await signin(email, password);
      addTestResult('Email Sign In', 'success', 'Signed in successfully');
    } catch (error) {
      addTestResult('Email Sign In', 'error', error.message);
    }
    setIsTestingAuth(false);
  };

  const testGoogleSignIn = async () => {
    setIsTestingAuth(true);
    try {
      await signInWithGoogle();
      addTestResult('Google Sign In', 'success', 'Google authentication successful');
    } catch (error) {
      addTestResult('Google Sign In', 'error', error.message);
    }
    setIsTestingAuth(false);
  };

  const testLogout = async () => {
    setIsTestingAuth(true);
    try {
      await logout();
      addTestResult('Logout', 'success', 'Logged out successfully');
    } catch (error) {
      addTestResult('Logout', 'error', error.message);
    }
    setIsTestingAuth(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <BrandSection padding="lg">
        <BrandContainer>
          <BrandHeading level={1} variant="white" className="text-center mb-8">
            Firebase Authentication Test
          </BrandHeading>

          {/* Current User Status */}
          <BrandCard variant="glass" padding="lg" className="mb-8">
            <BrandHeading level={3} className="mb-4">Current Authentication Status</BrandHeading>
            
            {loading ? (
              <div className="flex items-center">
                <BrandSpinner size="sm" className="mr-3" />
                <BrandText>Loading authentication state...</BrandText>
              </div>
            ) : user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <BrandBadge variant="success">Authenticated</BrandBadge>
                  <BrandText weight="semibold">{user.email}</BrandText>
                </div>
                <BrandText size="sm" variant="secondary">
                  User ID: {user.uid}
                </BrandText>
                <BrandText size="sm" variant="secondary">
                  Provider: {user.providerData[0]?.providerId || 'Unknown'}
                </BrandText>
                <BrandText size="sm" variant="secondary">
                  Verified: {user.emailVerified ? 'Yes' : 'No'}
                </BrandText>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <BrandBadge variant="error">Not Authenticated</BrandBadge>
                <BrandText>No user signed in</BrandText>
              </div>
            )}
          </BrandCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Authentication Tests */}
            <BrandCard variant="default" padding="lg">
              <BrandHeading level={3} className="mb-6">Authentication Tests</BrandHeading>
              
              <div className="space-y-4 mb-6">
                <BrandInput
                  label="Test Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter test email"
                />
                <BrandInput
                  label="Test Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter test password"
                  helper="Minimum 6 characters for Firebase"
                />
              </div>

              <div className="space-y-3">
                <BrandButton
                  variant="primary"
                  onClick={testEmailSignUp}
                  disabled={isTestingAuth || !email || !password}
                  className="w-full"
                >
                  {isTestingAuth ? <BrandSpinner size="sm" className="mr-2" /> : ''}
                  Test Email Sign Up
                </BrandButton>

                <BrandButton
                  variant="secondary"
                  onClick={testEmailSignIn}
                  disabled={isTestingAuth || !email || !password}
                  className="w-full"
                >
                  {isTestingAuth ? <BrandSpinner size="sm" className="mr-2" /> : ''}
                  Test Email Sign In
                </BrandButton>

                <BrandButton
                  variant="gold"
                  onClick={testGoogleSignIn}
                  disabled={isTestingAuth}
                  className="w-full"
                >
                  {isTestingAuth ? <BrandSpinner size="sm" className="mr-2" /> : ''}
                  Test Google Sign In
                </BrandButton>

                {user && (
                  <BrandButton
                    variant="outline"
                    onClick={testLogout}
                    disabled={isTestingAuth}
                    className="w-full"
                  >
                    {isTestingAuth ? <BrandSpinner size="sm" className="mr-2" /> : ''}
                    Test Logout
                  </BrandButton>
                )}
              </div>
            </BrandCard>

            {/* Test Results */}
            <BrandCard variant="default" padding="lg">
              <div className="flex justify-between items-center mb-6">
                <BrandHeading level={3}>Test Results</BrandHeading>
                <BrandButton variant="ghost" size="sm" onClick={clearResults}>
                  Clear Results
                </BrandButton>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <BrandText variant="secondary" className="text-center py-8">
                    No tests run yet. Try the authentication tests above.
                  </BrandText>
                ) : (
                  testResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg"
                      style={{
                        borderColor: result.status === 'success' ? '#10B981' : '#EF4444',
                        backgroundColor: result.status === 'success' ? '#F0FDF4' : '#FEF2F2'
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <BrandText weight="semibold" size="sm">
                          {result.test}
                        </BrandText>
                        <BrandBadge variant={result.status === 'success' ? 'success' : 'error'}>
                          {result.status}
                        </BrandBadge>
                      </div>
                      <BrandText size="sm" variant="secondary">
                        {result.message}
                      </BrandText>
                      <BrandText size="xs" variant="secondary">
                        {result.timestamp}
                      </BrandText>
                    </div>
                  ))
                )}
              </div>
            </BrandCard>
          </div>

          {/* Firebase Configuration Info */}
          <BrandCard variant="minimal" padding="lg" className="mt-8">
            <BrandHeading level={4} className="mb-4">Firebase Configuration Status</BrandHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <BrandText weight="semibold">Project ID:</BrandText>
                <BrandText variant="secondary" className="font-mono">
                  {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not configured'}
                </BrandText>
              </div>
              <div>
                <BrandText weight="semibold">Auth Domain:</BrandText>
                <BrandText variant="secondary" className="font-mono break-all">
                  {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Not configured'}
                </BrandText>
              </div>
              <div>
                <BrandText weight="semibold">Messaging Sender ID:</BrandText>
                <BrandText variant="secondary" className="font-mono">
                  {import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'Not configured'}
                </BrandText>
              </div>
              <div>
                <BrandText weight="semibold">API Key:</BrandText>
                <BrandText variant="secondary" className="font-mono">
                  {import.meta.env.VITE_FIREBASE_API_KEY ? 
                    `${import.meta.env.VITE_FIREBASE_API_KEY.substring(0, 20)}...` : 
                    'Not configured'
                  }
                </BrandText>
              </div>
            </div>
          </BrandCard>

          {/* Back to App */}
          <div className="text-center mt-8">
            <BrandButton
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="text-white border-white hover:bg-white hover:text-rose-600"
            >
              ← Back to Photo2Profit
            </BrandButton>
          </div>
        </BrandContainer>
      </BrandSection>
    </div>
  );
};

export default AuthTest;