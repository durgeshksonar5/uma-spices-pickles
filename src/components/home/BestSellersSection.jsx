import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { ProductCard } from '../products/ProductCard';

export const BestSellersSection = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBestSellers = async () => {
      setIsLoading(true);
      try {
        const res = await productApi.getProducts({ status: 'published', limit: 12 });
        if (res?.success && Array.isArray(res.data)) {
          // Select products tagged as best seller or top items
          const filtered = res.data.filter((p) => p.bestSeller || p.isFeatured).slice(0, 4);
          setBestSellers(filtered.length > 0 ? filtered : res.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load best seller products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBestSellers();
  }, []);

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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-[#F9EFDD]/40 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
