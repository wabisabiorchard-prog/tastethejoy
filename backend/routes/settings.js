const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyAdmin } = require('../middleware/auth');

// GET settings
router.get('/', async (req, res) => {
  try {
    if (db.isSupabase && db.supabase) {
      const { data, error } = await db.supabase.from('settings').select('*').eq('id', 'main').maybeSingle();
      if (data) return res.json({ success: true, data });
    }

    if (db.isPostgres) {
      const result = await db.query('SELECT * FROM public.settings WHERE id = $1', ['main']);
      if (result.rows.length > 0) {
        return res.json({ success: true, data: result.rows[0] });
      }
    }
    return res.json({ success: true, data: db.memoryStore.settings });
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب الإعدادات', error: err.message });
  }
});

// PUT update settings (Admin)
router.put('/', verifyAdmin, async (req, res) => {
  try {
    const { store_name, whatsapp, instagram, phone, delivery_fee, about_text } = req.body;

    if (db.isSupabase && db.supabase) {
      const updates = {};
      if (store_name) updates.store_name = store_name;
      if (whatsapp) updates.whatsapp = whatsapp;
      if (instagram) updates.instagram = instagram;
      if (phone) updates.phone = phone;
      if (delivery_fee !== undefined) updates.delivery_fee = Number(delivery_fee);
      if (about_text) updates.about_text = about_text;

      const { data, error } = await db.supabase.from('settings').upsert({ id: 'main', ...updates }).select().single();
      if (error) throw error;
      return res.json({ success: true, data, message: 'تم حفظ إعدادات المتجر بنجاح' });
    }

    if (db.isPostgres) {
      const result = await db.query(
        `UPDATE public.settings
         SET store_name = COALESCE($1, store_name),
             whatsapp = COALESCE($2, whatsapp),
             instagram = COALESCE($3, instagram),
             phone = COALESCE($4, phone),
             delivery_fee = COALESCE($5, delivery_fee),
             about_text = COALESCE($6, about_text)
         WHERE id = 'main' RETURNING *`,
        [
          store_name,
          whatsapp,
          instagram,
          phone,
          delivery_fee !== undefined ? Number(delivery_fee) : null,
          about_text
        ]
      );
      return res.json({ success: true, data: result.rows[0], message: 'تم حفظ إعدادات المتجر بنجاح' });
    }

    if (store_name) db.memoryStore.settings.store_name = store_name;
    if (whatsapp) db.memoryStore.settings.whatsapp = whatsapp;
    if (instagram) db.memoryStore.settings.instagram = instagram;
    if (phone) db.memoryStore.settings.phone = phone;
    if (delivery_fee !== undefined) db.memoryStore.settings.delivery_fee = Number(delivery_fee);
    if (about_text) db.memoryStore.settings.about_text = about_text;

    return res.json({ success: true, data: db.memoryStore.settings, message: 'تم حفظ إعدادات المتجر بنجاح' });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ success: false, message: 'تعذر حفظ الإعدادات', error: err.message });
  }
});

module.exports = router;
