import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';
import { businessConfig } from '../../config/businessConfig';

export const ChefsBundleSection = () => {
  const { addToCart } = useCart();

  const bundleProduct = products.find((p) => p.slug === 'chefs-signature-bundle') || {
    id: "prod-chefs-signature-bundle",
    slug: "chefs-signature-bundle",
    name: "Chef’s Signature Bundle",
    price: 2150,
    originalPrice: 2650,
    discount: 19,
    images: ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=900"],
    availableSizes: [{ size: "Standard Gift Box", price: 2150 }]
  };

  const includedItems = [
    "Turmeric Powder",
    "Red Chilli Powder",
    "Garam Masala",
    "Mango Pickle",
    "Lemon Pickle"
  ];

  const handleOrderBundleWhatsApp = () => {
    addToCart(bundleProduct, bundleProduct.availableSizes[0], 1);

    const cleanNumber = businessConfig.whatsAppNumber.replace(/\D/g, '');
    const message = `Hello ${businessConfig.brandName},\n\nI would like to order:\n\nProduct: ${bundleProduct.name}\nSize: Standard Gift Box\nPrice: ${formatCurrency(bundleProduct.price)}\n\nPlease confirm availability and delivery details.`;
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#F9EFDD]/60 rounded-3xl border border-[#E8DDCF] p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 shadow-sm relative overflow-hidden">
      {/* Visual Product Box Image - Pure Spices & Pickles Combo */}
      <div className="w-full lg:w-1/2 relative rounded-2xl overflow-hidden bg-white border border-[#E8DDCF] h-64 sm:h-80 shadow-xs">
        <img
          src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000"
          alt="Chef's Signature Spices & Pickles Combo Box"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-[#9A6428] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Latest Offer • Best Value</span>
        </div>
      </div>

      {/* Content Details */}
      <div className="w-full lg:w-1/2 space-y-4 text-left">
        <div>
          <span className="text-xs font-bold text-[#9A6428] tracking-widest uppercase mb-1 block">
            Special Festive Deal
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E3718] mb-2">
            Chef’s Signature Bundle
          </h3>
          <p className="text-sm text-[#777166] leading-relaxed">
            A curated combination of our bestselling spices and traditional handcrafted pickles. Delivered in a premium airtight gift box.
          </p>
        </div>

        {/* Included Items Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {includedItems.map((item) => (
            <span
              key={item}
              className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#E8DDCF] text-[#5E3718] font-semibold shadow-2xs"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Pricing & Discount */}
        <div className="flex items-center gap-3 pt-2">
          <span className="font-serif font-bold text-3xl sm:text-4xl text-[#171717]">
            {formatCurrency(bundleProduct.price)}
          </span>
          <span className="text-lg text-[#777166] line-through">
            {formatCurrency(bundleProduct.originalPrice)}
          </span>
          <span className="text-xs font-bold text-[#9A6428] bg-[#9A6428]/15 px-3 py-1 rounded-full">
            19% OFF
          </span>
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
