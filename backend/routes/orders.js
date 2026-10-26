const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyAdmin } = require('../middleware/auth');

function buildWhatsAppUrl(order, items, storeSettings) {
  const phone = storeSettings?.whatsapp || '213555000000';
  let text = `🤎 طلب جديد من Taste the Joy\n`;
  text += `رقم الطلب: #${order.order_number || ''}\n`;
  text += `الاسم: ${order.customer_name}\n`;
  text += `الهاتف: ${order.phone}\n`;
  text += `طريقة الاستلام: ${order.fulfillment_type === 'delivery' ? 'توصيل للمنزل' : 'استلام من المحل'}\n`;
  if (order.fulfillment_type === 'delivery') {
    text += `الولاية: ${order.wilaya}\n`;
    text += `العنوان: ${order.address}\n`;
  }
  text += `الموعد المحدد: ${new Date(order.scheduled_at).toLocaleString('ar-DZ')}\n`;
  text += `\n📦 المنتجات:\n`;
  items.forEach(it => {
    const pName = it.product_name?.ar || it.product_name || 'منتج';
    text += `• ${pName} × ${it.quantity} = ${it.line_total} دج\n`;
  });
  text += `\nالمجموع الفرعي: ${order.subtotal} دج\n`;
  if (order.discount_total > 0) text += `الخصم: -${order.discount_total} دج\n`;
  if (order.delivery_fee > 0) text += `سعر التوصيل: +${order.delivery_fee} دج\n`;
  text += `الإجمالي الصافي: ${order.total} دج\n`;
  if (order.notes) text += `ملاحظات: ${order.notes}\n`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// POST create order
router.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      phone,
      fulfillment_type,
      wilaya,
      address,
      notes,
      scheduled_at,
      payment_method,
      coupon_id,
      items
    } = req.body;

    if (!customer_name || !phone || !fulfillment_type) {
      return res.status(400).json({ success: false, message: 'الاسم ورقم الهاتف وطريقة الاستلام مطلوبة' });
    }
    if (fulfillment_type === 'delivery' && (!wilaya || !address)) {
      return res.status(400).json({ success: false, message: 'الولاية والعنوان مطلوبان لخدمة التوصيل' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'سلة المشتريات فارغة' });
    }

    const orderId = uuidv4();
    const scheduled = scheduled_at ? new Date(scheduled_at).toISOString() : new Date().toISOString();

    let subtotal = 0;
    const processedItems = items.map(item => {
      const unitPrice = Number(item.unit_price || item.price) || 0;
      const qty = Math.max(1, Number(item.quantity || item.qty) || 1);
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;
      return {
        id: uuidv4(),
        order_id: orderId,
        product_id: item.product_id || item.id || null,
        product_name: typeof item.name === 'object' ? item.name : { ar: item.name, en: item.name },
        unit_price: unitPrice,
        quantity: qty,
        options_snapshot: item.options_snapshot || item.opts || [],
        line_total: lineTotal
      };
    });

    let discountTotal = 0;
    let validCouponId = null;

    if (coupon_id) {
      let coupon = null;
      if (db.isSupabase && db.supabase) {
        const { data } = await db.supabase.from('coupons').select('*').eq('id', coupon_id).eq('is_active', true).maybeSingle();
        coupon = data;
      } else if (db.isPostgres) {
        const cRes = await db.query('SELECT * FROM public.coupons WHERE id = $1 AND is_active = true', [coupon_id]);
        if (cRes.rows.length) coupon = cRes.rows[0];
      } else {
        coupon = db.memoryStore.coupons.find(c => (c.id === coupon_id || c.code === coupon_id) && c.is_active !== false);
      }

      if (coupon && subtotal >= Number(coupon.minimum_subtotal || 0)) {
        validCouponId = coupon.id;
        if (coupon.discount_type === 'percentage') {
          discountTotal = Math.round((subtotal * Number(coupon.discount_value)) / 100);
        } else {
          discountTotal = Number(coupon.discount_value);
        }
        discountTotal = Math.min(discountTotal, subtotal);

        // Update coupon used count
        if (db.isSupabase && db.supabase) {
          await db.supabase.from('coupons').update({ used_count: (coupon.used_count || 0) + 1 }).eq('id', coupon.id);
        } else if (db.isPostgres) {
          await db.query('UPDATE public.coupons SET used_count = used_count + 1 WHERE id = $1', [coupon.id]);
        } else {
          coupon.used_count = (coupon.used_count || 0) + 1;
        }
      }
    }

    const deliveryFee = fulfillment_type === 'delivery' ? 500 : 0;
    const finalTotal = Math.max(0, subtotal - discountTotal + deliveryFee);

    let createdOrder = null;
    let orderNumber = null;

    // 1. db.supabase Client
    if (db.isSupabase && db.supabase) {
      const { data: ord, error: ordErr } = await db.supabase.from('orders').insert([{
        id: orderId,
        customer_name,
        phone,
        fulfillment_type,
        wilaya: wilaya || null,
        address: address || null,
        notes: notes || null,
        scheduled_at: scheduled,
        status: 'new',
        payment_method: payment_method || 'cash_on_delivery',
        coupon_id: validCouponId,
        subtotal,
        discount_total: discountTotal,
        delivery_fee: deliveryFee,
        total: finalTotal,
        currency: 'DZD'
      }]).select().single();

      if (ordErr) throw ordErr;
      createdOrder = ord;
      orderNumber = createdOrder.order_number;

      // Insert line items
      const { error: itemsErr } = await db.supabase.from('order_items').insert(processedItems);
      if (itemsErr) console.warn('Could not insert items in db.supabase:', itemsErr.message);
    } else if (db.isPostgres) {
      const orderRes = await db.query(
        `INSERT INTO public.orders (
          id, customer_name, phone, fulfillment_type, wilaya, address, notes,
          scheduled_at, status, payment_method, coupon_id, subtotal, discount_total,
          delivery_fee, total, currency
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *`,
        [orderId, customer_name, phone, fulfillment_type, wilaya || null, address || null, notes || null, scheduled, 'new', payment_method || 'cash_on_delivery', validCouponId, subtotal, discountTotal, deliveryFee, finalTotal, 'DZD']
      );

      createdOrder = orderRes.rows[0];
      orderNumber = createdOrder.order_number;

      for (const item of processedItems) {
        await db.query(
          `INSERT INTO public.order_items (
            id, order_id, product_id, product_name, unit_price, quantity, options_snapshot, line_total
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [item.id, item.order_id, item.product_id, JSON.stringify(item.product_name), item.unit_price, item.quantity, JSON.stringify(item.options_snapshot), item.line_total]
        );
      }
    } else {
      orderNumber = db.memoryStore.orderSequence++;
      createdOrder = {
        id: orderId,
        order_number: orderNumber,
        customer_name,
        phone,
        fulfillment_type,
        wilaya: wilaya || null,
        address: address || null,
        notes: notes || null,
        scheduled_at: scheduled,
        status: 'new',
        payment_method: payment_method || 'cash_on_delivery',
        coupon_id: validCouponId,
        subtotal,
        discount_total: discountTotal,
        delivery_fee: deliveryFee,
        total: finalTotal,
        currency: 'DZD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.memoryStore.orders.unshift(createdOrder);
      processedItems.forEach(it => db.memoryStore.order_items.push(it));
    }

    let storeSettings = db.memoryStore.settings;
    if (db.isSupabase && db.supabase) {
      const { data: st } = await db.supabase.from('settings').select('*').eq('id', 'main').maybeSingle();
      if (st) storeSettings = st;
    } else if (db.isPostgres) {
      const stRes = await db.query('SELECT * FROM public.settings WHERE id = $1', ['main']);
      if (stRes.rows.length) storeSettings = stRes.rows[0];
    }

    const whatsappUrl = buildWhatsAppUrl(createdOrder, processedItems, storeSettings);

    return res.status(201).json({
      success: true,
      data: {
        ...createdOrder,
        items: processedItems,
        whatsapp_url: whatsappUrl
      },
      message: `تم تسجيل طلبك بنجاح! رقم الطلب: #${orderNumber}`
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, message: 'تعذر إنشاء الطلب', error: err.message });
  }
});

