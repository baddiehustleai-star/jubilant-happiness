import React from "react";
import { useNavigate } from 'react-router-dom';
import { FaCameraRetro, FaDollarSign } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export default function Hero() {
  const navigate = useNavigate();
  
  return (
    <section className="hero-gradient flex flex-col items-center justify-center min-h-screen text-center relative safe-area-top">
      {/* Background shimmer overlay */}
      <div className="absolute inset-0 bg-diamond-glow opacity-50"></div>

      <div className="relative z-10 p-6 max-w-3xl mobile-section-padding">
        <div className="flex justify-center mb-6">
          <div className="relative p-4 bg-softwhite rounded-full shadow-soft-glow">
            <FaCameraRetro className="text-rosegold text-6xl" />
            <div className="absolute -top-2 -right-2 p-2 bg-money rounded-full">
              <FaDollarSign className="text-white text-2xl" />
            </div>
            <div className="absolute -bottom-1 -left-1">
              <HiSparkles className="text-diamond text-xl animate-pulse" />
            </div>
          </div>
        </div>

        <h1
          className="text-6xl md:text-7xl mobile-hero-title font-diamond tracking-wide mb-4
                     bg-gradient-to-r from-[#E9CBA7] via-[#B76E79] to-[#E9CBA7]
                     bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(183,110,121,0.35)]">
          PHOTO2PROFIT
        </h1>

        <h2
          className="text-2xl md:text-3xl mobile-hero-subtitle font-diamond tracking-normal mb-6
                     bg-gradient-to-r from-[#B76E79] to-[#E9CBA7]
                     bg-clip-text text-transparent italic">
          Photo2Payday Baddie Mode 💎
        </h2>

        <p className="text-lg text-rosegold-dark font-sans mb-8 animate-slide-up">
          Turn your photos into paydays with AI-powered resale magic.  
          <br />
          Manifest your hustle. Multiply your profit. ✨
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          <button 
            className="mobile-btn haptic-heavy bg-gradient-to-r from-rosegold to-rosegold-light text-white shadow-soft-glow hover:scale-105 transform transition-all"
            onClick={() => navigate('/login')}
          >
            Start Now 💎
          </button>
          <button 
            className="mobile-btn haptic-medium bg-blush text-rosegold hover:bg-rosegold hover:text-softwhite border-2 border-rosegold"
            onClick={() => navigate('/dashboard-test')}
          >
            Learn More ✨
          </button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in">
          <div className="p-4 bg-softwhite/80 backdrop-blur-sm rounded-2xl shadow-inner-glow">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-diamond text-rosegold font-semibold">AI Magic</h3>
            <p className="text-sm text-rosegold-dark">Smart listings that sell</p>
          </div>
          <div className="p-4 bg-softwhite/80 backdrop-blur-sm rounded-2xl shadow-inner-glow">
            <div className="text-2xl mb-2">📸</div>
            <h3 className="font-diamond text-rosegold font-semibold">Photo Upload</h3>
            <p className="text-sm text-rosegold-dark">Drag, drop, profit</p>
          </div>
          <div className="p-4 bg-softwhite/80 backdrop-blur-sm rounded-2xl shadow-inner-glow">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-diamond text-rosegold font-semibold">Multi-Platform</h3>
            <p className="text-sm text-rosegold-dark">Cross-post everywhere</p>
          </div>
        </div>
      </div>

      {/* Subtle shimmer line */}
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-blush to-rosegold animate-shimmer"></div>
      
      {/* Floating sparkles */}
      <div className="absolute top-20 left-10 animate-pulse">
        <HiSparkles className="text-diamond text-2xl opacity-70" />
      </div>
      <div className="absolute top-40 right-20 animate-pulse delay-500">
        <HiSparkles className="text-rosegold-light text-xl opacity-60" />
      </div>
      <div className="absolute bottom-40 left-20 animate-pulse delay-1000">
        <HiSparkles className="text-blush text-lg opacity-80" />
      </div>
    </section>
  );
}