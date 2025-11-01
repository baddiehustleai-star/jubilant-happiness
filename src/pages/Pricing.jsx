import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon, SparklesIcon, TrophyIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { paymentService } from '../services/payment.js';
import { useAuth } from '../contexts/AuthContext';

const PricingPage = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    try {
      const subData = await paymentService.getSubscriptionStatus(user.uid);
      setSubscription(subData);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan) => {
    try {
      setLoading(true);
      const result = await paymentService.createCheckoutSession(plan);
      window.location.href = result.url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBillingPortal = async () => {
    try {
      const result = await paymentService.createBillingPortalSession();
      window.location.href = result.url;
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      alert('Failed to open billing portal. Please try again.');
    }
  };

  const plans = {
    free: {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for trying out Photo2Profit',
      features: [
        '5 photo uploads per month',
        '3 AI-generated listings',
        'Basic templates',
        'Poshmark CSV export',
        'Email support',
      ],
      limitations: [
        'No background removal',
        'No eBay integration',
        'No batch processing',
        'Limited platforms',
        'Basic AI analysis',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    pro: {
      name: 'Pro',
      price: 14.99,
      period: 'month',
      originalPrice: 29.99,
      description: 'Everything you need to scale your reselling business',
      trialDays: 7,
      features: [
        'Unlimited photo uploads',
        'Unlimited AI listings',
        'Professional background removal',
        'All platform integrations',
        'Batch processing',
        'Advanced AI analysis',
        'Cross-posting automation',
        'Priority support',
        'Analytics dashboard',
        'Custom templates',
      ],
      limitations: [],
      cta: 'Start 7-Day Free Trial',
      popular: true,
    },
  };

  const testimonials = [
    {
      name: 'Sarah Chen',
      title: 'Poshmark Power Seller',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      content: 'Photo2Profit has 3x my sales! The AI descriptions are spot-on and save me hours every week.',
      rating: 5,
      sales: '$12,000+ monthly',
    },
    {
      name: 'Mike Rodriguez',
      title: 'Multi-Platform Seller',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      content: 'The cross-posting feature is a game-changer. I can list on 6 platforms in minutes instead of hours.',
      rating: 5,
      sales: '$8,500+ monthly',
    },
    {
      name: 'Emma Thompson',
      title: 'Vintage Clothing Specialist',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      content: 'The background removal makes my vintage pieces look professional. My conversion rate doubled!',
      rating: 5,
      sales: '$15,000+ monthly',
    },
  ];

  const stats = [
    { label: 'Active Sellers', value: '10,000+', icon: UserGroupIcon },
    { label: 'Photos Processed', value: '2.5M+', icon: SparklesIcon },
    { label: 'Revenue Generated', value: '$50M+', icon: ChartBarIcon },
    { label: 'Success Rate', value: '94%', icon: TrophyIcon },
  ];

  const faqs = [
    {
      question: 'How does the 7-day free trial work?',
      answer: 'Start your trial today with full access to all Pro features. You won\'t be charged until after 7 days. Cancel anytime during the trial period with no fees.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes! You can cancel your subscription at any time through your account settings or billing portal. You\'ll retain access until the end of your current billing period.',
    },
    {
      question: 'What platforms do you support?',
      answer: 'We support Poshmark, Mercari, Depop, eBay, Facebook Marketplace, and Vinted. We\'re constantly adding new platforms based on user feedback.',
    },
    {
      question: 'How accurate is the AI?',
      answer: 'Our AI achieves 94% accuracy in product categorization and generates descriptions that typically increase listing views by 40-60%. It learns from millions of successful listings.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with Photo2Profit, contact our support team for a full refund.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We use enterprise-grade security with end-to-end encryption. Your photos and data are stored securely and never shared with third parties.',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-amber-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Turn Photos Into{' '}
              <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                Profit
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered listing generation that helps resellers create professional listings 10x faster.
              Join 10,000+ sellers who've boosted their sales with Photo2Profit.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-8 w-8 text-rose-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Start free, upgrade when you're ready to scale
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.entries(plans).map(([planKey, plan]) => (
            <div
              key={planKey}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.popular
                  ? 'border-rose-600 shadow-xl scale-105'
                  : 'border-gray-200 shadow-lg'
              } bg-white`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-rose-600 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="flex items-center justify-center mb-2">
                  {plan.originalPrice && (
                    <span className="text-2xl text-gray-400 line-through mr-2">
                      ${plan.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
                
                {plan.trialDays && (
                  <p className="text-sm text-rose-600 font-medium">
                    {plan.trialDays}-day free trial
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-rose-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation) => (
                  <div key={limitation} className="flex items-start opacity-60">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => planKey === 'free' ? null : handleUpgrade(planKey)}
                disabled={loading || (subscription?.plan === planKey)}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
                  plan.popular
                    ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white hover:shadow-lg'
                    : subscription?.plan === planKey
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {subscription?.plan === planKey ? 'Current Plan' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Current Subscription Status */}
        {user && subscription && (
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-600">Plan</div>
                  <div className="font-medium text-gray-900 capitalize">{subscription.plan}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <div className={`font-medium capitalize ${
                    subscription.status === 'active' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {subscription.status}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Usage This Month</div>
                  <div className="font-medium text-gray-900">
                    {subscription.usage?.uploads || 0} uploads
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Next Billing</div>
                  <div className="font-medium text-gray-900">
                    {subscription.nextBilling ? 
                      new Date(subscription.nextBilling).toLocaleDateString() : 
                      'N/A'
                    }
                  </div>
                </div>
              </div>

              {subscription.plan === 'pro' && (
                <button
                  onClick={handleBillingPortal}
                  className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Manage Billing
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Testimonials */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by Thousands of Sellers
            </h2>
            <p className="text-lg text-gray-600">
              See how Photo2Profit is transforming reselling businesses
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.title}</div>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <SparklesIcon key={i} className="h-5 w-5 text-amber-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                
                <div className="text-sm font-medium text-rose-600">
                  {testimonial.sales}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about Photo2Profit
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-rose-600 to-amber-600 py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to 10x Your Reselling Business?
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            Join thousands of successful sellers using AI to maximize their profits
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={loading}
              className="bg-white text-rose-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-rose-600 transition-all"
            >
              Try Free Version
            </button>
          </div>

          <p className="text-rose-100 text-sm mt-6">
            No credit card required for trial • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;