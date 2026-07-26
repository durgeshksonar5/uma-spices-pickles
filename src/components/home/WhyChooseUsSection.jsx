import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Flame, ShieldCheck, PackageCheck, MessageCircle } from 'lucide-react';

export const WhyChooseUsSection = () => {
  const benefits = [
    {
      icon: Flame,
      title: "Authentic Family Recipes",
      description: "Passed down over three generations. Sun-cured in traditional earthen jars with no artificial colors.",
      color: "bg-[#7A1F1F]",
      textColor: "text-[#E6A817]"
    },
    {
      icon: ShieldCheck,
      title: "100% Pure Sourced Ingredients",
      description: "Single-origin spices sourced directly from Salem, Kashmir, Malabar coast & Unjha farm partners.",
      color: "bg-[#D95D16]",
      textColor: "text-white"
    },
    {
      icon: PackageCheck,
      title: "Hygienic Sealed Packaging",
      description: "Leak-proof food grade containers with tamper-evident inner foil seal to lock in peak aroma.",
      color: "bg-[#506B2F]",
      textColor: "text-[#E6A817]"
    },
    {
      icon: MessageCircle,
      title: "Fast WhatsApp Ordering",
      description: "No tedious payment forms. Confirm availability and delivery options directly with our team on WhatsApp.",
      color: "bg-[#25D366]",
      textColor: "text-white"
    }
  ];

  return (
    <section className="py-16 bg-[#FFF8ED] border-b border-[#E8D9C5]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Our Guarantee"
          title="Why Kitchens Across India Trust Us"
          subtitle="We bring traditional grandmother's recipes back to your modern dining table with zero compromise on quality."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFFBF5] p-6 rounded-2xl border border-[#E8D9C5] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-start space-y-4"
              >
                <div className={`w-12 h-12 rounded-xl ${benefit.color} ${benefit.textColor} flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 fill-current" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#7A1F1F]">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#3B2618]/75 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
