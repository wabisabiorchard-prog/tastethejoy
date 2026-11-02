import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ReviewsPage from './pages/ReviewsPage';
import AdminPage from './pages/AdminPage';

import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import FavoritesDrawer from './components/FavoritesDrawer';
import AdminDashboard from './components/admin/AdminDashboard';
import Toast from './components/Toast';

import { api, formatDZD } from './api';
import { ShoppingBag, MessageCircle } from 'lucide-react';

function AppLayout() {
  const { totalCount, total, setIsCartOpen } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  function showToast(msg) {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  }

  useEffect(() => {
    loadStoreData();
  }, []);

  async function loadStoreData() {
    setLoading(true);
    try {
      const [pRes, cRes, rRes, sRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getReviews(),
        api.getSettings()
      ]);

      if (pRes.success) setProducts(pRes.data);
      if (cRes.success) setCategories(cRes.data);
      if (rRes.success) setReviews(rRes.data);
      if (sRes.success) setSettings(sRes.data);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />

      {/* Global Navbar */}
      <Navbar onOpenTracker={() => setIsTrackerOpen(true)} />

      {/* Main Pages Content via Router */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                products={products}
                categories={categories}
                reviews={reviews}
                settings={settings}
                onOpenModal={setSelectedProduct}
                onShowToast={showToast}
              />
            }
          />

          <Route
            path="/products"
            element={
              <ProductsPage
                products={products}
                categories={categories}
                onOpenModal={setSelectedProduct}
                onShowToast={showToast}
              />
            }
          />

          <Route
            path="/about"
            element={<AboutPage settings={settings} />}
          />

          <Route
            path="/contact"
            element={
              <ContactPage
                settings={settings}
                onShowToast={showToast}
              />
            }
          />

          <Route
            path="/reviews"
            element={
              <ReviewsPage
                reviews={reviews}
                products={products}
                onReviewSubmitted={loadStoreData}
                onShowToast={showToast}
              />
            }
          />

          <Route
            path="/tastethejoyadmin"
            element={<AdminPage onShowToast={showToast} />}
          />
          <Route
            path="/admin"
            element={<AdminPage onShowToast={showToast} />}
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Floating Bottom Quick Actions */}
      {totalCount > 0 && (
        <button
          className="float-cart-btn"
          onClick={() => setIsCartOpen(true)}
          title="عرض السلة وإتمام الطلب"
        >
          <ShoppingBag size={18} />
          <span>{totalCount} منتجات — {formatDZD(total)}</span>
        </button>
      )}

      {/* Floating WhatsApp Quick Contact Button */}
      <a
        href={`https://wa.me/${settings?.whatsapp || '213555000000'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float-btn"
        title="تواصل معنا عبر WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Global Footer */}
      <Footer settings={settings} />

      {/* Global Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onShowToast={showToast}
        allProducts={products}
        onSelectProduct={setSelectedProduct}
      />

      <CartDrawer />

      <CheckoutModal
        onOrderSuccess={(order) => {
          setCompletedOrder(order);
        }}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      <FavoritesDrawer
        products={products}
        onOpenProductModal={setSelectedProduct}
      />

      <AdminDashboard onShowToast={showToast} />

      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <AppLayout />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
