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
    <section id="brownies" className="wrap" style={{ padding: '30px 20px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #431259 0%, #5B1D7C 50%, #7B2CBF 100%)',
        color: '#FFFFFF',
        borderRadius: '30px',
        padding: '38px 32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '32px',
        alignItems: 'center',
        boxShadow: '0 20px 48px rgba(67, 18, 89, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(224, 170, 255, 0.25)'
      }}>
        {/* Background glow circle */}
        <div style={{
          position: 'absolute',
          top: '-70px',
          right: '-70px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'rgba(247, 197, 213, 0.15)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        {/* Options Column */}
        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--pink)', marginBottom: '8px' }}>
            <Sparkles size={18} />
            <span style={{ fontWeight: 800, fontSize: '13.5px' }}>طازجة وساخنة تذوب في الفم</span>
          </div>

          <h2 style={{ color: '#fff', fontSize: '30px', marginBottom: '10px', fontWeight: 800 }}>
            خصّصي Brownies Box 🍫✨
          </h2>
          <p style={{ color: '#E8D6F7', fontSize: '15px', lineHeight: 1.7, maxWidth: '460px' }}>
            اختاري عدد الحبات ونوع الشوكولاتة الذائبة المفضلة عندك، والسعر يتحدث تلقائيًا!
          </p>

          {/* Step 1: Pieces count */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ fontWeight: 800, fontSize: '14.5px', marginBottom: '10px', color: '#F7EEFD' }}>
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
                      background: isSel ? 'linear-gradient(135deg, #70D6BC 0%, #56CFB2 100%)' : 'rgba(255, 255, 255, 0.1)',
                      borderColor: isSel ? '#70D6BC' : 'rgba(255, 255, 255, 0.25)',
                      color: isSel ? '#1E473D' : '#fff',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      padding: '10px 18px',
                      borderRadius: '16px',
                      fontWeight: 800,
                      fontSize: '14px',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isSel ? '0 4px 14px rgba(112, 214, 188, 0.4)' : 'none',
                      transform: isSel ? 'scale(1.04)' : 'none'
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
          <div style={{ marginTop: '22px' }}>
            <div style={{ fontWeight: 800, fontSize: '14.5px', marginBottom: '10px', color: '#F7EEFD' }}>
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
                      background: isSel ? 'linear-gradient(135deg, #FF5D8F 0%, #FF85A2 100%)' : 'rgba(255, 255, 255, 0.1)',
                      borderColor: isSel ? '#FF85A2' : 'rgba(255, 255, 255, 0.25)',
                      color: '#fff',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      padding: '10px 16px',
                      borderRadius: '16px',
                      fontWeight: 800,
                      fontSize: '13px',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isSel ? '0 4px 14px rgba(255, 93, 143, 0.4)' : 'none',
                      transform: isSel ? 'scale(1.03)' : 'none'
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
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '26px',
          border: '1.5px solid rgba(255, 255, 255, 0.22)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--lavender)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=300&auto=format&fit=crop"
              alt="Brownie Box"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div>
            <div style={{ fontSize: '13px', color: '#E8D6F7', fontWeight: 600 }}>السعر الإجمالي للبوكس:</div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--pink)', marginTop: '2px' }}>
              {formatDZD(currentConfig.price)}
            </div>
          </div>

          <button
            className="btn pistachio"
            style={{ width: '100%', padding: '14px', fontSize: '15.5px' }}
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
