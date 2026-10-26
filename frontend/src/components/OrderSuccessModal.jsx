import React, { useEffect } from 'react';
import { CheckCircle2, MessageCircle, X, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatDZD } from '../api';

export default function OrderSuccessModal({ order, onClose }) {
  if (!order) return null;

  useEffect(() => {
    // Fire festive celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  }, []);

  return (
    <div className="overlay show" style={{ zIndex: 120 }}>
      <div className="modal-container">
        <div className="modal-box" style={{ maxWidth: '480px', textAlign: 'center', padding: '32px 24px' }}>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>

          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: 'var(--pink)',
            color: 'var(--chocolate)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: 'var(--shadow)'
          }}>
            <CheckCircle2 size={44} />
          </div>

          <h2 style={{ fontSize: '24px', color: 'var(--chocolate)', marginBottom: '8px' }}>
            تم استلام طلبك بنجاح! 🤎
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
            شكرًا لثقتك في Taste the Joy! سنبدأ في تحضير طلبك بأعلى عناية.
          </p>

          {/* Order Details Badge */}
          <div style={{
            background: 'var(--cream)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'right',
            marginBottom: '20px',
            border: '1px solid var(--beige)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>رقم الطلب:</span>
              <span style={{ fontWeight: 800, color: 'var(--chocolate)' }}>#{order.order_number}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>الاسم:</span>
              <span style={{ fontWeight: 700 }}>{order.customer_name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>طريقة الاستلام:</span>
              <span style={{ fontWeight: 700 }}>
                {order.fulfillment_type === 'delivery' ? `توصيل (${order.wilaya})` : 'استلام من المحل'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>المبلغ الإجمالي:</span>
              <span style={{ fontWeight: 800, color: 'var(--chocolate)', fontSize: '15px' }}>
                {formatDZD(order.total)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {order.whatsapp_url && (
              <a
                href={order.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ background: '#25D366', color: '#fff', padding: '14px' }}
              >
                <MessageCircle size={18} />
                <span>إرسال تفاصيل الطلب عبر WhatsApp 💬</span>
              </a>
            )}

            <button
              className="btn outline"
              onClick={onClose}
              style={{ padding: '12px' }}
            >
              <ShoppingBag size={16} />
              <span>العودة إلى المتجر</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
