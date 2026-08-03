import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { GalleryProvider } from './context/GalleryContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { WhatsAppFloatingButton } from './components/layout/WhatsAppFloatingButton';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastContainer } from './components/common/Toast';
import { ProductGridSkeleton } from './components/common/LoadingSkeleton';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Cart = lazy(() => import('./pages/Cart'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProductsList = lazy(() => import('./pages/admin/AdminProductsList'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const AdminHeroSettings = lazy(() => import('./pages/admin/AdminHeroSettings'));
const AdminFestiveDealSettings = lazy(() => import('./pages/admin/AdminFestiveDealSettings'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AddCategory = lazy(() => import('./pages/admin/AddCategory'));

export const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <GalleryProvider>
            <Router>
              <ScrollToTop />
              <Suspense
                fallback={
                  <div className="max-w-7xl mx-auto px-4 py-16">
                    <ProductGridSkeleton count={8} />
                  </div>
                }
              >
                <Routes>
                  {/* Admin Unprotected Login */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Admin Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/products" element={<AdminProductsList />} />
                      <Route path="/admin/products/add" element={<ProductForm />} />
                      <Route path="/admin/products/edit/:id" element={<ProductForm />} />
                      <Route path="/admin/categories/add" element={<AddCategory />} />
                      <Route path="/admin/hero-banner" element={<AdminHeroSettings />} />
                      <Route path="/admin/festive-deal" element={<AdminFestiveDealSettings />} />
                      <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                      <Route path="/admin/gallery" element={<AdminGallery />} />
                    </Route>
                  </Route>

                  {/* Public Website Routes */}
                  <Route
                    path="*"
                    element={
                      <div className="flex flex-col min-h-screen bg-[#FFFBF5] text-[#3B2618]">
                        <Header />

                        <main className="flex-grow">
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/product/:slug" element={<ProductDetails />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/gallery" element={<Gallery />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>

                        <Footer />
                        <CartDrawer />
                        <WhatsAppFloatingButton />
                      </div>
                    }
                  />
                </Routes>
              </Suspense>

              <ToastContainer />
            </Router>
          </GalleryProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
