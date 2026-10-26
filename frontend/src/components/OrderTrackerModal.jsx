import React, { useState } from 'react';
import { X, Search, Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { api, formatDZD } from '../api';

const STATUS_STEPS = [
  { key: 'new', label: 'طلب جديد' },
  { key: 'reviewing', label: 'قيد المراجعة' },
  { key: 'preparing', label: 'قيد التحضير' },
  { key: 'ready', label: 'جاهز' },
  { key: 'completed', label: 'مكتمل' }
];

export default function OrderTrackerModal({ isOpen, onClose }) {
  const [orderQuery, setOrderQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSearch(e) {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setError('');
    setOrderResult(null);

    const clean = orderQuery.replace('#', '').trim();
    try {
      const res = await api.trackOrder(clean);
      if (res.success && res.data) {
        setOrderResult(res.data);
      } else {
        setError(res.message || 'لم يتم العثور على طلب بهذا الرقم');
      }
    } catch (err) {
      setError('تعذر العثور على الطلب. تأكد من إدخال رقم الطلب بشكل صحيح.');
    } finally {
      setLoading(false);
    }
  }

  function getStepIndex(status) {
    return STATUS_STEPS.findIndex(s => s.key === status);
  }

  return (
    <div className="overlay show" style={{ zIndex: 110 }} onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-box" style={{ maxWidth: '520px' }}>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Package size={22} color="var(--chocolate)" />
            <h2>تتبع حالة طلبك</h2>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
            أدخل رقم الطلب الذي استلمته لمعرفة مرحلة تحضيره وتوصيله
          </p>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              value={orderQuery}
              onChange={e => setOrderQuery(e.target.value)}
              placeholder="مثال: 1001 أو معرّف الطلب"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn small" disabled={loading}>
              <Search size={16} />
              <span>{loading ? 'بحث...' : 'تتبع'}</span>
            </button>
          </form>

          {error && (
            <div style={{
              background: '#fde8e8',
              color: '#c81e1e',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {orderResult && (
            <div style={{
              background: 'var(--cream)',
              borderRadius: '18px',
              padding: '18px',
              border: '1px solid var(--beige)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--chocolate)' }}>
                  طلب #{orderResult.order_number}
                </span>
                <span style={{
                  background: 'var(--pink)',
                  color: 'var(--chocolate)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: 700
                }}>
                  {STATUS_STEPS.find(s => s.key === orderResult.status)?.label || orderResult.status}
                </span>
              </div>

              {/* Progress steps */}
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', position: 'relative' }}>
                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getStepIndex(orderResult.status);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;

                  return (
                    <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 1, flex: 1 }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: isDone ? 'var(--pistachio)' : '#ddd',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 800,
                        border: isCurrent ? '3px solid var(--chocolate)' : 'none'
                      }}>
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: isCurrent ? 800 : 600,
                        color: isCurrent ? 'var(--chocolate)' : 'var(--muted)',
                        textAlign: 'center'
                      }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Order Info Details */}
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '13px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div><b>العميل:</b> {orderResult.customer_name} ({orderResult.phone})</div>
                <div><b>طريقة الاستلام:</b> {orderResult.fulfillment_type === 'delivery' ? `توصيل إلى ${orderResult.wilaya} - ${orderResult.address}` : 'استلام من المحل'}</div>
                <div><b>تاريخ الطلب:</b> {new Date(orderResult.created_at).toLocaleString('ar-DZ')}</div>
                <div style={{ fontWeight: 800, color: 'var(--chocolate)', marginTop: '4px', paddingTop: '6px', borderTop: '1px solid var(--beige)' }}>
                  المبلغ الإجمالي: {formatDZD(orderResult.total)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
