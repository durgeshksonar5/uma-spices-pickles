import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/products/ProductCard';
import { WhatsAppCheckoutForm } from '../components/cart/WhatsAppCheckoutForm';
import { formatCurrency } from '../utils/currency';
import {
  ShoppingBag,
  MessageCircle,
  Minus,
  Plus,
  ChevronDown,
  Check,
  Star
} from 'lucide-react';

export const ProductDetails = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isDirectCheckoutOpen, setIsDirectCheckoutOpen] = useState(false);

  // Accordion state for 5 accordions
  const [openAccordions, setOpenAccordions] = useState({
    details: true,
    ingredients: false,
    howToUse: false,
    storage: false,
    delivery: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentSize = product.availableSizes && product.availableSizes[selectedSizeIndex]
    ? product.availableSizes[selectedSizeIndex]
    : { size: 'Pack', price: product.price };

  const handleAddToCart = () => {
    addToCart(product, currentSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);

    const cleanNumber = businessConfig.whatsAppNumber.replace(/\D/g, '');
    const itemSubtotal = currentSize.price * quantity;
    const message = `Hello ${businessConfig.brandName},\n\nI would like to order:\n\nProduct: ${product.name}\nSize: ${currentSize.size}\nQuantity: ${quantity}\nSubtotal: ${formatCurrency(itemSubtotal)}\n\nPlease confirm availability and delivery details.`;
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDirectWhatsAppOrder = () => {
    addToCart(product, currentSize, quantity, false);
    setIsDirectCheckoutOpen(true);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-[#FFFBF5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Shop', link: '/shop' },
            { label: product.name }
          ]}
        />

        {/* Main Product Container */}
        <div className="bg-[#FFFBF5] rounded-2xl border border-[#E8DDCF] p-6 sm:p-10 shadow-xs mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden bg-white border border-[#E8DDCF] shadow-xs">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>

            {/* Right Product Details & Actions */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9A6428] bg-[#F9EFDD] px-3 py-1 rounded-full inline-block">
                  {product.category.replace('-', ' ')}
                </span>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E3718]">
                  {product.name}
                </h1>

                {/* Rating & Review */}
                <div className="flex items-center gap-2 text-xs pt-1">
                  <div className="flex items-center text-[#E9A900]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[#171717] font-semibold">
                    {product.rating || 4.9}
                  </span>
                  <span className="text-[#777166]">
                    ({product.reviewCount || 120} reviews)
                  </span>
                </div>

                {/* Live Price updating based on selected size */}
                <div className="pt-2 flex items-baseline gap-3">
                  <span className="font-sans font-bold text-3xl text-[#171717]">
                    {formatCurrency(currentSize.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#777166] line-through">
                      {formatCurrency(Math.round(currentSize.price * 1.2))}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-xs font-bold text-[#9A6428] bg-[#9A6428]/15 px-2 py-0.5 rounded">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#777166] leading-relaxed pt-2">
                  {product.shortDescription}
                </p>
              </div>

              {/* Size Selector - MUST update price immediately! */}
              <div className="space-y-2 pt-3 border-t border-[#E8DDCF]">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Select Size / Weight:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {product.availableSizes.map((sizeObj, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
                        selectedSizeIndex === idx
                          ? 'bg-[#9A6428] text-white border-[#9A6428] shadow-xs'
                          : 'bg-white text-[#171717] border-[#E8DDCF] hover:border-[#9A6428]'
                      }`}
                    >
                      <span>{sizeObj.size}</span>
                      <span className="opacity-80">({formatCurrency(sizeObj.price)})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Select Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#E8DDCF] bg-white rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2.5 hover:bg-[#F9EFDD] text-[#171717] font-bold"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold text-base text-[#171717]">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2.5 hover:bg-[#F9EFDD] text-[#171717] font-bold"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Single WhatsApp Order Button */}
              <div className="pt-4 border-t border-[#E8DDCF]">
                <button
                  onClick={handleDirectWhatsAppOrder}
                  className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#1DA851] text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current text-white" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Required Accordions */}
        <div className="bg-[#FFFBF5] rounded-2xl border border-[#E8DDCF] p-6 sm:p-8 shadow-xs mb-12 space-y-3">
          <h3 className="font-serif font-bold text-2xl text-[#5E3718] mb-4">
            Product & Order Details
          </h3>

          {/* 1. Product Details */}
          <div className="border border-[#E8DDCF] rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => toggleAccordion('details')}
              className="w-full p-4 text-left font-bold text-sm text-[#171717] flex items-center justify-between bg-[#F9EFDD]/50"
            >
              <span>Product Details</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.details ? 'rotate-180' : ''}`} />
            </button>
            {openAccordions.details && (
              <div className="p-4 text-xs sm:text-sm text-[#777166] leading-relaxed border-t border-[#E8DDCF] space-y-2">
                <p>{product.fullDescription}</p>
                {product.flavourProfile && (
                  <p><strong>Flavour Profile:</strong> {product.flavourProfile}</p>
                )}
                {product.sku && (
                  <p><strong>SKU:</strong> {product.sku}</p>
                )}
              </div>
            )}
          </div>

          {/* 2. Ingredients */}
          <div className="border border-[#E8DDCF] rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => toggleAccordion('ingredients')}
              className="w-full p-4 text-left font-bold text-sm text-[#171717] flex items-center justify-between bg-[#F9EFDD]/50"
            >
              <span>Ingredients</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.ingredients ? 'rotate-180' : ''}`} />
            </button>
            {openAccordions.ingredients && (
              <div className="p-4 text-xs sm:text-sm text-[#777166] leading-relaxed border-t border-[#E8DDCF]">
                {product.ingredients}
              </div>
            )}
          </div>

          {/* 3. How to Use */}
          <div className="border border-[#E8DDCF] rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => toggleAccordion('howToUse')}
              className="w-full p-4 text-left font-bold text-sm text-[#171717] flex items-center justify-between bg-[#F9EFDD]/50"
            >
              <span>How to Use</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.howToUse ? 'rotate-180' : ''}`} />
            </button>
            {openAccordions.howToUse && (
              <div className="p-4 text-xs sm:text-sm text-[#777166] leading-relaxed border-t border-[#E8DDCF]">
                {product.recommendedDishes || "Add to your daily curries, gravies, or serve alongside hot rice, parathas and snacks for authentic flavor."}
              </div>
            )}
          </div>

          {/* 4. Storage Instructions */}
          <div className="border border-[#E8DDCF] rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => toggleAccordion('storage')}
              className="w-full p-4 text-left font-bold text-sm text-[#171717] flex items-center justify-between bg-[#F9EFDD]/50"
            >
              <span>Storage Instructions</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.storage ? 'rotate-180' : ''}`} />
            </button>
            {openAccordions.storage && (
              <div className="p-4 text-xs sm:text-sm text-[#777166] leading-relaxed border-t border-[#E8DDCF] space-y-1">
                <p>{product.storageInstructions}</p>
                <p><strong>Shelf Life:</strong> {product.shelfLife}</p>
              </div>
            )}
          </div>

          {/* 5. Delivery Information */}
          <div className="border border-[#E8DDCF] rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => toggleAccordion('delivery')}
              className="w-full p-4 text-left font-bold text-sm text-[#171717] flex items-center justify-between bg-[#F9EFDD]/50"
            >
              <span>Delivery Information</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.delivery ? 'rotate-180' : ''}`} />
            </button>
            {openAccordions.delivery && (
              <div className="p-4 text-xs sm:text-sm text-[#777166] leading-relaxed border-t border-[#E8DDCF] space-y-1">
                <p>All items are freshly packed in hygienic food-grade jars/pouches.</p>
                <p>Delivery charges and exact timeline will be confirmed on WhatsApp based on your city and PIN code.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[#5E3718]">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Delivery Validation Modal */}
      <WhatsAppCheckoutForm
        isOpen={isDirectCheckoutOpen}
        onClose={() => setIsDirectCheckoutOpen(false)}
      />
    </div>
  );
};

export default ProductDetails;
