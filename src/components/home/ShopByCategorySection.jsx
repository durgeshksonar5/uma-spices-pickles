import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/categories';
import { productApi } from '../../api/productApi';
import spicesImg from '../../assets/spices.jpeg';
import picklesImg from '../../assets/pickels.jpeg';
import blendsImg from '../../assets/products/masale-pickels.jpeg';
import ladooImg from '../../assets/products/methi-ladoo---1785662402014-0.jpeg';
import shevayaImg from '../../assets/products/shevaya--1785662264363-0.jpeg';
import jamImg from '../../assets/products/amla-jam---1785661779717-0.png';
import candyImg from '../../assets/products/premium-amla-candy---1785660828907-0.png';
import juiceImg from '../../assets/products/premium-amla-juice---1785661139836-0.png';
import murabbaImg from '../../assets/products/premium-amla-murabba---1785661432325-0.png';

const categoryImageMap = {
  spices: spicesImg,
  pickles: picklesImg,
  blends: blendsImg,
  'amla-candy': candyImg,
  juice: juiceImg,
  murabba: murabbaImg,
  jam: jamImg,
  shevaya: shevayaImg,
  ladoo: ladooImg
};

export const ShopByCategorySection = () => {
  const [productCounts, setProductCounts] = useState({});
  const [allProductsCount, setAllProductsCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await productApi.getProducts({ limit: 200, status: 'published' });
        if (res && res.data) {
          const counts = {};
          res.data.forEach((p) => {
            if (p.category) {
              const catSlug = p.category.toLowerCase().trim().replace(/-+$/g, '');
              counts[catSlug] = (counts[catSlug] || 0) + 1;
            }
          });
          setProductCounts(counts);
          setAllProductsCount(res.data.length);
        }
      } catch (err) {
        console.error('Error fetching product counts for categories:', err);
      }
    };
    fetchCounts();
  }, []);

  const collections = [
    {
      title: 'ALL PRODUCTS',
      itemCount: `${allProductsCount || 18} items`,
      link: '/shop',
      image: spicesImg,
      alt: 'All Products Collection'
    },
    ...categories.map((cat) => {
      const count = productCounts[cat.slug] || 0;
      return {
        title: cat.name.toUpperCase(),
        itemCount: `${count} ${count === 1 ? 'item' : 'items'}`,
        link: `/shop?category=${cat.slug}`,
        image: categoryImageMap[cat.slug] || cat.image || spicesImg,
        alt: `${cat.name} Collection`
      };
    })
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

        {/* Collection Cards Grid: 4 cards per row */}
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
