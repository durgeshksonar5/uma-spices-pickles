import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ShopByCategorySection } from '../components/home/ShopByCategorySection';
import { BestSellersSection } from '../components/home/BestSellersSection';
import { AdBannersSection } from '../components/home/AdBannersSection';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { WhatsAppCtaSection } from '../components/home/WhatsAppCtaSection';

export const Home = () => {
  return (
    <div className="space-y-0 bg-[#FFFBF5]">
      {/* 1. Hero Banner Section */}
      <HeroSection />

      {/* 2. Best Sellers Section */}
      <BestSellersSection />

      {/* 3. Explore Our Collections Section (Circular cutout 4-card grid) */}
      <ShopByCategorySection />

      {/* 4. Advertising Banners Section (4 Ad Images - 2 per line) */}
      <AdBannersSection />

      {/* 5. Customer Testimonials Section */}
      <CustomerReviewsSection />

      {/* 6. WhatsApp Ordering CTA Section */}
      <WhatsAppCtaSection />
    </div>
  );
};

export default Home;