// GET all orders (Admin)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;

    if (db.isSupabase && db.supabase) {
      let q = db.supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false });
      if (status && status !== 'all') q = q.eq('status', status);
      const { data, error } = await q;
      if (error) throw error;
      return res.json({ success: true, data });
    }

    if (db.isPostgres) {
      let conditions = [];
      let params = [];
      let idx = 1;

      if (status && status !== 'all') {
        conditions.push(`status = $${idx}`);
        params.push(status);
        idx++;
      }
      if (search) {
        conditions.push(`(customer_name ILIKE $${idx} OR phone ILIKE $${idx} OR order_number::text ILIKE $${idx})`);
        params.push(`%${search}%`);
        idx++;
      }

      const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
      const orderRes = await db.query(
        `SELECT * FROM public.orders ${whereClause} ORDER BY created_at DESC`,
        params
      );

      const orders = orderRes.rows;
      if (orders.length > 0) {
        const orderIds = orders.map(o => o.id);
        const itemsRes = await db.query(
          `SELECT * FROM public.order_items WHERE order_id = ANY($1)`,
          [orderIds]
        );
        const itemsByOrder = {};
        itemsRes.rows.forEach(it => {
          if (!itemsByOrder[it.order_id]) itemsByOrder[it.order_id] = [];
          itemsByOrder[it.order_id].push(it);
        });
        orders.forEach(o => {
          o.items = itemsByOrder[o.id] || [];
        });
      }

      return res.json({ success: true, data: orders });
    }

    let orders = [...db.memoryStore.orders];
    if (status && status !== 'all') orders = orders.filter(o => o.status === status);
    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        o =>
          o.customer_name.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          String(o.order_number).includes(q)
      );
    }

    const enriched = orders.map(o => ({
      ...o,
      items: db.memoryStore.order_items.filter(it => it.order_id === o.id)
    }));

    return res.json({ success: true, data: enriched });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب الطلبات', error: err.message });
  }
});

