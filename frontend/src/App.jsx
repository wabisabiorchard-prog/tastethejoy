import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import BrownieCustomizer from './components/BrownieCustomizer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import FavoritesDrawer from './components/FavoritesDrawer';
import ReviewsSection from './components/ReviewsSection';
import AdminDashboard from './components/admin/AdminDashboard';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { api, formatDZD } from './api';
import { Search, Sparkles, MessageCircle, ShoppingBag } from 'lucide-react';

const OCCASIONS = [
  { id: 'all', label: 'جميع المناسبات' },
  { id: 'birthday', label: '🎂 أعياد الميلاد' },
  { id: 'grad', label: '🎓 النجاح والتخرج' },
  { id: 'valentine', label: "❤️ Valentine's Day" },
  { id: 'party', label: '🎉 الحفلات والجمعات' },
  { id: 'gift', label: '🎁 الهدايا' },
  { id: 'special', label: '✨ مناسبات خاصة' }
];

function MainStoreContent() {
  const { totalCount, total, setIsCartOpen } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOccasion, setActiveOccasion] = useState('all');

  // Modal states
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

  // Filter products based on search, category, and occasion
  const filteredProducts = products.filter(p => {
    const pName = (p.name?.ar || p.name || '').toLowerCase();
    const pDesc = (p.description?.ar || p.description || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = !query || pName.includes(query) || pDesc.includes(query);
    const matchesCat = activeCategory === 'all' || p.category_slug === activeCategory || p.category_id === activeCategory;
    const matchesOcc = activeOccasion === 'all' || p.occasion === activeOccasion;

    return matchesSearch && matchesCat && matchesOcc;
  });

  const bestSellers = products.filter(p => p.badge === 'best');
  const newArrivals = products.filter(p => p.badge === 'new');

  const cheesecakes = filteredProducts.filter(p => p.category_slug === 'cheesecake');
  const cakes = filteredProducts.filter(p => p.category_slug === 'cakes');
  const crunchies = filteredProducts.filter(p => p.category_slug === 'crunchy');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar onOpenTracker={() => setIsTrackerOpen(true)} />

      {/* Hero Section */}
      <Hero />

      {/* Search & Category Filter Section */}
      <section className="wrap" style={{ paddingTop: '10px', paddingBottom: '30px' }}>
        {/* Search input */}
        <div style={{
          position: 'relative',
          maxWidth: '600px',
          margin: '0 auto 20px'
        }}>
          <input
            type="text"
            placeholder="🔍 ابحثي عن نوع تشيز كيك، كيكة، أو طعم مفضل..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '14px 20px 14px 44px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--off-white)',
              fontSize: '15px',
              border: '1px solid var(--beige)',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--muted)',
                fontWeight: 700
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          <button
            className={`pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            جميع الحلويات
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`pill ${activeCategory === cat.slug ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.slug)}
            >
              {cat.name?.ar || cat.name}
            </button>
          ))}
        </div>

        {/* Occasions Row */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          padding: '16px 4px 6px',
          scrollbarWidth: 'none'
        }}>
          {OCCASIONS.map(occ => (
            <button
              key={occ.id}
              className={`pill ${activeOccasion === occ.id ? 'active' : ''}`}
              style={{ whiteSpace: 'nowrap', fontSize: '13px' }}
              onClick={() => setActiveOccasion(occ.id)}
            >
              {occ.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured / Best Sellers (if no search filter applied) */}
      {!searchQuery && activeCategory === 'all' && activeOccasion === 'all' && bestSellers.length > 0 && (
        <section className="wrap" style={{ padding: '20px 20px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <h2>الأكثر طلبًا 🔥</h2>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>الحلويات الأكثر حبًا لدى زبائننا</span>
          </div>
          <div className="product-grid">
            {bestSellers.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenModal={setSelectedProduct}
                onShowToast={showToast}
              />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals (if no search filter applied) */}
      {!searchQuery && activeCategory === 'all' && activeOccasion === 'all' && newArrivals.length > 0 && (
        <section className="wrap" style={{ padding: '20px 20px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <h2>وصل حديثًا ✨</h2>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>إبداعات جديدة طازجة</span>
          </div>
          <div className="product-grid">
            {newArrivals.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenModal={setSelectedProduct}
                onShowToast={showToast}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Categories Sections */}
      {/* 1. Cheesecake Section */}
      <section id="cheesecake" className="wrap" style={{ padding: '30px 20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
          <h2>🍰 Cheesecake</h2>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>وش راكم تستناو؟</span>
        </div>
        {cheesecakes.length > 0 ? (
          <div className="product-grid">
            {cheesecakes.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenModal={setSelectedProduct}
                onShowToast={showToast}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>لا توجد منتجات مطابقة لهذا القسم حاليًا.</p>
        )}
      </section>

      {/* 2. Cakes Section */}
      <section id="cakes" className="wrap" style={{ padding: '30px 20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
          <h2>🎂 Cakes</h2>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>لكل المناسبات والاحتفالات السعيدة</span>
        </div>
        {cakes.length > 0 ? (
          <div className="product-grid">
            {cakes.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenModal={setSelectedProduct}
                onShowToast={showToast}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>لا توجد منتجات مطابقة لهذا القسم حاليًا.</p>
        )}
      </section>

      {/* 3. Crunchy Section */}
      <section id="crunchy" className="wrap" style={{ padding: '30px 20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
          <h2>🍫 Crunchy Cake</h2>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>سحر القرمشة مع الشوكولاتة</span>
        </div>
        {crunchies.length > 0 ? (
          <div className="product-grid">
            {crunchies.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenModal={setSelectedProduct}
                onShowToast={showToast}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>لا توجد منتجات مطابقة لهذا القسم حاليًا.</p>
        )}
      </section>

      {/* Interactive Brownie Box Customizer */}
      <BrownieCustomizer onShowToast={showToast} />

      {/* About Us Section */}
      <section id="about" className="wrap" style={{ padding: '40px 20px' }}>
        <div style={{
          background: 'var(--off-white)',
          borderRadius: '26px',
          padding: '36px 30px',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--beige)',
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '32px' }}>🤎</span>
          <h2 style={{ fontSize: '26px', color: 'var(--chocolate)', margin: '12px 0' }}>
            من نحن؟ 🤎
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6b5645',
            lineHeight: 1.9,
            maxWidth: '680px',
            margin: '0 auto'
          }}>
            {settings?.about_text || 'قصة Taste the Joy تبدأ من شغف بسيط بالحلويات الراقية، لنقدم لكم تشكيلة متميزة من Cheesecake وكيكات وBrownies Box محضّرة بأجود المكونات وبكل حب، باش كل مناسبة عندكم تكون أحلى.'}
          </p>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <ReviewsSection
        reviews={reviews}
        products={products}
        onReviewSubmitted={loadStoreData}
        onShowToast={showToast}
      />

      {/* Floating Bottom Quick Actions */}
      {totalCount > 0 && (
        <button
          className="float-cart-btn"
          onClick={() => setIsCartOpen(true)}
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

      {/* Footer */}
      <Footer settings={settings} />

      {/* Modals & Drawers */}
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
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <MainStoreContent />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
