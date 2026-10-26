const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyAdmin } = require('../middleware/auth');

// Helper to attach option groups and values in Postgres
async function enrichProductsWithPG(products) {
  if (!products.length) return [];
  const productIds = products.map(p => p.id);

  const ogQuery = await db.query(
    `SELECT og.*, 
            COALESCE(
              json_agg(
                json_build_object(
                  'id', ov.id,
                  'name', ov.name,
                  'price_delta', ov.price_delta,
                  'is_available', ov.is_available,
                  'sort_order', ov.sort_order
                ) ORDER BY ov.sort_order ASC
              ) FILTER (WHERE ov.id IS NOT NULL),
              '[]'::json
            ) as values
     FROM public.product_option_groups og
     LEFT JOIN public.product_option_values ov ON og.id = ov.group_id AND ov.is_available = true
     WHERE og.product_id = ANY($1)
     GROUP BY og.id
     ORDER BY og.sort_order ASC`,
    [productIds]
  );

  const groupsByProduct = {};
  ogQuery.rows.forEach(g => {
    if (!groupsByProduct[g.product_id]) groupsByProduct[g.product_id] = [];
    groupsByProduct[g.product_id].push(g);
  });

  return products.map(p => ({
    ...p,
    option_groups: groupsByProduct[p.id] || []
  }));
}

// GET all products (with filtering)
router.get('/', async (req, res) => {
  try {
    const { category, search, occasion, featured, all } = req.query;
    const includeUnavailable = all === 'true';

    // 1. db.supabase Client
    if (db.isSupabase && db.supabase) {
      let q = db.supabase
        .from('products')
        .select(`
          *,
          category:categories(id, slug, name),
          option_groups:product_option_groups(
            id, code, name, is_required, min_selections, max_selections, sort_order,
            values:product_option_values(id, name, price_delta, is_available, sort_order)
          )
        `)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (!includeUnavailable) q = q.eq('is_available', true);
      if (occasion) q = q.eq('occasion', occasion);
      if (featured === 'true') q = q.eq('is_featured', true);

      const { data, error } = await q;
      if (error) throw error;

      let filtered = data.map(p => ({
        ...p,
        category_slug: p.category?.slug || null,
        category_name: p.category?.name || null,
        option_groups: (p.option_groups || []).map(og => ({
          ...og,
          values: (og.values || []).filter(v => v.is_available !== false)
        }))
      }));

      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category_slug === category || p.category_id === category);
      }

      if (search) {
        const sq = search.toLowerCase();
        filtered = filtered.filter(p => {
          const ar = (p.name?.ar || p.name || '').toLowerCase();
          const en = (p.name?.en || '').toLowerCase();
          const desc = (p.description?.ar || p.description || '').toLowerCase();
          return ar.includes(sq) || en.includes(sq) || desc.includes(sq);
        });
      }

      return res.json({ success: true, data: filtered });
    }

    // 2. Postgres Pool
    if (db.isPostgres) {
      let conditions = [];
      let params = [];
      let paramIdx = 1;

      if (!includeUnavailable) conditions.push(`p.is_available = true`);
      if (category && category !== 'all') {
        conditions.push(`(c.slug = $${paramIdx} OR p.category_id::text = $${paramIdx})`);
        params.push(category);
        paramIdx++;
      }
      if (occasion) {
        conditions.push(`p.occasion = $${paramIdx}`);
        params.push(occasion);
        paramIdx++;
      }
      if (featured === 'true') conditions.push(`p.is_featured = true`);
      if (search) {
        conditions.push(`(
          p.name->>'ar' ILIKE $${paramIdx} OR 
          p.name->>'en' ILIKE $${paramIdx} OR 
          p.description->>'ar' ILIKE $${paramIdx}
        )`);
        params.push(`%${search}%`);
        paramIdx++;
      }

      const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
      const sql = `
        SELECT p.*, c.slug as category_slug, c.name as category_name
        FROM public.products p
        LEFT JOIN public.categories c ON p.category_id = c.id
        ${whereClause}
        ORDER BY p.is_featured DESC, p.created_at DESC
      `;
      const result = await db.query(sql, params);
      const enriched = await enrichProductsWithPG(result.rows);
      return res.json({ success: true, data: enriched });
    }

    // 3. Memory Store
    let prods = db.memoryStore.products;
    if (!includeUnavailable) prods = prods.filter(p => p.is_available !== false);

    if (category && category !== 'all') {
      const cat = db.memoryStore.categories.find(c => c.slug === category || c.id === category);
      if (cat) prods = prods.filter(p => p.category_id === cat.id);
    }

    if (occasion) prods = prods.filter(p => p.occasion === occasion);
    if (featured === 'true') prods = prods.filter(p => p.is_featured);

    if (search) {
      const q = search.toLowerCase();
      prods = prods.filter(p => {
        const ar = (p.name?.ar || '').toLowerCase();
        const en = (p.name?.en || '').toLowerCase();
        const desc = (p.description?.ar || '').toLowerCase();
        return ar.includes(q) || en.includes(q) || desc.includes(q);
      });
    }

    const result = prods.map(p => {
      const cat = db.memoryStore.categories.find(c => c.id === p.category_id);
      const groups = db.memoryStore.product_option_groups
        .filter(g => g.product_id === p.id)
        .map(g => {
          const vals = db.memoryStore.product_option_values.filter(v => v.group_id === g.id && v.is_available !== false);
          return { ...g, values: vals };
        });
      return {
        ...p,
        category_slug: cat?.slug || null,
        category_name: cat?.name || null,
        option_groups: groups.length ? groups : p.option_groups || []
      };
    });

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب المنتجات', error: err.message });
  }
});

