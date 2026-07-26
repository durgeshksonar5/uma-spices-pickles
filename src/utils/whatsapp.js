import { businessConfig } from '../config/businessConfig';
import { formatCurrency } from './currency';

/**
 * Builds an encoded WhatsApp link for an order
 * @param {Array} cartItems 
 * @param {Object} customerDetails 
 * @param {number} totalAmount 
 * @returns {string} wa.me target URL
 */
export const buildWhatsAppOrderUrl = (cartItems, customerDetails, totalAmount) => {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  let message = `Hello, I would like to place an order.\n\n`;
  
  message += `Customer Details\n\n`;
  message += `Name: ${customerDetails.name}\n`;
  message += `Phone: ${customerDetails.phone}\n`;
  message += `Address: ${customerDetails.address}\n`;
  message += `City: ${customerDetails.city}\n`;
  message += `PIN Code: ${customerDetails.pincode}\n\n`;

  message += `Order Details\n\n`;

  cartItems.forEach((item, index) => {
    const itemSubtotal = item.selectedSize.price * item.quantity;
    message += `${index + 1}. ${item.product.name}\n`;
    message += `   Size: ${item.selectedSize.size}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Price: ${formatCurrency(item.selectedSize.price)}\n`;
    message += `   Subtotal: ${formatCurrency(itemSubtotal)}\n\n`;
  });

  message += `Total Items: ${totalItems}\n`;
  message += `Total Amount: ${formatCurrency(totalAmount)}\n\n`;

  if (customerDetails.orderNote && customerDetails.orderNote.trim()) {
    message += `Order Note:\n${customerDetails.orderNote.trim()}\n\n`;
  }

  message += `Please confirm product availability, delivery charges and payment details.`;

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
