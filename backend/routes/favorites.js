const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// GET favorites for a guest
router.get('/', async (req, res) => {
  try {
    const { guest_id } = req.query;
    if (!guest_id) {
      return res.status(400).json({ success: false, message: 'معرف المستخدم (guest_id) مطلوب' });
    }

    if (db.isSupabase && db.supabase) {
      const { data, error } = await db.supabase
        .from('favorites')
        .select('*, product:products(*)')
        .eq('guest_id', guest_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const formatted = (data || []).map(f => ({
        ...f,
        slug: f.product?.slug,
        name: f.product?.name,
        base_price: f.product?.base_price,
        currency: f.product?.currency,
        images: f.product?.images,
        badge: f.product?.badge,
        is_available: f.product?.is_available
      }));
      return res.json({ success: true, data: formatted });
    }

    if (db.isPostgres) {
      const sql = `
        SELECT f.*, p.slug, p.name, p.base_price, p.currency, p.images, p.badge, p.is_available
        FROM public.favorites f
        JOIN public.products p ON f.product_id = p.id
        WHERE f.guest_id = $1
        ORDER BY f.created_at DESC
      `;
      const result = await db.query(sql, [guest_id]);
      return res.json({ success: true, data: result.rows });
    }

    const favs = db.memoryStore.favorites.filter(f => f.guest_id === guest_id);
    const enriched = favs
      .map(f => {
        const p = db.memoryStore.products.find(prod => prod.id === f.product_id);
        if (!p) return null;
        return {
          ...f,
          slug: p.slug,
          name: p.name,
          base_price: p.base_price,
          currency: p.currency,
          images: p.images,
          badge: p.badge,
          is_available: p.is_available
        };
      })
      .filter(Boolean);

    return res.json({ success: true, data: enriched });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب المفضلة', error: err.message });
  }
});

// POST toggle favorite
router.post('/toggle', async (req, res) => {
  try {
    const { guest_id, product_id } = req.body;
    if (!guest_id || !product_id) {
      return res.status(400).json({ success: false, message: 'guest_id و product_id مطلوبان' });
    }

    if (db.isSupabase && db.supabase) {
      const { data: existing } = await db.supabase
        .from('favorites')
        .select('id')
        .eq('guest_id', guest_id)
        .eq('product_id', product_id)
        .maybeSingle();

      if (existing) {
        await db.supabase.from('favorites').delete().eq('id', existing.id);
        return res.json({ success: true, is_favorite: false, message: 'تم الحذف من المفضلة' });
      } else {
        await db.supabase.from('favorites').insert([{
          id: uuidv4(),
          guest_id,
          product_id
        }]);
        return res.json({ success: true, is_favorite: true, message: 'أُضيف إلى المفضلة ❤️' });
      }
    }

    if (db.isPostgres) {
      const check = await db.query(
        'SELECT * FROM public.favorites WHERE guest_id = $1 AND product_id = $2',
        [guest_id, product_id]
      );

      if (check.rows.length > 0) {
        await db.query('DELETE FROM public.favorites WHERE guest_id = $1 AND product_id = $2', [guest_id, product_id]);
        return res.json({ success: true, is_favorite: false, message: 'تم الحذف من المفضلة' });
      } else {
        const id = uuidv4();
        await db.query(
          'INSERT INTO public.favorites (id, guest_id, product_id) VALUES ($1, $2, $3)',
          [id, guest_id, product_id]
        );
        return res.json({ success: true, is_favorite: true, message: 'أُضيف إلى المفضلة ❤️' });
      }
    }

    const idx = db.memoryStore.favorites.findIndex(
      f => f.guest_id === guest_id && f.product_id === product_id
    );

    if (idx !== -1) {
      db.memoryStore.favorites.splice(idx, 1);
      return res.json({ success: true, is_favorite: false, message: 'تم الحذف من المفضلة' });
    } else {
      db.memoryStore.favorites.push({
        id: uuidv4(),
        guest_id,
        product_id,
        created_at: new Date().toISOString()
      });
      return res.json({ success: true, is_favorite: true, message: 'أُضيف إلى المفضلة ❤️' });
    }
  } catch (err) {
    console.error('Error toggling favorite:', err);
    res.status(500).json({ success: false, message: 'تعذر تعديل المفضلة', error: err.message });
  }
});

module.exports = router;
