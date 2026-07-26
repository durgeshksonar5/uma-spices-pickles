import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/products/ProductCard';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';

export const Wishlist = () => {
  const { wishlist, clearWishlist } = useCart();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-[#FFFBF5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Breadcrumb items={[{ label: 'My Wishlist' }]} />

        {/* Page Header */}
        <div className="bg-[#F9EFDD]/50 rounded-2xl p-6 sm:p-8 border border-[#E8DDCF] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <Heart className="w-6 h-6 text-[#9A6428] fill-current" />
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E3718]">
                My Saved Wishlist
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#777166]">
              Your handpicked favorite spices, blends, and pickles saved for quick access.
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Wishlist</span>
            </button>
          )}
        </div>

        {/* Wishlist Grid / Empty State */}
        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8DDCF] p-12 text-center space-y-4 max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-[#F9EFDD] text-[#9A6428] flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#5E3718]">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#777166] leading-relaxed">
              Explore our fresh spices, traditional pickles, and authentic blends to add items to your wishlist.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#9A6428] hover:bg-[#80511D] text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
