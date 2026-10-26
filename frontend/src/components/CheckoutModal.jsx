import React, { useState } from 'react';
import { X, Truck, Store, Calendar, Phone, User, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api, formatDZD } from '../api';

const ALGERIAN_WILAYAS = [
  '01 - أدرار', '02 - الشلف', '03 - الأغواط', '04 - أم البواقي', '05 - باتنة',
  '06 - بجاية', '07 - بسكرة', '08 - بشار', '09 - البليدة', '10 - البويرة',
  '11 - تمنراست', '12 - تبسة', '13 - تلمسان', '14 - تيارت', '15 - تيزي وزو',
  '16 - الجزائر العاصمة', '17 - الجلفة', '18 - جيجل', '19 - سطيف', '20 - سعيدة',
  '21 - سكيكدة', '22 - سيدي بلعباس', '23 - عنابة', '24 - قالمة', '25 - قسنطينة',
  '26 - المدية', '27 - مستغانم', '28 - المسيلة', '29 - معسكر', '30 - ورقلة',
  '31 - وهران', '32 - البيض', '33 - إليزي', '34 - برج بوعريريج', '35 - بومرداس',
  '36 - الطارف', '37 - تندوف', '38 - تسمسيلت', '39 - الوادي', '40 - خنشلة',
  '41 - سوق أهراس', '42 - تيبازة', '43 - ميلة', '44 - عين الدفلى', '45 - النعامة',
  '46 - عين تموشنت', '47 - غرداية', '48 - غليزان', '49 - تيميمون', '50 - برج باجي مختار',
  '51 - أولاد جلال', '52 - بني عباس', '53 - عين صالح', '54 - عين قزام', '55 - تقرت',
  '56 - جانت', '57 - المغير', '58 - المنيعة'
];

export default function CheckoutModal({ onOrderSuccess }) {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    appliedCoupon,
    fulfillmentType,
    setFulfillmentType,
    clearCart
  } = useCart();

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    wilaya: '16 - الجزائر العاصمة',
    address: '',
    notes: '',
    scheduled_at: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCheckoutOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.customer_name.trim() || !formData.phone.trim()) {
      setErrorMessage('يرجى ملء الاسم ورقم الهاتف');
      return;
    }

    if (fulfillmentType === 'delivery' && (!formData.wilaya || !formData.address.trim())) {
      setErrorMessage('يرجى ملء الولاية والعنوان لخدمة التوصيل');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customer_name: formData.customer_name.trim(),
      phone: formData.phone.trim(),
      fulfillment_type: fulfillmentType,
      wilaya: fulfillmentType === 'delivery' ? formData.wilaya : null,
      address: fulfillmentType === 'delivery' ? formData.address.trim() : null,
      notes: formData.notes.trim() || null,
      scheduled_at: formData.scheduled_at || new Date().toISOString(),
      payment_method: 'cash_on_delivery',
      coupon_id: appliedCoupon ? appliedCoupon.id : null,
      items: cart
    };

    try {
      const res = await api.createOrder(payload);
      if (res.success) {
        clearCart();
        setIsCheckoutOpen(false);
        if (onOrderSuccess) onOrderSuccess(res.data);
      } else {
        setErrorMessage(res.message || 'تعذر تأكيد الطلب');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="overlay show" style={{ zIndex: 110 }} onClick={() => setIsCheckoutOpen(false)}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-box" style={{ maxWidth: '580px', maxHeight: '92vh' }}>
          <button className="close-btn" onClick={() => setIsCheckoutOpen(false)}>
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '24px' }}>🧁</span>
            <h2>إتمام الطلب</h2>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '18px' }}>
            الدفع نقدًا عند الاستلام (Cash on delivery) 💵
          </p>

          {errorMessage && (
            <div style={{
              background: '#fde8e8',
              color: '#c81e1e',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Fulfillment Toggle */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              background: 'var(--cream)',
              padding: '6px',
              borderRadius: '16px',
              border: '1px solid var(--beige)'
            }}>
              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: fulfillmentType === 'delivery' ? 'var(--chocolate)' : 'transparent',
                  color: fulfillmentType === 'delivery' ? '#fff' : 'var(--chocolate)',
                  fontWeight: 700,
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                <Truck size={17} />
                <span>توصيل للمنزل</span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: fulfillmentType === 'pickup' ? 'var(--chocolate)' : 'transparent',
                  color: fulfillmentType === 'pickup' ? '#fff' : 'var(--chocolate)',
                  fontWeight: 700,
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                <Store size={17} />
                <span>استلام من المحل</span>
              </button>
            </div>

            {/* Customer Details */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                <User size={15} color="var(--chocolate)" />
                <span>الاسم الكامل *</span>
              </label>
              <input
                required
                placeholder="مثال: سارة محمد"
                value={formData.customer_name}
                onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                <Phone size={15} color="var(--chocolate)" />
                <span>رقم الهاتف *</span>
              </label>
              <input
                required
                type="tel"
                placeholder="مثال: 0555123456"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Delivery address fields */}
            {fulfillmentType === 'delivery' && (
              <>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    <MapPin size={15} color="var(--chocolate)" />
                    <span>الولاية *</span>
                  </label>
                  <select
                    value={formData.wilaya}
                    onChange={e => setFormData({ ...formData, wilaya: e.target.value })}
                  >
                    {ALGERIAN_WILAYAS.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    <MapPin size={15} color="var(--chocolate)" />
                    <span>العنوان بالتفصيل والبلدية *</span>
                  </label>
                  <input
                    required
                    placeholder="الحي، اسم الشارع، رقم العمارة أو البيت"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Scheduled date and time */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                <Calendar size={15} color="var(--chocolate)" />
                <span>موعد الاستلام أو التوصيل المرغوب:</span>
              </label>
              <input
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={e => setFormData({ ...formData, scheduled_at: e.target.value })}
              />
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                <FileText size={15} color="var(--chocolate)" />
                <span>ملاحظات إضافية (اختياري):</span>
              </label>
              <textarea
                rows="2"
                placeholder="مثال: الرجاء كتابة 'عيد ميلاد سعيد أمينة' على الكيك أو بدون مكسرات..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Order Summary Box */}
            <div style={{
              background: 'var(--cream)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                <span>مجموع المنتجات ({cart.length})</span>
                <span>{formatDZD(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#27ae60', fontWeight: 700 }}>
                  <span>الخصم ({appliedCoupon?.code})</span>
                  <span>-{formatDZD(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                <span>تكلفة التوصيل</span>
                <span>{formatDZD(deliveryFee)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: '17px',
                color: 'var(--chocolate)',
                paddingTop: '8px',
                borderTop: '1px dashed var(--beige)'
              }}>
                <span>المبلغ الإجمالي للدفع</span>
                <span>{formatDZD(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn"
              disabled={isSubmitting}
              style={{ padding: '14px', fontSize: '16px' }}
            >
              {isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب الآن 🤎'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
