import React from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { formatDZD } from '../api';

export default function ProductCard({ product, onOpenModal, onShowToast }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const name = product.name?.ar || product.name || 'حلوى فاخرة';
  const desc = product.description?.ar || product.description || '';
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop';
  const fav = isFavorite(product.id);

  const hasOptions = product.option_groups && product.option_groups.length > 0;

  function handleQuickAdd(e) {
    e.stopPropagation();
    if (hasOptions) {
      // Open modal so customer selects required options
      onOpenModal(product);
    } else {
      addToCart(product, null, 1);
      if (onShowToast) onShowToast(`تمت إضافة "${name}" إلى السلة 🛒`);
    }
  }

  function handleFavClick(e) {
    e.stopPropagation();
    toggleFavorite(product.id);
    if (onShowToast) {
      onShowToast(fav ? 'تمت الإزالة من المفضلة' : 'أُضيف إلى المفضلة ❤️');
    }
  }

  return (
    <div className="card">
      <div className="imgwrap" onClick={() => onOpenModal(product)}>
        <img src={image} alt={name} loading="lazy" />

        {/* Badges */}
        {product.badge === 'best' && (
          <span className="badge-tag">الأكثر طلبًا 🔥</span>
        )}
        {product.badge === 'new' && (
          <span className="badge-tag new">وصل حديثًا ✨</span>
        )}

        {/* Favorite Button */}
        <button
          className="fav-btn"
          onClick={handleFavClick}
          title={fav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart size={18} fill={fav ? '#e63946' : 'none'} color={fav ? '#e63946' : 'var(--chocolate)'} />
        </button>
      </div>

      <div className="body">
        <h3 onClick={() => onOpenModal(product)} style={{ cursor: 'pointer' }}>
          {name}
        </h3>

        {desc && <p className="desc">{desc}</p>}

        <div className="price-row">
          <div className="price">{formatDZD(product.base_price)}</div>
          {hasOptions && (
            <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
              خيارات إضافية
            </span>
          )}
        </div>

        <div className="actions">
          <button
            className="btn small outline"
            onClick={() => onOpenModal(product)}
            title="عرض التفاصيل"
          >
            <Eye size={14} />
            <span>التفاصيل</span>
          </button>
          <button
            className="btn small"
            onClick={handleQuickAdd}
            title="إضافة سريعة للسلة"
          >
            <ShoppingBag size={14} />
            <span>{hasOptions ? 'تخصيص' : 'أضف'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
