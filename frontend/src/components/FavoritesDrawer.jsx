import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { formatDZD } from '../api';

export default function FavoritesDrawer({ products, onOpenProductModal }) {
  const { isFavsOpen, setIsFavsOpen, favoriteIds, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  const favProducts = (products || []).filter(p => favoriteIds.includes(p.id));

  return (
    <>
      <div
        className={`overlay ${isFavsOpen ? 'show' : ''}`}
        onClick={() => setIsFavsOpen(false)}
      />
      <div className={`drawer ${isFavsOpen ? 'show' : ''}`}>
        <div className="drawer-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} fill="#e63946" color="#e63946" />
            <h3 style={{ fontSize: '18px' }}>قائمتك المفضلة</h3>
            <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
              ({favProducts.length} منتجات)
            </span>
          </div>
          <button className="close-btn" style={{ position: 'static' }} onClick={() => setIsFavsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {favProducts.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '12px',
              color: 'var(--muted)',
              textAlign: 'center',
              padding: '40px 0'
            }}>
              <span style={{ fontSize: '48px' }}>❤️</span>
              <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--chocolate)' }}>
                قائمتك المفضلة فارغة
              </div>
              <p style={{ fontSize: '14px', maxWidth: '240px' }}>
                اضغطي على رمز القلب في أي حلوى تعجبك لحفظها هنا لطلبها لاحقًا!
              </p>
            </div>
          ) : (
            favProducts.map(p => {
              const name = p.name?.ar || p.name;
              const img = p.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200&auto=format&fit=crop';
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    background: 'var(--cream)',
                    borderRadius: '16px',
                    padding: '12px',
                    border: '1px solid var(--beige)',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={img}
                    alt={name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setIsFavsOpen(false);
                      onOpenProductModal(p);
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontWeight: 700, fontSize: '14px', color: 'var(--chocolate)', cursor: 'pointer' }}
                      onClick={() => {
                        setIsFavsOpen(false);
                        onOpenProductModal(p);
                      }}
                    >
                      {name}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--chocolate)', marginTop: '4px' }}>
                      {formatDZD(p.base_price)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button
                      className="btn small"
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      onClick={() => {
                        addToCart(p, null, 1);
                      }}
                    >
                      <ShoppingBag size={13} />
                      <span>أضف</span>
                    </button>

                    <button
                      onClick={() => toggleFavorite(p.id)}
                      style={{ fontSize: '12px', color: '#b33939', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="حذف من المفضلة"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
