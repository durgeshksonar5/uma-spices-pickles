import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { WhatsAppFloatingButton } from './components/layout/WhatsAppFloatingButton';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastContainer } from './components/common/Toast';
import { ProductGridSkeleton } from './components/common/LoadingSkeleton';

// Lazy loading pages for optimal performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Cart = lazy(() => import('./pages/Cart'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const App = () => {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[#FFF8ED] text-[#3B2618]">
            <ScrollToTop />
            <Header />

            <main className="flex-grow">
              <Suspense
                fallback={
                  <div className="max-w-7xl mx-auto px-4 py-16">
                    <ProductGridSkeleton count={8} />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetails />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
            <CartDrawer />
            <WhatsAppFloatingButton />
            <ToastContainer />
          </div>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
};

export default App;
