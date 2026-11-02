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
        backgroundColor: 'var(--off-white)',
        borderRadius: '26px',
        padding: '40px 30px',
        border: '1px solid var(--beige)',
        boxShadow: 'var(--shadow)',
        maxWidth: '460px',
        width: '100%'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--pink)',
          color: 'var(--chocolate)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Lock size={30} />
        </div>
        <h2 style={{ fontSize: '22px', color: 'var(--chocolate)', marginBottom: '8px' }}>
          لوحة تحكم Taste the Joy 🔐
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginBottom: '24px' }}>
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
