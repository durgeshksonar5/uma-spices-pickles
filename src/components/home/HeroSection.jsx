import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Award, Utensils, Sparkles } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[95vh] min-h-[660px] max-h-[920px] overflow-hidden bg-[#5E3718] border-b border-[#E8DDCF]/80">
      {/* Single Background Banner Image spanning full screen width */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1920"
          alt="Gajanan Pure & Homemade Services Fresh Spices and Pickles"
          className="w-full h-full object-cover"
        />
        {/* Dark Gradient Overlay for high-contrast text */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
      </div>

      {/* Content Floating Over Full Width Banner */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6 text-left text-white">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6A817]/90 text-[#171717] text-xs font-extrabold uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Pure & Handcrafted</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#FFFBF5] tracking-tight leading-[1.15] drop-shadow-md">
            Discover the Essence of Fresh Spices & Pickles
          </h1>

          {/* Supporting Subtitle */}
          <p className="text-base sm:text-lg text-[#F9EFDD]/90 leading-relaxed font-sans max-w-xl">
            Handpicked ingredients, traditional recipes and authentic flavours crafted to make every meal memorable.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/shop"
              className="px-8 py-4 rounded-xl bg-[#9A6428] text-white font-bold text-sm sm:text-base hover:bg-[#80511D] transition-all shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Shop Spices & Pickles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/shop"
              className="px-6 py-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Collections</span>
            </Link>
          </div>

          {/* Trust Badges Bar */}
          <div className="pt-8 border-t border-white/20 flex flex-wrap items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#E6A817]" />
              <span className="text-xs font-semibold">100% Natural • No Preservatives</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#E6A817]" />
              <span className="text-xs font-semibold">Premium Quality Farm Direct</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#E6A817]" />
              <span className="text-xs font-semibold">Traditional Family Recipe</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
