import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { WhatsAppCheckoutForm } from '../cart/WhatsAppCheckoutForm';

export const WhatsAppCtaSection = () => {
  const { cartItems } = useCart();
  const { addToast } = useToast();
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);

  const handleWhatsAppOrderClick = () => {
    if (!cartItems || cartItems.length === 0) {
      addToast('Your cart is empty. Add products before placing an order.', 'info');
      return;
    }
    setIsCheckoutFormOpen(true);
  };

  return (
    <>
      <section className="py-10 bg-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F9EFDD]/60 rounded-2xl p-6 sm:p-8 border border-[#E8DDCF] flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Icon + Text */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366] shrink-0">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#171717]">
                  Ordering is now even easier!
                </h3>
                <p className="text-xs sm:text-sm text-[#777166] mt-0.5">
                  Add your favourite products to the cart and place your complete order through WhatsApp.
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleWhatsAppOrderClick}
              className="w-full md:w-auto px-6 py-3 rounded-xl border-2 border-[#25D366] text-[#171717] hover:bg-[#25D366] hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current text-[#25D366] group-hover:text-white" />
              <span>Order on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* WhatsApp Delivery Validation Form Modal */}
      <WhatsAppCheckoutForm
        isOpen={isCheckoutFormOpen}
        onClose={() => setIsCheckoutFormOpen(false)}
      />
    </>
  );
};
