import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '../common/SocialIcons';
import { businessConfig } from '../../config/businessConfig';
import { MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#FFFBF5] border-t border-[#E8DDCF] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 5-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#E8DDCF]">
          {/* Column 1: Brand Info & Social Links */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex flex-col text-left group">
              <span className="font-serif font-bold text-2xl text-[#5E3718] tracking-wider leading-none uppercase">
                {businessConfig.brandName}
              </span>
              <span className="text-[9px] text-[#777166] font-semibold tracking-[0.2em] uppercase mt-0.5">
                {businessConfig.brandSubtext}
              </span>
            </Link>

            <p className="text-xs text-[#777166] leading-relaxed">
              Bringing authentic flavors to your table with premium spices and homemade pickles crafted with care.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-1">
              <a
                href={businessConfig.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#F9EFDD] text-[#5E3718] hover:bg-[#9A6428] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={businessConfig.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#F9EFDD] text-[#5E3718] hover:bg-[#9A6428] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={businessConfig.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#F9EFDD] text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-sm text-[#171717]">Shop</h4>
            <ul className="space-y-2 text-xs text-[#777166]">
              <li>
                <Link to="/shop" className="hover:text-[#9A6428] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?category=spices" className="hover:text-[#9A6428] transition-colors">
                  Spices
                </Link>
              </li>
              <li>
                <Link to="/shop?category=pickles" className="hover:text-[#9A6428] transition-colors">
                  Pickles
                </Link>
              </li>
              <li>
                <Link to="/shop?category=blends" className="hover:text-[#9A6428] transition-colors">
                  Blends
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-sm text-[#171717]">Customer Care</h4>
            <ul className="space-y-2 text-xs text-[#777166]">
              <li>
                <Link to="/about" className="hover:text-[#9A6428] transition-colors">
                  Shipping and Delivery
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#9A6428] transition-colors">
                  Returns and Refunds
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#9A6428] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#9A6428] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: About */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-sm text-[#171717]">About Us</h4>
            <ul className="space-y-2 text-xs text-[#777166]">
              <li>
                <Link to="/about" className="hover:text-[#9A6428] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#9A6428] transition-colors">
                  Quality Promise
                </Link>
              </li>
              <li>
                <Link to="/about#recipes" className="hover:text-[#9A6428] transition-colors">
                  Recipes and Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: User Google Maps Iframe */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-sm text-[#171717] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#9A6428]" />
              <span>Our Location</span>
            </h4>

            {/* Map Frame */}
            <div className="w-full h-32 rounded-xl overflow-hidden border border-[#E8DDCF] shadow-2xs bg-white">
              <iframe
                title="Gajanan Pure & Homemade Services Location Map"
                src={businessConfig.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <p className="text-[11px] text-[#777166] leading-tight">
              Narayan Nagar, Latur, Maharashtra
            </p>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777166]">
          <p>© {new Date().getFullYear()} {businessConfig.fullName}. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-[#9A6428] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-[#9A6428] transition-colors">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
