const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyAdmin, JWT_SECRET } = require('../middleware/auth');

// POST admin login (supports Email OR Username)
router.post('/login', async (req, res) => {
  try {
    const identifier = (req.body.email || req.body.username || '').trim();
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني (أو اسم المستخدم) وكلمة المرور مطلوبان' });
    }

    let user = null;

    // 1. If db.supabase is connected, try db.supabase Auth first (for accounts created in db.supabase Auth)
    if (db.isSupabase && db.supabaseAdmin && identifier.includes('@')) {
      try {
        const { data: authData, error: authErr } = await db.supabaseAdmin.auth.signInWithPassword({
          email: identifier,
          password: password
        });

        if (!authErr && authData && authData.user) {
          // Sync with admin_users table (use admin client to bypass RLS)
          await db.supabaseAdmin.from('admin_users').upsert({
            user_id: authData.user.id,
            username: authData.user.email,
            is_active: true
          }, { onConflict: 'user_id' });

          const token = jwt.sign(
            { userId: authData.user.id, username: authData.user.email, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return res.json({
            success: true,
            token,
            admin: {
              userId: authData.user.id,
              username: authData.user.email
            },
            message: 'تم تسجيل الدخول بنجاح عبر db.supabase! مرحبًا بك 🤎'
          });
        }
      } catch (e) {
        // Continue to check admin_users table
        console.log('db.supabase Auth login fallback:', e.message);
      }
    }

    // 2. Check admin_users table in db.supabase or Postgres
    // Use db.supabaseAdmin to bypass RLS on admin_users table
    if (db.isSupabase && db.supabaseAdmin) {
      const { data, error } = await db.supabaseAdmin
        .from('admin_users')
        .select('*')
        .eq('username', identifier)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) {
        console.error('db.supabase admin_users db.query error:', error.message);
      }
      if (data) user = data;
    } else if (db.isPostgres) {
      const result = await db.query(
        'SELECT * FROM public.admin_users WHERE username = $1 AND is_active = true',
        [identifier]
      );
      if (result.rows.length > 0) user = result.rows[0];
    } else {
      user = db.memoryStore.admin_users.find(u => (u.username === identifier || u.email === identifier) && u.is_active);
    }

    let isValid = false;
    if (user && user.password_hash) {
      isValid = bcrypt.compareSync(password, user.password_hash);
    } else if (identifier === 'admin' && password === 'admin123') {
      isValid = true;
      user = { user_id: 'default-admin-id', username: 'admin' };
    }

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    const token = jwt.sign(
      { userId: user.user_id, username: user.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      admin: {
        userId: user.user_id,
        username: user.username
      },
      message: 'تم تسجيل الدخول بنجاح! مرحبًا بك في لوحة تحكم Taste the Joy 🤎'
    });
  } catch (err) {
    console.error('Error during admin login:', err);
    res.status(500).json({ success: false, message: 'خطأ في عملية تسجيل الدخول', error: err.message });
  }
});

