import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { validateCheckoutForm } from '../../utils/validation';
import { buildWhatsAppOrderUrl } from '../../utils/whatsapp';
import { formatCurrency } from '../../utils/currency';

export const WhatsAppCheckoutForm = ({ isOpen, onClose }) => {
  const { cartItems, subtotal } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    orderNote: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const waUrl = buildWhatsAppOrderUrl(cartItems, formData, subtotal);
      
      setTimeout(() => {
        window.open(waUrl, '_blank');
        setIsSubmitting(false);
        onClose();
      }, 300);
    } catch (error) {
      console.error("WhatsApp Link Error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Single Screen Modal Box */}
      <div className="relative bg-[#FFFBF5] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8D9C5] z-10 animate-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#3B2618]/60 hover:text-[#7A1F1F] rounded-full hover:bg-[#EEDEC8]/50 transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#25D366]/15 rounded-full flex items-center justify-center text-[#25D366] mx-auto mb-2">
            <MessageCircle className="w-6 h-6 fill-current" />
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#7A1F1F]">
            Enter Delivery Details
          </h3>
          <p className="text-xs text-[#3B2618]/75 mt-1">
            Fill your delivery details to confirm your order via WhatsApp.
          </p>
        </div>

        {/* Order Summary Pill */}
        <div className="bg-[#FFF8ED] p-3 rounded-xl border border-[#E8D9C5] mb-5 flex items-center justify-between text-xs font-bold text-[#3B2618]">
          <span>Total Items: {cartItems.reduce((a, b) => a + b.quantity, 0)}</span>
          <span className="text-[#7A1F1F] font-serif text-sm">Total: {formatCurrency(subtotal)}</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-sm font-bold text-[#3B2618] block mb-1">
              Your Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1F1F] text-[#3B2618] ${
                errors.name ? 'border-red-500 bg-red-50/20' : 'border-[#E8D9C5]'
              }`}
            />
            {errors.name && <p className="text-xs text-red-600 font-semibold mt-1">{errors.name}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="text-sm font-bold text-[#3B2618] block mb-1">
              Mobile Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your 10-digit mobile number"
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1F1F] text-[#3B2618] ${
                errors.phone ? 'border-red-500 bg-red-50/20' : 'border-[#E8D9C5]'
              }`}
            />
            {errors.phone && <p className="text-xs text-red-600 font-semibold mt-1">{errors.phone}</p>}
          </div>

          {/* Delivery Address */}
          <div>
            <label className="text-sm font-bold text-[#3B2618] block mb-1">
              Delivery Address <span className="text-red-600">*</span>
            </label>
            <textarea
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              placeholder="House/Flat No., Street Name, Landmark"
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1F1F] text-[#3B2618] ${
                errors.address ? 'border-red-500 bg-red-50/20' : 'border-[#E8D9C5]'
              }`}
            />
            {errors.address && <p className="text-xs text-red-600 font-semibold mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* City */}
            <div>
              <label className="text-sm font-bold text-[#3B2618] block mb-1">
                City <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1F1F] text-[#3B2618] ${
                  errors.city ? 'border-red-500 bg-red-50/20' : 'border-[#E8D9C5]'
                }`}
              />
              {errors.city && <p className="text-xs text-red-600 font-semibold mt-1">{errors.city}</p>}
            </div>

            {/* PIN Code */}
            <div>
              <label className="text-sm font-bold text-[#3B2618] block mb-1">
                PIN Code <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                maxLength="6"
                placeholder="6-digit PIN code"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1F1F] text-[#3B2618] ${
                  errors.pincode ? 'border-red-500 bg-red-50/20' : 'border-[#E8D9C5]'
                }`}
              />
              {errors.pincode && <p className="text-xs text-red-600 font-semibold mt-1">{errors.pincode}</p>}
            </div>
          </div>

          {/* Optional Order Note */}
          <div>
            <label className="text-xs font-bold text-[#3B2618]/80 block mb-1">
              Order Note <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="orderNote"
              value={formData.orderNote}
              onChange={handleChange}
              placeholder="Special instructions (e.g. Extra spicy)"
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#E8D9C5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1F1F] text-[#3B2618]"
            />
          </div>

          {/* Confirm Button */}
          <div className="pt-3 text-center space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{isSubmitting ? 'Preparing your order...' : 'Confirm Order on WhatsApp'}</span>
            </button>
            <p className="text-[11px] text-[#3B2618]/70">
              You will be redirected to WhatsApp to confirm your order.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
