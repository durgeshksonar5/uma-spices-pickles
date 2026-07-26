import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { InstagramIcon } from '../common/SocialIcons';
import { businessConfig } from '../../config/businessConfig';

export const ProductGallerySection = () => {
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
      caption: "Sun-dried Raw Spices & Masala Bowls"
    },
    {
      url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600",
      caption: "Sun-cured Traditional Mango Pickle Jars"
    },
    {
      url: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=600",
      caption: "Cold-Ground Golden Turmeric Powder"
    },
    {
      url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=600",
      caption: "Farm Fresh Crimson Kashmiri Red Chillies"
    },
    {
      url: "https://images.unsplash.com/photo-1590502160462-08942b083c27?auto=format&fit=crop&q=80&w=600",
      caption: "Tangy Sun-Dried Lemon Pickle Jar"
    },
    {
      url: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600",
      caption: "Handcrafted Shahi Garam Masala Blend"
    }
  ];

  return (
    <section className="py-16 bg-[#FFFBF5] border-b border-[#E8DDCF]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="#GajananPureAndHomemade"
          title="From Our Kitchen to Yours"
          subtitle="Follow our traditional preparation process, farm harvests, and pickle fermentation stories."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className="group relative rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 h-44 sm:h-52 bg-[#F9EFDD]/50 border border-[#E8DDCF]"
            >
              <img
                src={img.url}
                alt={img.caption}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                <InstagramIcon className="w-5 h-5 text-[#F9EFDD] mb-1" />
                <p className="text-[11px] font-semibold leading-tight line-clamp-2">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <a
            href={businessConfig.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9A6428] text-white text-xs font-bold hover:bg-[#80511D] transition-colors shadow-xs"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @gajanan_spices on Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
};
