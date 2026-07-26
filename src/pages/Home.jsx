import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ShopByCategorySection } from '../components/home/ShopByCategorySection';
import { BestSellersSection } from '../components/home/BestSellersSection';
import { ChefsBundleSection } from '../components/home/ChefsBundleSection';
import { LimitedOfferSection } from '../components/home/LimitedOfferSection';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { WhatsAppCtaSection } from '../components/home/WhatsAppCtaSection';

export const Home = () => {
  return (
    <div className="space-y-0 bg-[#FFFBF5]">
      {/* 1. Hero Banner Slider Section */}
      <HeroSection />

      {/* 2. Best Sellers Section */}
      <BestSellersSection />

      {/* 3. Explore Our Collections Section (Circular cutout 4-card grid) */}
      <ShopByCategorySection />

      {/* 4. Promotional Combined Section: Chef's Signature Bundle & Limited-Time Offer */}
      <section className="py-16 bg-[#FFFBF5] border-b border-[#E8DDCF]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Chef's Signature Bundle */}
          <ChefsBundleSection />

          {/* Limited Time Offer */}
          <LimitedOfferSection />
        </div>
      </section>

      {/* 5. Customer Testimonials Section */}
      <CustomerReviewsSection />

      {/* 6. WhatsApp Ordering CTA Section */}
      <WhatsAppCtaSection />
    </div>
  );
};

export default Home;
