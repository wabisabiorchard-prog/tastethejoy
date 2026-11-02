import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BrownieCustomizer from '../components/BrownieCustomizer';
import { Search, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';

const OCCASIONS = [
  { id: 'all', label: 'جميع المناسبات' },
  { id: 'birthday', label: '🎂 أعياد الميلاد' },
  { id: 'grad', label: '🎓 النجاح والتخرج' },
  { id: 'valentine', label: "❤️ Valentine's Day" },
  { id: 'party', label: '🎉 الحفلات والجمعات' },
  { id: 'gift', label: '🎁 الهدايا' },
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
    <div style={{ padding: '30px 0 50px' }}>
      {/* Page Header */}
      <div className="wrap" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 800,
          color: 'var(--chocolate)',
          backgroundColor: 'var(--pink)',
          padding: '5px 16px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-block',
          marginBottom: '10px'
        }}>
          قائمة الحلويات الفاخرة 🧁
        </span>
        <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', color: 'var(--chocolate)' }}>
          حلويات محضرة بشغف وإتقان
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '580px', margin: '8px auto 0' }}>
          تصفحي تشكيلتنا الراقية من تشيز كيك، كيكات المناسبات، بوكسات البراونيز المقرمشة والشوكولاتة الأصلية
        </p>
      </div>

      {/* Filter and Search Section */}
      <section className="wrap" style={{ marginBottom: '32px' }}>
        {/* Search input */}
        <div style={{
          position: 'relative',
          maxWidth: '620px',
          margin: '0 auto 22px'
        }}>
          <input
            type="text"
            placeholder="🔍 ابحثي عن نوع تشيز كيك، كيكة، أو طعم مفضل (بيستاشيو، لوتس، سنيكرز...)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '14px 20px 14px 44px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--off-white)',
              fontSize: '15px',
              border: '1px solid var(--beige)',
              boxShadow: 'var(--shadow-sm)'
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
                color: 'var(--muted)',
                fontWeight: 700,
                fontSize: '16px'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '16px'
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
              style={{ fontSize: '13px', padding: '6px 14px' }}
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
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--chocolate)' }}>
            المنتجات المتوفرة:
          </span>
          <span style={{
            backgroundColor: 'var(--off-white)',
            border: '1px solid var(--beige)',
            padding: '2px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: 800,
            color: 'var(--chocolate)'
          }}>
            {filteredProducts.length} صنف
          </span>
        </div>

        {(searchQuery || activeCategory !== 'all' || activeOccasion !== 'all') && (
          <button
            onClick={handleResetFilters}
            className="btn small outline"
            style={{ fontSize: '12.5px', padding: '6px 14px' }}
          >
            <RefreshCw size={13} />
            <span>إلغاء الفلاتر</span>
          </button>
        )}
      </div>

      {/* Product Grid */}
      <section className="wrap" style={{ marginBottom: '40px' }}>
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
            backgroundColor: 'var(--off-white)',
            borderRadius: '24px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px solid var(--beige)',
            maxWidth: '540px',
            margin: '20px auto'
          }}>
            <span style={{ fontSize: '42px', display: 'block', marginBottom: '14px' }}>🔍</span>
            <h3 style={{ fontSize: '20px', color: 'var(--chocolate)', marginBottom: '8px' }}>
              لم يتم العثور على حلويات مطابقة
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginBottom: '20px' }}>
              جرّب تغيير كلمات البحث أو استعراض كل التصنيفات لمشاهدة جميع أصنافنا اللذيذة.
            </p>
            <button onClick={handleResetFilters} className="btn small">
              <span>عرض جميع المنتجات</span>
            </button>
          </div>
        )}
      </section>

      {/* Show Brownie Customizer if Brownies filter is active or generally as extra delight */}
      <div className="wrap">
        <BrownieCustomizer onShowToast={onShowToast} />
      </div>
    </div>
  );
}