// GET single order by ID or order_number
router.get('/:idOrNum', async (req, res) => {
  try {
    const { idOrNum } = req.params;

    if (db.isSupabase && db.supabase) {
      const isNum = /^\d+$/.test(idOrNum);
      let q = db.supabase.from('orders').select('*, items:order_items(*)');
      if (isNum) {
        q = q.or(`order_number.eq.${idOrNum},id.eq.${idOrNum}`);
      } else {
        q = q.eq('id', idOrNum);
      }
      const { data, error } = await q.maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
      return res.json({ success: true, data });
    }

    if (db.isPostgres) {
      const isNum = /^\d+$/.test(idOrNum);
      const sql = isNum
        ? 'SELECT * FROM public.orders WHERE order_number = $1 OR id::text = $1'
        : 'SELECT * FROM public.orders WHERE id::text = $1';
      const orderRes = await db.query(sql, [idOrNum]);

      if (orderRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
      }

      const order = orderRes.rows[0];
      const itemsRes = await db.query('SELECT * FROM public.order_items WHERE order_id = $1', [order.id]);
      order.items = itemsRes.rows;

      return res.json({ success: true, data: order });
    }

    const order = db.memoryStore.orders.find(
      o => o.id === idOrNum || String(o.order_number) === idOrNum
    );
    if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });

    const items = db.memoryStore.order_items.filter(it => it.order_id === order.id);
    return res.json({ success: true, data: { ...order, items } });
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ success: false, message: 'خطأ في تتبع الطلب', error: err.message });
  }
});

// PATCH update order status (Admin)
router.patch('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'reviewing', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'حالة الطلب غير صالحة' });
    }

    if (db.isSupabase && db.supabase) {
      const { data, error } = await db.supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      return res.json({ success: true, data, message: `تم تحديث حالة الطلب إلى "${status}"` });
    }

    if (db.isPostgres) {
      const result = await db.query(
        `UPDATE public.orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [status, id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
      }
      return res.json({ success: true, data: result.rows[0], message: `تم تحديث حالة الطلب إلى "${status}"` });
    }

    const order = db.memoryStore.orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });

    order.status = status;
    order.updated_at = new Date().toISOString();

    return res.json({ success: true, data: order, message: `تم تحديث حالة الطلب إلى "${status}"` });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ success: false, message: 'تعذر تحديث حالة الطلب', error: err.message });
  }
});

module.exports = router;
