import React, { useState, useEffect } from 'react';import React from 'react';// src/pages/Dashboard.jsx

import { useAuth } from '../contexts/AuthContext';

import {import { useAuth } from '../contexts/AuthContext';import React, { useState, useEffect } from 'react';

  BrandContainer,

  BrandHeading,import {import { useAuth } from '../contexts/AuthContext';

  BrandText,

  BrandButton,  BrandContainer,import { 

  BrandCard,

  BrandBadge,  BrandHeading,  uploadService, 

  Logo

} from '../components/branding';  BrandText,  aiListingService, 



export default function Dashboard() {  BrandButton,  crossPostingService,

  const { user, logout, isDemoMode } = useAuth();

  const [stats, setStats] = useState({  BrandCard,  backgroundRemovalService 

    totalListings: 0,

    activeSales: 0,  BrandBadge,} from '../services';

    revenue: 0

  });  Logoimport PaymentService from '../services/paymentService';



  useEffect(() => {} from '../components/branding';import EnhancedPhotoUpload from '../components/EnhancedPhotoUpload';

    // In demo mode, show fake stats

    if (isDemoMode) {import {

      setStats({

        totalListings: 127,export default function Dashboard() {  BrandContainer,

        activeSales: 23,

        revenue: 2847.50  const { currentUser, logout, isDemoMode } = useAuth();  BrandSection,

      });

    }  BrandCard,

  }, [isDemoMode]);

  const handleLogout = async () => {  BrandHeading,

  return (

    <div className="min-h-screen bg-luxury-gradient">    try {  BrandText,

      {/* Header */}

      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">      await logout();  BrandButton,

        <BrandContainer>

          <div className="flex items-center justify-between py-4">    } catch (error) {  BrandBadge,

            <div className="flex items-center space-x-4">

              <Logo size="sm" variant="white" />      console.error('Logout error:', error);  BrandNavigation,

              <BrandHeading level={3} variant="white" className="mb-0">

                Dashboard    }  BrandSpinner

              </BrandHeading>

            </div>  };} from '../components/branding';

            

            <div className="flex items-center space-x-4">

              {isDemoMode && (

                <BrandBadge variant="warning">  return (const Dashboard = () => {

                  🎭 Demo Mode

                </BrandBadge>    <div className="min-h-screen bg-gray-50">  const { user, logout } = useAuth();

              )}

                    {/* Header */}  const [uploadedFiles, setUploadedFiles] = useState([]);

              <div className="text-white text-sm">

                Welcome, {user?.email || 'Demo User'}!      <div className="bg-white shadow-sm border-b">  const [generatedListings, setGeneratedListings] = useState([]);

              </div>

                      <BrandContainer>  const [subscription, setSubscription] = useState(null);

              <BrandButton 

                variant="outline"           <div className="flex justify-between items-center py-4">  const [usage, setUsage] = useState({ photos: 0, listings: 0 });

                size="sm"

                onClick={logout}            <Logo size="md" />  const [isLoading, setIsLoading] = useState(false);

                className="border-white text-white hover:bg-white hover:text-rose-600"

              >            <div className="flex items-center space-x-4">  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

                Sign Out

              </BrandButton>              {isDemoMode && (

            </div>

          </div>                <BrandBadge variant="warning">  // Navigation items

        </BrandContainer>

      </div>                  🎭 Demo Mode  const navigationItems = [



      {/* Main Content */}                </BrandBadge>    { name: 'Dashboard', href: '/dashboard' },

      <BrandContainer className="py-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">              )}    { name: 'Listings', href: '/listings' },

          {/* Stats Cards */}

          <BrandCard variant="glass" padding="lg">              <BrandButton variant="outline" onClick={handleLogout}>    { name: 'Analytics', href: '/analytics' },

            <div className="text-center">

              <div className="text-3xl font-bold text-white mb-2">                Sign Out    { name: 'Settings', href: '/settings' }

                {stats.totalListings}

              </div>              </BrandButton>  ];

              <BrandText variant="white" size="sm">

                Total Listings            </div>

              </BrandText>

            </div>          </div>  const navigationActions = [

          </BrandCard>

        </BrandContainer>    {

          <BrandCard variant="glass" padding="lg">

            <div className="text-center">      </div>      label: 'Upgrade',

              <div className="text-3xl font-bold text-white mb-2">

                {stats.activeSales}      variant: 'gold',

              </div>

              <BrandText variant="white" size="sm">      {/* Main Content */}      onClick: () => handleUpgrade()

                Active Sales

              </BrandText>      <BrandContainer className="py-12">    },

            </div>

          </BrandCard>        <div className="max-w-4xl mx-auto">    {



          <BrandCard variant="glass" padding="lg">          <div className="text-center mb-12">      label: 'Sign Out',

            <div className="text-center">

              <div className="text-3xl font-bold text-white mb-2">            <BrandHeading level={1} className="mb-4">      variant: 'outline',

                ${stats.revenue.toFixed(2)}

              </div>              Welcome to Photo2Profit! 🎉      onClick: logout

              <BrandText variant="white" size="sm">

                Total Revenue            </BrandHeading>    }

              </BrandText>

            </div>            <BrandText size="lg" className="max-w-2xl mx-auto">  ];

          </BrandCard>

        </div>              You're successfully authenticated and ready to start turning your thrift finds into profit!



        {/* Quick Actions */}            </BrandText>  useEffect(() => {

        <BrandCard variant="glass" padding="lg">

          <BrandHeading level={4} variant="white" className="mb-6">          </div>    loadUserData();

            Quick Actions

          </BrandHeading>  }, [user]);

          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">          {/* User Info Card */}

            <BrandButton variant="primary" className="w-full">

              📸 Upload Photos          <BrandCard variant="elevated" padding="lg" className="mb-8">  const loadUserData = async () => {

            </BrandButton>

                        <div className="flex items-center justify-between">    try {

            <BrandButton variant="secondary" className="w-full">

              🤖 Generate Listings              <div>      setIsLoading(true);

            </BrandButton>

                            <BrandHeading level={3} className="mb-2">      // Load subscription and usage data

            <BrandButton variant="secondary" className="w-full">

              📋 Manage Inventory                  Account Information      // This would typically come from your backend

            </BrandButton>

                            </BrandHeading>      setSubscription({ plan: 'free', status: 'active' });

            <BrandButton variant="secondary" className="w-full">

              📊 View Analytics                <div className="space-y-2">      setUsage({ photos: 15, listings: 8 });

            </BrandButton>

          </div>                  <BrandText>    } catch (error) {

        </BrandCard>

                    <strong>Email:</strong> {currentUser?.email || 'demo@photo2profit.com'}      console.error('Error loading user data:', error);

        {/* Demo Mode Info */}

        {isDemoMode && (                  </BrandText>    } finally {

          <BrandCard variant="glass" padding="lg" className="mt-6">

            <div className="text-center">                  <BrandText>      setIsLoading(false);

              <BrandHeading level={4} variant="white" className="mb-4">

                🎭 Demo Mode Active                    <strong>Account Type:</strong> {isDemoMode ? 'Demo User' : 'Free Plan'}    }

              </BrandHeading>

              <BrandText variant="white" className="mb-4">                  </BrandText>  };

                You're currently using Photo2Profit in demo mode. All data shown is simulated.

                To access real features, configure your Firebase project credentials.                  <BrandText>

              </BrandText>

              <BrandButton                     <strong>Status:</strong>   const handleFileUpload = async (files) => {

                variant="outline"

                className="border-white text-white hover:bg-white hover:text-rose-600"                    <BrandBadge variant="success" className="ml-2">    try {

              >

                Learn How to Setup Firebase                      Active      setIsLoading(true);

              </BrandButton>

            </div>                    </BrandBadge>      const uploaded = await uploadService.uploadFiles(files);

          </BrandCard>

        )}                  </BrandText>      setUploadedFiles(prev => [...prev, ...uploaded]);

      </BrandContainer>

    </div>                </div>    } catch (error) {

  );

}              </div>      console.error('Upload error:', error);

              <div className="text-6xl">    } finally {

                👤      setIsLoading(false);

              </div>    }

            </div>  };

          </BrandCard>

  const handleGenerateListing = async (photo) => {

          {/* Firebase Services Status */}    try {

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">      setIsLoading(true);

            <BrandCard variant="default" padding="md">      const listing = await aiListingService.generateListing(photo);

              <div className="text-center">      setGeneratedListings(prev => [...prev, listing]);

                <div className="text-3xl mb-3">🔐</div>    } catch (error) {

                <BrandHeading level={4} className="mb-2">      console.error('Listing generation error:', error);

                  Authentication    } finally {

                </BrandHeading>      setIsLoading(false);

                <BrandBadge variant="success">Connected</BrandBadge>    }

                <BrandText size="sm" className="mt-2">  };

                  {isDemoMode ? 'Demo simulation active' : 'Firebase Auth enabled'}

                </BrandText>  const handleCrossPost = async (listing) => {

              </div>    try {

            </BrandCard>      setIsLoading(true);

      await crossPostingService.crossPost(listing, selectedPlatforms);

            <BrandCard variant="default" padding="md">    } catch (error) {

              <div className="text-center">      console.error('Cross-posting error:', error);

                <div className="text-3xl mb-3">💾</div>    } finally {

                <BrandHeading level={4} className="mb-2">      setIsLoading(false);

                  Database    }

                </BrandHeading>  };

                <BrandBadge variant="success">Ready</BrandBadge>

                <BrandText size="sm" className="mt-2">  const handleUpgrade = async () => {

                  {isDemoMode ? 'Demo storage active' : 'Firestore configured'}    try {

                </BrandText>      await PaymentService.createCheckoutSession('pro_monthly');

              </div>    } catch (error) {

            </BrandCard>      console.error('Upgrade error:', error);

    }

            <BrandCard variant="default" padding="md">  };

              <div className="text-center">

                <div className="text-3xl mb-3">📁</div>  if (isLoading && !user) {

                <BrandHeading level={4} className="mb-2">    return (

                  File Storage      <div className="min-h-screen flex items-center justify-center">

                </BrandHeading>        <BrandSpinner size="lg" />

                <BrandBadge variant="success">Available</BrandBadge>      </div>

                <BrandText size="sm" className="mt-2">    );

                  {isDemoMode ? 'Demo uploads ready' : 'Firebase Storage ready'}  }

                </BrandText>

              </div>  return (

            </BrandCard>    <div className="min-h-screen bg-blush">

          </div>      {/* Navigation */}

      <BrandNavigation

          {/* Coming Soon Features */}        navigation={navigationItems}

          <BrandCard variant="elevated" padding="lg">        actions={navigationActions}

            <BrandHeading level={3} className="mb-6 text-center">        fixed={true}

              🚀 Coming Soon Features      />

            </BrandHeading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">      {/* Main Content */}

              <div className="space-y-3">      <div className="pt-20">

                <div className="flex items-center space-x-3">        {/* Hero Section */}

                  <div className="text-2xl">📸</div>        <BrandSection background="gradient" padding="lg">

                  <div>          <BrandContainer>

                    <BrandText className="font-semibold">Photo Upload & Analysis</BrandText>            <div className="text-center">

                    <BrandText size="sm">AI-powered item identification</BrandText>              <BrandHeading level={1} variant="white" className="mb-4">

                  </div>                Welcome back, {user?.displayName || 'Photo Seller'}!

                </div>              </BrandHeading>

                <div className="flex items-center space-x-3">              <BrandText variant="white" size="lg" className="max-w-2xl mx-auto mb-8">

                  <div className="text-2xl">💰</div>                Transform your photos into profitable listings with AI-powered optimization

                  <div>              </BrandText>

                    <BrandText className="font-semibold">Price Prediction</BrandText>              

                    <BrandText size="sm">Market value estimation</BrandText>              {/* Quick Stats */}

                  </div>              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">

                </div>                <BrandCard variant="glass" padding="default">

                <div className="flex items-center space-x-3">                  <div className="text-center">

                  <div className="text-2xl">📊</div>                    <BrandText size="2xl" weight="bold" variant="primary" className="mb-2">

                  <div>                      {usage.photos}

                    <BrandText className="font-semibold">Market Research</BrandText>                    </BrandText>

                    <BrandText size="sm">Competitive analysis tools</BrandText>                    <BrandText variant="secondary">Photos Uploaded</BrandText>

                  </div>                  </div>

                </div>                </BrandCard>

              </div>                

              <div className="space-y-3">                <BrandCard variant="glass" padding="default">

                <div className="flex items-center space-x-3">                  <div className="text-center">

                  <div className="text-2xl">📝</div>                    <BrandText size="2xl" weight="bold" variant="gold" className="mb-2">

                  <div>                      {usage.listings}

                    <BrandText className="font-semibold">Listing Optimization</BrandText>                    </BrandText>

                    <BrandText size="sm">AI-generated descriptions</BrandText>                    <BrandText variant="secondary">Listings Generated</BrandText>

                  </div>                  </div>

                </div>                </BrandCard>

                <div className="flex items-center space-x-3">                

                  <div className="text-2xl">📈</div>                <BrandCard variant="glass" padding="default">

                  <div>                  <div className="text-center">

                    <BrandText className="font-semibold">Profit Tracking</BrandText>                    <BrandBadge variant="gradient" size="lg">

                    <BrandText size="sm">Sales analytics dashboard</BrandText>                      {subscription?.plan?.toUpperCase() || 'FREE'}

                  </div>                    </BrandBadge>

                </div>                    <BrandText variant="secondary" className="mt-2">Current Plan</BrandText>

                <div className="flex items-center space-x-3">                  </div>

                  <div className="text-2xl">🎯</div>                </BrandCard>

                  <div>              </div>

                    <BrandText className="font-semibold">Smart Recommendations</BrandText>            </div>

                    <BrandText size="sm">Personalized insights</BrandText>          </BrandContainer>

                  </div>        </BrandSection>

                </div>

              </div>        {/* Upload Section */}

            </div>        <BrandSection background="white" padding="lg">

          </BrandCard>          <BrandContainer>

        </div>            <div className="text-center mb-12">

      </BrandContainer>              <BrandHeading level={2} className="mb-4">

    </div>                Upload Your Photos

  );              </BrandHeading>

}              <BrandText size="lg" variant="secondary" className="max-w-2xl mx-auto">
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
                          <BrandText variant="secondary">
                            {listing.description}
                          </BrandText>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <BrandText weight="bold" size="lg" variant="gold">
                            ${listing.suggestedPrice}
                          </BrandText>
                          <BrandBadge variant="primary">
                            {listing.category}
                          </BrandBadge>
                        </div>
                        
                        <div className="flex space-x-3">
                          <BrandButton
                            variant="primary"
                            onClick={() => handleCrossPost(listing)}
                          >
                            Cross-Post
                          </BrandButton>
                          <BrandButton variant="outline">
                            Edit Listing
                          </BrandButton>
                          <BrandButton variant="ghost">
                            Export CSV
                          </BrandButton>
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
      </div>
    </div>
  );
};

export default Dashboard;