import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/products/ProductCard';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { Sparkles, ArrowUpDown } from 'lucide-react';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'best-selling') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [selectedCategory, sortBy]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const categoryTitle = activeCategoryObj ? activeCategoryObj.name : 'All Spices, Pickles & Blends';

  return (
    <div className="bg-[#FFFBF5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Breadcrumb items={[{ label: 'Shop Catalogue' }]} />

        {/* Page Title & Category Header */}
        <div className="bg-[#F9EFDD]/50 rounded-2xl p-6 sm:p-8 border border-[#E8DDCF] shadow-xs text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E3718]">
              {categoryTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#777166] mt-1 max-w-xl">
              {activeCategoryObj
                ? activeCategoryObj.description
                : 'Browse our simple & authentic catalog categorized into Spices, Pickles, and Masala Blends.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#9A6428] bg-[#9A6428]/15 px-3 py-1.5 rounded-full">
              {filteredProducts.length} Products
            </span>
          </div>
        </div>

        {/* 3 Main Category Tabs Bar (Without Search Box) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FFFBF5] p-3 rounded-2xl border border-[#E8DDCF] shadow-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-[#9A6428] text-white shadow-xs'
                  : 'bg-white text-[#171717] border border-[#E8DDCF] hover:bg-[#F9EFDD]/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#F9EFDD]" />
              <span>All Products</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-[#9A6428] text-white shadow-xs'
                    : 'bg-white text-[#171717] border border-[#E8DDCF] hover:bg-[#F9EFDD]/60'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Controls: Sort Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-[#E8DDCF] shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#9A6428]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-[#171717] bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="best-selling">Best Selling</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
