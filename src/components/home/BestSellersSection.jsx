import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { products } from '../../data/products';
import { ProductCard } from '../products/ProductCard';

export const BestSellersSection = () => {
  // Select top 4 bestsellers for a relaxed, spacious 4-in-a-row grid
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <section className="py-16 bg-[#FFFBF5] border-b border-[#E8DDCF]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-left">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E3718]">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-[#9A6428] hover:text-[#5E3718] flex items-center gap-1.5 transition-colors group"
          >
            <span>View all products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid: Exactly 4 relaxed boxes in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