// GET product by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    if (db.isSupabase && db.supabase) {
      const { data, error } = await db.supabase
        .from('products')
        .select(`
          *,
          category:categories(id, slug, name),
          option_groups:product_option_groups(
            id, code, name, is_required, min_selections, max_selections, sort_order,
            values:product_option_values(id, name, price_delta, is_available, sort_order)
          )
        `)
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle();

      if (error) throw error;
      if (!data) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });

      return res.json({
        success: true,
        data: {
          ...data,
          category_slug: data.category?.slug || null,
          category_name: data.category?.name || null
        }
      });
    }

    if (db.isPostgres) {
      const sql = `
        SELECT p.*, c.slug as category_slug, c.name as category_name
        FROM public.products p
        LEFT JOIN public.categories c ON p.category_id = c.id
        WHERE p.id::text = $1 OR p.slug = $1
      `;
      const result = await db.query(sql, [idOrSlug]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
      }
      const enriched = await enrichProductsWithPG(result.rows);
      return res.json({ success: true, data: enriched[0] });
    }

    const p = db.memoryStore.products.find(x => x.id === idOrSlug || x.slug === idOrSlug);
    if (!p) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });

    const cat = db.memoryStore.categories.find(c => c.id === p.category_id);
    const groups = db.memoryStore.product_option_groups
      .filter(g => g.product_id === p.id)
      .map(g => {
        const vals = db.memoryStore.product_option_values.filter(v => v.group_id === g.id && v.is_available !== false);
        return { ...g, values: vals };
      });

    return res.json({
      success: true,
      data: {
        ...p,
        category_slug: cat?.slug || null,
        category_name: cat?.name || null,
        option_groups: groups.length ? groups : p.option_groups || []
      }
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب تفاصيل المنتج', error: err.message });
  }
});