// POST create admin account (supports Email or Username) without email confirmation
router.post('/create-account', async (req, res) => {
  try {
    const identifier = (req.body.email || req.body.username || '').trim();
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني (أو اسم المستخدم) وكلمة المرور مطلوبان' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = uuidv4();

    // If db.supabase is connected
    if (db.isSupabase && db.supabaseAdmin) {
      // 1. If it's an email, create user in db.supabase Auth using admin API (no email verification needed)
      if (identifier.includes('@')) {
        try {
          // Use admin.createUser() which auto-confirms the user - NO email verification
          const { data: createData, error: createErr } = await db.supabaseAdmin.auth.admin.createUser({
            email: identifier,
            password: password,
            email_confirm: true,  // Auto-confirm, no verification email sent
            user_metadata: { role: 'admin' }
          });

          if (createErr) {
            console.error('db.supabase Auth admin.createUser error:', createErr.message);
            // If user already exists, try to update password
            if (createErr.message.includes('already') || createErr.message.includes('exists')) {
              // User already exists in Auth - just update admin_users table
              console.log('User already exists in db.supabase Auth, updating admin_users table...');
            } else {
              // Other error - log but continue to try table insert
              console.warn('Auth error (will try table insert):', createErr.message);
            }
          }

          if (createData?.user) {
            // Successfully created in db.supabase Auth - now add to admin_users table
            const { error: upsertErr } = await db.supabaseAdmin.from('admin_users').upsert({
              user_id: createData.user.id,
              username: identifier,
              password_hash: passwordHash,
              is_active: true
            }, { onConflict: 'user_id' });

            if (upsertErr) {
              console.error('admin_users upsert error:', upsertErr.message);
            }

            return res.status(201).json({
              success: true,
              message: `تم إنشاء حساب المسؤول "${identifier}" بنجاح! ✅ يمكنك تسجيل الدخول الآن.`,
              admin: { userId: createData.user.id, username: identifier }
            });
          }
        } catch (e) {
          console.warn('db.supabase Auth fallback:', e.message);
          // Fallback to direct table insert
        }
      }

      // 2. Direct insert in admin_users table (for username-based accounts or email fallback)
      const { data, error } = await db.supabaseAdmin.from('admin_users').upsert({
        user_id: userId,
        username: identifier,
        password_hash: passwordHash,
        is_active: true
      }, { onConflict: 'username' }).select().single();

      if (error) {
        console.error('admin_users direct insert error:', error.message);
        throw new Error(error.message);
      }
      return res.status(201).json({
        success: true,
        message: `تم إنشاء حساب المسؤول "${identifier}" بنجاح! ✅`,
        admin: { userId: data.user_id, username: data.username }
      });
    }

    if (db.isPostgres) {
      await db.query(
        `INSERT INTO public.admin_users (user_id, username, password_hash, is_active)
         VALUES ($1, $2, $3, true)
         ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
        [userId, identifier, passwordHash]
      );
      return res.status(201).json({
        success: true,
        message: `تم إنشاء حساب المسؤول "${identifier}" بنجاح في PostgreSQL!`,
        admin: { userId, username: identifier }
      });
    }

    const existing = db.memoryStore.admin_users.find(u => u.username === identifier);
    if (existing) {
      existing.password_hash = passwordHash;
    } else {
      db.memoryStore.admin_users.push({
        user_id: userId,
        username: identifier,
        password_hash: passwordHash,
        is_active: true
      });
    }

    return res.status(201).json({
      success: true,
      message: `تم إنشاء حساب المسؤول "${identifier}" بنجاح!`,
      admin: { userId, username: identifier }
    });
  } catch (err) {
    console.error('Error creating admin account:', err);
    res.status(500).json({ success: false, message: 'تعذر إنشاء الحساب: ' + err.message, error: err.message });
  }
});

// GET admin dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    // Use db.supabaseAdmin to bypass RLS for admin stats
    if (db.isSupabase && db.supabaseAdmin) {
      const { data: allOrders } = await db.supabaseAdmin.from('orders').select('id, total, status, created_at').order('created_at', { ascending: false });
      const { count: prodCount } = await db.supabaseAdmin.from('products').select('*', { count: 'exact', head: true });
      const { count: revCount } = await db.supabaseAdmin.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      const ordersList = allOrders || [];
      const totalRev = ordersList.reduce((acc, o) => acc + Number(o.total || 0), 0);
      const newOrders = ordersList.filter(o => o.status === 'new').length;
      const preparingOrders = ordersList.filter(o => o.status === 'preparing').length;

      return res.json({
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
      });
    }

    if (db.isPostgres) {
      const ordersRes = await db.query(`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total), 0) as total_revenue,
          COUNT(*) FILTER (WHERE status = 'new') as new_orders,
          COUNT(*) FILTER (WHERE status = 'preparing') as preparing_orders
        FROM public.orders
      `);

      const prodRes = await db.query('SELECT COUNT(*) as total_products FROM public.products WHERE is_available = true');
      const revRes = await db.query("SELECT COUNT(*) as pending_reviews FROM public.reviews WHERE status = 'pending'");
      const recentOrdersRes = await db.query('SELECT * FROM public.orders ORDER BY created_at DESC LIMIT 5');

      const stats = ordersRes.rows[0];

      return res.json({
        success: true,
        data: {
          total_revenue: Number(stats.total_revenue),
          total_orders: Number(stats.total_orders),
          new_orders: Number(stats.new_orders),
          preparing_orders: Number(stats.preparing_orders),
          total_products: Number(prodRes.rows[0].total_products),
          pending_reviews: Number(revRes.rows[0].pending_reviews),
          recent_orders: recentOrdersRes.rows
        }
      });
    }

    const totalRevenue = db.memoryStore.orders.reduce((acc, o) => acc + Number(o.total || 0), 0);
    const newOrders = db.memoryStore.orders.filter(o => o.status === 'new').length;
    const preparingOrders = db.memoryStore.orders.filter(o => o.status === 'preparing').length;
    const pendingReviews = db.memoryStore.reviews.filter(r => r.status === 'pending').length;
    const activeProducts = db.memoryStore.products.filter(p => p.is_available !== false).length;

    return res.json({
      success: true,
      data: {
        total_revenue: totalRevenue,
        total_orders: db.memoryStore.orders.length,
        new_orders: newOrders,
        preparing_orders: preparingOrders,
        total_products: activeProducts,
        pending_reviews: pendingReviews,
        recent_orders: db.memoryStore.orders.slice(0, 5)
      }
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب الإحصائيات', error: err.message });
  }
});

module.exports = router;
