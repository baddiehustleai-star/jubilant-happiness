// src/pages/Success.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrandContainer,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandButton,
} from '../components/branding';

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: track conversion in analytics
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId) {
      console.log('✅ Payment successful:', sessionId);
    }
  }, []);

  return (
    <BrandContainer>
      <BrandCard className="max-w-md mx-auto mt-20 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <BrandHeading className="mb-4">Payment Successful!</BrandHeading>

        <BrandText className="mb-6">
          Thank you for your purchase. You'll receive a confirmation email shortly.
        </BrandText>

        <div className="space-y-3">
          <BrandButton onClick={() => navigate('/dashboard')} className="w-full">
            Go to Dashboard
          </BrandButton>
          <BrandButton onClick={() => navigate('/')} variant="secondary" className="w-full">
            Back to Home
          </BrandButton>
        </div>
      </BrandCard>
    </BrandContainer>
  );
}
