import React, { useState } from 'react';
import { Star, MessageSquarePlus, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { api, getGuestId } from '../api';

export default function ReviewsSection({ reviews, products, onReviewSubmitted, onShowToast }) {
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [productId, setProductId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    const guestId = getGuestId();

    // Default to first product if none selected
    const chosenProductId = productId || (products?.[0]?.id) || 'general';

    try {
      const res = await api.submitReview({
        guest_id: guestId,
        product_id: chosenProductId,
        author_name: authorName.trim() || 'زبونة Touta Délices',
        rating: Number(rating),
        comment: comment.trim()
      });

      if (res.success) {
        setAuthorName('');
        setComment('');
        setSuccessNotice(true);
        if (onShowToast) onShowToast(res.message);
        if (onReviewSubmitted) onReviewSubmitted();
        setTimeout(() => setSuccessNotice(false), 5000);
      }
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast('تعذر إرسال التقييم');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="reviews" className="wrap" style={{ padding: '20px 20px 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '38px' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--purple-deep)', fontWeight: 800 }}>
          واش قالوا علينا؟ 💜⭐
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '15.5px', marginTop: '8px' }}>
          آراء زبائننا وتجاربهم الصادقة مع حلوياتنا المميزة
        </p>
      </div>

      {/* Reviews Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '22px',
        marginBottom: '46px'
      }}>
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', gridColumn: '1/-1', fontSize: '15px' }}>
            لا توجد تقييمات منشورة بعد، كوني أول من يشاركنا تجربته الرائعة! 🍰
          </p>
        ) : (
          reviews.map(r => (
            <div
              key={r.id}
              className="card"
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid rgba(199, 125, 255, 0.22)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', gap: '3px', color: '#f39c12' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={17}
                    fill={i < r.rating ? '#FFAA00' : '#E8DDF0'}
                    color={i < r.rating ? '#FFAA00' : '#E8DDF0'}
                  />
                ))}
              </div>

              <div style={{ fontWeight: 800, fontSize: '15.5px', color: 'var(--purple-deep)' }}>
                {r.author_name || 'زبونة Touta Délices'}
              </div>

              <p style={{ color: '#4A3B53', fontSize: '14.5px', lineHeight: 1.6 }}>
                "{r.comment}"
              </p>

              {r.created_at && (
                <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: 'auto', paddingTop: '8px' }}>
                  {new Date(r.created_at).toLocaleDateString('ar-DZ')}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Submission Form */}
      <div style={{
        maxWidth: '580px',
        margin: '0 auto',
        background: '#FFFFFF',
        borderRadius: '28px',
        padding: '34px 28px',
        boxShadow: 'var(--shadow)',
        border: '1px solid rgba(199, 125, 255, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '18px' }}>
          <MessageSquarePlus size={22} color="#7B2CBF" />
          <h3 style={{ fontSize: '19px', color: 'var(--purple-deep)', fontWeight: 800 }}>شاركينا رأيك وتجربتك 🍰✨</h3>
        </div>

        {successNotice && (
          <div style={{
            background: 'rgba(86, 207, 178, 0.15)',
            color: '#1B9A7B',
            border: '1px solid rgba(86, 207, 178, 0.4)',
            padding: '14px',
            borderRadius: '16px',
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            marginBottom: '16px',
            fontWeight: 700
          }}>
            <CheckCircle2 size={19} />
            <span>شكرًا لكِ! تم إرسال تقييمك وسيظهر بعد موافقة الإدارة.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--purple-deep)', marginBottom: '7px', display: 'block' }}>
              اسمك الكريم:
            </label>
            <input
              placeholder="مثال: ياسمين من البليدة"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid rgba(199, 125, 255, 0.3)',
                background: '#FAF7FD',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--purple-deep)', marginBottom: '7px', display: 'block' }}>
              الحلوى التي تذوقتيها:
            </label>
            <select
              value={productId}
              onChange={e => setProductId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid rgba(199, 125, 255, 0.3)',
                background: '#FAF7FD',
                fontSize: '14px',
                outline: 'none',
                color: 'var(--purple-deep)',
                fontWeight: 600
              }}
            >
              <option value="">-- اختاري الصنف (اختياري) --</option>
              {products?.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name?.ar || p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--purple-deep)', marginBottom: '7px', display: 'block' }}>
              التقييم العام:
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    cursor: 'pointer',
                    padding: '4px',
                    transition: 'transform 0.15s ease',
                    transform: star <= rating ? 'scale(1.15)' : 'scale(1)'
                  }}
                  aria-label={`${star} نجوم`}
                >
                  <Star
                    size={26}
                    fill={star <= rating ? '#FFAA00' : '#E8DDF0'}
                    color={star <= rating ? '#FFAA00' : '#E8DDF0'}
                  />
                </button>
              ))}
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--purple-deep)', marginRight: '8px' }}>
                ({rating} من 5)
              </span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--purple-deep)', marginBottom: '7px', display: 'block' }}>
              تعليقك وانطباعك:
            </label>
            <textarea
              rows="3"
              placeholder="كيف كان الطعم، التزيين، وسرعة التوصيل؟"
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid rgba(199, 125, 255, 0.3)',
                background: '#FAF7FD',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn small"
            disabled={isSubmitting}
            style={{ width: 'fit-content', padding: '11px 26px', marginTop: '4px' }}
          >
            <Send size={15} />
            <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}</span>
          </button>

          <span style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
            *يتم مراجعة التقييمات قبل نشرها لضمان مصداقية التجربة للجميع.
          </span>
        </form>
      </div>
    </section>
  );
}
