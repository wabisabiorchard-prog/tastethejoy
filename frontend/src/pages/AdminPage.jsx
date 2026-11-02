import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

export default function AdminPage({ onShowToast }) {
  const { isAdminOpen, setIsAdminOpen } = useAuth();

  useEffect(() => {
    setIsAdminOpen(true);
  }, [setIsAdminOpen]);

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '28px',
        padding: '44px 32px',
        border: '1px solid rgba(199, 125, 255, 0.25)',
        boxShadow: 'var(--shadow)',
        maxWidth: '460px',
        width: '100%'
      }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(123, 44, 191, 0.15), rgba(247, 197, 213, 0.35))',
          color: '#7B2CBF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px'
        }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: '22px', color: 'var(--purple-deep)', fontWeight: 800, marginBottom: '8px' }}>
          لوحة تحكم Touta Délices 🔐
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginBottom: '26px', lineHeight: 1.6 }}>
          منطقة مخصصة لإدارة الطلبات، المنتجات، التقييمات وإعدادات المتجر.
        </p>

        <button
          onClick={() => setIsAdminOpen(true)}
          className="btn"
          style={{ width: '100%', marginBottom: '14px' }}
        >
          <span>فتح لوحة الإدارة</span>
        </button>

        <Link to="/" style={{ fontSize: '14px', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} />
          <span>الرجوع إلى المتجر</span>
        </Link>
      </div>

      <AdminDashboard onShowToast={onShowToast} />
    </div>
  );
}
