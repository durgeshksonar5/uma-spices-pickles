import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-[#FFFBF5] p-6 rounded-2xl border border-[#E8DDCF] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex text-[#E9A900]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating ? 'fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <Quote className="w-6 h-6 text-[#9A6428]/25" />
        </div>

        <p className="text-xs sm:text-sm text-[#171717] leading-relaxed italic">
          "{testimonial.review}"
        </p>
      </div>

      <div className="pt-3 border-t border-[#E8DDCF] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#9A6428] text-white font-serif font-bold text-base flex items-center justify-center border border-[#F9EFDD] shrink-0">
          {testimonial.initials}
        </div>
        <div>
          <h4 className="font-sans font-bold text-sm text-[#5E3718]">
            {testimonial.name}
          </h4>
          <span className="text-[11px] text-[#25D366] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 fill-current" />
            <span>Verified Customer ({testimonial.location})</span>
          </span>
        </div>
      </div>
    </div>
  );
};
