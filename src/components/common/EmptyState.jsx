import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, SearchX, ArrowRight } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = ShoppingBag,
  title = "Your cart is empty",
  description = "Explore our authentic range of ground spices, whole masalas, and traditional pickles.",
  actionText = "Explore Catalogue",
  actionLink = "/shop",
  onActionClick
}) => {
  return (
    <div className="text-center py-12 px-4 max-w-md mx-auto">
      <div className="w-20 h-20 bg-[#FFF8ED] rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-dashed border-[#D95D16]/30 text-[#D95D16]">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#7A1F1F] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#3B2618]/70 mb-6 leading-relaxed">
        {description}
      </p>
      {onActionClick ? (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7A1F1F] text-white font-medium hover:bg-[#932929] transition-colors shadow-md"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7A1F1F] text-white font-medium hover:bg-[#932929] transition-colors shadow-md"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};
