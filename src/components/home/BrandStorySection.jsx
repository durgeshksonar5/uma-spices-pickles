import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Award, HeartHandshake, Leaf, CheckCircle2 } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';

export const BrandStorySection = () => {
  return (
    <section className="py-16 bg-[#FFFBF5] border-b border-[#E8D9C5]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image Grid Collage */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=500"
                alt="Sun Cured Mango Pickle"
                className="rounded-2xl shadow-lg h-44 sm:h-52 w-full object-cover border-2 border-[#FFF8ED]"
              />
              <img
                src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=500"
                alt="Golden Salem Turmeric Powder"
                className="rounded-2xl shadow-lg h-44 sm:h-52 w-full object-cover border-2 border-[#FFF8ED] mt-6"
              />
            </div>
            
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-[#7A1F1F] text-white px-6 py-3 rounded-full shadow-2xl border-2 border-[#E6A817]/40 text-center whitespace-nowrap">
              <span className="font-serif font-bold text-sm text-[#E6A817]">Since 1984</span>
              <span className="text-xs font-medium block text-amber-100">Preserving Pure Taste</span>
            </div>
          </div>

          {/* Right Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#506B2F]/15 text-[#506B2F] text-xs font-semibold uppercase tracking-wider">
              <Leaf className="w-4 h-4" />
              <span>Our Heritage & Process</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#7A1F1F] leading-tight">
              Crafted With Patience, Sun-cured With Care
            </h2>

            <p className="text-sm sm:text-base text-[#3B2618]/80 leading-relaxed">
              At <strong>{businessConfig.brandName}</strong>, we believe great food begins with respect for ingredients. We source single-origin spices directly from smallholder Indian farmers and cure our pickles naturally in traditional ceramic barnis under the warm sun.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#506B2F] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#3B2618]">
                  <strong>Cold-Ground Spices:</strong> Milled at controlled low temperatures so vital essential oils never evaporate.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#506B2F] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#3B2618]">
                  <strong>Kachi Ghani Oils:</strong> Pickles cured only in 100% pure cold-pressed mustard & sesame oils.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#506B2F] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#3B2618]">
                  <strong>Zero Preservatives:</strong> Free from artificial colors, MSG, sodium benzoate, or chemical acidifiers.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <RouterLink
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#7A1F1F] hover:text-[#D95D16] transition-colors border-b-2 border-[#7A1F1F] pb-1"
              >
                <span>Read Full Brand Story</span>
                <span>→</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
