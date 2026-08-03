import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, PhoneCall } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';
import { MobileMenu } from './MobileMenu';
import logoEnglish from '../../assets/gajanan-food-logo-english.png';
import logoMarathi from '../../assets/gajanan-food-logo-marathi.png';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Spices', path: '/shop?category=spices' },
    { name: 'Pickles', path: '/shop?category=pickles' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  // Precise Active Page Checking including Query Parameters
  const checkIsActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path.includes('?')) {
      const [base, query] = path.split('?');
      return location.pathname === base && location.search === `?${query}`;
    }
    if (path === '/shop') {
      return location.pathname === '/shop' && (!location.search || !location.search.includes('category='));
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFFBF5]/95 backdrop-blur-md shadow-sm border-b border-[#E8DDCF]'
            : 'bg-[#FFFBF5] border-b border-[#E8DDCF]/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg text-[#171717] hover:text-[#9A6428] hover:bg-[#F9EFDD]/60 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logos (English & Marathi) */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group py-1 shrink-0 ml-auto sm:ml-0">
              <img
                src={logoEnglish}
                alt="Gajanan Pure & Homemade Services Logo"
                className="h-12 sm:h-15 w-auto object-contain transition-transform group-hover:scale-102"
              />
              <div className="h-7 sm:h-9 w-[1px] bg-[#E8DDCF]" />
              <img
                src={logoMarathi}
                alt="गजानन फुड्स मराठी लोगो"
                className="h-12 sm:h-15 w-auto object-contain transition-transform group-hover:scale-102"
              />
            </Link>

            {/* Center Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => {
                const isActive = checkIsActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? 'text-[#5E3718] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#9A6428] after:rounded-full'
                        : 'text-[#171717]/85 hover:text-[#9A6428]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons: Contact Us Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Contact Us Button */}
              <Link
                to="/contact"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#9A6428] hover:bg-[#80511D] text-white transition-all shadow-xs group active:scale-95 text-sm font-bold"
                aria-label="Contact Us"
              >
                <PhoneCall className="w-5 h-5 text-[#F9EFDD]" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};
