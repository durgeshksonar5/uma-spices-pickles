import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, User, PhoneCall } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';
import { MobileMenu } from './MobileMenu';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
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
    { name: 'Blends', path: '/shop?category=blends' },
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

            {/* Brand Logo */}
            <Link to="/" className="flex flex-col text-left group">
              <span className="font-serif font-bold text-2xl sm:text-3xl text-[#5E3718] tracking-wider leading-none group-hover:text-[#9A6428] transition-colors uppercase">
                {businessConfig.brandName}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#777166] font-semibold tracking-[0.25em] uppercase mt-0.5">
                {businessConfig.brandSubtext}
              </span>
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

            {/* Right Action Icons: Profile, Contact Us Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Profile Icon */}
              <button
                onClick={() => navigate('/about')}
                className="hidden sm:flex p-2 rounded-full text-[#171717] hover:text-[#9A6428] hover:bg-[#F9EFDD]/50 transition-colors"
                aria-label="User Account"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Contact Us Button */}
              <Link
                to="/contact"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#9A6428] hover:bg-[#80511D] text-white transition-all shadow-xs group active:scale-95 text-xs font-bold"
                aria-label="Contact Us"
              >
                <PhoneCall className="w-4 h-4 text-[#F9EFDD]" />
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
