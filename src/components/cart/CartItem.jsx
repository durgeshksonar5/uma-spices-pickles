import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const itemSubtotal = item.selectedSize.price * item.quantity;

  return (
    <div className="bg-white p-3.5 rounded-xl border border-[#E8DDCF] shadow-2xs hover:border-[#9A6428]/40 transition-all flex items-center gap-3 relative group">
      {/* Product Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F9EFDD]/50 shrink-0 border border-[#E8DDCF] relative">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-contain p-1"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-sans font-bold text-sm text-[#171717] truncate leading-tight pr-6">
            {item.product.name}
          </h4>
          <button
            onClick={() => removeFromCart(item.cartId)}
            className="absolute top-3 right-3 text-[#777166] hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
            title="Remove item"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#777166]">
          <span className="bg-[#F9EFDD] text-[#9A6428] font-bold px-2 py-0.5 rounded">
            Size: {item.selectedSize.size}
          </span>
          <span>•</span>
          <span className="font-medium text-[#171717]">{formatCurrency(item.selectedSize.price)} / unit</span>
        </div>

        {/* Quantity Controls & Item Subtotal */}
        <div className="flex items-center justify-between pt-1.5">
          <div className="flex items-center border border-[#E8DDCF] bg-[#FFFBF5] rounded-md overflow-hidden">
            <button
              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-1 hover:bg-white text-[#171717] disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 text-xs font-bold text-[#171717] min-w-[20px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
              className="p-1 hover:bg-white text-[#171717] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-right">
            <span className="font-sans font-bold text-base text-[#171717]">
              {formatCurrency(itemSubtotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
