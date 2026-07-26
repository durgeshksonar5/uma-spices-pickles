import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, ChevronRight, MessageCircle } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';

export const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Spices', path: '/shop?category=spices' },
    { name: 'Pickles', path: '/shop?category=pickles' },
    { name: 'Blends', path: '/shop?category=blends' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#FFFBF5] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
        <div>
          {/* Header */}
          <div className="p-5 flex items-center justify-between border-b border-[#E8DDCF]">
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl text-[#5E3718] leading-none uppercase tracking-wider">
                {businessConfig.brandName}
              </span>
              <span className="text-[9px] text-[#777166] font-semibold tracking-[0.2em] uppercase mt-0.5">
                {businessConfig.brandSubtext}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#171717] hover:text-[#5E3718] rounded-lg bg-[#F9EFDD] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-5 py-3 rounded-xl font-medium text-sm transition-colors ${
                    isActive
                      ? 'bg-[#9A6428] text-white shadow-xs font-semibold'
                      : 'text-[#171717] bg-white border border-[#E8DDCF] hover:bg-[#F9EFDD]/50'
                  }`
                }
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer WhatsApp Button */}
        <div className="p-5 border-t border-[#E8DDCF] bg-[#FFFBF5]">
          <a
            href={businessConfig.socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-[#25D366] text-white font-bold text-sm shadow-sm hover:bg-[#20ba5a] transition-colors"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
