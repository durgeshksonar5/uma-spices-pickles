import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/products/ProductCard';
import { buildWhatsAppOrderUrl } from '../utils/whatsapp';
import { formatCurrency } from '../utils/currency';
import {
  MessageCircle,
  Minus,
  Plus,
  ChevronDown,
  Star
} from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800';

const extractProductImage = (prod) => {
  if (!prod) return DEFAULT_FALLBACK_IMAGE;

  if (Array.isArray(prod.images) && prod.images.length > 0) {
    const primary = prod.images.find((img) => img && typeof img === 'object' && img.isPrimary);
    const target = primary || prod.images[0];

    if (typeof target === 'string' && target.trim()) return target;
    if (target && typeof target === 'object' && target.url) return target.url;
  }

  if (typeof prod.image === 'string' && prod.image.trim()) {
    return prod.image;
  }

  return DEFAULT_FALLBACK_IMAGE;
};

export const ProductDetails = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState(DEFAULT_FALLBACK_IMAGE);

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDirectCheckoutOpen, setIsDirectCheckoutOpen] = useState(false);

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

  useEffect(() => {
    const loadProductData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await productApi.getProductBySlug(slug);
        if (res.success && res.data) {
          const p = res.data;
          setProduct(p);
          setSelectedSizeIndex(0);
          setMainImageUrl(extractProductImage(p));

          const relRes = await productApi.getProducts({
            category: p.category,
            limit: 4,
            status: 'published'
          });
          if (relRes.success && relRes.data) {
            setRelatedProducts(relRes.data.filter((item) => item.slug !== slug).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.message || 'Product not found.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] py-16 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#9A6428] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-[#5E3718] font-serif">Loading Product Details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#5E3718]">Product Not Found</h2>
        <p className="text-xs text-[#777166]">{error || 'The requested product could not be located.'}</p>
        <Link
          to="/shop"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#9A6428] text-white text-xs font-bold shadow-xs"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const sizesList =
    product.availableSizes && product.availableSizes.length > 0
      ? product.availableSizes
      : product.sizes && product.sizes.length > 0
      ? product.sizes.map((s) => ({ size: s.label, price: s.price }))
      : [{ size: 'Standard Pack', price: product.basePrice || product.price }];

  const currentSize = sizesList[selectedSizeIndex] || sizesList[0];

  const handleDirectWhatsAppOrder = () => {
    addToCart(product, currentSize, quantity, false);
    const waUrl = buildWhatsAppOrderUrl(
      [{ product, selectedSize: currentSize, quantity }],
      {},
      (currentSize.price || product.price || product.basePrice || 0) * quantity
    );
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#FFFBF5] min-h-screen py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Shop', link: '/shop' },
            { label: product.name }
          ]}
        />

        <div className="bg-[#FFFBF5] rounded-2xl border border-[#E8DDCF] p-6 sm:p-10 shadow-xs mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Image */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden bg-white border border-[#E8DDCF] shadow-xs">
                <img
                  src={mainImageUrl}
                  alt={product.name}
                  onError={() => setMainImageUrl(DEFAULT_FALLBACK_IMAGE)}
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9A6428] bg-[#F9EFDD] px-3 py-1 rounded-full inline-block">
                  {product.category}
                </span>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E3718]">
                  {product.name}
                </h1>

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

                {Boolean(Number(currentSize.price) > 0) && (
                  <div className="pt-2 flex items-baseline gap-3">
                    <span className="font-sans font-bold text-3xl text-[#171717]">
                      {formatCurrency(currentSize.price)}
                    </span>
                    {Boolean(product.basePrice && Number(product.basePrice) > Number(currentSize.price)) && (
                      <span className="text-sm text-[#777166] line-through">
                        {formatCurrency(product.basePrice)}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-sm text-[#777166] leading-relaxed pt-2">
                  {product.shortDescription || product.description}
                </p>
              </div>

              {/* Size Selector */}
              <div className="space-y-2 pt-3 border-t border-[#E8DDCF]">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Select Size / Weight:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {sizesList.map((sizeObj, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                        selectedSizeIndex === idx
                          ? 'bg-[#9A6428] text-white border-[#9A6428] shadow-xs'
                          : 'bg-white text-[#171717] border-[#E8DDCF] hover:border-[#9A6428]'
                      }`}
                    >
                      <span>{sizeObj.size}</span>
                      {Boolean(Number(sizeObj.price) > 0) && (
                        <span className="opacity-80">({formatCurrency(sizeObj.price)})</span>
                      )}
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
                      className="p-2.5 hover:bg-[#F9EFDD] text-[#171717] font-bold cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold text-base text-[#171717]">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2.5 hover:bg-[#F9EFDD] text-[#171717] font-bold cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
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

        {/* Accordions */}
        <div className="bg-[#FFFBF5] rounded-2xl border border-[#E8DDCF] p-6 sm:p-8 shadow-xs mb-12 space-y-3">
          <h3 className="font-serif font-bold text-2xl text-[#5E3718] mb-4">
            Product & Order Details
          </h3>

          <div className="border border-[#E8DDCF] rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => toggleAccordion('details')}
              className="w-full p-4 text-left font-bold text-sm text-[#171717] flex items-center justify-between bg-[#F9EFDD]/50 cursor-pointer"
            >
              <span>Product Details</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.details ? 'rotate-180' : ''}`} />
            </button>
            {openAccordions.details && (
              <div className="p-4 text-xs sm:text-sm text-[#777166] leading-relaxed border-t border-[#E8DDCF] space-y-2">
                <p>{product.description || product.shortDescription}</p>
                {product.sku && <p><strong>SKU:</strong> {product.sku}</p>}
                {product.brand && <p><strong>Brand:</strong> {product.brand}</p>}
              </div>
            )}
          </div>

          <div className="border border-[#E8DDCF] rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => toggleAccordion('ingredients')}
              className="w-full p-4 text-left font-bold text-sm text-[#171717] flex items-center justify-between bg-[#F9EFDD]/50 cursor-pointer"
            >
              <span>Ingredients</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.ingredients ? 'rotate-180' : ''}`} />
            </button>
            {openAccordions.ingredients && (
              <div className="p-4 text-xs sm:text-sm text-[#777166] leading-relaxed border-t border-[#E8DDCF]">
                {product.ingredients || '100% natural raw ingredients.'}
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
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
