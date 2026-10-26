import React from 'react';
import { Sparkles, ArrowLeft, Truck, Award } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="wrap" style={{ padding: '50px 20px 40px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        alignItems: 'center',
        gap: '40px'
      }}>
        {/* Text Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--pink)',
            color: 'var(--chocolate)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: 800,
            width: 'fit-content'
          }}>
            <Sparkles size={16} />
            <span>حلويات راقية تُحضّر طازجة بحب 🤎</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5.5vw, 54px)',
            color: 'var(--chocolate)',
            lineHeight: 1.2
          }}>
            طعم يخليك تقول... <br />
            <span style={{ color: 'var(--pastel-brown)' }}>نعاودو؟ 🤎</span>
          </h1>

          <p style={{
            fontSize: '17px',
            color: '#6b5645',
            lineHeight: 1.7,
            maxWidth: '500px'
          }}>
            أشهى تشيز كيك كريمي، كيكات مناسبات فخمة، وبوكسات براونيز ساخنة ومغموسة بأفضل شوكولاتة ذائبة لتزين أحلى لحظاتكم.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', paddingTop: '6px' }}>
            <a href="#cheesecake" className="btn">
              <span>اكتشفي حلوياتنا</span>
              <ArrowLeft size={16} />
            </a>
            <a href="#brownies" className="btn outline">
              <span>خصّص بوكس البراونيز 🍫</span>
            </a>
          </div>

          {/* Quick Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '18px',
            paddingTop: '16px',
            borderTop: '1px solid var(--beige)',
            color: 'var(--muted)',
            fontSize: '13px',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={16} color="var(--pistachio-dark)" />
              <span>توصيل سريع للمنزل</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="var(--pistachio-dark)" />
              <span>مكونات أصلية 100%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px' }}>💵</span>
              <span>الدفع عند الاستلام</span>
            </div>
          </div>
        </div>

        {/* Visual Showcase Side */}
        <div style={{ position: 'relative' }}>
          <div style={{
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            aspectRatio: '4 / 3',
            background: 'var(--beige)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop"
              alt="حلويات Taste the Joy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Floating Pill on Image */}
          <div style={{
            position: 'absolute',
            bottom: '-16px',
            left: '24px',
            background: 'var(--off-white)',
            padding: '12px 20px',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid var(--beige)'
          }}>
            <span style={{ fontSize: '28px' }}>🍰</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--chocolate)' }}>Cheesecake بيستاشيو</div>
              <div style={{ fontSize: '12px', color: 'var(--pistachio-dark)', fontWeight: 700 }}>الأكثر طلبًا هذا الأسبوع 🔥</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
