// src/components/BrandTest.jsx
import React from 'react';
import {
  BrandContainer,
  BrandSection,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandButton,
  BrandBadge,
  BrandInput,
  BrandSpinner,
  Logo,
  LogoWithIcon,
  LogoMark
} from './branding';

const BrandTest = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logo Test */}
      <BrandSection background="white" padding="lg">
        <BrandContainer>
          <BrandHeading level={2} className="mb-8 text-center">
            Logo Components Test
          </BrandHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <BrandCard padding="lg">
              <BrandText weight="semibold" className="mb-4">Logo Default</BrandText>
              <Logo size="lg" />
            </BrandCard>
            <BrandCard padding="lg">
              <BrandText weight="semibold" className="mb-4">Logo With Icon</BrandText>
              <LogoWithIcon size="lg" />
            </BrandCard>
            <BrandCard padding="lg">
              <BrandText weight="semibold" className="mb-4">Logo Mark</BrandText>
              <LogoMark size="lg" />
            </BrandCard>
          </div>
        </BrandContainer>
      </BrandSection>

      {/* Typography Test */}
      <BrandSection background="rose" padding="lg">
        <BrandContainer>
          <BrandHeading level={2} className="mb-8 text-center">
            Typography Test
          </BrandHeading>
          <div className="space-y-4">
            <BrandHeading level={1}>Heading 1 - Main Title</BrandHeading>
            <BrandHeading level={2} variant="primary">Heading 2 - Section Title</BrandHeading>
            <BrandHeading level={3} gradient>Heading 3 - Gradient Text</BrandHeading>
            <BrandText size="lg">Large body text for important descriptions</BrandText>
            <BrandText>Regular body text for content</BrandText>
            <BrandText size="sm" variant="secondary">Small secondary text</BrandText>
          </div>
        </BrandContainer>
      </BrandSection>

      {/* Button Test */}
      <BrandSection background="white" padding="lg">
        <BrandContainer>
          <BrandHeading level={2} className="mb-8 text-center">
            Button Components Test
          </BrandHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <BrandButton variant="primary">Primary</BrandButton>
            <BrandButton variant="secondary">Secondary</BrandButton>
            <BrandButton variant="gold">Gold</BrandButton>
            <BrandButton variant="outline">Outline</BrandButton>
            <BrandButton variant="ghost">Ghost</BrandButton>
            <BrandButton variant="danger">Danger</BrandButton>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <BrandButton size="sm" variant="primary">Small Button</BrandButton>
            <BrandButton size="default" variant="primary">Default Button</BrandButton>
            <BrandButton size="lg" variant="primary">Large Button</BrandButton>
          </div>
        </BrandContainer>
      </BrandSection>

      {/* Card Test */}
      <BrandSection background="gradient" padding="lg">
        <BrandContainer>
          <BrandHeading level={2} variant="white" className="mb-8 text-center">
            Card Components Test
          </BrandHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BrandCard variant="default" padding="lg">
              <BrandHeading level={4} className="mb-2">Default Card</BrandHeading>
              <BrandText variant="secondary">Standard white card with shadow</BrandText>
            </BrandCard>
            <BrandCard variant="luxury" padding="lg">
              <BrandHeading level={4} className="mb-2">Luxury Card</BrandHeading>
              <BrandText variant="secondary">Premium gradient background</BrandText>
            </BrandCard>
            <BrandCard variant="glass" padding="lg">
              <BrandHeading level={4} className="mb-2">Glass Card</BrandHeading>
              <BrandText variant="secondary">Transparent glass effect</BrandText>
            </BrandCard>
            <BrandCard variant="minimal" padding="lg">
              <BrandHeading level={4} className="mb-2">Minimal Card</BrandHeading>
              <BrandText variant="secondary">Clean minimal design</BrandText>
            </BrandCard>
          </div>
        </BrandContainer>
      </BrandSection>

      {/* Badge Test */}
      <BrandSection background="white" padding="lg">
        <BrandContainer>
          <BrandHeading level={2} className="mb-8 text-center">
            Badge Components Test
          </BrandHeading>
          <div className="flex flex-wrap gap-4 justify-center">
            <BrandBadge variant="primary">Primary</BrandBadge>
            <BrandBadge variant="gold">Gold</BrandBadge>
            <BrandBadge variant="success">Success</BrandBadge>
            <BrandBadge variant="warning">Warning</BrandBadge>
            <BrandBadge variant="error">Error</BrandBadge>
            <BrandBadge variant="info">Info</BrandBadge>
            <BrandBadge variant="gradient">Gradient</BrandBadge>
          </div>
        </BrandContainer>
      </BrandSection>

      {/* Form Test */}
      <BrandSection background="rose" padding="lg">
        <BrandContainer>
          <BrandHeading level={2} className="mb-8 text-center">
            Form Components Test
          </BrandHeading>
          <BrandCard variant="default" padding="lg" className="max-w-md mx-auto">
            <div className="space-y-4">
              <BrandInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                helper="We'll never share your email"
              />
              <BrandInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                error="Password must be at least 8 characters"
              />
              <BrandButton variant="primary" className="w-full">
                Test Form Submit
              </BrandButton>
            </div>
          </BrandCard>
        </BrandContainer>
      </BrandSection>

      {/* Loading Test */}
      <BrandSection background="white" padding="lg">
        <BrandContainer>
          <BrandHeading level={2} className="mb-8 text-center">
            Loading Components Test
          </BrandHeading>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <BrandSpinner size="sm" className="mb-2" />
              <BrandText size="sm">Small</BrandText>
            </div>
            <div className="text-center">
              <BrandSpinner size="default" className="mb-2" />
              <BrandText size="sm">Default</BrandText>
            </div>
            <div className="text-center">
              <BrandSpinner size="lg" className="mb-2" />
              <BrandText size="sm">Large</BrandText>
            </div>
            <div className="text-center">
              <BrandSpinner size="xl" className="mb-2" />
              <BrandText size="sm">Extra Large</BrandText>
            </div>
          </div>
        </BrandContainer>
      </BrandSection>

      {/* Responsive Test */}
      <BrandSection background="gradient" padding="lg">
        <BrandContainer>
          <BrandHeading level={2} variant="white" className="mb-8 text-center">
            Responsive Design Test
          </BrandHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <BrandCard key={item} variant="glass" padding="default">
                <BrandText variant="white" className="text-center">
                  Responsive Card {item}
                </BrandText>
              </BrandCard>
            ))}
          </div>
        </BrandContainer>
      </BrandSection>
    </div>
  );
};

export default BrandTest;