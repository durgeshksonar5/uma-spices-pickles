import React from 'react';
import { MessageCircle, RotateCcw } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export const OrderSummary = ({
  totalItems,
  subtotal,
  onProceedToCheckout,
  onClearCart
}) => {
  return (
    <div className="bg-[#FFFBF5] rounded-2xl border border-[#E8DDCF] p-6 space-y-6 shadow-xs">
      <h3 className="font-serif font-bold text-xl text-[#5E3718] border-b border-[#E8DDCF] pb-3">
        Order Summary
      </h3>

      {/* Total & Delivery Note */}
      <div className="space-y-3 text-sm text-[#777166]">
        <div className="flex justify-between items-center">
          <span>Total Products ({totalItems} items)</span>
          <span className="font-bold text-[#171717]">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span>Delivery Charges</span>
          <span className="font-semibold text-[#9A6428]">Confirmed on WhatsApp</span>
        </div>

        <div className="pt-3 border-t border-[#E8DDCF] flex justify-between items-baseline">
          <span className="font-sans font-bold text-base text-[#5E3718]">
            Grand Total
          </span>
          <span className="font-sans font-extrabold text-2xl text-[#171717]">
            {formatCurrency(subtotal)}
          </span>
        </div>
      </div>

      <p className="text-xs text-[#9A6428] font-semibold bg-[#F9EFDD] p-3 rounded-lg border border-[#E8DDCF]">
        Delivery charges and payment details will be confirmed on WhatsApp.
      </p>

      {/* WhatsApp Order Button */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onProceedToCheckout}
          disabled={totalItems === 0}
          className="w-full py-3.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-95 disabled:opacity-50"
        >
          <MessageCircle className="w-5 h-5 fill-current shrink-0" />
          <span>Order on WhatsApp</span>
        </button>

        {onClearCart && totalItems > 0 && (
          <button
            onClick={onClearCart}
            className="w-full py-2 text-xs font-semibold text-[#777166] hover:text-red-600 flex items-center justify-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};
