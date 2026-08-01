import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';
import { formatCurrency } from '../../utils/currency';
import { buildWhatsAppOrderUrl } from '../../utils/whatsapp';

export const CartDrawer = () => {
  const { isCartOpen, closeCart, cartItems, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  const handleProceedToWhatsApp = () => {
    const waUrl = buildWhatsAppOrderUrl(cartItems, {}, subtotal);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    closeCart();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          onClick={closeCart}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-[#FFFBF5] shadow-2xl border-l border-[#E8D9C5] flex flex-col">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E8D9C5] bg-[#FFF8ED] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#7A1F1F]">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="font-serif font-bold text-xl">Your Cart ({totalItems})</h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-[#3B2618]/70 hover:text-[#7A1F1F] rounded-full hover:bg-[#EEDEC8]/50 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-[#EEDEC8]/50 flex items-center justify-center text-[#7A1F1F]/60">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-lg text-[#3B2618]">Your cart is empty</p>
                    <p className="text-xs text-[#3B2618]/70 mt-1">
                      Add spices and pickles to order via WhatsApp.
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="px-5 py-2.5 rounded-xl bg-[#7A1F1F] text-white font-bold text-xs hover:bg-[#5C1717] transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <CartItem key={item.cartId} item={item} />
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-[#E8D9C5] bg-[#FFF8ED] space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-base font-bold text-[#3B2618]">
                    <span>Subtotal</span>
                    <span className="font-serif text-lg text-[#7A1F1F]">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <p className="text-xs text-[#506B2F] font-semibold">
                    Delivery charges will be confirmed on WhatsApp.
                  </p>
                </div>

                {/* Main Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleProceedToWhatsApp}
                    className="w-full py-4 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-6 h-6 fill-current shrink-0" />
                    <span>Order on WhatsApp</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="py-2.5 px-3 rounded-xl bg-white border border-[#7A1F1F] text-[#7A1F1F] font-bold text-xs text-center hover:bg-[#7A1F1F] hover:text-white transition-colors"
                    >
                      View Cart
                    </Link>
                    <button
                      onClick={closeCart}
                      className="py-2.5 px-3 rounded-xl bg-white border border-[#E8D9C5] text-[#3B2618] font-bold text-xs hover:bg-[#EEDEC8]/40 transition-colors cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
