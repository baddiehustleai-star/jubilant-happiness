import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  BrandContainer,
  BrandHeading,
  BrandText,
  BrandButton,
  BrandCard,
  BrandBadge,
  Logo,
} from '../components/branding';

export default function Dashboard() {
  const { user, logout, isDemoMode } = useAuth();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeSales: 0,
    revenue: 0,
  });

  useEffect(() => {
    // In demo mode, show fake stats
    if (isDemoMode) {
      setStats({
        totalListings: 127,
        activeSales: 23,
        revenue: 2847.5,
      });
    }
  }, [isDemoMode]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-gradient">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <BrandContainer>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Logo size="sm" variant="white" />
              <BrandHeading level={3} variant="white" className="mb-0">
                Dashboard
              </BrandHeading>
            </div>

            <div className="flex items-center space-x-4">
              {isDemoMode && <BrandBadge variant="warning">🎭 Demo Mode</BrandBadge>}

              <div className="text-white text-sm">Welcome, {user?.email || 'Demo User'}!</div>

              <BrandButton
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-white text-white hover:bg-white hover:text-rose-600"
              >
                Sign Out
              </BrandButton>
            </div>
          </div>
        </BrandContainer>
      </div>

      {/* Main Content */}
      <BrandContainer className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <BrandCard variant="glass" padding="lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.totalListings}</div>
              <BrandText variant="white" size="sm">
                Total Listings
              </BrandText>
            </div>
          </BrandCard>

          <BrandCard variant="glass" padding="lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.activeSales}</div>
              <BrandText variant="white" size="sm">
                Active Sales
              </BrandText>
            </div>
          </BrandCard>

          <BrandCard variant="glass" padding="lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">${stats.revenue.toFixed(2)}</div>
              <BrandText variant="white" size="sm">
                Total Revenue
              </BrandText>
            </div>
          </BrandCard>
        </div>

        {/* Quick Actions */}
        <BrandCard variant="glass" padding="lg">
          <BrandHeading level={4} variant="white" className="mb-6">
            Quick Actions
          </BrandHeading>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <BrandButton variant="primary" className="w-full">
              📸 Upload Photos
            </BrandButton>

            <BrandButton variant="secondary" className="w-full">
              🤖 Generate Listings
            </BrandButton>

            <BrandButton variant="secondary" className="w-full">
              📋 Manage Inventory
            </BrandButton>

            <BrandButton variant="secondary" className="w-full">
              📊 View Analytics
            </BrandButton>
          </div>
        </BrandCard>

        {/* Demo Mode Info */}
        {isDemoMode && (
          <BrandCard variant="glass" padding="lg" className="mt-6">
            <div className="text-center">
              <BrandHeading level={4} variant="white" className="mb-4">
                🎭 Demo Mode Active
              </BrandHeading>
              <BrandText variant="white" className="mb-4">
                You're currently using Photo2Profit in demo mode. All data shown is simulated. To
                access real features, configure your Firebase project credentials.
              </BrandText>
              <BrandButton
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-rose-600"
              >
                Learn How to Setup Firebase
              </BrandButton>
            </div>
          </BrandCard>
        )}

        {/* Firebase Services Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <BrandCard variant="default" padding="md">
            <div className="text-center">
              <div className="text-3xl mb-3">🔐</div>
              <BrandHeading level={4} className="mb-2">
                Authentication
              </BrandHeading>
              <BrandBadge variant="success">Connected</BrandBadge>
              <BrandText size="sm" className="mt-2">
                {isDemoMode ? 'Demo simulation active' : 'Firebase Auth enabled'}
              </BrandText>
            </div>
          </BrandCard>

          <BrandCard variant="default" padding="md">
            <div className="text-center">
              <div className="text-3xl mb-3">💾</div>
              <BrandHeading level={4} className="mb-2">
                Database
              </BrandHeading>
              <BrandBadge variant="success">Ready</BrandBadge>
              <BrandText size="sm" className="mt-2">
                {isDemoMode ? 'Demo storage active' : 'Firestore configured'}
              </BrandText>
            </div>
          </BrandCard>

          <BrandCard variant="default" padding="md">
            <div className="text-center">
              <div className="text-3xl mb-3">📁</div>
              <BrandHeading level={4} className="mb-2">
                File Storage
              </BrandHeading>
              <BrandBadge variant="success">Available</BrandBadge>
              <BrandText size="sm" className="mt-2">
                {isDemoMode ? 'Demo uploads ready' : 'Firebase Storage ready'}
              </BrandText>
            </div>
          </BrandCard>
        </div>

        {/* Coming Soon Features */}
        <BrandCard variant="elevated" padding="lg" className="mt-8">
          <BrandHeading level={3} className="mb-6 text-center">
            🚀 Coming Soon Features
          </BrandHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📸</div>
                <div>
                  <BrandText className="font-semibold">Photo Upload & Analysis</BrandText>
                  <BrandText size="sm">AI-powered item identification</BrandText>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💰</div>
                <div>
                  <BrandText className="font-semibold">Price Prediction</BrandText>
                  <BrandText size="sm">Market value estimation</BrandText>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📊</div>
                <div>
                  <BrandText className="font-semibold">Market Research</BrandText>
                  <BrandText size="sm">Competitive analysis tools</BrandText>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📝</div>
                <div>
                  <BrandText className="font-semibold">Listing Optimization</BrandText>
                  <BrandText size="sm">AI-generated descriptions</BrandText>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📈</div>
                <div>
                  <BrandText className="font-semibold">Profit Tracking</BrandText>
                  <BrandText size="sm">Sales analytics dashboard</BrandText>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <BrandText className="font-semibold">Smart Recommendations</BrandText>
                  <BrandText size="sm">Personalized insights</BrandText>
                </div>
              </div>
            </div>
          </div>
        </BrandCard>
      </BrandContainer>
    </div>
  );
}