// POST create product (Admin)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const {
      category_id,
      slug,
      name,
      description,
      base_price,
      currency,
      images,
      is_available,
      is_featured,
      occasion,
      badge,
      option_groups
    } = req.body;

    if (!name || base_price === undefined) {
      return res.status(400).json({ success: false, message: 'اسم المنتج والسعر الأساسي مطلوبان' });
    }

    const id = uuidv4();
    const productSlug = slug || `prod-${Date.now()}`;
    const nameJson = typeof name === 'object' ? name : { ar: name, en: name };
    const descJson = typeof description === 'object' ? description : { ar: description || '', en: description || '' };
    const price = Number(base_price) || 0;
    const curr = currency || 'DZD';
    const imgs = Array.isArray(images) ? images : (images ? [images] : []);
    const available = is_available !== false;
    const featured = Boolean(is_featured);

    if (db.isSupabase && db.supabase) {
      const { data, error } = await db.supabase.from('products').insert([{
        id,
        category_id: category_id || null,
        slug: productSlug,
        name: nameJson,
        description: descJson,
        base_price: price,
        currency: curr,
        images: imgs,
        is_available: available,
        is_featured: featured,
        occasion: occasion || 'special',
        badge: badge || null
      }]).select().single();

      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    if (db.isPostgres) {
      const result = await db.query(
        `INSERT INTO public.products (
          id, category_id, slug, name, description, base_price, currency, images,
          is_available, is_featured, occasion, badge
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [id, category_id || null, productSlug, nameJson, descJson, price, curr, imgs, available, featured, occasion || 'special', badge || null]
      );
      return res.status(201).json({ success: true, data: result.rows[0] });
    }

    const newProd = {
      id,
      category_id: category_id || null,
      slug: productSlug,
      name: nameJson,
      description: descJson,
      base_price: price,
      currency: curr,
      images: imgs,
      is_available: available,
      is_featured: featured,
      occasion: occasion || 'special',
      badge: badge || null,
      option_groups: option_groups || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.memoryStore.products.push(newProd);

    return res.status(201).json({ success: true, data: newProd });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: 'تعذر إضافة المنتج', error: err.message });
  }
});

// PUT update product (Admin)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, slug, name, description, base_price, currency, images, is_available, is_featured, occasion, badge } = req.body;

    if (db.isSupabase && db.supabase) {
      const updates = {};
      if (category_id !== undefined) updates.category_id = category_id;
      if (slug) updates.slug = slug;
      if (name) updates.name = typeof name === 'object' ? name : { ar: name };
      if (description !== undefined) updates.description = typeof description === 'object' ? description : { ar: description };
      if (base_price !== undefined) updates.base_price = Number(base_price);
      if (currency) updates.currency = currency;
      if (images) updates.images = Array.isArray(images) ? images : [images];
      if (is_available !== undefined) updates.is_available = Boolean(is_available);
      if (is_featured !== undefined) updates.is_featured = Boolean(is_featured);
      if (occasion !== undefined) updates.occasion = occasion;
      if (badge !== undefined) updates.badge = badge;
      updates.updated_at = new Date().toISOString();

      const { data, error } = await db.supabase.from('products').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.json({ success: true, data });
    }

    if (db.isPostgres) {
      const result = await db.query(
        `UPDATE public.products
         SET category_id = COALESCE($1, category_id),
             slug = COALESCE($2, slug),
             name = COALESCE($3, name),
             description = COALESCE($4, description),
             base_price = COALESCE($5, base_price),
             currency = COALESCE($6, currency),
             images = COALESCE($7, images),
             is_available = COALESCE($8, is_available),
             is_featured = COALESCE($9, is_featured),
             occasion = COALESCE($10, occasion),
             badge = COALESCE($11, badge),
             updated_at = NOW()
         WHERE id = $12 RETURNING *`,
        [category_id, slug, name ? (typeof name === 'object' ? name : { ar: name }) : null, description ? (typeof description === 'object' ? description : { ar: description }) : null, base_price !== undefined ? Number(base_price) : null, currency, images, is_available, is_featured, occasion, badge, id]
      );
      if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
      return res.json({ success: true, data: result.rows[0] });
    }

    const prod = db.memoryStore.products.find(p => p.id === id);
    if (!prod) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });

    if (category_id !== undefined) prod.category_id = category_id;
    if (slug) prod.slug = slug;
    if (name) prod.name = typeof name === 'object' ? name : { ar: name };
    if (description !== undefined) prod.description = typeof description === 'object' ? description : { ar: description };
    if (base_price !== undefined) prod.base_price = Number(base_price);
    if (currency) prod.currency = currency;
    if (images) prod.images = Array.isArray(images) ? images : [images];
    if (is_available !== undefined) prod.is_available = Boolean(is_available);
    if (is_featured !== undefined) prod.is_featured = Boolean(is_featured);
    if (occasion !== undefined) prod.occasion = occasion;
    if (badge !== undefined) prod.badge = badge;
    prod.updated_at = new Date().toISOString();

    return res.json({ success: true, data: prod });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'تعذر تعديل المنتج', error: err.message });
  }
});

// DELETE product (Admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isSupabase && db.supabase) {
      const { error } = await db.supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
    }

    if (db.isPostgres) {
      await db.query('DELETE FROM public.products WHERE id = $1', [id]);
      return res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
    }

    const idx = db.memoryStore.products.findIndex(p => p.id === id);
    if (idx !== -1) db.memoryStore.products.splice(idx, 1);
    return res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: 'تعذر حذف المنتج', error: err.message });
  }
});

module.exports = router;
