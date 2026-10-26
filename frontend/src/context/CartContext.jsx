import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ttj_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState('delivery'); // 'delivery' | 'pickup'

  useEffect(() => {
    localStorage.setItem('ttj_cart_v2', JSON.stringify(cart));
  }, [cart]);

  // Recalculate coupon if subtotal falls below minimum
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = fulfillmentType === 'delivery' ? 500 : 0;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (subtotal < Number(appliedCoupon.minimum_subtotal || 0)) {
      setAppliedCoupon(null);
      setCouponError(`تم إلغاء الكوبون لأن المجموع أقل من ${appliedCoupon.minimum_subtotal} دج`);
    } else if (appliedCoupon.discount_type === 'percentage') {
      discountAmount = Math.round((subtotal * Number(appliedCoupon.discount_value)) / 100);
    } else {
      discountAmount = Math.min(Number(appliedCoupon.discount_value), subtotal);
    }
  }

  const total = Math.max(0, subtotal - discountAmount + deliveryFee);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product, options = null, qty = 1) {
    // Generate unique key based on product ID and selected options
    const optKey = options ? JSON.stringify(options) : '';
    const itemKey = `${product.id}_${optKey}`;

    // Calculate item unit price (base_price + options price_delta)
    let unitPrice = Number(product.base_price) || 0;
    let optionsSnapshot = [];

    if (Array.isArray(options)) {
      options.forEach(opt => {
        unitPrice += Number(opt.price_delta || 0);
        optionsSnapshot.push({
          group_name: opt.group_name || '',
          value_name: opt.name?.ar || opt.name || '',
          price_delta: opt.price_delta || 0
        });
      });
    } else if (options && typeof options === 'object') {
      // Brownies box or key-value options
      optionsSnapshot = options;
      if (options.totalPrice) {
        unitPrice = options.totalPrice;
      }
    }

    setCart(prev => {
      const existing = prev.find(i => i.key === itemKey);
      if (existing) {
        return prev.map(i =>
          i.key === itemKey ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          key: itemKey,
          product_id: product.id,
          name: product.name,
          image: product.images?.[0] || product.image || '',
          price: unitPrice,
          quantity: qty,
          options_snapshot: optionsSnapshot
        }
      ];
    });
  }

  function updateQty(key, delta) {
    setCart(prev =>
      prev
        .map(i => {
          if (i.key === key) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  }

  function removeFromCart(key) {
    setCart(prev => prev.filter(i => i.key !== key));
  }

  function clearCart() {
    setCart([]);
    setAppliedCoupon(null);
    setCouponError('');
  }

  async function applyCoupon(code) {
    if (!code.trim()) return false;
    setCouponError('');
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.success) {
        setAppliedCoupon(res.data);
        return { success: true, message: res.message };
      } else {
        setCouponError(res.message);
        return { success: false, message: res.message };
      }
    } catch (err) {
      setCouponError('تعذر تطبيق الكوبون');
      return { success: false, message: 'تعذر تطبيق الكوبون' };
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponError('');
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        totalCount,
        subtotal,
        deliveryFee,
        discountAmount,
        total,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        fulfillmentType,
        setFulfillmentType,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
