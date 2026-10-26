import React, { useState, useEffect } from 'react';
import {
  X, Lock, LogOut, Package, ShoppingCart, Tag, Star, Settings,
  TrendingUp, Clock, CheckCircle, RefreshCw, Plus, Trash2, Edit3, MessageCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api, formatDZD } from '../../api';

export default function AdminDashboard({ onShowToast }) {
  const { isAdminLoggedIn, adminUser, login, logout, isAdminOpen, setIsAdminOpen } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'stats' | 'orders' | 'products' | 'reviews' | 'coupons' | 'settings'

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Data states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [settings, setSettings] = useState({
    store_name: '',
    whatsapp: '',
    instagram: '',
    phone: '',
    delivery_fee: 500,
    about_text: ''
  });

  const [loadingData, setLoadingData] = useState(false);

  // Product modal / edit state
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Coupon form state
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 10,
    minimum_subtotal: 2000,
    usage_limit: 100
  });

  useEffect(() => {
    if (isAdminLoggedIn && isAdminOpen) {
      loadAllAdminData();
    }
  }, [isAdminLoggedIn, isAdminOpen]);

  async function loadAllAdminData() {
    setLoadingData(true);
    try {
      const [sRes, oRes, pRes, cRes, rRes, cpRes, stRes] = await Promise.all([
        api.getAdminStats(),
        api.getOrders(),
        api.getProducts({ all: 'true' }),
        api.getCategories(true),
        api.getReviews({ all: 'true' }),
        api.getCoupons(),
        api.getSettings()
      ]);

      if (sRes.success) setStats(sRes.data);
      if (oRes.success) setOrders(oRes.data);
      if (pRes.success) setProducts(pRes.data);
      if (cRes.success) setCategories(cRes.data);
      if (rRes.success) setReviews(rRes.data);
      if (cpRes.success) setCoupons(cpRes.data);
      if (stRes.success) setSettings(stRes.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingData(false);
    }
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    setLoginLoading(true);

    if (isRegisterMode) {
      try {
        const res = await api.createAdminAccount(username, password);
        if (res.success) {
          setLoginSuccess(res.message);
          // Automatically log in
          const loginRes = await login(username, password);
          if (loginRes.success && onShowToast) onShowToast('تم تسجيل الدخول بنجاح');
        } else {
          setLoginError(res.message || 'تعذر إنشاء الحساب');
        }
      } catch (err) {
        setLoginError('حدث خطأ أثناء إنشاء الحساب');
      } finally {
        setLoginLoading(false);
      }
    } else {
      const res = await login(username, password);
      setLoginLoading(false);
      if (!res.success) {
        setLoginError(res.message);
      } else {
        if (onShowToast) onShowToast(res.message);
      }
    }
  }

  async function handleUpdateOrderStatus(orderId, newStatus) {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (onShowToast) onShowToast(res.message);
      }
    } catch (err) {
      if (onShowToast) onShowToast('تعذر تحديث حالة الطلب');
    }
  }

  async function handleReviewStatus(reviewId, newStatus) {
    try {
      const res = await api.updateReviewStatus(reviewId, newStatus);
      if (res.success) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: newStatus } : r));
        if (onShowToast) onShowToast(res.message);
      }
    } catch (err) {
      if (onShowToast) onShowToast('تعذر تحديث التقييم');
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    try {
      const res = await api.deleteReview(reviewId);
      if (res.success) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        if (onShowToast) onShowToast(res.message);
      }
    } catch (err) {
      if (onShowToast) onShowToast('تعذر حذف التقييم');
    }
  }

  async function handleSaveProduct(e) {
    e.preventDefault();
    try {
      if (editingProduct.id) {
        const res = await api.updateProduct(editingProduct.id, editingProduct);
        if (res.success) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } : p));
          if (onShowToast) onShowToast('تم تحديث المنتج بنجاح');
        }
      } else {
        const res = await api.createProduct(editingProduct);
        if (res.success) {
          setProducts(prev => [res.data, ...prev]);
          if (onShowToast) onShowToast('تمت إضافة المنتج بنجاح');
        }
      }
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (err) {
      if (onShowToast) onShowToast('تعذر حفظ بيانات المنتج');
    }
  }

  async function handleDeleteProduct(productId) {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      const res = await api.deleteProduct(productId);
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        if (onShowToast) onShowToast('تم حذف المنتج بنجاح');
      }
    } catch (err) {
      if (onShowToast) onShowToast('تعذر حذف المنتج');
    }
  }

  async function handleCreateCoupon(e) {
    e.preventDefault();
    try {
      const res = await api.createCoupon(newCoupon);
      if (res.success) {
        setCoupons(prev => [res.data, ...prev]);
        setNewCoupon({ code: '', discount_type: 'percentage', discount_value: 10, minimum_subtotal: 2000, usage_limit: 100 });
        if (onShowToast) onShowToast('تمت إضافة الكوبون بنجاح');
      }
    } catch (err) {
      if (onShowToast) onShowToast('تعذر إنشاء الكوبون');
    }
  }

  async function handleDeleteCoupon(couponId) {
    if (!window.confirm('هل تريد حذف هذا الكوبون؟')) return;
    try {
      const res = await api.deleteCoupon(couponId);
      if (res.success) {
        setCoupons(prev => prev.filter(c => c.id !== couponId));
        if (onShowToast) onShowToast(res.message);
      }
    } catch (err) {
      if (onShowToast) onShowToast('تعذر حذف الكوبون');
    }
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    try {
      const res = await api.updateSettings(settings);
      if (res.success) {
        if (onShowToast) onShowToast(res.message);
      }
    } catch (err) {
      if (onShowToast) onShowToast('تعذر حفظ الإعدادات');
    }
  }

  if (!isAdminOpen) return null;

  return (
    <div className="overlay show" style={{ zIndex: 110 }} onClick={() => setIsAdminOpen(false)}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-box" style={{ maxWidth: '960px', width: '95vw', height: '90vh', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
          
          {/* Dashboard Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '18px 24px',
            borderBottom: '1px solid var(--beige)',
            background: 'var(--chocolate)',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🔐</span>
              <div>
                <h3 style={{ color: '#fff', fontSize: '18px' }}>لوحة تحكم Taste the Joy</h3>
                {isAdminLoggedIn && (
                  <span style={{ fontSize: '12px', color: 'var(--pink)' }}>
                    المسؤول: {adminUser?.username || 'admin'}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isAdminLoggedIn && (
                <>
                  <button
                    onClick={loadAllAdminData}
                    style={{ color: '#fff', padding: '6px' }}
                    title="تحديث البيانات"
                  >
                    <RefreshCw size={18} />
                  </button>
                  <button
                    onClick={logout}
                    className="btn small outline"
                    style={{ borderColor: 'var(--pink)', color: 'var(--pink)' }}
                  >
                    <LogOut size={14} />
                    <span>خروج</span>
                  </button>
                </>
              )}
              <button
                className="close-btn"
                style={{ position: 'static', background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                onClick={() => setIsAdminOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* If NOT logged in: Show Login Form */}
          {!isAdminLoggedIn ? (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
              background: 'var(--cream)'
            }}>
              <form onSubmit={handleAuthSubmit} style={{
                background: '#fff',
                padding: '32px 28px',
                borderRadius: '20px',
                maxWidth: '420px',
                width: '100%',
                boxShadow: 'var(--shadow)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--pink)',
                    color: 'var(--chocolate)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px'
                  }}>
                    <Lock size={26} />
                  </div>
                  <h3>{isRegisterMode ? 'إنشاء حساب مسؤول جديد' : 'تسجيل دخول الإدارة'}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
                    {isRegisterMode 
                      ? 'إنشاء حساب فوري بدون الحاجة لرسالة تحقق في الإيميل 🚀'
                      : 'أدخل اسم المستخدم وكلمة المرور للوصول للوحة التحكم'}
                  </p>
                </div>

                {loginSuccess && (
                  <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
                    {loginSuccess}
                  </div>
                )}

                {loginError && (
                  <div style={{ background: '#fde8e8', color: '#c81e1e', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
                    {loginError}
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>البريد الإلكتروني أو اسم المستخدم (Email / Username):</label>
                  <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="مثال: admin@tastethejoy.com أو admin"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>كلمة المرور (Password):</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="اكتب كلمة مرور قوية"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn"
                  disabled={loginLoading}
                  style={{ width: '100%', padding: '12px', marginTop: '6px' }}
                >
                  {loginLoading 
                    ? 'جاري المعالجة...' 
                    : isRegisterMode ? 'إنشاء الحساب ودخول اللوحة 🤎' : 'دخول للوحة التحكم 🤎'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(!isRegisterMode);
                      setLoginError('');
                      setLoginSuccess('');
                    }}
                    style={{ fontSize: '13px', color: 'var(--chocolate)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    {isRegisterMode ? 'لديك حساب بالفعل؟ تسجيل الدخول' : '+ إنشاء حساب مسؤول جديد بلا إيميل'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Logged in Dashboard Layout */
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* Sidebar Tabs */}
              <div style={{
                width: '200px',
                background: 'var(--off-white)',
                borderLeft: '1px solid var(--beige)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '16px 10px'
              }}>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`pill ${activeTab === 'stats' ? 'active' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: '12px' }}
                >
                  <TrendingUp size={16} />
                  <span>الإحصائيات</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`pill ${activeTab === 'orders' ? 'active' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: '12px' }}
                >
                  <ShoppingCart size={16} />
                  <span>الطلبات ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`pill ${activeTab === 'products' ? 'active' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: '12px' }}
                >
                  <Package size={16} />
                  <span>المنتجات ({products.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pill ${activeTab === 'reviews' ? 'active' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: '12px' }}
                >
                  <Star size={16} />
                  <span>التقييمات ({reviews.filter(r => r.status === 'pending').length} معلقة)</span>
                </button>

                <button
                  onClick={() => setActiveTab('coupons')}
                  className={`pill ${activeTab === 'coupons' ? 'active' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: '12px' }}
                >
                  <Tag size={16} />
                  <span>الكوبونات ({coupons.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`pill ${activeTab === 'settings' ? 'active' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: '12px' }}
                >
                  <Settings size={16} />
                  <span>إعدادات المتجر</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--cream)' }}>
                {/* 1. STATS TAB */}
                {activeTab === 'stats' && stats && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '16px'
                    }}>
                      <div style={{ background: '#fff', padding: '20px', borderRadius: '18px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>إجمالي المبيعات</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--chocolate)', marginTop: '6px' }}>
                          {formatDZD(stats.total_revenue)}
                        </div>
                      </div>
                      <div style={{ background: '#fff', padding: '20px', borderRadius: '18px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>إجمالي الطلبات</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--chocolate)', marginTop: '6px' }}>
                          {stats.total_orders}
                        </div>
                      </div>
                      <div style={{ background: '#fff', padding: '20px', borderRadius: '18px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ fontSize: '13px', color: '#c0392b', fontWeight: 600 }}>طلبات جديدة تحتاج مراجعة</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#c0392b', marginTop: '6px' }}>
                          {stats.new_orders}
                        </div>
                      </div>
                      <div style={{ background: '#fff', padding: '20px', borderRadius: '18px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>تقييمات بانتظار الموافقة</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#f39c12', marginTop: '6px' }}>
                          {stats.pending_reviews}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '18px' }}>إدارة الطلبات الواردة</h3>
                      <span style={{ fontSize: '13px', color: 'var(--muted)' }}>العدد الإجمالي: {orders.length}</span>
                    </div>

                    {orders.length === 0 ? (
                      <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', textAlign: 'center', color: 'var(--muted)' }}>
                        لا توجد طلبات بعد.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {orders.map(order => (
                          <div
                            key={order.id}
                            style={{
                              background: '#fff',
                              borderRadius: '16px',
                              padding: '18px',
                              boxShadow: 'var(--shadow-sm)',
                              border: order.status === 'new' ? '2px solid var(--pistachio)' : '1px solid var(--beige)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                              <div>
                                <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--chocolate)' }}>
                                  طلب #{order.order_number}
                                </span>
                                <span style={{ marginRight: '10px', fontSize: '13px', color: 'var(--muted)' }}>
                                  {new Date(order.created_at).toLocaleString('ar-DZ')}
                                </span>
                              </div>

                              {/* Status Selector */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 700 }}>الحالة:</label>
                                <select
                                  value={order.status}
                                  onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                                  style={{ width: 'auto', padding: '6px 12px', fontSize: '13px', fontWeight: 700 }}
                                >
                                  <option value="new">جديد (New)</option>
                                  <option value="reviewing">قيد المراجعة</option>
                                  <option value="preparing">قيد التحضير</option>
                                  <option value="ready">جاهز للاستلام/التوصيل</option>
                                  <option value="completed">مكتمل وتم التسليم</option>
                                  <option value="cancelled">ملغي</option>
                                </select>
                              </div>
                            </div>

                            {/* Customer & Items breakdown */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--beige)', fontSize: '13px' }}>
                              <div>
                                <div><b>العميل:</b> {order.customer_name}</div>
                                <div><b>الهاتف:</b> {order.phone}</div>
                                <div><b>طريقة الاستلام:</b> {order.fulfillment_type === 'delivery' ? `توصيل (${order.wilaya} - ${order.address})` : 'استلام من المحل'}</div>
                                {order.notes && <div style={{ color: '#b33939' }}><b>ملاحظات:</b> {order.notes}</div>}
                              </div>

                              <div>
                                <div style={{ fontWeight: 700, marginBottom: '4px' }}>المنتجات المطلوبة:</div>
                                {order.items?.map((it, idx) => (
                                  <div key={idx} style={{ color: 'var(--muted)' }}>
                                    • {it.product_name?.ar || it.product_name} × {it.quantity} ({formatDZD(it.line_total)})
                                  </div>
                                ))}
                                <div style={{ fontWeight: 800, color: 'var(--chocolate)', marginTop: '6px', fontSize: '15px' }}>
                                  المجموع: {formatDZD(order.total)}
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <a
                                  href={`https://wa.me/213${order.phone.replace(/^0/, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn small"
                                  style={{ background: '#25D366', color: '#fff' }}
                                >
                                  <MessageCircle size={14} />
                                  <span>مراسلة الزبون</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PRODUCTS TAB */}
                {activeTab === 'products' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '18px' }}>إدارة المنتجات</h3>
                      <button
                        className="btn small"
                        onClick={() => {
                          setEditingProduct({
                            name: { ar: '', en: '' },
                            description: { ar: '', en: '' },
                            base_price: 1500,
                            category_id: categories[0]?.id || null,
                            images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'],
                            is_available: true,
                            is_featured: false,
                            badge: null,
                            occasion: 'special'
                          });
                          setShowProductModal(true);
                        }}
                      >
                        <Plus size={15} />
                        <span>إضافة منتج جديد</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {products.map(p => {
                        const name = p.name?.ar || p.name;
                        const img = p.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200&auto=format&fit=crop';
                        return (
                          <div
                            key={p.id}
                            style={{
                              background: '#fff',
                              borderRadius: '14px',
                              padding: '12px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              boxShadow: 'var(--shadow-sm)'
                            }}
                          >
                            <img src={img} alt="" style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--chocolate)' }}>{name}</div>
                              <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                                {formatDZD(p.base_price)} • {p.is_available ? '✅ متوفر' : '❌ غير متوفر'} {p.badge ? `• [${p.badge}]` : ''}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                className="btn small outline"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setShowProductModal(true);
                                }}
                              >
                                <Edit3 size={14} />
                                <span>تعديل</span>
                              </button>
                              <button
                                className="btn small"
                                style={{ background: '#c0392b' }}
                                onClick={() => handleDeleteProduct(p.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. REVIEWS MODERATION TAB */}
                {activeTab === 'reviews' && (
                  <div>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>مراجعة تقييمات الزبائن</h3>
                    {reviews.length === 0 ? (
                      <div style={{ background: '#fff', padding: '24px', borderRadius: '14px', textAlign: 'center' }}>
                        لا توجد تقييمات حاليًا.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {reviews.map(r => (
                          <div
                            key={r.id}
                            style={{
                              background: '#fff',
                              borderRadius: '14px',
                              padding: '14px 18px',
                              border: r.status === 'pending' ? '2px solid #f39c12' : '1px solid var(--beige)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '12px'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 700 }}>{r.author_name}</span>
                                <span>{'⭐'.repeat(r.rating)}</span>
                                <span style={{
                                  fontSize: '11px',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: r.status === 'approved' ? '#e8f5e9' : r.status === 'pending' ? '#fff8e1' : '#ffebee',
                                  color: r.status === 'approved' ? '#2e7d32' : r.status === 'pending' ? '#f57f17' : '#c62828',
                                  fontWeight: 700
                                }}>
                                  {r.status === 'approved' ? 'مقبول' : r.status === 'pending' ? 'بانتظار الموافقة' : 'مرفوض'}
                                </span>
                              </div>
                              <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
                                "{r.comment}"
                              </p>
                            </div>

                            <div style={{ display: 'flex', gap: '6px' }}>
                              {r.status !== 'approved' && (
                                <button
                                  className="btn small"
                                  style={{ background: 'var(--pistachio)' }}
                                  onClick={() => handleReviewStatus(r.id, 'approved')}
                                >
                                  قبول ونشر
                                </button>
                              )}
                              {r.status !== 'rejected' && (
                                <button
                                  className="btn small outline"
                                  onClick={() => handleReviewStatus(r.id, 'rejected')}
                                >
                                  رفض
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteReview(r.id)}
                                style={{ color: '#c0392b', padding: '6px' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. COUPONS TAB */}
                {activeTab === 'coupons' && (
                  <div>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>إدارة كوبونات الخصم</h3>

                    {/* New Coupon Form */}
                    <form onSubmit={handleCreateCoupon} style={{
                      background: '#fff',
                      padding: '16px',
                      borderRadius: '16px',
                      marginBottom: '20px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '10px',
                      alignItems: 'end'
                    }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700 }}>كود الكوبون:</label>
                        <input
                          placeholder="مثال: JOY20"
                          value={newCoupon.code}
                          onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700 }}>نوع الخصم:</label>
                        <select
                          value={newCoupon.discount_type}
                          onChange={e => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
                        >
                          <option value="percentage">نسبة مئوية (%)</option>
                          <option value="fixed">مبلغ ثابت (دج)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700 }}>القيمة:</label>
                        <input
                          type="number"
                          value={newCoupon.discount_value}
                          onChange={e => setNewCoupon({ ...newCoupon, discount_value: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700 }}>الحد الأدنى للطلب (دج):</label>
                        <input
                          type="number"
                          value={newCoupon.minimum_subtotal}
                          onChange={e => setNewCoupon({ ...newCoupon, minimum_subtotal: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="btn small" style={{ height: '42px' }}>
                        + إضافة الكوبون
                      </button>
                    </form>

                    {/* List coupons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {coupons.map(cp => (
                        <div
                          key={cp.id}
                          style={{
                            background: '#fff',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--chocolate)' }}>
                              {cp.code}
                            </span>
                            <span style={{ marginRight: '10px', fontSize: '13px', color: 'var(--muted)' }}>
                              خصم {cp.discount_value} {cp.discount_type === 'percentage' ? '%' : 'دج'} • الحد الأدنى: {cp.minimum_subtotal} دج • مستخدم: {cp.used_count || 0} مرات
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteCoupon(cp.id)}
                            style={{ color: '#c0392b', padding: '6px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <form onSubmit={handleSaveSettings} style={{
                    background: '#fff',
                    padding: '24px',
                    borderRadius: '18px',
                    maxWidth: '560px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>إعدادات المتجر والتواصل</h3>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>اسم المتجر:</label>
                      <input
                        value={settings.store_name}
                        onChange={e => setSettings({ ...settings, store_name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>رقم WhatsApp (بدون + وبدون مسافات):</label>
                      <input
                        value={settings.whatsapp}
                        onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                        placeholder="213555000000"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>حساب Instagram:</label>
                      <input
                        value={settings.instagram}
                        onChange={e => setSettings({ ...settings, instagram: e.target.value })}
                        placeholder="taste.the.joy"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>تكلفة التوصيل الافتراضية (دج):</label>
                      <input
                        type="number"
                        value={settings.delivery_fee}
                        onChange={e => setSettings({ ...settings, delivery_fee: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>نص 'من نحن' في الصفحة الرئيسية:</label>
                      <textarea
                        rows="3"
                        value={settings.about_text}
                        onChange={e => setSettings({ ...settings, about_text: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn small" style={{ width: 'fit-content', padding: '12px 24px' }}>
                      حفظ إعدادات المتجر 🤎
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit / Add Product Sub-modal */}
      {showProductModal && editingProduct && (
        <div className="overlay show" style={{ zIndex: 130 }} onClick={() => setShowProductModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-box" style={{ maxWidth: '520px' }}>
              <button className="close-btn" onClick={() => setShowProductModal(false)}>
                <X size={18} />
              </button>
              <h3 style={{ marginBottom: '16px' }}>{editingProduct.id ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
              
              <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>اسم المنتج (بالعربية):</label>
                  <input
                    value={editingProduct.name?.ar || editingProduct.name || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, ar: e.target.value } })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>السعر الأساسي (دج):</label>
                  <input
                    type="number"
                    value={editingProduct.base_price || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, base_price: Number(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>القسم:</label>
                  <select
                    value={editingProduct.category_id || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name?.ar || cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>رابط الصورة:</label>
                  <input
                    value={editingProduct.images?.[0] || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>شارة المنتج (Badge):</label>
                  <select
                    value={editingProduct.badge || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value || null })}
                  >
                    <option value="">بدون شارة</option>
                    <option value="best">الأكثر طلبًا (Best Seller)</option>
                    <option value="new">وصل حديثًا (New)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>الوصف:</label>
                  <textarea
                    rows="2"
                    value={editingProduct.description?.ar || editingProduct.description || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, ar: e.target.value } })}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={editingProduct.is_available !== false}
                    onChange={e => setEditingProduct({ ...editingProduct, is_available: e.target.checked })}
                    style={{ width: 'auto' }}
                  />
                  <label style={{ fontSize: '13px', fontWeight: 700 }}>المنتج متوفر للطلب</label>
                </div>

                <button type="submit" className="btn small" style={{ marginTop: '10px' }}>
                  حفظ التغييرات
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
