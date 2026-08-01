import { businessConfig } from '../config/businessConfig';
import { formatCurrency } from './currency';

/**
 * Builds an encoded WhatsApp link for an order
 * @param {Array} cartItems 
 * @param {Object} customerDetails 
 * @param {number} totalAmount 
 * @returns {string} wa.me target URL
 */
export const buildWhatsAppOrderUrl = (cartItems = [], customerDetails = {}, totalAmount = 0) => {
  const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  let message = `Hello ${businessConfig.brandName},\n\nI would like to place an order:\n\n`;

  if (customerDetails && (customerDetails.name || customerDetails.phone || customerDetails.address)) {
    message += `Customer Details:\n`;
    if (customerDetails.name) message += `Name: ${customerDetails.name}\n`;
    if (customerDetails.phone) message += `Phone: ${customerDetails.phone}\n`;
    if (customerDetails.address) message += `Address: ${customerDetails.address}\n`;
    if (customerDetails.city) message += `City: ${customerDetails.city}\n`;
    if (customerDetails.pincode) message += `PIN Code: ${customerDetails.pincode}\n\n`;
  }

  message += `Order Items:\n`;
  cartItems.forEach((item, index) => {
    const pName = item.product?.name || item.name || 'Product';
    const sSize = item.selectedSize?.size ? ` (${item.selectedSize.size})` : '';
    const sPrice = item.selectedSize?.price || item.price || item.basePrice || 0;
    const qty = item.quantity || 1;
    const itemSubtotal = sPrice * qty;

    message += `${index + 1}. ${pName}${sSize} x ${qty} - ${formatCurrency(itemSubtotal)}\n`;
  });

  const finalTotal = totalAmount || cartItems.reduce((acc, item) => {
    const sPrice = item.selectedSize?.price || item.price || item.basePrice || 0;
    return acc + sPrice * (item.quantity || 1);
  }, 0);

  message += `\nTotal Items: ${totalItems}\n`;
  message += `Total Amount: ${formatCurrency(finalTotal)}\n\n`;

  if (customerDetails && customerDetails.orderNote && customerDetails.orderNote.trim()) {
    message += `Order Note: ${customerDetails.orderNote.trim()}\n\n`;
  }

  message += `Please confirm my order, total price, and delivery details. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  const cleanNumber = businessConfig.whatsAppNumber.replace(/\D/g, '');

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};

/**
 * Builds a direct general inquiry WhatsApp link
 * @param {string} subject 
 * @param {Object} details 
 * @returns {string} wa.me URL
 */
export const buildWhatsAppInquiryUrl = (subject = "Product Inquiry", details = {}) => {
  let message = `Hello ${businessConfig.brandName},\n\nI have an inquiry regarding: ${subject}\n\n`;
  if (details.name) message += `Name: ${details.name}\n`;
  if (details.phone) message += `Phone: ${details.phone}\n`;
  if (details.message) message += `Message: ${details.message}\n\n`;
  message += `Please guide me with details. Thank you!`;

  const cleanNumber = businessConfig.whatsAppNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};
