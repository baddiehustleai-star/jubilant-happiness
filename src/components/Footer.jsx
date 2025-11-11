import React from 'react';
import { FaInstagram, FaTiktok, FaFacebookF } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative bg-softwhite border-t border-rosegold/40 text-center py-10">
      {/* Soft blush background shimmer */}
      <div className="absolute inset-0 bg-luxe-gradient opacity-10 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <h3 className="text-xl md:text-2xl font-diamond bg-gradient-to-r from-rosegold to-rosegold-light bg-clip-text text-transparent">
          Manifested by Baddie AI Hustle ✨
        </h3>

        <p className="text-rosegold-dark text-sm max-w-md">
          Empowering creators, resellers, and digital hustlers to turn photos into paydays.
        </p>

        <div className="flex gap-6 mt-4">
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="text-rosegold hover:text-rosegold-light transition"
          >
            <FaInstagram size={22} />
          </a>
          <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noreferrer"
            className="text-rosegold hover:text-rosegold-light transition"
          >
            <FaTiktok size={22} />
          </a>
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noreferrer"
            className="text-rosegold hover:text-rosegold-light transition"
          >
            <FaFacebookF size={22} />
          </a>
        </div>

        <div className="mt-6 text-xs text-rosegold-dark/80">
          © {new Date().getFullYear()} Photo2Profit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
