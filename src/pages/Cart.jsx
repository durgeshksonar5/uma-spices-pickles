import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { CartItem } from '../components/cart/CartItem';
import { OrderSummary } from '../components/cart/OrderSummary';
import { EmptyState } from '../components/common/EmptyState';
import { WhatsAppCheckoutForm } from '../components/cart/WhatsAppCheckoutForm';
import { ShoppingBag, ArrowLeft, RotateCcw } from 'lucide-react';

export const Cart = () => {
  const { cartItems, totalItems, subtotal, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="bg-[#FFFBF5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E3718] flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#9A6428]" />
            <span>Your Cart ({totalItems})</span>
          </h1>

          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-[#FFFBF5] rounded-2xl border border-[#E8DDCF] p-8 sm:p-12 shadow-xs text-center">
            <EmptyState
              title="Your cart is empty."
              description="Add your favourite spices and pickles to place an order on WhatsApp."
              actionText="Explore Products"
              actionLink="/shop"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 bg-[#FFFBF5] rounded-2xl border border-[#E8DDCF] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="border-b border-[#E8DDCF] pb-3 flex items-center justify-between font-serif font-bold text-lg text-[#5E3718]">
                <span>Product Details</span>
                <span>Subtotal</span>
              </div>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <CartItem key={item.cartId} item={item} />
                ))}
              </div>

              {/* Bottom Main Action Buttons */}
              <div className="pt-6 border-t border-[#E8DDCF] flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto py-3 px-6 rounded-lg bg-white border border-[#9A6428] text-[#9A6428] font-bold text-sm text-center hover:bg-[#9A6428] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xs transition-all"
                >
                  <span>Order on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 sticky top-24">
              <OrderSummary
                totalItems={totalItems}
                subtotal={subtotal}
                onProceedToCheckout={() => setIsCheckoutOpen(true)}
                onClearCart={clearCart}
              />
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Delivery Validation Form Modal */}
      <WhatsAppCheckoutForm
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};

export default Cart;
