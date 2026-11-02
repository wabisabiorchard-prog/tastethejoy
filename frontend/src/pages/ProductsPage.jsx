import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BrownieCustomizer from '../components/BrownieCustomizer';
import { Search, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';

const OCCASIONS = [
  { id: 'all', label: 'جميع المناسبات' },
  { id: 'birthday', label: '🎂 أعياد الميلاد' },
  { id: 'grad', label: '🎓 النجاح والتخرج' },
  { id: 'valentine', label: "❤️ مناسبات رومانسية" },
  { id: 'party', label: '🎉 الحفلات والجمعات' },
  { id: 'gift', label: '🎁 هدايا ومفاجآت' },
  { id: 'special', label: '✨ مناسبات خاصة' }
];

export default function ProductsPage({
  products = [],
  categories = [],
  onOpenModal,
  onShowToast
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOccasion, setActiveOccasion] = useState('all');

  // Sync state if URL search params change
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  function handleCategoryChange(catSlug) {
    setActiveCategory(catSlug);
    if (catSlug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catSlug });
    }
  }

  function handleResetFilters() {
    setActiveCategory('all');
    setSearchQuery('');
    setActiveOccasion('all');
    setSearchParams({});
  }

  // Filter products based on search, category, and occasion
  const filteredProducts = products.filter(p => {
    const pName = (p.name?.ar || p.name || '').toLowerCase();
    const pDesc = (p.description?.ar || p.description || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = !query || pName.includes(query) || pDesc.includes(query);
    const matchesCat = activeCategory === 'all' || p.category_slug === activeCategory || p.category_id === activeCategory;
    const matchesOcc = activeOccasion === 'all' || p.occasion === activeOccasion;

    return matchesSearch && matchesCat && matchesOcc;
  });

  return (
    <div style={{ padding: '36px 0 60px' }}>
      {/* Page Header */}
      <div className="wrap" style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 800,
          color: 'var(--purple-deep)',
          backgroundColor: 'rgba(199, 125, 255, 0.18)',
          border: '1px solid rgba(199, 125, 255, 0.35)',
          padding: '6px 18px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '12px'
        }}>
          <Sparkles size={14} color="#7B2CBF" /> قائمة حلويات Touta Délices 🧁
        </span>
        <h1 style={{
          fontSize: 'clamp(28px, 4.5vw, 42px)',
          color: 'var(--purple-deep)',
          fontWeight: 800,
          letterSpacing: '-0.5px'
        }}>
          إبداعات حلوة محضّرة بكل شغف وإتقان
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '600px', margin: '10px auto 0', lineHeight: 1.7 }}>
          اكتشفي تشكيلتنا الراقية من تشيز كيك كريمي، كيكات مناسبات فخمة، بوكسات براونيز مقرمشة ومكسرات فاخرة
        </p>
      </div>

      {/* Filter and Search Section */}
      <section className="wrap" style={{ marginBottom: '36px' }}>
        {/* Search input */}
        <div style={{
          position: 'relative',
          maxWidth: '620px',
          margin: '0 auto 24px'
        }}>
          <input
            type="text"
            placeholder="🔍 ابحثي عن حلوى، كيكة، أو نكهة (بيستاشيو، كيندر، لوتس، ليمون...)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '15px 22px 15px 46px',
              borderRadius: 'var(--radius-full)',
              background: '#FFFFFF',
              fontSize: '15px',
              border: '1.5px solid rgba(199, 125, 255, 0.3)',
              boxShadow: 'var(--shadow-sm)',
              outline: 'none',
              transition: 'all 0.25s ease'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--purple-deep)',
                fontWeight: 700,
                fontSize: '16px',
                background: 'rgba(199, 125, 255, 0.2)',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="مسح البحث"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '9px',
          justifyContent: 'center',
          marginBottom: '18px'
        }}>
          <button
            className={`pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            جميع الحلويات ({products.length})
          </button>
          {categories.map(cat => {
            const count = products.filter(p => p.category_slug === cat.slug || p.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                className={`pill ${activeCategory === cat.slug ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.slug)}
              >
                {cat.name?.ar || cat.name} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>

        {/* Occasions Row */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '10px 4px 6px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          scrollbarWidth: 'none'
        }}>
          {OCCASIONS.map(occ => (
            <button
              key={occ.id}
              className={`pill ${activeOccasion === occ.id ? 'active' : ''}`}
              style={{
                fontSize: '13px',
                padding: '6px 15px',
                borderRadius: '20px'
              }}
              onClick={() => setActiveOccasion(occ.id)}
            >
              {occ.label}
            </button>
          ))}
        </div>
      </section>

      {/* Products Results Header */}
      <div className="wrap" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '22px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--purple-deep)' }}>
            الحلويات المتوفرة:
          </span>
          <span style={{
            background: 'linear-gradient(135deg, rgba(123, 44, 191, 0.12), rgba(247, 197, 213, 0.25))',
            border: '1px solid rgba(123, 44, 191, 0.2)',
            padding: '3px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: 800,
            color: 'var(--purple-deep)'
          }}>
            {filteredProducts.length} صنف
          </span>
        </div>

        {(searchQuery || activeCategory !== 'all' || activeOccasion !== 'all') && (
          <button
            onClick={handleResetFilters}
            className="btn small outline"
            style={{ fontSize: '12.5px', padding: '6px 15px', borderRadius: '20px' }}
          >
            <RefreshCw size={13} />
            <span>إعادة ضبط الفلاتر</span>
          </button>
        )}
      </div>

      {/* Product Grid */}
      <section className="wrap" style={{ marginBottom: '46px' }}>
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenModal={onOpenModal}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            padding: '52px 24px',
            textAlign: 'center',
            border: '1.5px dashed rgba(199, 125, 255, 0.4)',
            maxWidth: '540px',
            margin: '20px auto',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ fontSize: '46px', display: 'block', marginBottom: '14px' }}>🔍</span>
            <h3 style={{ fontSize: '20px', color: 'var(--purple-deep)', fontWeight: 800, marginBottom: '8px' }}>
              لم نعثر على حلويات مطابقة
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginBottom: '22px', lineHeight: 1.6 }}>
              جرّبي تغيير كلمات البحث أو استعراض جميع التصنيفات لمشاهدة كل إبداعاتنا اللذيذة.
            </p>
            <button onClick={handleResetFilters} className="btn small">
              <span>عرض جميع الأصناف</span>
            </button>
          </div>
        )}
      </section>

      {/* Show Brownie Customizer */}
      <div className="wrap">
        <BrownieCustomizer onShowToast={onShowToast} />
      </div>
    </div>
  );
}
