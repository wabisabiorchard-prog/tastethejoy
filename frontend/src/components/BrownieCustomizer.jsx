import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatDZD } from '../api';

const BROWNIE_COUNTS = [
  { n: 5, price: 1200 },
  { n: 6, price: 1400 },
  { n: 7, price: 1600 },
  { n: 8, price: 1800 },
  { n: 9, price: 2000 },
  { n: 10, price: 2200 }
];

const BROWNIE_FLAVORS = [
  { id: 'pistachio', label: 'بيستاشيو إيطالي (Pistachio)', icon: '🟢' },
  { id: 'chocolate', label: 'شوكولاتة الحليب (Milk Chocolate)', icon: '🍫' },
  { id: 'hazelnut', label: 'بندق نوتيلا (Hazelnut)', icon: '🌰' }
];

export default function BrownieCustomizer({ onShowToast }) {
  const { addToCart } = useCart();
  const [selectedCount, setSelectedCount] = useState(6);
  const [selectedFlavor, setSelectedFlavor] = useState('pistachio');

  const currentConfig = BROWNIE_COUNTS.find(c => c.n === selectedCount) || BROWNIE_COUNTS[1];
  const flavorObj = BROWNIE_FLAVORS.find(f => f.id === selectedFlavor) || BROWNIE_FLAVORS[0];

  function handleAddBox() {
    const customProduct = {
      id: 'brownie-custom-box',
      name: {
        ar: `Brownies Box (${selectedCount} حبات - ${flavorObj.label.split(' ')[0]})`,
        en: `Brownies Box (${selectedCount} pcs - ${selectedFlavor})`
      },
      base_price: currentConfig.price,
      images: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop'],
      currency: 'DZD'
    };

    const options = {
      pieces: selectedCount,
      flavor: flavorObj.label,
      totalPrice: currentConfig.price
    };

    addToCart(customProduct, options, 1);
    if (onShowToast) onShowToast(`تمت إضافة بوكس البراونيز (${selectedCount} حبات) 🛒`);
  }

  return (
    <section id="brownies" className="wrap" style={{ padding: '40px 20px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #5B3A29 0%, #3B2A20 100%)',
        color: 'var(--off-white)',
        borderRadius: '28px',
        padding: '36px 30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        alignItems: 'center',
        boxShadow: '0 16px 40px rgba(59, 42, 32, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow circle */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(243, 201, 206, 0.08)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        {/* Options Column */}
        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--pink)', marginBottom: '8px' }}>
            <Sparkles size={18} />
            <span style={{ fontWeight: 700, fontSize: '13px' }}>طازجة وساخنة تذوب في الفم</span>
          </div>

          <h2 style={{ color: '#fff', fontSize: '28px', marginBottom: '10px' }}>
            خصّص Brownies Box 🍫
          </h2>
          <p style={{ color: '#d9c6b8', fontSize: '15px', lineHeight: 1.6, maxWidth: '440px' }}>
            اختاري عدد الحبات ونوع الشوكولاتة الذائبة المفضلة عندك، والسعر يتحدث تلقائيًا!
          </p>

          {/* Step 1: Pieces count */}
          <div style={{ marginTop: '22px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: '#f0e6dc' }}>
              1. اختاري عدد الحبات:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {BROWNIE_COUNTS.map(c => {
                const isSel = selectedCount === c.n;
                return (
                  <button
                    key={c.n}
                    type="button"
                    onClick={() => setSelectedCount(c.n)}
                    style={{
                      background: isSel ? 'var(--pistachio)' : 'rgba(255, 255, 255, 0.08)',
                      borderColor: isSel ? 'var(--pistachio)' : 'rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      padding: '10px 18px',
                      borderRadius: '14px',
                      fontWeight: 700,
                      fontSize: '14px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSel && <Check size={14} style={{ display: 'inline', marginLeft: '4px' }} />}
                    {c.n} حبات
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Flavor */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: '#f0e6dc' }}>
              2. نوع الشوكولاتة والصوص الذائب:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {BROWNIE_FLAVORS.map(f => {
                const isSel = selectedFlavor === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFlavor(f.id)}
                    style={{
                      background: isSel ? 'var(--pistachio)' : 'rgba(255, 255, 255, 0.08)',
                      borderColor: isSel ? 'var(--pistachio)' : 'rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      padding: '10px 16px',
                      borderRadius: '14px',
                      fontWeight: 700,
                      fontSize: '13px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ marginLeft: '6px' }}>{f.icon}</span>
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pricing & Call to Action Column */}
        <div style={{
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '22px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--pistachio)',
            boxShadow: 'var(--shadow)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=300&auto=format&fit=crop"
              alt="Brownie Box"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div>
            <div style={{ fontSize: '13px', color: '#d9c6b8' }}>السعر الإجمالي للبوكس:</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--pink)', marginTop: '4px' }}>
              {formatDZD(currentConfig.price)}
            </div>
          </div>

          <button
            className="btn pistachio"
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            onClick={handleAddBox}
          >
            <ShoppingBag size={18} />
            <span>أضف البوكس إلى السلة 🛒</span>
          </button>
        </div>
      </div>
    </section>
  );
}
