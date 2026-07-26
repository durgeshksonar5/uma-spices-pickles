import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-[#FFFBF5] rounded-2xl p-4 border border-[#E8D9C5] animate-pulse flex flex-col justify-between">
      <div className="w-full h-48 bg-[#EEDEC8]/60 rounded-xl mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-[#EEDEC8]/60 rounded w-1/3" />
        <div className="h-5 bg-[#EEDEC8]/80 rounded w-3/4" />
        <div className="h-3 bg-[#EEDEC8]/40 rounded w-1/2" />
      </div>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#E8D9C5]/50">
        <div className="h-6 bg-[#EEDEC8] rounded w-20" />
        <div className="h-9 bg-[#EEDEC8] rounded-xl w-24" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
