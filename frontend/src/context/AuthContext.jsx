import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('ttj_admin_token') || null);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ttj_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  function isCurrentAdminUrl() {
    const p = window.location.pathname.toLowerCase();
    const h = window.location.hash.toLowerCase();
    return p.includes('tastethejoyadmin') || h.includes('admin') || h.includes('tastethejoyadmin');
  }

  const [isAdminOpen, setIsAdminOpen] = useState(() => isCurrentAdminUrl());

  // Listen to path changes, hash changes, or popstate
  useEffect(() => {
    function checkPath() {
      if (isCurrentAdminUrl()) {
        setIsAdminOpen(true);
      }
    }

    checkPath();
    window.addEventListener('popstate', checkPath);
    window.addEventListener('hashchange', checkPath);
    return () => {
      window.removeEventListener('popstate', checkPath);
      window.removeEventListener('hashchange', checkPath);
    };
  }, []);

  function handleSetIsAdminOpen(open) {
    setIsAdminOpen(open);
    if (!open && isCurrentAdminUrl()) {
      window.history.pushState(null, '', '/');
    }
  }

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('ttj_admin_token', adminToken);
    } else {
      localStorage.removeItem('ttj_admin_token');
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('ttj_admin_user', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('ttj_admin_user');
    }
  }, [adminUser]);

  async function login(username, password) {
    try {
      const res = await api.adminLogin(username, password);
      if (res.success && res.token) {
        setAdminToken(res.token);
        setAdminUser(res.admin);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'فشل تسجيل الدخول' };
    } catch (err) {
      return { success: false, message: 'تعذر الاتصال بالخادم' };
    }
  }

  function logout() {
    setAdminToken(null);
    setAdminUser(null);
    setIsAdminOpen(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAdminLoggedIn: Boolean(adminToken),
        adminUser,
        login,
        logout,
        isAdminOpen,
        setIsAdminOpen: handleSetIsAdminOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
