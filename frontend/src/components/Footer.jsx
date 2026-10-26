import React from 'react';
import { MessageCircle, MapPin, Clock } from 'lucide-react';

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '24px' }}>🍰</span>
            <h3 style={{ color: '#fff', fontSize: '20px' }}>Taste the Joy</h3>
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.85, maxWidth: '280px' }}>
            حلويات وكيكات راقية محضّرة بكل حب وإتقان، باش كل مناسبة واحتفال عندكم يكون استثنائي.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '14px' }}>الأقسام السريعة</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <a href="#cheesecake" style={{ opacity: 0.85, transition: 'opacity 0.2s' }}>🍰 Cheesecake بارد</a>
            <a href="#cakes" style={{ opacity: 0.85, transition: 'opacity 0.2s' }}>🎂 كيكات الاحتفالات</a>
            <a href="#crunchy" style={{ opacity: 0.85, transition: 'opacity 0.2s' }}>🍫 Crunchy Cakes</a>
            <a href="#brownies" style={{ opacity: 0.85, transition: 'opacity 0.2s' }}>🎁 بوكسات البراونيز</a>
          </div>
        </div>

        {/* Contact info */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '14px' }}>تواصلوا معنا</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.85 }}
            >
              <MessageCircle size={16} color="#25D366" />
              <span>WhatsApp: +{wa}</span>
            </a>
            <a
              href={`https://instagram.com/${ig}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.85 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Instagram: @{ig}</span>
            </a>
          </div>
        </div>

        {/* Working Hours */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '14px' }}>أوقات العمل والتوصيل</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', opacity: 0.85, marginBottom: '6px' }}>
            <Clock size={16} />
            <span>يوميًا من 10:00 صباحًا إلى 20:00 مساءً</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', opacity: 0.85 }}>
            <MapPin size={16} />
            <span>التوصيل متوفر لجميع الولايات</span>
          </div>
        </div>
      </div>

      <div className="wrap" style={{
        marginTop: '36px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '12px',
        opacity: 0.7
      }}>
        <span>© {new Date().getFullYear()} Taste the Joy — جميع الحقوق محفوظة</span>
        <span>صُنعت بكل 🤎 من أجل لحظاتكم السعيدة</span>
      </div>
    </footer>
  );
}
