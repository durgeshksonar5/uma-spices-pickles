import React, { useState, useEffect } from 'react';
import { ZoomIn, X, Maximize2 } from 'lucide-react';
import picklesCatalogue from '../../assets/product-catalogues/pickles-product-list.jpg';
import spicesCatalogue from '../../assets/product-catalogues/spices-product-list.jpg';
import laddusCatalogue from '../../assets/product-catalogues/laddus-product-list.jpg';
import papadDriedCatalogue from '../../assets/product-catalogues/papad-dried-products-list.jpg';

const catalogueItems = [
  {
    id: 1,
    title: 'Pickles Product List',
    image: picklesCatalogue,
    altText: 'Complete Marathi pickles product catalogue'
  },
  {
    id: 2,
    title: 'Spices Product List',
    image: spicesCatalogue,
    altText: 'Complete Marathi spices product catalogue'
  },
  {
    id: 3,
    title: 'Laddus Product List',
    image: laddusCatalogue,
    altText: 'Complete Marathi laddus product catalogue'
  },
  {
    id: 4,
    title: 'Papad, Kuradai and Dried Products',
    image: papadDriedCatalogue,
    altText: 'Complete Marathi papad, kuradai and dried products catalogue'
  }
];

export const ProductCatalogueSection = () => {
  const [activeCatalogue, setActiveCatalogue] = useState(null);

  // Close on Escape key press & prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveCatalogue(null);
      }
    };
    if (activeCatalogue) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeCatalogue]);

  return (
    <section className="py-16 bg-[#FFFBF5] border-b border-[#E8DDCF]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E3718]">
            Explore Our Complete Product Range
          </h2>
          <p className="text-xs sm:text-sm text-[#777166] mt-1 max-w-2xl">
            Browse our wide range of homemade pickles, spices, laddus, papads and traditional food products. Click any catalogue image to expand and view full size.
          </p>
        </div>

        {/* Catalogue Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {catalogueItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveCatalogue(item)}
              className="group bg-white border border-[#E8DDCF] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col space-y-3 cursor-pointer"
            >
              {/* Card Title & Expand Action */}
              <div className="flex items-center justify-between border-b border-[#E8DDCF]/60 pb-2">
                <h3 className="font-sans font-extrabold text-base sm:text-lg text-[#171717] tracking-wide">
                  {item.title}
                </h3>
                <span className="text-xs font-bold text-[#9A6428] group-hover:text-[#5E3718] flex items-center gap-1 transition-colors bg-[#F9EFDD]/50 px-2.5 py-1 rounded-lg">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Click to Expand</span>
                </span>
              </div>

              {/* Catalogue Image Frame */}
              <div className="w-full rounded-xl overflow-hidden bg-[#FFFBF5] border border-[#E8DDCF]/50 flex items-center justify-center min-h-[220px] sm:min-h-[280px] relative group">
                <img
                  src={item.image}
                  alt={item.altText}
                  loading="lazy"
                  className="w-full h-auto max-h-[500px] object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
                />

                {/* Hover Overlay Badge */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/95 text-[#5E3718] font-bold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-[#9A6428]" />
                    <span>View Fullscreen Catalogue</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Expand Lightbox Modal */}
      {activeCatalogue && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveCatalogue(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[92vh] bg-white rounded-3xl p-4 sm:p-6 flex flex-col items-center shadow-2xl border border-[#E8DDCF] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-[#E8DDCF] mb-3">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#5E3718]">
                  {activeCatalogue.title}
                </h3>
                <p className="text-xs text-[#777166]">
                  Full resolution view • Click X or press ESC to close
                </p>
              </div>
              <button
                onClick={() => setActiveCatalogue(null)}
                className="p-2 rounded-full bg-[#F9EFDD] text-[#5E3718] hover:bg-[#9A6428] hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Full Image Display Container */}
            <div className="w-full flex-1 overflow-auto flex items-center justify-center bg-[#FFFBF5] rounded-2xl p-2 sm:p-4 border border-[#E8DDCF]/50">
              <img
                src={activeCatalogue.image}
                alt={activeCatalogue.altText}
                className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-xl shadow-xs"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductCatalogueSection;
