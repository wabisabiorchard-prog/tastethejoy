const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyAdmin } = require('../middleware/auth');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const includeInactive = req.query.all === 'true';

    // 1. db.supabase Client
    if (db.isSupabase && db.supabase) {
      let q = db.supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (!includeInactive) q = q.eq('is_active', true);
      const { data, error } = await q;
      if (error) throw error;
      return res.json({ success: true, data });
    }

    // 2. Direct Postgres Pool
    if (db.isPostgres) {
      const sql = includeInactive
        ? 'SELECT * FROM public.categories ORDER BY sort_order ASC, created_at ASC'
        : 'SELECT * FROM public.categories WHERE is_active = true ORDER BY sort_order ASC, created_at ASC';
      const result = await db.query(sql);
      return res.json({ success: true, data: result.rows });
    }

    // 3. In-Memory Store
    let cats = db.memoryStore.categories;
    if (!includeInactive) {
      cats = cats.filter(c => c.is_active !== false);
    }
    cats.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    return res.json({ success: true, data: cats });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب الأقسام', error: err.message });
  }
});

// POST create category (Admin)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { slug, name, description, image_url, sort_order, is_active } = req.body;
    if (!slug || !name) {
      return res.status(400).json({ success: false, message: 'الاسم والمعرّف (slug) مطلوبان' });
    }

    const id = uuidv4();
    const nameJson = typeof name === 'object' ? name : { ar: name, en: name };
    const descJson = typeof description === 'object' ? description : { ar: description || '', en: description || '' };
    const order = Number(sort_order) || 0;
    const active = is_active !== false;

    if (db.isSupabase && db.supabase) {
      const { data, error } = await db.supabase.from('categories').insert([{
        id, slug, name: nameJson, description: descJson, image_url, sort_order: order, is_active: active
      }]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    if (db.isPostgres) {
      const result = await db.query(
        `INSERT INTO public.categories (id, slug, name, description, image_url, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [id, slug, nameJson, descJson, image_url, order, active]
      );
      return res.status(201).json({ success: true, data: result.rows[0] });
    }

    const newCat = {
      id,
      slug,
      name: nameJson,
      description: descJson,
      image_url: image_url || null,
      sort_order: order,
      is_active: active,
      created_at: new Date().toISOString()
    };
    db.memoryStore.categories.push(newCat);
    return res.status(201).json({ success: true, data: newCat });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ success: false, message: 'تعذر إنشاء القسم', error: err.message });
  }
});

// PUT update category (Admin)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, name, description, image_url, sort_order, is_active } = req.body;

    if (db.isSupabase && db.supabase) {
      const updates = {};
      if (slug) updates.slug = slug;
      if (name) updates.name = typeof name === 'object' ? name : { ar: name };
      if (description !== undefined) updates.description = typeof description === 'object' ? description : { ar: description };
      if (image_url !== undefined) updates.image_url = image_url;
      if (sort_order !== undefined) updates.sort_order = Number(sort_order);
      if (is_active !== undefined) updates.is_active = Boolean(is_active);

      const { data, error } = await db.supabase.from('categories').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.json({ success: true, data });
    }

    if (db.isPostgres) {
      const result = await db.query(
        `UPDATE public.categories
         SET slug = COALESCE($1, slug),
             name = COALESCE($2, name),
             description = COALESCE($3, description),
             image_url = COALESCE($4, image_url),
             sort_order = COALESCE($5, sort_order),
             is_active = COALESCE($6, is_active)
         WHERE id = $7 RETURNING *`,
        [
          slug,
          name ? (typeof name === 'object' ? name : { ar: name }) : null,
          description ? (typeof description === 'object' ? description : { ar: description }) : null,
          image_url,
          sort_order !== undefined ? Number(sort_order) : null,
          is_active,
          id
        ]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'القسم غير موجود' });
      }
      return res.json({ success: true, data: result.rows[0] });
    }

    const cat = db.memoryStore.categories.find(c => c.id === id);
    if (!cat) return res.status(404).json({ success: false, message: 'القسم غير موجود' });

    if (slug) cat.slug = slug;
    if (name) cat.name = typeof name === 'object' ? name : { ar: name };
    if (description !== undefined) cat.description = typeof description === 'object' ? description : { ar: description };
    if (image_url !== undefined) cat.image_url = image_url;
    if (sort_order !== undefined) cat.sort_order = Number(sort_order);
    if (is_active !== undefined) cat.is_active = Boolean(is_active);

    return res.json({ success: true, data: cat });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ success: false, message: 'تعذر تحديث القسم', error: err.message });
  }
});

// DELETE category (Admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isSupabase && db.supabase) {
      const { error } = await db.supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'تم حذف القسم بنجاح' });
    }

    if (db.isPostgres) {
      await db.query('DELETE FROM public.categories WHERE id = $1', [id]);
      return res.json({ success: true, message: 'تم حذف القسم بنجاح' });
    }

    const idx = db.memoryStore.categories.findIndex(c => c.id === id);
    if (idx !== -1) db.memoryStore.categories.splice(idx, 1);
    return res.json({ success: true, message: 'تم حذف القسم بنجاح' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ success: false, message: 'تعذر حذف القسم', error: err.message });
  }
});

module.exports = router;
