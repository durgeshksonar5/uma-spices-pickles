import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { ShoppingBag, CheckSquare, MessageCircle } from 'lucide-react';

export const HowToOrderSection = () => {
  const steps = [
    {
      number: "1",
      icon: ShoppingBag,
      title: "Choose Products",
      description: "Browse categories and select your favourite products.",
      color: "bg-[#7A1F1F]",
      textColor: "text-[#E6A817]"
    },
    {
      number: "2",
      icon: CheckSquare,
      title: "Add to Cart",
      description: "Select the size and quantity you need.",
      color: "bg-[#D95D16]",
      textColor: "text-white"
    },
    {
      number: "3",
      icon: MessageCircle,
      title: "Order on WhatsApp",
      description: "Send your order and confirm delivery details.",
      color: "bg-[#25D366]",
      textColor: "text-white"
    }
  ];

  return (
    <section className="py-16 bg-[#FFFBF5] border-b border-[#E8D9C5]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="3 Easy Steps"
          title="Ordering Is Simple"
          subtitle="Place your order in less than a minute directly through WhatsApp."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFF8ED] p-6 rounded-3xl border border-[#E8D9C5] text-center space-y-4 shadow-sm relative group hover:shadow-md transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${step.color} ${step.textColor} flex items-center justify-center mx-auto shadow-md transform group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 fill-current" />
                </div>

                <div className="w-8 h-8 rounded-full bg-[#E6A817]/20 text-[#7A1F1F] font-bold text-sm flex items-center justify-center mx-auto">
                  Step {step.number}
                </div>

                <h3 className="font-serif font-bold text-xl text-[#7A1F1F]">
                  {step.title}
                </h3>

                <p className="text-sm text-[#3B2618]/80 leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
