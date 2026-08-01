import React from 'react';
import { Link } from 'react-router-dom';

import foodsImg from '../../assets/products/foods.jpeg';
import ghee1Img from '../../assets/products/ghee-1.jpeg';
import gheeImg from '../../assets/products/ghee.jpeg';
import masalePicklesImg from '../../assets/products/masale-pickels.jpeg';
import spicesImg from '../../assets/products/spices.jpeg';
import acharImg from '../../assets/products/achar.jpeg';

export const AdBannersSection = () => {
  const adBanners = [
    {
      id: 'ad-1',
      title: 'Gajanan Pure Foods Collection',
      image: foodsImg,
      link: '/shop'
    },
    {
      id: 'ad-2',
      title: 'Pure Desi Ghee - Special Edition',
      image: ghee1Img,
      link: '/shop'
    },
    {
      id: 'ad-3',
      title: 'Authentic Pure Ghee Pack',
      image: gheeImg,
      link: '/shop'
    },
    {
      id: 'ad-4',
      title: 'Traditional Masale & Pickles',
      image: masalePicklesImg,
      link: '/shop?category=pickles'
    },
    {
      id: 'ad-5',
      title: 'Pure Farm Fresh Spices',
      image: spicesImg,
      link: '/shop?category=spices'
    },
    {
      id: 'ad-6',
      title: 'Homemade Special Achar',
      image: acharImg,
      link: '/shop?category=pickles'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#FFFBF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 6 Ad Banner Cards Grid (3 Images Per Line) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {adBanners.map((ad) => (
            <Link
              key={ad.id}
              to={ad.link}
              className="group relative rounded-3xl overflow-hidden border border-[#E8DDCF] shadow-md hover:shadow-2xl transition-all duration-500 min-h-[380px] sm:min-h-[420px] lg:min-h-[450px] aspect-3/4 block bg-[#F9EFDD]/50"
            >
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdBannersSection;
