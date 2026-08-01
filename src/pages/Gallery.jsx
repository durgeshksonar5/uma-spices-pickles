import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await apiClient('/gallery');
      if (res && res.data) {
        setGalleryItems(res.data);
      } else {
        setGalleryItems([]);
      }
    } catch (err) {
      console.warn('Gallery API error:', err.message);
      setGalleryItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else {
      setSelectedImageIndex(galleryItems.length - 1);
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (selectedImageIndex < galleryItems.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    } else {
      setSelectedImageIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#171717] pb-16">
      {/* Breadcrumb Header */}
      <div className="bg-[#F9EFDD]/50 border-b border-[#E8DDCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Gallery' }]} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-[#5E3718] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F9EFDD_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#9A6428]/60 text-[#F9EFDD] border border-[#F9EFDD]/20 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#F9EFDD]" />
            <span>Behind The Scenes & Authentic Moments</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F9EFDD]">
            Our Photo Gallery
          </h1>

          <p className="text-sm sm:text-base text-[#F9EFDD]/80 max-w-2xl mx-auto leading-relaxed">
            Take a visual tour of our traditional spice grinding, authentic home pickle preparation, sun-drying fields, and hygienic packaging processes.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#777166]">
            <RefreshCw className="w-8 h-8 animate-spin text-[#9A6428]" />
            <p className="text-sm font-semibold">Loading gallery photos...</p>
          </div>
        ) : galleryItems.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center space-y-4">
            <Camera className="w-12 h-12 text-[#9A6428]/40 mx-auto" />
            <h3 className="text-lg font-bold text-[#5E3718]">No gallery photos uploaded yet</h3>
            <p className="text-xs text-[#777166]">
              Gallery photos will appear here once uploaded by the admin.
            </p>
          </div>
        ) : (
          /* Gallery Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <div
                key={item._id || index}
                onClick={() => openLightbox(index)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-[#E8DDCF] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 overflow-hidden bg-[#F9EFDD]/40">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3 rounded-full bg-white/90 text-[#5E3718] transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                      <Maximize2 className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                {(item.title || item.description) && (
                  <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-2">
                    {item.title && (
                      <h3 className="font-bold text-base text-[#5E3718] group-hover:text-[#9A6428] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-xs text-[#777166] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Callout Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#5E3718] to-[#80511D] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F9EFDD]">
              Taste the Authentic Tradition
            </h3>
            <p className="text-xs sm:text-sm text-[#F9EFDD]/80 max-w-xl">
              From handpicked ingredients to pure low-temperature grinding, experience unadulterated freshness delivered directly to your doorstep.
            </p>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F9EFDD] hover:bg-white text-[#5E3718] font-bold text-sm transition-all shadow-md shrink-0 active:scale-95"
          >
            <ShoppingBag className="w-5 h-5 text-[#9A6428]" />
            <span>Explore Shop Now</span>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && galleryItems[selectedImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev */}
          <button
            onClick={handlePrevImage}
            className="absolute left-3 sm:left-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Navigation Next */}
          <button
            onClick={handleNextImage}
            className="absolute right-3 sm:right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Next Image"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Lightbox Content Container */}
          <div
            className="max-w-4xl w-full bg-[#171717] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Box */}
            <div className="md:w-2/3 bg-black flex items-center justify-center p-2 min-h-[300px]">
              <img
                src={galleryItems[selectedImageIndex].imageUrl}
                alt={galleryItems[selectedImageIndex].title || 'Gallery image'}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>

            {/* Details Box */}
            <div className="md:w-1/3 p-6 flex flex-col justify-between bg-[#1f1f1f] text-white border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#9A6428] uppercase tracking-wider">
                    Photo {selectedImageIndex + 1} of {galleryItems.length}
                  </span>
                </div>

                {galleryItems[selectedImageIndex].title && (
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#F9EFDD]">
                    {galleryItems[selectedImageIndex].title}
                  </h2>
                )}

                {galleryItems[selectedImageIndex].description && (
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    {galleryItems[selectedImageIndex].description}
                  </p>
                )}
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3">
                <Link
                  to="/shop"
                  onClick={closeLightbox}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#9A6428] hover:bg-[#80511D] text-white font-bold text-xs transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Fresh Spices</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
