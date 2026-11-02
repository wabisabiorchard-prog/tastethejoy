import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Truck, Award, Heart } from 'lucide-react';

export default function Hero() {
  return (
    <section className="wrap" style={{ padding: '40px 20px 40px', position: 'relative' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        alignItems: 'center',
        gap: '40px'
      }}>
        {/* Text Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #F4ECFD 0%, #FDEEF3 100%)',
            color: 'var(--purple-deep)',
            border: '1px solid rgba(224, 170, 255, 0.6)',
            padding: '7px 18px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13.5px',
            fontWeight: 800,
            width: 'fit-content',
            boxShadow: '0 2px 10px rgba(108, 40, 158, 0.08)'
          }}>
            <Sparkles size={16} color="var(--purple-primary)" />
            <span>عالم الحلويات والبهجة في Touta Délices ✨</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5.5vw, 54px)',
            color: 'var(--purple-deep)',
            lineHeight: 1.25,
            letterSpacing: '-0.5px'
          }}>
            سحر المذاق الحلو... <br />
            <span style={{
              background: 'linear-gradient(135deg, #7B2CBF 0%, #C77DFF 50%, #FF5D8F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              يصنع لحظات لا تُنسى 🍰
            </span>
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'var(--muted)',
            lineHeight: 1.8,
            maxWidth: '520px'
          }}>
            أشهى تشيز كيك كريمي بنكهات أصلية، كيكات مناسبات راقية، وبوكسات براونيز ساخنة ومغموسة بالشوكولاتة الفاخرة لتغمر مناسباتكم بالفرح والدلال.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', paddingTop: '6px' }}>
            <Link to="/products" className="btn hero-cta-btn">
              <span>اكتشفي حلوياتنا</span>
              <ArrowLeft size={16} />
            </Link>
            <Link to="/products?category=brownies" className="btn outline hero-secondary-btn">
              <span>خصّصي بوكس البراونيز 🍫</span>
            </Link>
          </div>

          {/* Quick Badges with Mint & Peach Highlights */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '18px',
            borderTop: '1px solid var(--beige)',
            color: 'var(--muted)',
            fontSize: '13.5px',
            fontWeight: 700
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--beige)'
            }}>
              <Truck size={17} color="#2B9E83" />
              <span>توصيل سريع ومبرد</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--beige)'
            }}>
              <Award size={17} color="#9D4EDD" />
              <span>مكونات أصلية 100%</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--beige)'
            }}>
              <span style={{ fontSize: '15px' }}>💵</span>
              <span>الدفع عند الاستلام</span>
            </div>
          </div>
        </div>

        {/* Visual Showcase Side with Purple Glow */}
        <div style={{ position: 'relative' }}>
          <div style={{
            borderRadius: '32px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(108, 40, 158, 0.18)',
            aspectRatio: '4 / 3',
            background: 'linear-gradient(135deg, #F4ECFD 0%, #FDEEF3 100%)',
            border: '3px solid #FFFFFF',
            position: 'relative'
          }} className="hero-img-container">
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop"
              alt="حلويات Touta Délices الفاخرة"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              className="hero-img-hover"
            />
          </div>

          {/* Floating Pill on Image */}
          <div style={{
            position: 'absolute',
            bottom: '-16px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '12px 22px',
            borderRadius: '22px',
            boxShadow: '0 12px 30px rgba(108, 40, 158, 0.16)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1.5px solid var(--beige)',
            animation: 'floatPill 4s ease-in-out infinite'
          }}>
            <span style={{ fontSize: '28px' }}>🍰</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--purple-deep)' }}>Cheesecake بيستاشيو</div>
              <div style={{ fontSize: '12px', color: '#FF5D8F', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>الأكثر طلباً هذا الأسبوع 🔥</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatPill {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .hero-img-hover {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-img-container:hover .hero-img-hover {
          transform: scale(1.05);
        }
        .hero-cta-btn:hover {
          transform: translateY(-2px) scale(1.02);
        }
        .hero-secondary-btn:hover {
          transform: translateY(-2px);
          border-color: var(--purple-primary) !important;
        }
      `}</style>
    </section>
  );
}
