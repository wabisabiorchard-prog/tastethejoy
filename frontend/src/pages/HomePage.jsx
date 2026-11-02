import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import BrownieCustomizer from '../components/BrownieCustomizer';
import { ArrowLeft, Sparkles, Star, Heart, CheckCircle2, ChevronLeft } from 'lucide-react';

export default function HomePage({
  products = [],
  categories = [],
  reviews = [],
  settings = null,
  onOpenModal,
  onShowToast
}) {
  const bestSellers = products.filter(p => p.badge === 'best');
  const newArrivals = products.filter(p => p.badge === 'new');
  const approvedReviews = reviews.filter(r => r.status === 'approved' || !r.status).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Categories Quick Showcase */}
      <section className="wrap" style={{ padding: '10px 20px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 800,
            color: 'var(--pistachio-dark)',
            backgroundColor: 'rgba(155, 185, 140, 0.18)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)'
          }}>
            تشكيلاتنا الفاخرة
          </span>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', marginTop: '8px' }}>
            تسوّق حسب القسم 🧁
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '4px' }}>
            كل صنف محضر بعناية ليلبي كل الأذواق
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              style={{
                backgroundColor: 'var(--off-white)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                border: '1px solid var(--beige)',
                boxShadow: 'var(--shadow-sm)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="category-card-hover"
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                overflow: 'hidden',
                flexShrink: 0,
                backgroundColor: 'var(--beige)'
              }}>
                <img
                  src={cat.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=300&auto=format&fit=crop'}
                  alt={cat.name?.ar || cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '17px', color: 'var(--chocolate)', marginBottom: '4px' }}>
                  {cat.name?.ar || cat.name}
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <span>تصفح الأصناف</span>
                  <ChevronLeft size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section className="wrap" style={{ padding: '20px 20px 30px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)' }}>الأكثر طلبًا 🔥</h2>
              <span style={{ fontSize: '14px', color: 'var(--muted)' }}>الحلويات الأكثر حبًا لدى زبائننا السعداء</span>
            </div>
            <Link to="/products" className="btn small outline" style={{ textDecoration: 'none' }}>
              <span>عرض كل المنتجات</span>
              <ArrowLeft size={15} />
            </Link>
          </div>

          <div className="product-grid">
            {bestSellers.slice(0, 4).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenModal={onOpenModal}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Interactive Brownie Customizer Showcase */}
      <BrownieCustomizer onShowToast={onShowToast} />

      {/* 5. New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="wrap" style={{ padding: '20px 20px 30px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)' }}>وصل حديثًا ✨</h2>
              <span style={{ fontSize: '14px', color: 'var(--muted)' }}>إبداعات جديدة وطازجة تذوب في الفم</span>
            </div>
            <Link to="/products" className="btn small outline" style={{ textDecoration: 'none' }}>
              <span>استكشف المزيد</span>
              <ArrowLeft size={15} />
            </Link>
          </div>

          <div className="product-grid">
            {newArrivals.slice(0, 4).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenModal={onOpenModal}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Quick About Banner */}
      <section className="wrap" style={{ padding: '20px 20px 30px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--off-white) 0%, #fff6ec 100%)',
          borderRadius: '26px',
          padding: '36px 30px',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--beige)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'center',
          gap: '30px'
        }}>
          <div>
            <span style={{
              fontSize: '13px',
              fontWeight: 800,
              color: 'var(--chocolate)',
              backgroundColor: 'var(--pink)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)'
            }}>
              شغف وحب في كل قطعة
            </span>
            <h2 style={{ fontSize: '26px', color: 'var(--chocolate)', margin: '14px 0 10px' }}>
              قصة Taste the Joy 🤎
            </h2>
            <p style={{
              fontSize: '15.5px',
              color: '#6b5645',
              lineHeight: 1.8,
              marginBottom: '20px'
            }}>
              {settings?.about_text || 'قصة Taste the Joy تبدأ من شغف بسيط بالحلويات الراقية، لنقدم لكم تشكيلة متميزة من Cheesecake وكيكات وBrownies Box محضّرة بأجود المكونات وبكل حب، باش كل مناسبة عندكم تكون أحلى.'}
            </p>
            <Link to="/about" className="btn small" style={{ textDecoration: 'none' }}>
              <span>تعرف علينا أكثر</span>
              <ArrowLeft size={15} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px'
          }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '18px',
              borderRadius: '18px',
              border: '1px solid var(--beige)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '6px' }}>✨</span>
              <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--chocolate)' }}>100% طازج</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>تحضير يومي بكل حب</div>
            </div>

            <div style={{
              backgroundColor: '#fff',
              padding: '18px',
              borderRadius: '18px',
              border: '1px solid var(--beige)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '6px' }}>🍫</span>
              <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--chocolate)' }}>شوكولاتة فاخرة</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>بلجيكية وإيطالية أصلية</div>
            </div>

            <div style={{
              backgroundColor: '#fff',
              padding: '18px',
              borderRadius: '18px',
              border: '1px solid var(--beige)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '6px' }}>🚚</span>
              <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--chocolate)' }}>58 ولاية</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>توصيل مبرد ومحمي</div>
            </div>

            <div style={{
              backgroundColor: '#fff',
              padding: '18px',
              borderRadius: '18px',
              border: '1px solid var(--beige)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '6px' }}>⭐</span>
              <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--chocolate)' }}>+1000 زبون</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>سعيد وراضٍ</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Quick Reviews Preview */}
      {approvedReviews.length > 0 && (
        <section className="wrap" style={{ padding: '10px 20px 40px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)' }}>آراء وتجارب الزبائن ⭐</h2>
              <span style={{ fontSize: '14px', color: 'var(--muted)' }}>شهادات نعتز بها من عشاق المذاق الرفيع</span>
            </div>
            <Link to="/reviews" className="btn small outline" style={{ textDecoration: 'none' }}>
              <span>قراءة كل الآراء ({reviews.length})</span>
              <ArrowLeft size={15} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {approvedReviews.map(r => (
              <div
                key={r.id}
                style={{
                  backgroundColor: 'var(--off-white)',
                  padding: '22px',
                  borderRadius: '20px',
                  border: '1px solid var(--beige)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: i < r.rating ? '#e67e22' : '#d1c7bd', fontSize: '16px' }}>
                      ★
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: '14.5px', color: '#554234', lineHeight: 1.7, marginBottom: '14px' }}>
                  "{r.comment}"
                </p>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--chocolate)' }}>
                  {r.author_name || 'زبون وفِي'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .category-card-hover:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow);
          border-color: var(--pastel-brown);
        }
      `}</style>
    </div>
  );
}
