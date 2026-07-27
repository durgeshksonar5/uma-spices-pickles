import React, { useState, useEffect } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';
import { businessConfig } from '../../config/businessConfig';
import { settingsApi } from '../../api/settingsApi';

const DEFAULT_DEAL_IMAGE = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000';

export const ChefsBundleSection = () => {
  const { addToCart } = useCart();
  const [deal, setDeal] = useState({
    badge: 'SPECIAL FESTIVE DEAL',
    tagline: 'Latest Offer • Best Value',
    title: 'Chef’s Signature Bundle',
    description: 'A curated combination of our bestselling spices and traditional handcrafted pickles. Delivered in a premium airtight gift box.',
    image: DEFAULT_DEAL_IMAGE,
    price: 2150,
    originalPrice: 2650,
    discount: '19% OFF',
    includedItems: ['Turmeric Powder', 'Red Chilli Powder', 'Garam Masala', 'Mango Pickle', 'Lemon Pickle']
  });
  const [dealImageSrc, setDealImageSrc] = useState(DEFAULT_DEAL_IMAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeal = async () => {
      setIsLoading(true);
      try {
        const res = await settingsApi.getFestiveDealSettings();
        if (res.success && res.data) {
          setDeal(res.data);
          if (res.data.image) setDealImageSrc(res.data.image);
        }
      } catch (err) {
        console.error('Failed to load festive deal settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeal();
  }, []);

  const handleOrderBundleWhatsApp = () => {
    const bundleProduct = {
      _id: 'prod-festive-deal-bundle',
      id: 'prod-festive-deal-bundle',
      name: deal.title,
      price: deal.price,
      images: [{ url: dealImageSrc }]
    };

    addToCart(bundleProduct, { size: 'Gift Box', price: deal.price }, 1);

    const cleanNumber = businessConfig.whatsAppNumber.replace(/\D/g, '');
    const message = `Hello ${businessConfig.brandName},\n\nI would like to order:\n\nProduct: ${deal.title}\nPrice: ${formatCurrency(deal.price)}\n\nPlease confirm availability and delivery details.`;
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="w-full h-72 bg-[#F9EFDD]/50 rounded-3xl animate-pulse"></div>
    );
  }

  return (
    <div className="bg-[#F9EFDD]/60 rounded-3xl border border-[#E8DDCF] p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 shadow-sm relative overflow-hidden text-left">
      {/* Visual Product Box Image */}
      <div className="w-full lg:w-1/2 relative rounded-2xl overflow-hidden bg-white border border-[#E8DDCF] h-64 sm:h-80 shadow-xs">
        <img
          src={dealImageSrc}
          alt={deal.title}
          onError={() => setDealImageSrc(DEFAULT_DEAL_IMAGE)}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-[#9A6428] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{deal.tagline || 'Latest Offer • Best Value'}</span>
        </div>
      </div>

      {/* Content Details */}
      <div className="w-full lg:w-1/2 space-y-4">
        <div>
          <span className="text-xs font-bold text-[#9A6428] tracking-widest uppercase mb-1 block">
            {deal.badge || 'SPECIAL FESTIVE DEAL'}
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E3718] mb-2">
            {deal.title}
          </h3>
          <p className="text-sm text-[#777166] leading-relaxed">
            {deal.description}
          </p>
        </div>

        {/* Included Items Pills */}
        {deal.includedItems && deal.includedItems.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {deal.includedItems.map((item, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#E8DDCF] text-[#5E3718] font-semibold shadow-2xs"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Pricing & Discount */}
        <div className="flex items-center gap-3 pt-2">
          <span className="font-serif font-bold text-3xl sm:text-4xl text-[#171717]">
            {formatCurrency(deal.price)}
          </span>
          {deal.originalPrice && deal.originalPrice > deal.price && (
            <span className="text-lg text-[#777166] line-through">
              {formatCurrency(deal.originalPrice)}
            </span>
          )}
          {deal.discount && (
            <span className="text-xs font-bold text-[#9A6428] bg-[#9A6428]/15 px-3 py-1 rounded-full">
              {deal.discount}
            </span>
          )}
        </div>

        {/* Order Bundle on WhatsApp Button */}
        <div className="pt-2">
          <button
            onClick={handleOrderBundleWhatsApp}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-[#25D366] hover:bg-[#1DA851] text-white flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current text-white" />
            <span>Order Bundle on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChefsBundleSection;
