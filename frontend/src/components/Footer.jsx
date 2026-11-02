import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, MapPin, Clock, Heart, Sparkles } from 'lucide-react';

export default function Footer({ settings }) {
  const wa = settings?.whatsapp || '213555000000';
  const ig = settings?.instagram || 'touta.delices';

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #220933 0%, #13041F 100%)',
      color: '#F4EEF8',
      padding: '56px 0 calc(32px + env(safe-area-inset-bottom, 0px))',
      marginTop: 'auto',
      borderTop: '1px solid rgba(199, 125, 255, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background soft glow decoration */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '10%',
        width: '350px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(157, 78, 221, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(40px)'
      }} />

      <div className="wrap" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '36px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Brand */}
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px', textDecoration: 'none' }}>
            <span style={{ fontSize: '26px', filter: 'drop-shadow(0 2px 6px rgba(247,197,213,0.4))' }}>🍰</span>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F7C5D5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.3px'
            }}>
              Touta Délices
            </h3>
          </Link>
          <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#D9C8E2', maxWidth: '280px' }}>
            حلويات وكيكات راقية محضّرة بكل حب وشغف، لتجعل كل احتفال ولحظة حلوة تجربة ساحرة لا تُنسى.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              background: 'rgba(86, 207, 178, 0.15)',
              color: '#56CFB2',
              border: '1px solid rgba(86, 207, 178, 0.3)'
            }}>
              <Sparkles size={12} /> حلويات طازجة يومياً
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#F7C5D5', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>أقسام الحلويات</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '14px' }}>
            <Link to="/products?category=cheesecake" className="footer-link" style={{ color: '#E8DDF0', textDecoration: 'none', transition: 'all 0.2s' }}>
              🍰 تشيز كيك بارد وفواكه
            </Link>
            <Link to="/products?category=cakes" className="footer-link" style={{ color: '#E8DDF0', textDecoration: 'none', transition: 'all 0.2s' }}>
              🎂 كيكات المناسبات والاحتفال
            </Link>
            <Link to="/products?category=crunchy" className="footer-link" style={{ color: '#E8DDF0', textDecoration: 'none', transition: 'all 0.2s' }}>
              🍫 كرانشي كيك بنكهات غنية
            </Link>
            <Link to="/products?category=brownies" className="footer-link" style={{ color: '#E8DDF0', textDecoration: 'none', transition: 'all 0.2s' }}>
              🎁 بوكسات البراونيز المخصصة
            </Link>
          </div>
        </div>

        {/* Navigation Pages */}
        <div>
          <h4 style={{ color: '#F7C5D5', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>صفحات الموقع</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '14px' }}>
            <Link to="/" className="footer-link" style={{ color: '#E8DDF0', textDecoration: 'none' }}>🏠 الصفحة الرئيسية</Link>
            <Link to="/products" className="footer-link" style={{ color: '#E8DDF0', textDecoration: 'none' }}>🛒 تصفح القائمة كاملة</Link>
            <Link to="/about" className="footer-link" style={{ color: '#E8DDF0', textDecoration: 'none' }}>✨ قصة Touta Délices</Link>
            <Link to="/reviews" className="footer-link" style={{ color: '#E8DDF0', textDecoration: 'none' }}>⭐ تجارب وآراء زبائننا</Link>
            <Link to="/contact" className="footer-link" style={{ color: '#E8DDF0', textDecoration: 'none' }}>📞 تواصل معنا والطلبات</Link>
          </div>
        </div>

        {/* Contact info & Working Hours */}
        <div>
          <h4 style={{ color: '#F7C5D5', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>خدمة الزبائن والطلب</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              style={{ display: 'flex', alignItems: 'center', gap: '9px', color: '#E8DDF0', textDecoration: 'none' }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(37, 211, 102, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={15} color="#25D366" />
              </div>
              <span>واتساب: +{wa}</span>
            </a>
            <a
              href={`https://instagram.com/${ig}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              style={{ display: 'flex', alignItems: 'center', gap: '9px', color: '#E8DDF0', textDecoration: 'none' }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(247, 197, 213, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F7C5D5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <span>إنستغرام: @{ig}</span>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', color: '#D9C8E2', marginTop: '2px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(199, 125, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={14} color="#C77DFF" />
              </div>
              <span>يومياً من 10:00 صباحاً إلى 20:00 مساءً</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', color: '#D9C8E2' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(199, 125, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={14} color="#C77DFF" />
              </div>
              <span>توصيل سريع ومضمون لكافة الولايات</span>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{
        marginTop: '42px',
        paddingTop: '22px',
        borderTop: '1px solid rgba(199, 125, 255, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '13px',
        color: '#BFA8CE'
      }}>
        <span>© {new Date().getFullYear()} Touta Délices — جميع الحقوق محفوظة</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          صُنعت بكل <Heart size={14} fill="#F7C5D5" color="#F7C5D5" /> و 💜 لنسعد أوقاتكم
        </span>
      </div>
    </footer>
  );
}
