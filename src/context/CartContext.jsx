import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

const CART_STORAGE_KEY = 'gajanan_spices_cart_v1';
const WISHLIST_STORAGE_KEY = 'gajanan_spices_wishlist_v1';

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist]);

  // Add to cart
  const addToCart = (product, selectedSize = null, quantity = 1, showToast = true) => {
    // If no size selected, default to first available size
    const sizeObj = selectedSize || (product.availableSizes && product.availableSizes[0]) || { size: 'Pack', price: product.price };

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedSize.size === sizeObj.size
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            cartId: `${product.id}-${sizeObj.size}`,
            product,
            selectedSize: sizeObj,
            quantity
          }
        ];
      }
    });

    if (showToast) {
      addToast(`Added ${product.name} (${sizeObj.size}) to cart!`, 'success');
    }
  };

  // Remove from cart
  const removeFromCart = (cartId) => {
    setCartItems((prev) => {
      const itemToRemove = prev.find((item) => item.cartId === cartId);
      if (itemToRemove && addToast) {
        addToast(`Removed ${itemToRemove.product.name} from cart`, 'info');
      }
      return prev.filter((item) => item.cartId !== cartId);
    });
  };

  // Update quantity (min 1)
  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Wishlist toggle
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('Added to wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Totals calculations
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.selectedSize.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
