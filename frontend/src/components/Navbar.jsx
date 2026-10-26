import React from 'react';
import { ShoppingBag, Heart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function Navbar({ onOpenTracker }) {
  const { totalCount, setIsCartOpen } = useCart();
  const { favCount, setIsFavsOpen } = useFavorites();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(251, 246, 238, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--beige)'
    }}>
      <nav className="wrap" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px'
      }}>
        <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🍰</span>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--chocolate)' }}>
            Taste the Joy
          </span>
        </a>

        {/* Desktop links */}
        <div style={{
          display: 'none',
          gap: '24px',
          fontWeight: 600,
          fontSize: '15px'
        }} className="nav-desktop-links">
          <a href="#home" style={{ transition: 'color 0.2s' }}>الرئيسية</a>
          <a href="#cheesecake">تشيز كيك</a>
          <a href="#cakes">الكيك</a>
          <a href="#crunchy">كرانشي</a>
          <a href="#brownies">بوكسات براونيز</a>
          <a href="#about">من نحن</a>
          <a href="#reviews">آراء الزبائن</a>
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Order Tracker */}
          <button
            onClick={onOpenTracker}
            title="تتبع طلبك"
            style={{
              position: 'relative',
              backgroundColor: 'var(--off-white)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--chocolate)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--beige)',
              cursor: 'pointer'
            }}
          >
            <Search size={18} />
          </button>

          {/* Favorites */}
          <button
            onClick={() => setIsFavsOpen(true)}
            title="المفضلة"
            style={{
              position: 'relative',
              backgroundColor: 'var(--off-white)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: favCount > 0 ? '#e63946' : 'var(--chocolate)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--beige)',
              cursor: 'pointer'
            }}
          >
            <Heart size={19} fill={favCount > 0 ? '#e63946' : 'none'} />
            {favCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                background: 'var(--pink)',
                color: 'var(--chocolate)',
                fontSize: '11px',
                fontWeight: 800,
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                {favCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            title="سلة المشتريات"
            style={{
              position: 'relative',
              backgroundColor: 'var(--chocolate)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: 'var(--shadow)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
          >
            <ShoppingBag size={19} />
            {totalCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                background: 'var(--pistachio)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 800,
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
              }}>
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <style>{`
        @media (min-width: 860px) {
          .nav-desktop-links {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
