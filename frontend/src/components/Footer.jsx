import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, MapPin, Clock, Heart } from 'lucide-react';

export default function Footer({ settings }) {
  const wa = settings?.whatsapp || '213555000000';
  const ig = settings?.instagram || 'taste.the.joy';

  return (
    <footer style={{
      background: 'var(--chocolate)',
      color: '#f2e6da',
      padding: '50px 0 calc(30px + env(safe-area-inset-bottom, 0px))',
      marginTop: 'auto'
    }}>
      <div className="wrap" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '32px'
      }}>
        {/* Brand */}
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px', textDecoration: 'none' }}>
            <span style={{ fontSize: '24px' }}>🍰</span>
            <h3 style={{ color: '#fff', fontSize: '20px' }}>Taste the Joy</h3>
          </Link>
          <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.85, maxWidth: '280px' }}>
            حلويات وكيكات راقية محضّرة بكل حب وإتقان، باش كل مناسبة واحتفال عندكم يكون استثنائي وطعمه لا يُنسى.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '14px' }}>أقسام المتجر</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '14px' }}>
            <Link to="/products?category=cheesecake" style={{ opacity: 0.85, transition: 'opacity 0.2s', textDecoration: 'none' }}>
              🍰 Cheesecake بارد
            </Link>
            <Link to="/products?category=cakes" style={{ opacity: 0.85, transition: 'opacity 0.2s', textDecoration: 'none' }}>
              🎂 كيكات الاحتفالات
            </Link>
            <Link to="/products?category=crunchy" style={{ opacity: 0.85, transition: 'opacity 0.2s', textDecoration: 'none' }}>
              🍫 Crunchy Cakes
            </Link>
            <Link to="/products?category=brownies" style={{ opacity: 0.85, transition: 'opacity 0.2s', textDecoration: 'none' }}>
              🎁 بوكسات البراونيز المخصصة
            </Link>
          </div>
        </div>

        {/* Navigation Pages */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '14px' }}>روابط سريعة</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '14px' }}>
            <Link to="/" style={{ opacity: 0.85, textDecoration: 'none' }}>🏠 الصفحة الرئيسية</Link>
            <Link to="/products" style={{ opacity: 0.85, textDecoration: 'none' }}>🛒 تصفح جميع المنتجات</Link>
            <Link to="/about" style={{ opacity: 0.85, textDecoration: 'none' }}>📖 قصة المتجر (من نحن)</Link>
            <Link to="/reviews" style={{ opacity: 0.85, textDecoration: 'none' }}>⭐ آراء وتقييمات الزبائن</Link>
            <Link to="/contact" style={{ opacity: 0.85, textDecoration: 'none' }}>📞 تواصل معنا</Link>
          </div>
        </div>

        {/* Contact info & Working Hours */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '14px' }}>خدمة الزبائن والتوصيل</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, textDecoration: 'none' }}
            >
              <MessageCircle size={16} color="#25D366" />
              <span>واتساب للطلبات: +{wa}</span>
            </a>
            <a
              href={`https://instagram.com/${ig}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, textDecoration: 'none' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>إنستغرام: @{ig}</span>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.85, marginTop: '4px' }}>
              <Clock size={16} />
              <span>يوميًا من 10:00 صباحًا إلى 20:00 مساءً</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.85 }}>
              <MapPin size={16} />
              <span>التوصيل متوفر لجميع الولايات (58 ولاية)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{
        marginTop: '36px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '12px',
        opacity: 0.75
      }}>
        <span>© {new Date().getFullYear()} Taste the Joy — جميع الحقوق محفوظة</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          صُنعت بكل 🤎 من أجل أسعد اللحظات
        </span>
      </div>
    </footer>
  );
}
