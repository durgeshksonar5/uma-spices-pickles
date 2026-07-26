import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const ShopByCategorySection = () => {
  // 4 Featured Collection Cards matching the reference layout strictly
  const collections = [
    {
      title: "PURE SPICES",
      itemCount: "7 items",
      link: "/shop?category=spices",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
      alt: "Pure Spices Collection"
    },
    {
      title: "ALL PRODUCTS",
      itemCount: "18 items",
      link: "/shop",
      image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=600",
      alt: "All Products Collection"
    },
    {
      title: "TRADITIONAL PICKLES",
      itemCount: "6 items",
      link: "/shop?category=pickles",
      image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600",
      alt: "Traditional Pickles Collection"
    },
    {
      title: "MASALA BLENDS",
      itemCount: "5 items",
      link: "/shop?category=blends",
      image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600",
      alt: "Masala Blends Collection"
    }
  ];

  return (
    <section className="py-16 bg-[#FFFBF5] border-b border-[#E8DDCF]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-left">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E3718]">
              Explore Our Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#777166] mt-1">
              Handcrafted in small batches with authentic traditional recipes.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-[#9A6428] hover:text-[#5E3718] flex items-center gap-1.5 transition-colors group"
          >
            <span>View all products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Circular Collection Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {collections.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="group bg-white border border-[#E8DDCF] rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center space-y-4"
            >
              {/* Top Bold Category Title */}
              <h3 className="font-sans font-extrabold text-sm sm:text-base text-[#171717] tracking-wider uppercase group-hover:text-[#9A6428] transition-colors">
                {item.title}
              </h3>

              {/* Center Circular Cutout Image */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-[#F9EFDD] group-hover:border-[#9A6428] shadow-inner transition-colors duration-300 relative bg-[#FFFBF5]">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Bottom Item Count Badge */}
              <div className="pt-1">
                <span className="text-xs font-bold text-[#777166] group-hover:text-[#9A6428] transition-colors uppercase tracking-wider">
                  {item.itemCount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
