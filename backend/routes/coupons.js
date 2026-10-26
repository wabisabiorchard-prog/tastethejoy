const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyAdmin } = require('../middleware/auth');

// POST validate coupon (Public)
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'كود الكوبون مطلوب' });
    }

    const orderSubtotal = Number(subtotal) || 0;
    const cleanCode = code.trim().toUpperCase();

    let coupon = null;

    if (db.isSupabase && db.supabase) {
      const { data, error } = await db.supabase
        .from('coupons')
        .select('*')
        .ilike('code', cleanCode)
        .eq('is_active', true)
        .maybeSingle();
      if (data) coupon = data;
    } else if (db.isPostgres) {
      const result = await db.query(
        `SELECT * FROM public.coupons WHERE UPPER(code) = $1 AND is_active = true`,
        [cleanCode]
      );
      if (result.rows.length > 0) coupon = result.rows[0];
    } else {
      coupon = db.memoryStore.coupons.find(
        c => c.code.toUpperCase() === cleanCode && c.is_active !== false
      );
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'كوبون الخصم غير صالح أو غير موجود' });
    }

    const now = new Date();
    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      return res.status(400).json({ success: false, message: 'هذا الكوبون لم يبدأ بعد' });
    }
    if (coupon.ends_at && new Date(coupon.ends_at) < now) {
      return res.status(400).json({ success: false, message: 'انتهت صلاحية هذا الكوبون' });
    }
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ success: false, message: 'تم استهلاك الحد الأقصى لهذا الكوبون' });
    }
    if (orderSubtotal < Number(coupon.minimum_subtotal || 0)) {
      return res.status(400).json({
        success: false,
        message: `الحد الأدنى للطلب لتفعيل هذا الكوبون هو ${coupon.minimum_subtotal} دج`
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = Math.round((orderSubtotal * Number(coupon.discount_value)) / 100);
    } else {
      discountAmount = Number(coupon.discount_value);
    }

    if (discountAmount > orderSubtotal) {
      discountAmount = orderSubtotal;
    }

    return res.json({
      success: true,
      data: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discountAmount,
        minimum_subtotal: coupon.minimum_subtotal
      },
      message: `تم تطبيق الخصم بنجاح! توفير ${discountAmount} دج`
    });
  } catch (err) {
    console.error('Error validating coupon:', err);
    res.status(500).json({ success: false, message: 'خطأ في التحقق من الكوبون', error: err.message });
  }
});

// GET all coupons (Admin)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    if (db.isSupabase && db.supabase) {
      const { data, error } = await db.supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.json({ success: true, data });
    }
    if (db.isPostgres) {
      const result = await db.query('SELECT * FROM public.coupons ORDER BY created_at DESC');
      return res.json({ success: true, data: result.rows });
    }
    return res.json({ success: true, data: db.memoryStore.coupons });
  } catch (err) {
    console.error('Error fetching coupons:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب الكوبونات', error: err.message });
  }
});

// POST create coupon (Admin)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { code, discount_type, discount_value, minimum_subtotal, starts_at, ends_at, usage_limit, is_active } = req.body;

    if (!code || !discount_type || !discount_value) {
      return res.status(400).json({ success: false, message: 'الكود ونوع الخصم وقيمته مطلوبة' });
    }

    const id = uuidv4();
    const cleanCode = code.trim().toUpperCase();
    const minSub = Number(minimum_subtotal) || 0;
    const val = Number(discount_value) || 0;
    const limit = usage_limit ? Number(usage_limit) : null;
    const active = is_active !== false;

    if (db.isSupabase && db.supabase) {
      const { data, error } = await db.supabase.from('coupons').insert([{
        id, code: cleanCode, discount_type, discount_value: val, minimum_subtotal: minSub,
        starts_at: starts_at || null, ends_at: ends_at || null, usage_limit: limit, is_active: active
      }]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    if (db.isPostgres) {
      const result = await db.query(
        `INSERT INTO public.coupons (
          id, code, discount_type, discount_value, minimum_subtotal, starts_at, ends_at, usage_limit, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [id, cleanCode, discount_type, val, minSub, starts_at || null, ends_at || null, limit, active]
      );
      return res.status(201).json({ success: true, data: result.rows[0] });
    }

    const newCoupon = {
      id,
      code: cleanCode,
      discount_type,
      discount_value: val,
      minimum_subtotal: minSub,
      starts_at: starts_at || null,
      ends_at: ends_at || null,
      usage_limit: limit,
      used_count: 0,
      is_active: active,
      created_at: new Date().toISOString()
    };
    db.memoryStore.coupons.push(newCoupon);

    return res.status(201).json({ success: true, data: newCoupon });
  } catch (err) {
    console.error('Error creating coupon:', err);
    res.status(500).json({ success: false, message: 'تعذر إنشاء الكوبون', error: err.message });
  }
});

// DELETE coupon (Admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isSupabase && db.supabase) {
      const { error } = await db.supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'تم حذف الكوبون بنجاح' });
    }

    if (db.isPostgres) {
      await db.query('DELETE FROM public.coupons WHERE id = $1', [id]);
      return res.json({ success: true, message: 'تم حذف الكوبون بنجاح' });
    }

    const idx = db.memoryStore.coupons.findIndex(c => c.id === id);
    if (idx !== -1) db.memoryStore.coupons.splice(idx, 1);
    return res.json({ success: true, message: 'تم حذف الكوبون بنجاح' });
  } catch (err) {
    console.error('Error deleting coupon:', err);
    res.status(500).json({ success: false, message: 'تعذر حذف الكوبون', error: err.message });
  }
});

module.exports = router;
