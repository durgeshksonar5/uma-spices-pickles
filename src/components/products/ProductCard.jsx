import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';
import { businessConfig } from '../../config/businessConfig';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800';

const extractImageUrl = (product) => {
  if (!product) return DEFAULT_FALLBACK_IMAGE;

  if (Array.isArray(product.images) && product.images.length > 0) {
    const primary = product.images.find((img) => img && typeof img === 'object' && img.isPrimary);
    const target = primary || product.images[0];

    if (typeof target === 'string' && target.trim()) return target;
    if (target && typeof target === 'object' && target.url) return target.url;
  }

  if (typeof product.image === 'string' && product.image.trim()) {
    return product.image;
  }

  return DEFAULT_FALLBACK_IMAGE;
};

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => extractImageUrl(product));

  // Default size selection
  const defaultSize = product.availableSizes && product.availableSizes.length > 0
    ? product.availableSizes[0]
    : { size: 'Pack', price: product.price || product.basePrice || 0 };

  const handleAddToCartAndWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, defaultSize, 1);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);

    const cleanNumber = businessConfig.whatsAppNumber.replace(/\D/g, '');
    const message = `Hello ${businessConfig.brandName},\n\nI would like to order:\n\nProduct: ${product.name}\nSize: ${defaultSize.size}\nPrice: ${formatCurrency(defaultSize.price)}\n\nPlease confirm product availability and delivery details.`;
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#FFFBF5] rounded-2xl border border-[#E8DDCF] p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
      <div>
        {/* Rectangle Image Container */}
        <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-[#F9EFDD]/50 mb-3 border border-[#E8DDCF]">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={imgSrc}
              alt={product.name}
              loading="lazy"
              onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </div>

        {/* Product Meta */}
        <div className="space-y-1 text-left">
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#171717] line-clamp-1 hover:text-[#9A6428] transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[#777166] line-clamp-1 font-medium">
            {product.descriptor || product.subcategory || "Pure & Authentic"}
          </p>

          {/* Price */}
          {Boolean(Number(product.price || product.basePrice) > 0) && (
            <div className="pt-1 flex items-baseline gap-2">
              <span className="font-sans font-bold text-base sm:text-lg text-[#171717]">
                {formatCurrency(product.price || product.basePrice)}
              </span>
              {Boolean(product.originalPrice && Number(product.originalPrice) > Number(product.price || product.basePrice)) && (
                <span className="text-xs text-[#777166] line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs pt-1">
            <div className="flex items-center text-[#E9A900]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-[#777166] text-[11px] font-semibold">
              ({product.reviewCount || 90})
            </span>
          </div>
        </div>
      </div>

      {/* Direct Order on WhatsApp Button */}
      <div className="pt-3.5 mt-2">
        <button
          onClick={handleAddToCartAndWhatsApp}
          className="w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#1DA851] text-white flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-current text-white" />
          <span>Order on WhatsApp</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
