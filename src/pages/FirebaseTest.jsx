// src/pages/FirebaseTest.jsx
import React, { useState } from 'react';
import { 
  quickConnectionTest, 
  runAllFirebaseTests 
} from '../utils/firebaseTest';
import {
  BrandContainer,
  BrandSection,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandButton,
  BrandBadge
} from '../components/branding';

const FirebaseTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [testing, setTesting] = useState(false);
  const [quickTest, setQuickTest] = useState(null);

  const handleQuickTest = () => {
    console.clear();
    const result = quickConnectionTest();
    setQuickTest(result);
  };

  const handleFullTest = async () => {
    setTesting(true);
    setTestResults(null);
    console.clear();
    
    try {
      const results = await runAllFirebaseTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({ overall: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-blush">
      <BrandSection background="gradient" padding="lg">
        <BrandContainer>
          <div className="text-center">
            <BrandHeading level={1} variant="white" className="mb-4">
              Firebase Connection Test
            </BrandHeading>
            <BrandText variant="white" size="lg">
              Project: photo2profit-758851214311
            </BrandText>
          </div>
        </BrandContainer>
      </BrandSection>

      <BrandSection background="white" padding="lg">
        <BrandContainer>
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Quick Test */}
            <BrandCard variant="default" padding="lg">
              <BrandHeading level={3} className="mb-4">
                Quick Configuration Check
              </BrandHeading>
              <BrandText className="mb-4">
                Verify that Firebase services are properly configured.
              </BrandText>
              
              <BrandButton 
                variant="outline" 
                onClick={handleQuickTest}
                className="mb-4"
              >
                Run Quick Test
              </BrandButton>
              
              {quickTest !== null && (
                <div className="mt-4">
                  <BrandBadge variant={quickTest ? 'success' : 'error'}>
                    {quickTest ? '✅ Configuration OK' : '❌ Configuration Issue'}
                  </BrandBadge>
                  <BrandText size="sm" className="mt-2">
                    Check browser console for details.
                  </BrandText>
                </div>
              )}
            </BrandCard>

            {/* Full Test */}
            <BrandCard variant="default" padding="lg">
              <BrandHeading level={3} className="mb-4">
                Full Firebase Test
              </BrandHeading>
              <BrandText className="mb-4">
                Test Authentication, Firestore, and Storage functionality.
                <br />
                <strong>Note:</strong> This will create a temporary test user.
              </BrandText>
              
              <BrandButton 
                variant="primary" 
                onClick={handleFullTest}
                disabled={testing}
                className="mb-4"
              >
                {testing ? 'Testing...' : 'Run Full Test'}
              </BrandButton>
              
              {testResults && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <BrandBadge variant={testResults.auth?.success ? 'success' : 'error'}>
                        🔐 Authentication
                      </BrandBadge>
                      <BrandText size="sm" className="mt-1">
                        {testResults.auth?.success ? 'Working' : 'Failed'}
                      </BrandText>
                    </div>
                    
                    <div className="text-center">
                      <BrandBadge variant={testResults.firestore?.success ? 'success' : 'error'}>
                        📄 Firestore
                      </BrandBadge>
                      <BrandText size="sm" className="mt-1">
                        {testResults.firestore?.success ? 'Working' : 'Failed'}
                      </BrandText>
                    </div>
                    
                    <div className="text-center">
                      <BrandBadge variant={testResults.storage?.success ? 'success' : 'error'}>
                        📁 Storage
                      </BrandBadge>
                      <BrandText size="sm" className="mt-1">
                        {testResults.storage?.success ? 'Working' : 'Failed'}
                      </BrandText>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <BrandBadge 
                      variant={testResults.overall ? 'success' : 'error'}
                      size="lg"
                    >
                      {testResults.overall ? '🎉 All Tests Passed!' : '❌ Some Tests Failed'}
                    </BrandBadge>
                  </div>
                  
                  <BrandText size="sm" variant="secondary" className="text-center">
                    Check browser console for detailed results.
                  </BrandText>
                </div>
              )}
            </BrandCard>

            {/* Setup Instructions */}
            <BrandCard variant="luxury" padding="lg">
              <BrandHeading level={3} className="mb-4">
                Firebase Setup Checklist
              </BrandHeading>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📝</span>
                  <BrandText>Update .env file with Firebase credentials</BrandText>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔐</span>
                  <BrandText>Enable Authentication (Email/Password + Google)</BrandText>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📄</span>
                  <BrandText>Create Firestore Database (test mode)</BrandText>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📁</span>
                  <BrandText>Enable Firebase Storage (test mode)</BrandText>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔄</span>
                  <BrandText>Restart dev server after updating .env</BrandText>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-rose-50 rounded-lg">
                <BrandText weight="semibold" className="mb-2">
                  Need Help?
                </BrandText>
                <BrandText size="sm">
                  Check FIREBASE_CREDENTIALS_SETUP.md and FIREBASE_SETUP.md for detailed instructions.
                </BrandText>
              </div>
            </BrandCard>

            {/* Console Output */}
            <BrandCard variant="minimal" padding="lg">
              <BrandHeading level={4} className="mb-3">
                Console Output
              </BrandHeading>
              <BrandText size="sm" variant="secondary">
                Open your browser's Developer Tools (F12) → Console tab to see detailed test results.
              </BrandText>
              <div className="mt-3 p-3 bg-gray-100 rounded font-mono text-sm">
                Press F12 → Console to see Firebase test output
              </div>
            </BrandCard>
            
          </div>
        </BrandContainer>
      </BrandSection>
    </div>
  );
};

export default FirebaseTest;