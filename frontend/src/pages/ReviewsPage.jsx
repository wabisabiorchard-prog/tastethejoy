import React from 'react';
import ReviewsSection from '../components/ReviewsSection';
import { Sparkles } from 'lucide-react';

export default function ReviewsPage({
  reviews = [],
  products = [],
  onReviewSubmitted,
  onShowToast
}) {
  return (
    <div style={{ padding: '36px 0 70px' }}>
      {/* Header */}
      <div className="wrap" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 800,
          color: 'var(--purple-deep)',
          backgroundColor: 'rgba(199, 125, 255, 0.18)',
          border: '1px solid rgba(199, 125, 255, 0.35)',
          padding: '6px 20px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '12px'
        }}>
          <Sparkles size={14} color="#7B2CBF" /> تجارب زبائننا السعداء ⭐
        </span>
        <h1 style={{
          fontSize: 'clamp(28px, 4.5vw, 44px)',
          color: 'var(--purple-deep)',
          fontWeight: 800,
          letterSpacing: '-0.5px'
        }}>
          آراء وتقييمات زبائن Touta Délices
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16.5px', maxWidth: '620px', margin: '10px auto 0', lineHeight: 1.7 }}>
          سعادتكم ورضاكم هو سر إلهامنا اليومي لنقدم أشهى كيكات وحلويات بأعلى معايير الإتقان 🍰
        </p>
      </div>

      <ReviewsSection
        reviews={reviews}
        products={products}
        onReviewSubmitted={onReviewSubmitted}
        onShowToast={onShowToast}
      />
    </div>
  );
}
