// src/components/DashboardTest.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  uploadService, 
  aiListingService, 
  crossPostingService,
  backgroundRemovalService 
} from '../services';
import PaymentService from '../services/paymentService';
import EnhancedPhotoUpload from './EnhancedPhotoUpload';
import {
  BrandContainer,
  BrandSection,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandButton,
  BrandBadge,
  BrandSpinner
} from './branding';

const DashboardTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [isTestingService, setIsTestingService] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generatedListings, setGeneratedListings] = useState([]);

  const addTestResult = (test, status, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testUploadService = async () => {
    setIsTestingService(true);
    try {
      // Create a mock file for testing
      const mockFile = new File(['test content'], 'test-image.jpg', { type: 'image/jpeg' });
      const result = await uploadService.uploadFiles([mockFile]);
      
      setUploadedFiles(result);
      addTestResult('Upload Service', 'success', `Uploaded ${result.length} file(s)`, result);
    } catch (error) {
      addTestResult('Upload Service', 'error', error.message);
    }
    setIsTestingService(false);
  };

  const testAIListingService = async () => {
    setIsTestingService(true);
    try {
      const mockPhoto = {
        name: 'test-product.jpg',
        url: 'https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=Test+Product',
        category: 'Electronics'
      };
      
      const result = await aiListingService.generateListing(mockPhoto);
      setGeneratedListings(prev => [...prev, result]);
      addTestResult('AI Listing Service', 'success', 'Generated listing successfully', result);
    } catch (error) {
      addTestResult('AI Listing Service', 'error', error.message);
    }
    setIsTestingService(false);
  };

  const testBackgroundRemovalService = async () => {
    setIsTestingService(true);
    try {
      const mockPhoto = {
        name: 'test-background.jpg',
        url: 'https://via.placeholder.com/400x400/87CEEB/FFFFFF?text=Background+Test'
      };
      
      const result = await backgroundRemovalService.removeBackground(mockPhoto);
      addTestResult('Background Removal', 'success', 'Background removed successfully', result);
    } catch (error) {
      addTestResult('Background Removal', 'error', error.message);
    }
    setIsTestingService(false);
  };

  const testCrossPostingService = async () => {
    setIsTestingService(true);
    try {
      const mockListing = {
        title: 'Test Product Listing',
        description: 'This is a test product for cross-platform posting',
        price: 29.99,
        category: 'Electronics',
        photos: ['https://via.placeholder.com/400x400']
      };
      
      const platforms = ['ebay', 'mercari', 'poshmark'];
      const result = await crossPostingService.crossPost(mockListing, platforms);
      addTestResult('Cross-Posting Service', 'success', `Posted to ${platforms.length} platforms`, result);
    } catch (error) {
      addTestResult('Cross-Posting Service', 'error', error.message);
    }
    setIsTestingService(false);
  };

  const testPaymentService = async () => {
    setIsTestingService(true);
    try {
      // Test creating a checkout session (won't actually charge in demo mode)
      const result = await PaymentService.createCheckoutSession('pro_monthly');
      addTestResult('Payment Service', 'success', 'Checkout session created (demo mode)', result);
    } catch (error) {
      addTestResult('Payment Service', 'error', error.message);
    }
    setIsTestingService(false);
  };

  const testAllServices = async () => {
    addTestResult('Comprehensive Test', 'info', 'Starting all service tests...');
    await testUploadService();
    await testAIListingService();
    await testBackgroundRemovalService();
    await testCrossPostingService();
    await testPaymentService();
    addTestResult('Comprehensive Test', 'success', 'All service tests completed!');
  };

  const handleFileUpload = async (files) => {
    try {
      setIsTestingService(true);
      const uploaded = await uploadService.uploadFiles(files);
      setUploadedFiles(prev => [...prev, ...uploaded]);
      addTestResult('Real File Upload', 'success', `Successfully uploaded ${files.length} file(s)`, uploaded);
    } catch (error) {
      addTestResult('Real File Upload', 'error', error.message);
    }
    setIsTestingService(false);
  };

  const clearResults = () => {
    setTestResults([]);
    setUploadedFiles([]);
    setGeneratedListings([]);
  };

  return (
    <div className="min-h-screen bg-blush">
      <BrandSection padding="lg">
        <BrandContainer>
          <BrandHeading level={1} className="text-center mb-8">
            Dashboard Features Test
          </BrandHeading>

          {/* User Status */}
          <BrandCard variant="luxury" padding="lg" className="mb-8">
            <BrandHeading level={3} className="mb-4">Test Environment</BrandHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <BrandText weight="semibold">User Status:</BrandText>
                <div className="flex items-center space-x-2 mt-1">
                  {user ? (
                    <>
                      <BrandBadge variant="success">Authenticated</BrandBadge>
                      <BrandText size="sm">{user.email}</BrandText>
                    </>
                  ) : (
                    <BrandBadge variant="error">Not Authenticated</BrandBadge>
                  )}
                </div>
              </div>
              <div>
                <BrandText weight="semibold">Environment:</BrandText>
                <BrandBadge variant="info" className="mt-1">Demo Mode</BrandBadge>
              </div>
            </div>
          </BrandCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service Tests */}
            <BrandCard variant="default" padding="lg">
              <BrandHeading level={3} className="mb-6">Service Tests</BrandHeading>
              
              <div className="space-y-3">
                <BrandButton
                  variant="primary"
                  onClick={testUploadService}
                  disabled={isTestingService}
                  className="w-full"
                >
                  {isTestingService ? <BrandSpinner size="sm" className="mr-2" /> : ''}
                  Test Upload Service
                </BrandButton>

                <BrandButton
                  variant="secondary"
                  onClick={testAIListingService}
                  disabled={isTestingService}
                  className="w-full"
                >
                  {isTestingService ? <BrandSpinner size="sm" className="mr-2" /> : ''}
                  Test AI Listing Generation
                </BrandButton>

                <BrandButton
                  variant="gold"
                  onClick={testBackgroundRemovalService}
                  disabled={isTestingService}
                  className="w-full"
                >
                  {isTestingService ? <BrandSpinner size="sm" className="mr-2" /> : ''}
                  Test Background Removal
                </BrandButton>

                <BrandButton
                  variant="outline"
                  onClick={testCrossPostingService}
                  disabled={isTestingService}
                  className="w-full"
                >
                  {isTestingService ? <BrandSpinner size="sm" className="mr-2" /> : ''}
                  Test Cross-Platform Posting
                </BrandButton>

                <BrandButton
                  variant="ghost"
                  onClick={testPaymentService}
                  disabled={isTestingService}
                  className="w-full"
                >
                  {isTestingService ? <BrandSpinner size="sm" className="mr-2" /> : ''}
                  Test Payment Service
                </BrandButton>

                <hr className="my-4" />

                <BrandButton
                  variant="primary"
                  onClick={testAllServices}
                  disabled={isTestingService}
                  className="w-full"
                  size="lg"
                >
                  {isTestingService ? <BrandSpinner size="sm" className="mr-2" /> : ''}
                  Run All Tests
                </BrandButton>
              </div>
            </BrandCard>

            {/* Test Results */}
            <BrandCard variant="default" padding="lg">
              <div className="flex justify-between items-center mb-6">
                <BrandHeading level={3}>Test Results</BrandHeading>
                <BrandButton variant="ghost" size="sm" onClick={clearResults}>
                  Clear All
                </BrandButton>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <BrandText variant="secondary" className="text-center py-8">
                    No tests run yet. Try the service tests above.
                  </BrandText>
                ) : (
                  testResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg"
                      style={{
                        borderColor: 
                          result.status === 'success' ? '#10B981' : 
                          result.status === 'error' ? '#EF4444' : '#3B82F6',
                        backgroundColor: 
                          result.status === 'success' ? '#F0FDF4' : 
                          result.status === 'error' ? '#FEF2F2' : '#EFF6FF'
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <BrandText weight="semibold" size="sm">
                          {result.test}
                        </BrandText>
                        <BrandBadge variant={
                          result.status === 'success' ? 'success' : 
                          result.status === 'error' ? 'error' : 'info'
                        }>
                          {result.status}
                        </BrandBadge>
                      </div>
                      <BrandText size="sm" variant="secondary">
                        {result.message}
                      </BrandText>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer">View Data</summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                      <BrandText size="xs" variant="secondary">
                        {result.timestamp}
                      </BrandText>
                    </div>
                  ))
                )}
              </div>
            </BrandCard>
          </div>

          {/* File Upload Test */}
          <BrandCard variant="default" padding="lg" className="mt-8">
            <BrandHeading level={3} className="mb-6">Real File Upload Test</BrandHeading>
            <EnhancedPhotoUpload
              onUpload={handleFileUpload}
              maxFiles={5}
              acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
            />
            
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <BrandHeading level={4} className="mb-4">Uploaded Files</BrandHeading>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedFiles.slice(-4).map((file, index) => (
                    <div key={index} className="text-center">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                        <img
                          src={file.preview || file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <BrandText size="xs" className="truncate">
                        {file.name}
                      </BrandText>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </BrandCard>

          {/* Generated Listings Display */}
          {generatedListings.length > 0 && (
            <BrandCard variant="default" padding="lg" className="mt-8">
              <BrandHeading level={3} className="mb-6">Generated Listings</BrandHeading>
              <div className="space-y-4">
                {generatedListings.map((listing, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <BrandHeading level={4} className="mb-2">{listing.title}</BrandHeading>
                    <BrandText variant="secondary" className="mb-2">{listing.description}</BrandText>
                    <div className="flex items-center space-x-4">
                      <BrandBadge variant="gold">${listing.suggestedPrice}</BrandBadge>
                      <BrandBadge variant="primary">{listing.category}</BrandBadge>
                    </div>
                  </div>
                ))}
              </div>
            </BrandCard>
          )}

          {/* Back to App */}
          <div className="text-center mt-8">
            <BrandButton
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
            >
              ← Go to Real Dashboard
            </BrandButton>
          </div>
        </BrandContainer>
      </BrandSection>
    </div>
  );
};

export default DashboardTest;