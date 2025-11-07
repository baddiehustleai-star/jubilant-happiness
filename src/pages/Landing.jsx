import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { 
  BrandSection,
  BrandContainer,
  BrandHeading,
  BrandText,
  BrandButton,
  BrandCard,
  BrandNavigation
} from '../components/branding';

export default function Landing() {
  const navigate = useNavigate();
  
  const navigationActions = [
    {
      label: 'Sign In',
      variant: 'outline',
      onClick: () => navigate('/login')
    },
    {
      label: 'Get Started',
      variant: 'primary',
      onClick: () => navigate('/login')
    }
  ];

  const features = [
    {
      title: 'AI-Powered Listings',
      description: 'Generate compelling product descriptions and titles automatically using advanced AI',
      icon: '🤖'
    },
    {
      title: 'Background Removal',
      description: 'Professional photo editing with one-click background removal',
      icon: '✨'
    },
    {
      title: 'Cross-Platform Posting',
      description: 'Post to multiple marketplaces simultaneously with optimized formatting',
      icon: '🚀'
    },
    {
      title: 'Smart Pricing',
      description: 'Get AI-suggested pricing based on market analysis and trends',
      icon: '💰'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Online Seller',
      quote: 'Photo2Profit increased my listing efficiency by 300%. I can now focus on sourcing while the AI handles the tedious work.'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Reseller',
      quote: 'The background removal feature alone saves me hours each week. The AI listings are spot-on every time.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <BrandNavigation actions={navigationActions} />

      {/* Hero Section with Luxe Theme */}
      <Hero />

      {/* Features Section */}
      <BrandSection background="white" padding="xl">
        <BrandContainer>
          <div className="text-center mb-16">
            <BrandHeading level={2} className="mb-4">
              Everything You Need to Sell More
            </BrandHeading>
            <BrandText size="lg" variant="secondary" className="max-w-2xl mx-auto">
              Streamline your reselling workflow with powerful AI tools designed for modern sellers
            </BrandText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <BrandCard key={index} variant="default" padding="lg" hover={true}>
                <div className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <BrandHeading level={4} className="mb-3">
                    {feature.title}
                  </BrandHeading>
                  <BrandText variant="secondary">
                    {feature.description}
                  </BrandText>
                </div>
              </BrandCard>
            ))}
          </div>
        </BrandContainer>
      </BrandSection>

      {/* How It Works Section */}
      <BrandSection background="rose" padding="xl">
        <BrandContainer>
          <div className="text-center mb-16">
            <BrandHeading level={2} className="mb-4">
              How It Works
            </BrandHeading>
            <BrandText size="lg" variant="secondary" className="max-w-2xl mx-auto">
              Get from photo to profit in three simple steps
            </BrandText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand-gradient w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <BrandHeading level={4} className="mb-3">
                Upload Photos
              </BrandHeading>
              <BrandText variant="secondary">
                Simply drag and drop your product photos into our platform
              </BrandText>
            </div>

            <div className="text-center">
              <div className="bg-brand-gradient w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <BrandHeading level={4} className="mb-3">
                AI Enhancement
              </BrandHeading>
              <BrandText variant="secondary">
                Our AI generates listings, removes backgrounds, and suggests optimal pricing
              </BrandText>
            </div>

            <div className="text-center">
              <div className="bg-brand-gradient w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <BrandHeading level={4} className="mb-3">
                Cross-Post & Sell
              </BrandHeading>
              <BrandText variant="secondary">
                Instantly post to multiple platforms and start making sales
              </BrandText>
            </div>
          </div>
        </BrandContainer>
      </BrandSection>

      {/* Testimonials Section */}
      <BrandSection background="white" padding="xl">
        <BrandContainer>
          <div className="text-center mb-16">
            <BrandHeading level={2} className="mb-4">
              Trusted by Successful Sellers
            </BrandHeading>
            <BrandText size="lg" variant="secondary" className="max-w-2xl mx-auto">
              Join thousands of sellers who've transformed their business with Photo2Profit
            </BrandText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <BrandCard key={index} variant="default" padding="lg">
                <BrandText className="italic mb-4">
                  "{testimonial.quote}"
                </BrandText>
                <div>
                  <BrandText weight="semibold" className="mb-1">
                    {testimonial.name}
                  </BrandText>
                  <BrandText size="sm" variant="secondary">
                    {testimonial.role}
                  </BrandText>
                </div>
              </BrandCard>
            ))}
          </div>
        </BrandContainer>
      </BrandSection>

      {/* CTA Section */}
      <BrandSection background="gradient" padding="xl">
        <BrandContainer>
          <div className="text-center">
            <BrandHeading level={2} variant="white" className="mb-4">
              Ready to Transform Your Selling?
            </BrandHeading>
            <BrandText variant="white" size="lg" className="max-w-2xl mx-auto mb-8">
              Start your free trial today and see why thousands of sellers choose Photo2Profit
            </BrandText>
            <BrandButton size="lg" variant="white" onClick={() => navigate('/login')}>
              Start Free Trial - No Credit Card Required
            </BrandButton>
          </div>
        </BrandContainer>
      </BrandSection>

      {/* Simple Luxe Footer */}
      <Footer />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}
