import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatDZD } from '../api';

export default function ProductModal({ product, onClose, onShowToast, allProducts, onSelectProduct }) {
  const { addToCart } = useCart();

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  if (!product) return null;

  const name = product.name?.ar || product.name || 'حلوى Taste the Joy';
  const desc = product.description?.ar || product.description || '';
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'];

  const optionGroups = product.option_groups || [];

  // Calculate current unit price based on selected options
  let currentUnitPrice = Number(product.base_price) || 0;
  const chosenOptionsList = [];

  optionGroups.forEach(group => {
    const selectedValId = selectedOptions[group.id];
    if (selectedValId && group.values) {
      const val = group.values.find(v => v.id === selectedValId);
      if (val) {
        currentUnitPrice += Number(val.price_delta || 0);
        chosenOptionsList.push({
          group_id: group.id,
          group_name: group.name?.ar || group.name,
          ...val
        });
      }
    }
  });

  const totalPrice = currentUnitPrice * quantity;

  // Find similar products in same category
  const similarProducts = (allProducts || [])
    .filter(p => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 3);

  function handleOptionSelect(groupId, valueId) {
    setSelectedOptions(prev => ({
      ...prev,
      [groupId]: valueId
    }));
  }

  function handleAddToCart() {
    // Validate required option groups
    for (const group of optionGroups) {
      if (group.is_required && !selectedOptions[group.id]) {
        alert(`يرجى تحديد: ${group.name?.ar || group.name}`);
        return;
      }
    }

    addToCart(product, chosenOptionsList, quantity);
    if (onShowToast) onShowToast(`تمت إضافة ${quantity} × "${name}" إلى السلة 🛒`);
    onClose();
  }

  return (
    <div className="overlay show" onClick={onClose} style={{ zIndex: 110 }}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-box" style={{ maxWidth: '680px', maxHeight: '92vh' }}>
          <button className="close-btn" onClick={onClose} title="إغلاق">
            <X size={18} />
          </button>

          {/* Main Image & Thumbnails */}
          <div style={{ borderRadius: '20px', overflow: 'hidden', background: 'var(--beige)', aspectRatio: '16/10' }}>
            <img
              src={images[selectedImgIdx] || images[0]}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: selectedImgIdx === idx ? '2px solid var(--chocolate)' : '1px solid var(--beige)',
                    opacity: selectedImgIdx === idx ? 1 : 0.7
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Details */}
          <div style={{ marginTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2>{name}</h2>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--chocolate)' }}>
                {formatDZD(currentUnitPrice)}
              </div>
            </div>

            <p style={{ color: '#6b5645', marginTop: '8px', lineHeight: 1.6, fontSize: '15px' }}>
              {desc}
            </p>

            {/* Option Groups */}
            {optionGroups.length > 0 && (
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {optionGroups.map(group => {
                  const gName = group.name?.ar || group.name;
                  return (
                    <div key={group.id} style={{ background: 'var(--cream)', padding: '14px 18px', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--chocolate)' }}>
                          {gName}
                        </span>
                        {group.is_required && (
                          <span style={{ fontSize: '12px', color: '#c0392b', fontWeight: 600 }}>*مطلوب</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {group.values?.map(val => {
                          const vName = val.name?.ar || val.name;
                          const isSel = selectedOptions[group.id] === val.id;
                          const delta = Number(val.price_delta || 0);

                          return (
                            <button
                              key={val.id}
                              type="button"
                              onClick={() => handleOptionSelect(group.id, val.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: isSel ? 'var(--pistachio)' : '#fff',
                                color: isSel ? '#fff' : 'var(--ink)',
                                border: isSel ? '1px solid var(--pistachio)' : '1px solid var(--beige)',
                                padding: '8px 14px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: 600,
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {isSel && <Check size={14} />}
                              <span>{vName}</span>
                              {delta > 0 && <span>(+{formatDZD(delta)})</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quantity and Add to Cart Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginTop: '24px',
              paddingTop: '18px',
              borderTop: '1px solid var(--beige)'
            }}>
              {/* Quantity Counter */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'var(--cream)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                border: '1px solid var(--beige)'
              }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Minus size={15} />
                </button>
                <span style={{ fontWeight: 800, fontSize: '16px', minWidth: '24px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                className="btn"
                style={{ flex: 1, padding: '14px 20px', fontSize: '16px' }}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>أضف للسلة — {formatDZD(totalPrice)}</span>
              </button>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--beige)' }}>
                <h4 style={{ fontSize: '15px', marginBottom: '12px', color: 'var(--chocolate)' }}>
                  منتجات مشابهة قد تعجبك
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {similarProducts.map(p => {
                    const pName = p.name?.ar || p.name;
                    const pImg = p.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop';
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (onSelectProduct) onSelectProduct(p);
                        }}
                        style={{
                          background: 'var(--cream)',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          padding: '8px'
                        }}
                      >
                        <img src={pImg} alt={pName} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '10px' }} />
                        <div style={{ fontWeight: 700, fontSize: '12px', marginTop: '6px', color: 'var(--chocolate)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
                          {formatDZD(p.base_price)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
