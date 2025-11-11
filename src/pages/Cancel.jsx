// src/pages/Cancel.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrandContainer,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandButton,
} from '../components/branding';

export default function Cancel() {
  const navigate = useNavigate();

  return (
    <BrandContainer>
      <BrandCard className="max-w-md mx-auto mt-20 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <BrandHeading className="mb-4">Payment Cancelled</BrandHeading>

        <BrandText className="mb-6">
          Your payment was cancelled. No charges were made to your account.
        </BrandText>

        <div className="space-y-3">
          <BrandButton onClick={() => navigate(-1)} className="w-full">
            Try Again
          </BrandButton>
          <BrandButton onClick={() => navigate('/')} variant="secondary" className="w-full">
            Back to Home
          </BrandButton>
        </div>
      </BrandCard>
    </BrandContainer>
  );
}
