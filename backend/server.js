require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB, isPostgres } = require('./config/db');

const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const couponsRouter = require('./routes/coupons');
const reviewsRouter = require('./routes/reviews');
const favoritesRouter = require('./routes/favorites');
const adminRouter = require('./routes/admin');
const settingsRouter = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/settings', settingsRouter);

// Health Check & DB Status
app.get('/api/health', async (req, res) => {
  try {
    const { isSupabase, isPostgres, dbMode, supabase, memoryStore } = require('./config/db');
    
    let details = {
      status: 'healthy',
      time: new Date().toISOString(),
      store: 'Taste the Joy 🤎 Backend',
      database_mode: dbMode
    };

    if (isSupabase && supabase) {
      details.connection = 'connected_to_supabase';
      details.message = '✅ متصل بنجاح مع قاعدة بيانات Supabase السحابية';
      const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
      const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      details.counts = { categories: catCount, products: prodCount };
    } else if (isPostgres) {
      details.connection = 'connected_to_postgresql';
      details.message = '✅ متصل بنجاح مع PostgreSQL عبر الرابط المباشر';
    } else {
      details.connection = 'in_memory_mock';
      details.message = '⚠️ يعمل بالمخزن التجريبي المؤقت (In-Memory). ضع مفاتيح Supabase في ملف .env للربط السحابي الدائم.';
      details.counts = {
        categories: memoryStore.categories.length,
        products: memoryStore.products.length,
        admins: memoryStore.admin_users.length
      };
    }

    res.json(details);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'حدث خطأ غير متوقع في الخادم',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`
======================================================
  🤎 Taste the Joy - Node.js Backend Running!
======================================================
  🚀 Server URL:       http://localhost:${PORT}
  🔍 Health Check:     http://localhost:${PORT}/api/health
  🍰 Products API:     http://localhost:${PORT}/api/products
  📦 Orders API:       http://localhost:${PORT}/api/orders
  🔐 Admin Login API:  http://localhost:${PORT}/api/admin/login
  🔑 Default Admin:    admin / admin123
======================================================
    `);
  });
}

start();
