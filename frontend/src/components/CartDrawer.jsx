import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Tag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatDZD } from '../api';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQty,
    removeFromCart,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  async function handleApplyCoupon(e) {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponCode);
    setIsApplyingCoupon(false);
  }

  function handleProceedToCheckout() {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }

  return (
    <>
      <div
        className={`overlay ${isCartOpen ? 'show' : ''}`}
        onClick={() => setIsCartOpen(false)}
      />
      <div className={`drawer ${isCartOpen ? 'show' : ''}`}>
        {/* Drawer Header */}
        <div className="drawer-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--chocolate)" />
            <h3 style={{ fontSize: '18px' }}>سلة المشتريات</h3>
            <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
              ({cart.reduce((s, i) => s + i.quantity, 0)} منتجات)
            </span>
          </div>
          <button className="close-btn" style={{ position: 'static' }} onClick={() => setIsCartOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '12px',
              color: 'var(--muted)',
              textAlign: 'center',
              padding: '40px 0'
            }}>
              <span style={{ fontSize: '48px' }}>🧁</span>
              <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--chocolate)' }}>
                سلتك فارغة حاليًا 🤎
              </div>
              <p style={{ fontSize: '14px', maxWidth: '240px' }}>
                اكتشفي حلوياتنا وكيكاتنا المميزة وشاركي الفرحة مع من تحبين.
              </p>
              <button
                className="btn small"
                style={{ marginTop: '10px' }}
                onClick={() => setIsCartOpen(false)}
              >
                تصفح الحلويات 🍰
              </button>
            </div>
          ) : (
            cart.map(item => {
              const name = item.name?.ar || item.name;
              return (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    background: 'var(--cream)',
                    borderRadius: '16px',
                    padding: '12px',
                    border: '1px solid var(--beige)'
                  }}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200&auto=format&fit=crop'}
                    alt={name}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '12px',
                      objectFit: 'cover'
                    }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--chocolate)' }}>
                        {name}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        style={{ color: '#b33939', padding: '2px' }}
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Options snapshots */}
                    {Array.isArray(item.options_snapshot) && item.options_snapshot.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '2px 0' }}>
                        {item.options_snapshot.map((opt, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '11px',
                              background: '#fff',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              color: 'var(--muted)'
                            }}
                          >
                            {opt.value_name || opt.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.options_snapshot && !Array.isArray(item.options_snapshot) && item.options_snapshot.flavor && (
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        {item.options_snapshot.pieces} حبات • {item.options_snapshot.flavor}
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: '6px'
                    }}>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--chocolate)' }}>
                        {formatDZD(item.price * item.quantity)}
                      </div>

                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#fff',
                        borderRadius: 'var(--radius-full)',
                        padding: '2px 8px',
                        border: '1px solid var(--beige)'
                      }}>
                        <button
                          onClick={() => updateQty(item.key, -1)}
                          style={{ color: 'var(--chocolate)' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: '13px', minWidth: '18px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.key, 1)}
                          style={{ color: 'var(--chocolate)' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Coupon Code Input */}
          {cart.length > 0 && (
            <div style={{ marginTop: '10px', background: 'var(--cream)', padding: '12px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--chocolate)' }}>
                <Tag size={15} />
                <span>كوبون الخصم:</span>
              </div>

              {appliedCoupon ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#e8f5e9',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #a5d6a7'
                }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#2e7d32', fontSize: '13px' }}>
                      {appliedCoupon.code}
                    </span>
                    <span style={{ fontSize: '12px', color: '#1b5e20', marginRight: '6px' }}>
                      (خصم {appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}%` : `${appliedCoupon.discount_value} دج`})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ fontSize: '12px', color: '#c62828', fontWeight: 700 }}
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '6px' }}>
                  <input
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="رمز الكوبون (مثل JOY10)"
                    style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
                  />
                  <button
                    type="submit"
                    className="btn small"
                    disabled={isApplyingCoupon}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    تطبيق
                  </button>
                </form>
              )}

              {couponError && (
                <div style={{ color: '#c0392b', fontSize: '12px', marginTop: '6px', fontWeight: 600 }}>
                  {couponError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="drawer-foot">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                <span>المجموع الفرعي</span>
                <span>{formatDZD(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#27ae60', fontWeight: 700 }}>
                  <span>قيمة الخصم</span>
                  <span>-{formatDZD(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                <span>سعر التوصيل المقدر</span>
                <span>{formatDZD(deliveryFee)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: '18px',
                color: 'var(--chocolate)',
                paddingTop: '8px',
                borderTop: '1px dashed var(--beige)'
              }}>
                <span>الإجمالي</span>
                <span>{formatDZD(total)}</span>
              </div>
            </div>

            <button
              className="btn"
              style={{ width: '100%', padding: '14px' }}
              onClick={handleProceedToCheckout}
            >
              <span>متابعة إتمام الطلب</span>
              <ArrowLeft size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
