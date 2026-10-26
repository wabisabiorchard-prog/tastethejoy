import React, { useState } from 'react';
import { Star, MessageSquarePlus, Send, CheckCircle2 } from 'lucide-react';
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
        author_name: authorName.trim() || 'زبون Taste the Joy',
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
    <section id="reviews" className="wrap" style={{ padding: '60px 20px 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--chocolate)' }}>
          وش قالو علينا؟ ⭐
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '6px' }}>
          آراء زبائننا الكرام وتجاربهم الصادقة مع حلوياتنا
        </p>
      </div>

      {/* Reviews Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', gridColumn: '1/-1' }}>
            لا توجد تقييمات منشورة بعد، كوني أول من يشاركنا رأيه! 🤎
          </p>
        ) : (
          reviews.map(r => (
            <div
              key={r.id}
              style={{
                background: 'var(--off-white)',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--beige)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', gap: '2px', color: '#f39c12' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < r.rating ? '#f39c12' : '#e0e0e0'}
                    color={i < r.rating ? '#f39c12' : '#e0e0e0'}
                  />
                ))}
              </div>

              <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--chocolate)' }}>
                {r.author_name || 'زبون Taste the Joy'}
              </div>

              <p style={{ color: '#6b5645', fontSize: '14px', lineHeight: 1.5 }}>
                "{r.comment}"
              </p>

              {r.created_at && (
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 'auto', paddingTop: '6px' }}>
                  {new Date(r.created_at).toLocaleDateString('ar-DZ')}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Submission Form */}
      <div style={{
        maxWidth: '560px',
        margin: '0 auto',
        background: 'var(--off-white)',
        borderRadius: '24px',
        padding: '26px 24px',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--beige)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <MessageSquarePlus size={20} color="var(--chocolate)" />
          <h3 style={{ fontSize: '18px' }}>شاركينا رأيك وتجربتك 🤎</h3>
        </div>

        {successNotice && (
          <div style={{
            background: '#e8f5e9',
            color: '#2e7d32',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '14px',
            fontWeight: 700
          }}>
            <CheckCircle2 size={18} />
            <span>شكرًا لك! تم إرسال تقييمك وسيظهر بعد موافقة الإدارة.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
              اسمك الكريم:
            </label>
            <input
              placeholder="مثال: أمينة من الجزائر"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
              الحلوى التي جربتها:
            </label>
            <select
              value={productId}
              onChange={e => setProductId(e.target.value)}
            >
              <option value="">-- اختاري المنتج (اختياري) --</option>
              {products?.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name?.ar || p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
              التقييم:
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ cursor: 'pointer', padding: '4px' }}
                >
                  <Star
                    size={24}
                    fill={star <= rating ? '#f39c12' : '#e0e0e0'}
                    color={star <= rating ? '#f39c12' : '#e0e0e0'}
                  />
                </button>
              ))}
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--chocolate)', marginRight: '6px' }}>
                ({rating} من 5)
              </span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
              تعليقك:
            </label>
            <textarea
              rows="3"
              placeholder="كيف كان الطعم، التغليف، والخدمة؟"
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn small"
            disabled={isSubmitting}
            style={{ width: 'fit-content', padding: '10px 22px' }}
          >
            <Send size={15} />
            <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}</span>
          </button>

          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
            *يتم فحص التقييمات قبل نشرها لضمان تجربة حقيقية ومفيدة للجميع.
          </span>
        </form>
      </div>
    </section>
  );
}
