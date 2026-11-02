import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import BrownieCustomizer from '../components/BrownieCustomizer';
import { ArrowLeft, Sparkles, ChevronLeft, Heart, Award, Star } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Categories Quick Showcase */}
      <section className="wrap" style={{ padding: '10px 20px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 800,
            color: 'var(--purple-primary)',
            backgroundColor: 'var(--lavender-light)',
            padding: '5px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(224, 170, 255, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={14} />
            <span>تشكيلاتنا الفاخرة</span>
          </span>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', marginTop: '10px', color: 'var(--purple-deep)' }}>
            تسوّقي حسب القسم 🧁
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '15.5px', marginTop: '6px' }}>
            تشكيلة واسعة صُممت لتضفي البهجة على كل مناسباتكم
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
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                border: '1.5px solid var(--beige)',
                boxShadow: '0 6px 18px rgba(108, 40, 158, 0.05)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="category-card-hover"
            >
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                overflow: 'hidden',
                flexShrink: 0,
                backgroundColor: 'var(--lavender-light)',
                border: '1px solid var(--beige)'
              }}>
                <img
                  src={cat.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=300&auto=format&fit=crop'}
                  alt={cat.name?.ar || cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="cat-img"
                />
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '17px', color: 'var(--purple-deep)', marginBottom: '4px', fontWeight: 800 }}>
                  {cat.name?.ar || cat.name}
                </h3>
                <span style={{
                  fontSize: '13px',
                  color: 'var(--purple-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 700
                }}>
                  <span>تصفحي الأصناف</span>
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
            marginBottom: '22px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>🔥</span>
                <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', color: 'var(--purple-deep)' }}>الأكثر طلبًا</h2>
              </div>
              <span style={{ fontSize: '14.5px', color: 'var(--muted)' }}>الحلويات التي يعشقها زبائن Touta Délices</span>
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
            marginBottom: '22px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>✨</span>
                <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', color: 'var(--purple-deep)' }}>وصل حديثًا</h2>
              </div>
              <span style={{ fontSize: '14.5px', color: 'var(--muted)' }}>إبداعات جديدة وطازجة تذوب في الفم</span>
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

      {/* 6. Quick About Banner with Lavender Gradient */}
      <section className="wrap" style={{ padding: '20px 20px 30px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F5EEFD 60%, #FDEEF3 100%)',
          borderRadius: '30px',
          padding: '40px 34px',
          boxShadow: '0 12px 36px rgba(108, 40, 158, 0.08)',
          border: '1.5px solid var(--beige)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'center',
          gap: '34px'
        }}>
          <div>
            <span style={{
              fontSize: '13px',
              fontWeight: 800,
              color: 'var(--purple-deep)',
              backgroundColor: 'var(--pink)',
              padding: '5px 14px',
              borderRadius: 'var(--radius-full)',
              display: 'inline-block'
            }}>
              لمسة من الشغف والجمال
            </span>
            <h2 style={{ fontSize: '28px', color: 'var(--purple-deep)', margin: '14px 0 12px', fontWeight: 800 }}>
              قصة Touta Délices ✨🍰
            </h2>
            <p style={{
              fontSize: '15.5px',
              color: 'var(--muted)',
              lineHeight: 1.85,
              marginBottom: '22px'
            }}>
              {settings?.about_text || 'قصة Touta Délices تبدأ من شغف عميق بالحلويات العصرية والراقية، لنقدم لكم تشكيلة متميزة من Cheesecake بارد وكيكات المناسبات وبوكسات البراونيز محضّرة بأجود المكونات وبكل حب لتضفي بهجة على كل لحظاتكم.'}
            </p>
            <Link to="/about" className="btn small" style={{ textDecoration: 'none' }}>
              <span>تعرفي علينا أكثر</span>
              <ArrowLeft size={15} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '20px 16px',
              borderRadius: '20px',
              border: '1px solid var(--beige)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.25s ease'
            }} className="stat-card">
              <span style={{ fontSize: '30px', display: 'block', marginBottom: '6px' }}>✨</span>
              <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--purple-deep)' }}>100% طازج</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700 }}>تحضير يومي بكل حب</div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '20px 16px',
              borderRadius: '20px',
              border: '1px solid var(--beige)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.25s ease'
            }} className="stat-card">
              <span style={{ fontSize: '30px', display: 'block', marginBottom: '6px' }}>🍫</span>
              <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--purple-deep)' }}>شوكولاتة أصلية</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700 }}>بلجيكية وإيطالية فاخرة</div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '20px 16px',
              borderRadius: '20px',
              border: '1px solid var(--beige)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.25s ease'
            }} className="stat-card">
              <span style={{ fontSize: '30px', display: 'block', marginBottom: '6px' }}>🚚</span>
              <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--purple-deep)' }}>58 ولاية</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700 }}>توصيل محمي ومبرد</div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '20px 16px',
              borderRadius: '20px',
              border: '1px solid var(--beige)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.25s ease'
            }} className="stat-card">
              <span style={{ fontSize: '30px', display: 'block', marginBottom: '6px' }}>💖</span>
              <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--purple-deep)' }}>+1000 زبون</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700 }}>راضٍ ومبسوط</div>
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
            marginBottom: '22px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>⭐</span>
                <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', color: 'var(--purple-deep)' }}>آراء الزبائن</h2>
              </div>
              <span style={{ fontSize: '14.5px', color: 'var(--muted)' }}>تجارب سعيدة نعتز بها من عشاق Touta Délices</span>
            </div>
            <Link to="/reviews" className="btn small outline" style={{ textDecoration: 'none' }}>
              <span>قراءة كل الآراء ({reviews.length})</span>
              <ArrowLeft size={15} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px'
          }}>
            {approvedReviews.map(r => (
              <div
                key={r.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '24px',
                  borderRadius: '22px',
                  border: '1px solid var(--beige)',
                  boxShadow: '0 6px 18px rgba(108, 40, 158, 0.05)',
                  transition: 'all 0.25s ease'
                }}
                className="review-preview-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: i < r.rating ? '#FFAA00' : '#E0D4EC', fontSize: '17px' }}>
                      ★
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.7, marginBottom: '14px' }}>
                  "{r.comment}"
                </p>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--purple-deep)' }}>
                  {r.author_name || 'زبونة وفيّة 🤎'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .category-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(123, 44, 191, 0.15);
          border-color: var(--lavender);
        }
        .category-card-hover:hover .cat-img {
          transform: scale(1.08);
        }
        .cat-img {
          transition: transform 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          border-color: var(--lavender);
        }
        .review-preview-card:hover {
          transform: translateY(-3px);
          border-color: var(--lavender);
          box-shadow: 0 10px 24px rgba(108, 40, 158, 0.1);
        }
      `}</style>
    </div>
  );
}
