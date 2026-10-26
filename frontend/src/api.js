// Direct Supabase Client & API for Taste the Joy
import { supabase } from './supabaseClient';

// Format Algerian Dinar
export function formatDZD(amount) {
  const num = Number(amount) || 0;
  return num.toLocaleString('ar-DZ') + ' دج';
}

// Get or generate persistent Guest ID for reviews & favorites
export function getGuestId() {
  let gid = localStorage.getItem('ttj_guest_id');
  if (!gid) {
    gid = 'guest_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('ttj_guest_id', gid);
  }
  return gid;
}

export const api = {
  // Categories
  async getCategories(all = false) {
    try {
      let q = supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (!all) q = q.eq('is_active', true);
      const { data, error } = await q;
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (e) {
      console.error('getCategories error:', e);
      return { success: false, data: [] };
    }
  },

  async createCategory(catData) {
    const { data, error } = await supabase.from('categories').insert([catData]).select().single();
    if (error) throw error;
    return { success: true, data };
  },

  async updateCategory(id, updates) {
    const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data };
  },

  async deleteCategory(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Products
  async getProducts(params = {}) {
    try {
      let q = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, slug, name),
          option_groups:product_option_groups(
            id, code, name, is_required, min_selections, max_selections, sort_order,
            values:product_option_values(id, name, price_delta, is_available, sort_order)
          )
        `)
        .order('created_at', { ascending: false });

      if (params.category && params.category !== 'all') {
        const { data: cat } = await supabase.from('categories').select('id').eq('slug', params.category).maybeSingle();
        if (cat) q = q.eq('category_id', cat.id);
      }

      if (params.occasion && params.occasion !== 'all') {
        q = q.eq('occasion', params.occasion);
      }

      if (params.featured === 'true') {
        q = q.eq('is_featured', true);
      }

      if (params.all !== 'true') {
        q = q.eq('is_available', true);
      }

      const { data, error } = await q;
      if (error) throw error;

      let list = data || [];
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter(p => {
          const arName = p.name?.ar || '';
          const enName = p.name?.en || '';
          return arName.toLowerCase().includes(s) || enName.toLowerCase().includes(s);
        });
      }

      return {
        success: true,
        data: list.map(p => ({
          ...p,
          category_slug: p.category?.slug,
          category_name: p.category?.name
        }))
      };
    } catch (e) {
      console.error('getProducts error:', e);
      return { success: false, data: [] };
    }
  },

  async getProduct(idOrSlug) {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      let q = supabase.from('products').select(`
        *,
        category:categories(id, slug, name),
        option_groups:product_option_groups(
          id, code, name, is_required, min_selections, max_selections, sort_order,
          values:product_option_values(id, name, price_delta, is_available, sort_order)
        )
      `);
      q = isUUID ? q.eq('id', idOrSlug) : q.eq('slug', idOrSlug);
      const { data, error } = await q.single();
      if (error) throw error;
      return { success: true, data };
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  async createProduct(prodData) {
    const { option_groups, ...p } = prodData;
    const { data, error } = await supabase.from('products').insert([p]).select().single();
    if (error) throw error;
    return { success: true, data };
  },

  async updateProduct(id, updates) {
    const { option_groups, category, ...p } = updates;
    const { data, error } = await supabase.from('products').update(p).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data };
  },

  async deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Coupons
  async validateCoupon(code, subtotal) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .ilike('code', code.trim())
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        return { success: false, message: 'كود الخصم غير صحيح أو غير مفعل' };
      }

      if (Number(subtotal) < Number(data.minimum_subtotal || 0)) {
        return { success: false, message: `الحد الأدنى لتفعيل هذا الكوبون هو ${data.minimum_subtotal} دج` };
      }

      return { success: true, data };
    } catch (e) {
      return { success: false, message: 'تعذر التحقق من الكوبون' };
    }
  },

  async getCoupons() {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    return { success: true, data: data || [] };
  },

  async createCoupon(couponData) {
    const { data, error } = await supabase.from('coupons').insert([couponData]).select().single();
    if (error) throw error;
    return { success: true, data };
  },

  async deleteCoupon(id) {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) throw error;
    return { success: true, message: 'تم حذف الكوبون بنجاح' };
  },

  // Orders
  async createOrder(orderPayload) {
    try {
      const { items, ...orderData } = orderPayload;
      const { data: order, error: ordErr } = await supabase.from('orders').insert([orderData]).select().single();
      if (ordErr) throw ordErr;

      if (items && items.length > 0) {
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product_name,
          unit_price: item.unit_price,
          quantity: item.quantity,
          options_snapshot: item.options_snapshot || [],
          line_total: item.line_total
        }));
        await supabase.from('order_items').insert(orderItems);
      }

      return { success: true, data: order, message: 'تم إرسال طلبك بنجاح! شكراً لثقتكم 🤎' };
    } catch (e) {
      return { success: false, message: 'تعذر إنشاء الطلب: ' + e.message };
    }
  },

  async getOrders() {
    const { data } = await supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false });
    return { success: true, data: data || [] };
  },

  async trackOrder(idOrNum) {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrNum);
      let q = supabase.from('orders').select('*, items:order_items(*)');
      q = isUUID ? q.eq('id', idOrNum) : q.eq('order_number', parseInt(idOrNum, 10));
      const { data, error } = await q.single();
      if (error) throw error;
      return { success: true, data };
    } catch (e) {
      return { success: false, message: 'لم يتم العثور على الطلب' };
    }
  },

  async updateOrderStatus(id, status) {
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data, message: 'تم تحديث حالة الطلب بنجاح' };
  },

  // Reviews
  async getReviews(params = {}) {
    try {
      let q = supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (params.all !== 'true') {
        q = q.eq('status', 'approved');
      }
      const { data, error } = await q;
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (e) {
      return { success: false, data: [] };
    }
  },

  async submitReview(reviewData) {
    const { data, error } = await supabase.from('reviews').insert([{ ...reviewData, status: 'pending' }]).select().single();
    if (error) throw error;
    return { success: true, message: 'شكراً لتقييمك! سيظهر تقييمك بعد المراجعة 🤎' };
  },

  async updateReviewStatus(id, status) {
    const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
    if (error) throw error;
    return { success: true, message: 'تم تحديث حالة التقييم' };
  },

  async deleteReview(id) {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;
    return { success: true, message: 'تم حذف التقييم' };
  },

  // Favorites
  async getFavorites(guestId) {
    const { data } = await supabase.from('favorites').select('product_id').eq('guest_id', guestId);
    return { success: true, data: (data || []).map(f => f.product_id) };
  },

  async toggleFavorite(guestId, productId) {
    const { data: existing } = await supabase.from('favorites').select('id').eq('guest_id', guestId).eq('product_id', productId).maybeSingle();
    if (existing) {
      await supabase.from('favorites').delete().eq('id', existing.id);
      return { success: true, is_favorite: false };
    } else {
      await supabase.from('favorites').insert([{ guest_id: guestId, product_id: productId }]);
      return { success: true, is_favorite: true };
    }
  },

  // Settings
  async getSettings() {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 'main').maybeSingle();
      if (error || !data) {
        return {
          success: true,
          data: {
            store_name: 'Taste the Joy 🤎',
            whatsapp: '213555000000',
            instagram: 'taste.the.joy',
            phone: '0555000000',
            delivery_fee: 500,
            about_text: 'تشكيلة راقية من الحلويات الفاخرة'
          }
        };
      }
      return { success: true, data };
    } catch (e) {
      return { success: true, data: { store_name: 'Taste the Joy 🤎', whatsapp: '213555000000', delivery_fee: 500 } };
    }
  },

  async updateSettings(settingsData) {
    const { data, error } = await supabase.from('settings').upsert({ id: 'main', ...settingsData }).select().single();
    if (error) throw error;
    return { success: true, data, message: 'تم حفظ الإعدادات بنجاح' };
  },

  // Admin Auth & Stats
  async adminLogin(emailOrUsername, password) {
    try {
      const identifier = emailOrUsername.trim();
      // 1. Try Supabase Auth signIn
      if (identifier.includes('@')) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password: password
        });
        if (!error && data?.user) {
          return {
            success: true,
            token: data.session?.access_token || 'supabase_token_' + data.user.id,
            admin: { userId: data.user.id, username: data.user.email },
            message: 'تم تسجيل الدخول بنجاح! مرحبًا بك 🤎'
          };
        }
      }

      // 2. Default fallback
      if (identifier === 'admin' && password === 'admin123') {
        return {
          success: true,
          token: 'default_admin_token',
          admin: { userId: 'admin', username: 'admin' },
          message: 'تم تسجيل الدخول كمسؤول رئيسي 🤎'
        };
      }

      return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    } catch (e) {
      return { success: false, message: 'خطأ في تسجيل الدخول: ' + e.message };
    }
  },

  async createAdminAccount(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password
      });
      if (error) throw error;
      return {
        success: true,
        message: 'تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.',
        admin: { userId: data.user?.id, username: email }
      };
    } catch (e) {
      return { success: false, message: 'تعذر إنشاء الحساب: ' + e.message };
    }
  },

  async getAdminStats() {
    try {
      const { data: allOrders } = await supabase.from('orders').select('id, total, status, created_at');
      const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: revCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      const ordersList = allOrders || [];
      const totalRev = ordersList.reduce((acc, o) => acc + Number(o.total || 0), 0);
      const newOrders = ordersList.filter(o => o.status === 'new').length;
      const preparingOrders = ordersList.filter(o => o.status === 'preparing').length;

      return {
        success: true,
        data: {
          total_revenue: totalRev,
          total_orders: ordersList.length,
          new_orders: newOrders,
          preparing_orders: preparingOrders,
          total_products: prodCount || 0,
          pending_reviews: revCount || 0,
          recent_orders: ordersList.slice(0, 5)
        }
      };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
};
