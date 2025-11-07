import React from "react";
import { FaInstagram, FaTiktok, FaFacebookF } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export default function LuxeFooter() {
  return (
    <footer className="relative bg-rosegold text-softwhite overflow-hidden">
      {/* Shimmer background */}
      <div className="absolute inset-0 bg-gradient-to-r from-rosegold via-rosegold-light to-rosegold opacity-80"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="text-center">
          <h3 className="text-2xl font-diamond mb-4 text-softwhite">
            Manifested by Baddie AI Hustle ✨
          </h3>
          
          <p className="text-lg mb-6 text-blush-light">
            Where photos become profit and dreams become reality 💎
          </p>
          
          {/* Social links */}
          <div className="flex justify-center space-x-6 mb-8">
            <a 
              href="#" 
              className="p-3 bg-softwhite/20 backdrop-blur-sm rounded-full hover:bg-softwhite/30 transition-all hover:scale-110"
              aria-label="Instagram"
            >
              <FaInstagram className="text-2xl text-softwhite" />
            </a>
            <a 
              href="#" 
              className="p-3 bg-softwhite/20 backdrop-blur-sm rounded-full hover:bg-softwhite/30 transition-all hover:scale-110"
              aria-label="Twitter"
            >
              <FaTwitter className="text-2xl text-softwhite" />
            </a>
            <a 
              href="#" 
              className="p-3 bg-softwhite/20 backdrop-blur-sm rounded-full hover:bg-softwhite/30 transition-all hover:scale-110"
              aria-label="TikTok"
            >
              <FaTiktok className="text-2xl text-softwhite" />
            </a>
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-sm">
            <div>
              <h4 className="font-diamond font-semibold mb-3 text-softwhite">Product</h4>
              <ul className="space-y-2 text-blush-light">
                <li><a href="#" className="hover:text-softwhite transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-softwhite transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-softwhite transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-diamond font-semibold mb-3 text-softwhite">Support</h4>
              <ul className="space-y-2 text-blush-light">
                <li><a href="#" className="hover:text-softwhite transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-softwhite transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-softwhite transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-diamond font-semibold mb-3 text-softwhite">Legal</h4>
              <ul className="space-y-2 text-blush-light">
                <li><a href="#" className="hover:text-softwhite transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-softwhite transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-softwhite transition-colors">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-diamond font-semibold mb-3 text-softwhite">Company</h4>
              <ul className="space-y-2 text-blush-light">
                <li><a href="#" className="hover:text-softwhite transition-colors">About</a></li>
                <li><a href="#" className="hover:text-softwhite transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-softwhite transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-softwhite/20 pt-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blush-light text-sm mb-4 md:mb-0">
              © 2025 Photo2Profit. All rights reserved. Made with 💎 by Baddie AI Hustle
            </p>
            <div className="flex items-center space-x-2">
              <HiSparkles className="text-diamond text-lg animate-pulse" />
              <span className="text-sm font-diamond text-softwhite">Luxury Mode Activated</span>
              <HiSparkles className="text-diamond text-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating sparkles */}
      <div className="absolute top-10 left-10 animate-pulse">
        <HiSparkles className="text-diamond text-xl opacity-50" />
      </div>
      <div className="absolute top-20 right-20 animate-pulse delay-700">
        <HiSparkles className="text-blush-light text-lg opacity-60" />
      </div>
      <div className="absolute bottom-20 left-1/4 animate-pulse delay-300">
        <HiSparkles className="text-softwhite text-sm opacity-40" />
      </div>
      <div className="absolute bottom-10 right-1/3 animate-pulse delay-1000">
        <HiSparkles className="text-diamond text-lg opacity-50" />
      </div>
    </footer>
  );
}