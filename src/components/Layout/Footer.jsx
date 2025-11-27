import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaHeart,
  FaShieldAlt,
  FaFileContract,
  FaQuestionCircle,
  FaEnvelope,
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-rose-dark via-dark to-rose-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-rose rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P2P</span>
              </div>
              <span className="font-diamond text-xl bg-gradient-to-r from-blush via-rose to-gold bg-clip-text text-transparent">
                Photo2Profit
              </span>
            </div>
            <p className="text-blush/80 text-sm leading-relaxed">
              Transform your photos into profits with AI-powered optimization and automated eBay
              listings. Join thousands of sellers maximizing their resale potential.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/baddiehustleai-star/jubilant-happiness"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blush/60 hover:text-gold transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/photo2profit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blush/60 hover:text-gold transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/photo2profit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blush/60 hover:text-gold transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/pricing"
                  className="text-blush/80 hover:text-gold transition-colors text-sm"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-blush/80 hover:text-gold transition-colors text-sm"
                >
                  Features
                </a>
              </li>
              <li>
                <a href="#demo" className="text-blush/80 hover:text-gold transition-colors text-sm">
                  Try Demo
                </a>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-blush/80 hover:text-gold transition-colors text-sm"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <a
                  href="/api-docs"
                  className="text-blush/80 hover:text-gold transition-colors text-sm"
                >
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-blush/80 hover:text-gold transition-colors text-sm"
                >
                  About Us
                </a>
              </li>
              <li>
                <a href="/blog" className="text-blush/80 hover:text-gold transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="text-blush/80 hover:text-gold transition-colors text-sm"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/press"
                  className="text-blush/80 hover:text-gold transition-colors text-sm"
                >
                  Press Kit
                </a>
              </li>
              <li>
                <a
                  href="/partners"
                  className="text-blush/80 hover:text-gold transition-colors text-sm"
                >
                  Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@photo2profit.online"
                  className="text-blush/80 hover:text-gold transition-colors text-sm flex items-center"
                >
                  <FaEnvelope className="mr-2 text-xs" />
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="/help"
                  className="text-blush/80 hover:text-gold transition-colors text-sm flex items-center"
                >
                  <FaQuestionCircle className="mr-2 text-xs" />
                  Help Center
                </a>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-blush/80 hover:text-gold transition-colors text-sm flex items-center"
                >
                  <FaShieldAlt className="mr-2 text-xs" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-blush/80 hover:text-gold transition-colors text-sm flex items-center"
                >
                  <FaFileContract className="mr-2 text-xs" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="/status"
                  className="text-blush/80 hover:text-gold transition-colors text-sm"
                >
                  System Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blush/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-blush/60 text-sm">
              © {currentYear} Photo2Profit. All rights reserved.
            </div>

            <div className="flex items-center space-x-2 text-blush/60 text-sm">
              <span>Made with</span>
              <FaHeart className="text-rose w-4 h-4 animate-pulse" />
              <span>for sellers everywhere</span>
            </div>

            <div className="text-blush/60 text-sm">
              Powered by AI • Secured by Stripe • Hosted on Vercel
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
