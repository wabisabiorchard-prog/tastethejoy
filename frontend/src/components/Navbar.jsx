import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function Navbar({ onOpenTracker }) {
  const { totalCount, setIsCartOpen } = useCart();
  const { favCount, setIsFavsOpen } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/products', label: 'الحلويات والمنتجات' },
    { to: '/about', label: 'من نحن' },
    { to: '/reviews', label: 'آراء الزبائن' },
    { to: '/contact', label: 'تواصل معنا' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(235, 228, 247, 0.85)',
      boxShadow: '0 4px 20px rgba(108, 40, 158, 0.04)',
      transition: 'all 0.3s ease'
    }}>
      <nav className="wrap" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        gap: '16px'
      }}>
        {/* Brand Logo - Returns to Home */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          onClick={() => setMobileMenuOpen(false)}
          className="brand-logo-hover"
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #E0AAFF 0%, #F7C5D5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(123, 44, 191, 0.2)',
            fontSize: '22px'
          }}>
            🍰
          </div>
          <div>
            <span style={{
              fontSize: '22px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #431259 0%, #7B2CBF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.3px',
              display: 'block',
              lineHeight: 1.1
            }}>
              Touta Délices
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.2px' }}>
              حلويات فاخرة ومبهجة ✨
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 700,
          fontSize: '14.5px'
        }} className="nav-desktop-links">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Order Tracker / Search Button */}
          <button
            onClick={onOpenTracker}
            title="تتبع طلبك والبحث"
            className="nav-icon-btn"
            style={{
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--purple-deep)',
              boxShadow: '0 2px 10px rgba(108, 40, 158, 0.08)',
              border: '1px solid var(--beige)',
              cursor: 'pointer'
            }}
          >
            <Search size={18} />
          </button>

          {/* Favorites Button */}
          <button
            onClick={() => setIsFavsOpen(true)}
            title="المفضلة"
            className="nav-icon-btn"
            style={{
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: favCount > 0 ? '#FF5D8F' : 'var(--purple-deep)',
              boxShadow: '0 2px 10px rgba(108, 40, 158, 0.08)',
              border: '1px solid var(--beige)',
              cursor: 'pointer'
            }}
          >
            <Heart size={19} fill={favCount > 0 ? '#FF5D8F' : 'none'} />
            {favCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                background: 'linear-gradient(135deg, #FF5D8F 0%, #FF85A2 100%)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 800,
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(255, 93, 143, 0.4)'
              }}>
                {favCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            title="سلة المشتريات"
            className="nav-icon-btn cart-btn-pop"
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #6C289E 0%, #9D4EDD 100%)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(108, 40, 158, 0.3)',
              cursor: 'pointer'
            }}
          >
            <ShoppingBag size={18} />
            {totalCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                background: 'linear-gradient(135deg, #56CFB2 0%, #70D6BC 100%)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 800,
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(86, 207, 178, 0.45)'
              }}>
                {totalCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle"
            aria-label="القائمة"
            style={{
              display: 'none',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid var(--beige)',
              color: 'var(--purple-deep)',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(108, 40, 158, 0.08)'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--beige)',
          padding: '16px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 12px 28px rgba(108, 40, 158, 0.12)',
          animation: 'fadeIn 0.25s ease'
        }} className="mobile-nav-panel">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        .brand-logo-hover {
          transition: transform 0.25s ease;
        }
        .brand-logo-hover:hover {
          transform: translateY(-1px) scale(1.02);
        }

        .nav-link-item {
          padding: 8px 16px;
          border-radius: var(--radius-full);
          color: var(--purple-deep);
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .nav-link-item:hover {
          background-color: var(--lavender-light);
          color: var(--purple-primary);
          transform: translateY(-1px);
        }
        .nav-link-item.active {
          background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%);
          color: #fff !important;
          box-shadow: 0 4px 14px rgba(123, 44, 191, 0.28);
        }

        .nav-icon-btn {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-icon-btn:hover {
          transform: translateY(-2px) scale(1.06);
          border-color: var(--lavender) !important;
          box-shadow: 0 6px 16px rgba(108, 40, 158, 0.16) !important;
        }
        .nav-icon-btn:active {
          transform: scale(0.92);
        }

        .mobile-nav-link {
          padding: 12px 18px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 15px;
          color: var(--purple-deep);
          text-decoration: none;
          transition: all 0.2s;
          display: block;
        }
        .mobile-nav-link:hover {
          background: var(--lavender-light);
          color: var(--purple-primary);
        }
        .mobile-nav-link.active {
          background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%);
          color: #fff !important;
          box-shadow: 0 4px 12px rgba(123, 44, 191, 0.25);
        }

        @media (min-width: 860px) {
          .nav-desktop-links {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
          .mobile-nav-panel {
            display: none !important;
          }
        }

        @media (max-width: 859px) {
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
