import React from 'react';

export const SectionHeading = ({
  badge,
  title,
  subtitle,
  centered = true,
  className = ""
}) => {
  return (
    <div className={`mb-10 ${centered ? 'text-center max-w-2xl mx-auto' : 'max-w-xl'} ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#E6A817]/15 text-[#7A1F1F] border border-[#E6A817]/30 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D95D16]"></span>
          {badge}
        </span>
      )}
      <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7A1F1F] tracking-tight leading-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-[#3B2618]/80 leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
      <div className={`w-16 h-0.5 bg-gradient-to-r from-[#D95D16] to-[#E6A817] rounded-full mt-4 ${centered ? 'mx-auto' : ''}`} />
    </div>
  );
};
