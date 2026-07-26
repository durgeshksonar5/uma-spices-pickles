import React from 'react';
import { Filter, RotateCcw, X, Search } from 'lucide-react';
import { categories } from '../../data/categories';

export const ProductFilters = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockChange,
  sortBy,
  onSortChange,
  onResetFilters,
  totalProductsCount,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) => {
  const content = (
    <div className="space-y-6">
      {/* Header for Filter box */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DDCF]">
        <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#5E3718]">
          <Filter className="w-5 h-5 text-[#9A6428]" />
          <span>Filter Products</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-[#9A6428] hover:text-[#5E3718] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
          Search Catalogue
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-[#777166] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search spice, pickle, masala..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E8DDCF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9A6428] text-[#171717]"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
          Categories
        </label>
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-[#9A6428] text-white font-bold'
                : 'bg-white text-[#171717] hover:bg-[#F9EFDD]/50 border border-[#E8DDCF]'
            }`}
          >
            <span>All Categories</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-[#9A6428] text-white font-bold'
                  : 'bg-white text-[#171717] hover:bg-[#F9EFDD]/50 border border-[#E8DDCF]'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2 pt-2 border-t border-[#E8DDCF]">
        <div className="flex items-center justify-between text-xs font-bold text-[#171717]">
          <span className="uppercase tracking-wider">Max Price</span>
          <span className="text-[#9A6428]">Up to ₹{priceRange}</span>
        </div>
        <input
          type="range"
          min="100"
          max="3000"
          step="50"
          value={priceRange}
          onChange={(e) => onPriceRangeChange(Number(e.target.value))}
          className="w-full accent-[#9A6428] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#777166]">
          <span>₹100</span>
          <span>₹1500</span>
          <span>₹3000</span>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="pt-2 border-t border-[#E8DDCF]">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#171717]">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded text-[#9A6428] focus:ring-[#9A6428] accent-[#9A6428]"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );

  if (isMobileDrawer) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          onClick={onCloseMobileDrawer}
        />
        <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#FFFBF5] p-6 shadow-2xl overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E8DDCF]">
            <span className="font-serif font-bold text-lg text-[#5E3718]">Filters</span>
            <button onClick={onCloseMobileDrawer} className="p-1 text-[#171717] hover:text-[#5E3718]">
              <X className="w-5 h-5" />
            </button>
          </div>
          {content}
          <div className="mt-8 pt-4 border-t border-[#E8DDCF]">
            <button
              onClick={onCloseMobileDrawer}
              className="w-full py-3 rounded-lg bg-[#9A6428] text-white font-semibold text-sm shadow-xs"
            >
              Show {totalProductsCount} Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFBF5] rounded-2xl border border-[#E8DDCF] p-5 shadow-xs sticky top-24">
      {content}
    </div>
  );
};
