// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  uploadService,
  aiListingService,
  crossPostingService,
  backgroundRemovalService,
} from '../services';
import PaymentService from '../services/paymentService';
import EnhancedPhotoUpload from '../components/EnhancedPhotoUpload';
import ApiHealth from '../components/ApiHealth';
import ProductionReadiness from '../components/ProductionReadiness';
import {
  BrandContainer,
  BrandSection,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandButton,
  BrandBadge,
  BrandNavigation,
  BrandSpinner,
} from '../components/branding';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generatedListings, setGeneratedListings] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState({ photos: 0, listings: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Navigation items
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Products', href: '/products' },
    { name: 'Upgrades', href: '/upgrades' },
    { name: 'Listings', href: '/listings' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Settings', href: '/settings' },
  ];

  const navigationActions = [
    {
      label: user?.premium ? '⭐ Premium' : 'Upgrade',
      variant: user?.premium ? 'outline' : 'gold',
      onClick: () => (window.location.href = '/upgrades'),
    },
    {
      label: 'Sign Out',
      variant: 'outline',
      onClick: logout,
    },
  ];

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      // Load subscription and usage data
      // This would typically come from your backend
      setSubscription({ plan: 'free', status: 'active' });
      setUsage({ photos: 15, listings: 8 });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files) => {
    try {
      setIsLoading(true);
      const uploaded = await uploadService.uploadFiles(files);
      setUploadedFiles((prev) => [...prev, ...uploaded]);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateListing = async (photo) => {
    try {
      setIsLoading(true);
      const listing = await aiListingService.generateListing(photo);
      setGeneratedListings((prev) => [...prev, listing]);
    } catch (error) {
      console.error('Listing generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrossPost = async (listing) => {
    try {
      setIsLoading(true);
      await crossPostingService.crossPost(listing, ['ebay', 'poshmark'], user?.uid);
    } catch (error) {
      console.error('Cross-posting error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      await PaymentService.createCheckoutSession('pro_monthly');
    } catch (error) {
      console.error('Upgrade error:', error);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BrandSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush">
      {/* Navigation */}
      <BrandNavigation navigation={navigationItems} actions={navigationActions} fixed={true} />

      {/* Main Content */}
      <div className="pt-20">
        {/* Hero Section */}
        <BrandSection background="gradient" padding="lg">
          <BrandContainer>
            <div className="text-center">
              <BrandHeading level={1} variant="white" className="mb-4">
                Welcome back, {user?.displayName || 'Photo Seller'}!
              </BrandHeading>
              <BrandText variant="white" size="lg" className="max-w-2xl mx-auto mb-8">
                Transform your photos into profitable listings with AI-powered optimization
              </BrandText>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <BrandCard variant="glass" padding="default">
                  <div className="text-center">
                    <BrandText size="2xl" weight="bold" variant="primary" className="mb-2">
                      {usage.photos}
                    </BrandText>
                    <BrandText variant="secondary">Photos Uploaded</BrandText>
                  </div>
                </BrandCard>

                <BrandCard variant="glass" padding="default">
                  <div className="text-center">
                    <BrandText size="2xl" weight="bold" variant="gold" className="mb-2">
                      {usage.listings}
                    </BrandText>
                    <BrandText variant="secondary">Listings Generated</BrandText>
                  </div>
                </BrandCard>

                <BrandCard variant="glass" padding="default">
                  <div className="text-center">
                    <BrandBadge variant="gradient" size="lg">
                      {subscription?.plan?.toUpperCase() || 'FREE'}
                    </BrandBadge>
                    <BrandText variant="secondary" className="mt-2">
                      Current Plan
                    </BrandText>
                  </div>
                </BrandCard>
              </div>
            </div>
          </BrandContainer>
        </BrandSection>

        {/* Upload Section */}
        <BrandSection background="white" padding="lg">
          <BrandContainer>
            <div className="text-center mb-12">
              <BrandHeading level={2} className="mb-4">
                Upload Your Photos
              </BrandHeading>
              <BrandText size="lg" variant="secondary" className="max-w-2xl mx-auto">
                Drag and drop your photos to get started with AI-powered listing generation
              </BrandText>
            </div>

            <BrandCard variant="default" padding="lg" className="max-w-4xl mx-auto">
              <EnhancedPhotoUpload
                onUpload={handleFileUpload}
                maxFiles={10}
                acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
              />
            </BrandCard>
          </BrandContainer>
        </BrandSection>

        {/* Recent Uploads */}
        {uploadedFiles.length > 0 && (
          <BrandSection background="rose" padding="lg">
            <BrandContainer>
              <BrandHeading level={3} className="mb-8">
                Recent Uploads
              </BrandHeading>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedFiles.slice(0, 6).map((file, index) => (
                  <BrandCard key={index} variant="default" padding="default" hover={true}>
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={file.preview || file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <BrandText weight="medium" className="mb-2 truncate">
                      {file.name}
                    </BrandText>
                    <div className="flex space-x-2">
                      <BrandButton
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleGenerateListing(file)}
                      >
                        Generate Listing
                      </BrandButton>
                      <BrandButton
                        variant="outline"
                        size="sm"
                        onClick={() => backgroundRemovalService.removeBackground(file)}
                      >
                        Remove BG
                      </BrandButton>
                    </div>
                  </BrandCard>
                ))}
              </div>
            </BrandContainer>
          </BrandSection>
        )}

        {/* Generated Listings */}
        {generatedListings.length > 0 && (
          <BrandSection background="white" padding="lg">
            <BrandContainer>
              <BrandHeading level={3} className="mb-8">
                Generated Listings
              </BrandHeading>

              <div className="space-y-6">
                {generatedListings.map((listing, index) => (
                  <BrandCard key={index} variant="default" padding="lg">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={listing.photo?.url}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <BrandHeading level={4} className="mb-2">
                            {listing.title}
                          </BrandHeading>
                          <BrandText variant="secondary">{listing.description}</BrandText>
                        </div>

                        <div className="flex items-center space-x-4">
                          <BrandText weight="bold" size="lg" variant="gold">
                            ${listing.suggestedPrice}
                          </BrandText>
                          <BrandBadge variant="primary">{listing.category}</BrandBadge>
                        </div>

                        <div className="flex space-x-3">
                          <BrandButton variant="primary" onClick={() => handleCrossPost(listing)}>
                            Cross-Post
                          </BrandButton>
                          <BrandButton variant="outline">Edit Listing</BrandButton>
                          <BrandButton variant="ghost">Export CSV</BrandButton>
                        </div>
                      </div>
                    </div>
                  </BrandCard>
                ))}
              </div>
            </BrandContainer>
          </BrandSection>
        )}

        {/* Upgrade CTA */}
        {subscription?.plan === 'free' && (
          <BrandSection background="gold" padding="lg">
            <BrandContainer>
              <div className="text-center">
                <BrandHeading level={3} variant="white" className="mb-4">
                  Ready to Unlock Premium Features?
                </BrandHeading>
                <BrandText variant="white" size="lg" className="mb-8 max-w-2xl mx-auto">
                  Get unlimited uploads, advanced AI features, and priority support
                </BrandText>
                <BrandButton variant="white" size="lg" onClick={handleUpgrade}>
                  Upgrade to Pro
                </BrandButton>
              </div>
            </BrandContainer>
          </BrandSection>
        )}

        {/* System Health */}
        <BrandSection background="white" padding="lg">
          <BrandContainer>
            <div className="max-w-3xl mx-auto">
              <ApiHealth />
              <div className="mt-6">
                <ProductionReadiness />
              </div>
            </div>
          </BrandContainer>
        </BrandSection>
      </div>
    </div>
  );
};

export default Dashboard;
