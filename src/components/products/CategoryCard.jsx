import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="group relative bg-[#FFFBF5] rounded-2xl overflow-hidden border border-[#E8D9C5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Category Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#EEDEC8]/40">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-serif text-xl font-bold text-white tracking-wide group-hover:text-[#E6A817] transition-colors">
            {category.name}
          </h3>
        </div>
      </div>

      {/* View Products Small Button Footer */}
      <div className="p-3.5 bg-[#FFFBF5] border-t border-[#E8D9C5] flex items-center justify-between text-xs font-bold text-[#7A1F1F] group-hover:text-[#D95D16] transition-colors mt-auto">
        <span>View Products</span>
        <div className="w-7 h-7 rounded-full bg-[#FFF8ED] flex items-center justify-center border border-[#E8D9C5] group-hover:bg-[#7A1F1F] group-hover:text-white transition-all">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
};
