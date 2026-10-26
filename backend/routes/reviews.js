const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyAdmin } = require('../middleware/auth');

// GET reviews
router.get('/', async (req, res) => {
  try {
    const { status, product_id, all } = req.query;

    if (db.isSupabase && db.supabase) {
      let q = db.supabase.from('reviews').select('*, product:products(name, slug, images)').order('created_at', { ascending: false });
      if (all !== 'true' && !status) {
        q = q.eq('status', 'approved');
      } else if (status) {
        q = q.eq('status', status);
      }
      if (product_id) q = q.eq('product_id', product_id);

      const { data, error } = await q;
      if (error) throw error;

      const formatted = (data || []).map(r => ({
        ...r,
        product_name: r.product?.name || null,
        product_slug: r.product?.slug || null,
        product_image: r.product?.images?.[0] || null
      }));
      return res.json({ success: true, data: formatted });
    }

    if (db.isPostgres) {
      let conditions = [];
      let params = [];
      let idx = 1;

      if (all !== 'true' && !status) {
        conditions.push(`r.status = 'approved'`);
      } else if (status) {
        conditions.push(`r.status = $${idx}`);
        params.push(status);
        idx++;
      }

      if (product_id) {
        conditions.push(`r.product_id = $${idx}`);
        params.push(product_id);
        idx++;
      }

      const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
      const sql = `
        SELECT r.*, p.name as product_name, p.slug as product_slug, p.images[1] as product_image
        FROM public.reviews r
        LEFT JOIN public.products p ON r.product_id = p.id
        ${whereClause}
        ORDER BY r.created_at DESC
      `;
      const result = await db.query(sql, params);
      return res.json({ success: true, data: result.rows });
    }

    let revs = [...db.memoryStore.reviews];
    if (all !== 'true' && !status) {
      revs = revs.filter(r => r.status === 'approved');
    } else if (status) {
      revs = revs.filter(r => r.status === status);
    }

    if (product_id) revs = revs.filter(r => r.product_id === product_id);

    const enriched = revs.map(r => {
      const prod = db.memoryStore.products.find(p => p.id === r.product_id);
      return {
        ...r,
        product_name: prod?.name || null,
        product_slug: prod?.slug || null,
        product_image: prod?.images?.[0] || null
      };
    });

    return res.json({ success: true, data: enriched });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب التقييمات', error: err.message });
  }
});

// POST submit review
router.post('/', async (req, res) => {
  try {
    const { guest_id, product_id, author_name, rating, comment } = req.body;

    if (!guest_id || !product_id || !rating) {
      return res.status(400).json({ success: false, message: 'معرف المستخدم والمنتج والتقييم مطلوبان' });
    }

    const starRating = Math.min(5, Math.max(1, Number(rating) || 5));
    const id = uuidv4();

    if (db.isSupabase && db.supabase) {
      const { data, error } = await db.supabase.from('reviews').upsert({
        id,
        guest_id,
        product_id,
        author_name: author_name || 'زبون مميز',
        rating: starRating,
        comment: comment || '',
        status: 'pending'
      }, { onConflict: 'guest_id,product_id' }).select().single();

      if (error) throw error;
      return res.status(201).json({
        success: true,
        data,
        message: 'شكرًا لك! تم إرسال تقييمك وسيظهر بعد موافقة الإدارة 🤎'
      });
    }

    if (db.isPostgres) {
      const result = await db.query(
        `INSERT INTO public.reviews (id, guest_id, product_id, author_name, rating, comment, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending')
         ON CONFLICT (guest_id, product_id)
         DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, author_name = EXCLUDED.author_name, status = 'pending', created_at = NOW()
         RETURNING *`,
        [id, guest_id, product_id, author_name || 'زبون مميز', starRating, comment || '']
      );
      return res.status(201).json({
        success: true,
        data: result.rows[0],
        message: 'شكرًا لك! تم إرسال تقييمك وسيظهر بعد موافقة الإدارة 🤎'
      });
    }

    const existingIdx = db.memoryStore.reviews.findIndex(
      r => r.guest_id === guest_id && r.product_id === product_id
    );

    const reviewObj = {
      id,
      guest_id,
      product_id,
      author_name: author_name || 'زبون مميز',
      rating: starRating,
      comment: comment || '',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      db.memoryStore.reviews[existingIdx] = reviewObj;
    } else {
      db.memoryStore.reviews.unshift(reviewObj);
    }

    return res.status(201).json({
      success: true,
      data: reviewObj,
      message: 'شكرًا لك! تم إرسال تقييمك وسيظهر بعد موافقة الإدارة 🤎'
    });
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ success: false, message: 'تعذر إرسال التقييم', error: err.message });
  }
});

// PATCH review status (Admin)
router.patch('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'حالة التقييم غير صالحة' });
    }

    if (db.isSupabase && db.supabase) {
      const { data, error } = await db.supabase.from('reviews').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return res.json({ success: true, data, message: `تم تعديل حالة التقييم إلى ${status}` });
    }

    if (db.isPostgres) {
      const result = await db.query(
        `UPDATE public.reviews SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'التقييم غير موجود' });
      }
      return res.json({ success: true, data: result.rows[0], message: `تم تعديل حالة التقييم إلى ${status}` });
    }

    const rev = db.memoryStore.reviews.find(r => r.id === id);
    if (!rev) return res.status(404).json({ success: false, message: 'التقييم غير موجود' });

    rev.status = status;
    return res.json({ success: true, data: rev, message: `تم تعديل حالة التقييم إلى ${status}` });
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ success: false, message: 'تعذر تعديل التقييم', error: err.message });
  }
});

// DELETE review (Admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isSupabase && db.supabase) {
      const { error } = await db.supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'تم حذف التقييم' });
    }

    if (db.isPostgres) {
      await db.query('DELETE FROM public.reviews WHERE id = $1', [id]);
      return res.json({ success: true, message: 'تم حذف التقييم' });
    }

    const idx = db.memoryStore.reviews.findIndex(r => r.id === id);
    if (idx !== -1) db.memoryStore.reviews.splice(idx, 1);
    return res.json({ success: true, message: 'تم حذف التقييم' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ success: false, message: 'تعذر حذف التقييم', error: err.message });
  }
});

module.exports = router;
