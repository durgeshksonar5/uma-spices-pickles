import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { businessConfig } from '../config/businessConfig';
import { ShieldCheck, Leaf, Award, Sun, Users, Sparkles } from 'lucide-react';

export const About = () => {
  return (
    <div className="bg-[#FFFBF5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'About Us' }]} />

        {/* Hero Banner */}
        <div className="bg-[#F9EFDD]/50 rounded-2xl p-8 sm:p-12 border border-[#E8DDCF] mb-12 shadow-xs">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9A6428]/15 text-[#9A6428] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic Heritage</span>
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#5E3718] leading-tight">
              Preserving Authentic Flavours, One Jar at a Time
            </h1>

            <p className="text-base sm:text-lg text-[#777166] leading-relaxed font-sans">
              Welcome to <strong>{businessConfig.brandName}</strong>. We are an artisanal spice & pickle house dedicated to bringing authentic, preservative-free recipes back into everyday kitchens.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#5E3718] text-white p-8 rounded-2xl shadow-xs space-y-4 border border-[#9A6428]/30">
            <div className="w-10 h-10 rounded-xl bg-[#9A6428] text-white flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#F9EFDD]">Our Mission</h3>
            <p className="text-xs sm:text-sm text-[#F9EFDD]/90 leading-relaxed">
              To revive traditional Indian stone-ground masalas and sun-cured oil pickles by sourcing single-origin raw spices directly from partner farmers, maintaining 100% natural purity without chemical additives.
            </p>
          </div>

          <div className="bg-[#9A6428] text-white p-8 rounded-2xl shadow-xs space-y-4 border border-[#F9EFDD]/30">
            <div className="w-10 h-10 rounded-xl bg-white text-[#9A6428] flex items-center justify-center font-bold">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#FFFBF5]">Our Commitment</h3>
            <p className="text-xs sm:text-sm text-[#FFFBF5]/90 leading-relaxed">
              Zero compromises on ingredient quality. We use only cold-pressed kachi ghani mustard oil, rock salt, and whole dried fruits to ensure every pinch delivers unadulterated flavor and health benefits.
            </p>
          </div>
        </div>

        {/* Process */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-3xl font-bold text-[#5E3718]">
              How We Handcraft Our Products
            </h2>
            <p className="text-xs sm:text-sm text-[#777166] mt-1">
              From farm harvest to sun-aging and airtight hygienic sealing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#FFFBF5] p-6 rounded-xl border border-[#E8DDCF] space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#9A6428] text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="font-serif font-bold text-lg text-[#171717]">Farm Sourcing</h4>
              <p className="text-xs text-[#777166] leading-relaxed">
                Salem turmeric roots, Kashmiri chillies, and green mangoes handpicked at peak freshness.
              </p>
            </div>

            <div className="bg-[#FFFBF5] p-6 rounded-xl border border-[#E8DDCF] space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#9A6428] text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="font-serif font-bold text-lg text-[#171717]">Sun Curing</h4>
              <p className="text-xs text-[#777166] leading-relaxed">
                Pickles aged naturally for 30-40 days under natural sunlight in ceramic barnis.
              </p>
            </div>

            <div className="bg-[#FFFBF5] p-6 rounded-xl border border-[#E8DDCF] space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#9A6428] text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="font-serif font-bold text-lg text-[#171717]">Cool Milling</h4>
              <p className="text-xs text-[#777166] leading-relaxed">
                Low-temperature milling retains essential oils, vibrant natural colors, and aroma.
              </p>
            </div>

            <div className="bg-[#FFFBF5] p-6 rounded-xl border border-[#E8DDCF] space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#9A6428] text-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h4 className="font-serif font-bold text-lg text-[#171717]">Hygienic Seal</h4>
              <p className="text-xs text-[#777166] leading-relaxed">
                Sealed in food-grade airtight jars to preserve freshness during transit.
              </p>
            </div>
          </div>
        </div>

        {/* Why Families Trust Us */}
        <div className="bg-[#F9EFDD]/50 rounded-2xl p-8 sm:p-12 border border-[#E8DDCF] mb-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-3xl font-bold text-[#5E3718]">
              Why Families Trust Us
            </h2>
            <p className="text-xs sm:text-sm text-[#777166] mt-1">
              Built on transparency, natural ingredients, and personal customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#9A6428]/15 text-[#9A6428] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-[#171717]">100% Pure & Natural</h4>
                <p className="text-xs text-[#777166] mt-1 leading-relaxed">
                  No artificial colors, starch fillers, or synthetic chemical preservatives.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#9A6428]/15 text-[#9A6428] flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-[#171717]">Naturally Sun-Dried</h4>
                <p className="text-xs text-[#777166] mt-1 leading-relaxed">
                  Whole spices sun-dried to eliminate moisture while preserving essential nutrients.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#9A6428]/15 text-[#9A6428] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-[#171717]">Direct WhatsApp Support</h4>
                <p className="text-xs text-[#777166] mt-1 leading-relaxed">
                  Personal customer support and quick order confirmation via WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
