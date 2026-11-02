import React from 'react';
import ReviewsSection from '../components/ReviewsSection';

export default function ReviewsPage({
  reviews = [],
  products = [],
  onReviewSubmitted,
  onShowToast
}) {
  return (
    <div style={{ padding: '30px 0 60px' }}>
      {/* Header */}
      <div className="wrap" style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 800,
          color: 'var(--chocolate)',
          backgroundColor: 'var(--pink)',
          padding: '5px 18px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-block',
          marginBottom: '10px'
        }}>
          تجارب زبائننا السعداء ⭐
        </span>
        <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', color: 'var(--chocolate)' }}>
          آراء وتقييمات زبائن Taste the Joy
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '600px', margin: '8px auto 0' }}>
          رأيكم هو دافعنا الدائم للتألق وتقديم أشهى الحلويات وأعلى درجات الإتقان
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
