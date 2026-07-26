import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gift, ArrowRight, MessageCircle } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';

export const PromotionalBanner = () => {
  return (
    <section className="py-12 bg-[#FFF8ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#7A1F1F] via-[#932929] to-[#D95D16] p-8 sm:p-12 text-white shadow-2xl border-2 border-[#E6A817]/30">
          {/* Subtle background graphics */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6A817] text-[#7A1F1F] text-xs font-bold uppercase tracking-wider">
                <Gift className="w-4 h-4" />
                <span>Festival & Bulk Special Offer</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Build Your Custom Flavour Box
              </h2>

              <p className="text-sm sm:text-base text-amber-100 max-w-2xl font-sans leading-relaxed">
                Choose your favourite whole spices, ground masalas, and handmade pickles to curate your own custom combo box. Get up to <strong className="text-[#E6A817]">20% OFF</strong> + special gift box on direct WhatsApp orders!
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-3">
              <Link
                to="/shop?category=combo-packs"
                className="w-full py-4 px-6 rounded-xl bg-[#E6A817] hover:bg-amber-400 text-[#7A1F1F] font-bold text-base flex items-center justify-center gap-2 shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                <span>Shop Combo Packs</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Link>

              <a
                href={businessConfig.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Custom Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
