import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';
import { EmptyState } from '../common/EmptyState';
import { WhatsAppCheckoutForm } from './WhatsAppCheckoutForm';
import { formatCurrency } from '../../utils/currency';

export const CartDrawer = () => {
  const { isCartOpen, closeCart, cartItems, totalItems, subtotal } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={closeCart}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 z-10">
          <div className="w-screen max-w-md sm:max-w-lg bg-[#FFF8ED] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-[#E8D9C5]">
            
            {/* Header */}
            <div className="bg-[#7A1F1F] text-white p-4 sm:p-5 flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#E6A817]" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-white leading-tight">
                    Your Cart
                  </h3>
                  <span className="text-xs text-[#E6A817] font-semibold">
                    {totalItems} {totalItems === 1 ? 'Item' : 'Items'} Selected
                  </span>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {cartItems.length === 0 ? (
                <div className="py-12">
                  <EmptyState
                    title="Your cart is empty."
                    description="Add your favourite spices and pickles to place an order."
                    actionText="Explore Products"
                    onActionClick={closeCart}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <CartItem key={item.cartId} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Bottom Actions */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 bg-[#FFFBF5] border-t border-[#E8D9C5] shadow-2xl shrink-0 space-y-4">
                {/* Total & Delivery Note */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif font-bold text-base text-[#7A1F1F]">Cart Total</span>
                    <span className="font-serif font-extrabold text-2xl text-[#7A1F1F]">{formatCurrency(subtotal)}</span>
                  </div>
                  <p className="text-xs text-[#506B2F] font-semibold">
                    Delivery charges will be confirmed on WhatsApp.
                  </p>
                </div>

                {/* Main Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-95"
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
                      className="py-2.5 px-3 rounded-xl bg-white border border-[#E8D9C5] text-[#3B2618] font-bold text-xs hover:bg-[#EEDEC8]/40 transition-colors"
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

      {/* WhatsApp Checkout Form Modal */}
      <WhatsAppCheckoutForm
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};
