import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function Navbar({ onOpenTracker }) {
  const { totalCount, setIsCartOpen } = useCart();
  const { favCount, setIsFavsOpen } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
      backgroundColor: 'rgba(251, 246, 238, 0.96)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--beige)',
      transition: 'all 0.2s ease'
    }}>
      <nav className="wrap" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        gap: '16px'
      }}>
        {/* Brand Logo - Returns to Home */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <span style={{ fontSize: '26px' }}>🍰</span>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--chocolate)', letterSpacing: '-0.3px' }}>
            Taste the Joy
          </span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Order Tracker / Search Button */}
          <button
            onClick={onOpenTracker}
            title="تتبع طلبك"
            style={{
              position: 'relative',
              backgroundColor: 'var(--off-white)',
              width: '40px',
              height: '40px',
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

          {/* Favorites Button */}
          <button
            onClick={() => setIsFavsOpen(true)}
            title="المفضلة"
            style={{
              position: 'relative',
              backgroundColor: 'var(--off-white)',
              width: '40px',
              height: '40px',
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
            <Heart size={18} fill={favCount > 0 ? '#e63946' : 'none'} />
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
                width: '19px',
                height: '19px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                {favCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            title="سلة المشتريات"
            style={{
              position: 'relative',
              backgroundColor: 'var(--chocolate)',
              width: '40px',
              height: '40px',
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
            <ShoppingBag size={18} />
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
                width: '19px',
                height: '19px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
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
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--off-white)',
              border: '1px solid var(--beige)',
              color: 'var(--chocolate)',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--off-white)',
          borderTop: '1px solid var(--beige)',
          padding: '16px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: 'var(--shadow)'
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
        .nav-link-item {
          padding: 8px 14px;
          border-radius: var(--radius-full);
          color: var(--chocolate);
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
        }
        .nav-link-item:hover {
          background-color: rgba(91, 58, 41, 0.06);
          color: var(--chocolate-hover);
        }
        .nav-link-item.active {
          background-color: var(--chocolate);
          color: #fff !important;
          box-shadow: var(--shadow-sm);
        }

        .mobile-nav-link {
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 15px;
          color: var(--chocolate);
          text-decoration: none;
          transition: all 0.2s;
          display: block;
        }
        .mobile-nav-link:hover {
          background: rgba(91, 58, 41, 0.05);
        }
        .mobile-nav-link.active {
          background: var(--chocolate);
          color: #fff !important;
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
