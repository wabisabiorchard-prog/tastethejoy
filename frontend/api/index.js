const express = require('express');
const cors = require('cors');
const db = require('../backend/config/db');

const categoriesRouter = require('../backend/routes/categories');
const productsRouter = require('../backend/routes/products');
const ordersRouter = require('../backend/routes/orders');
const couponsRouter = require('../backend/routes/coupons');
const reviewsRouter = require('../backend/routes/reviews');
const favoritesRouter = require('../backend/routes/favorites');
const adminRouter = require('../backend/routes/admin');
const settingsRouter = require('../backend/routes/settings');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    await db.initDB();
    dbInitialized = true;
  }
  next();
});

app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/settings', settingsRouter);

app.get('/api/health', async (req, res) => {
  try {
    let details = {
      status: 'healthy',
      time: new Date().toISOString(),
      store: 'Taste the Joy 🤎 Backend (Vercel Serverless)',
      database_mode: db.dbMode
    };

    if (db.isSupabase && db.supabase) {
      details.connection = 'connected_to_supabase';
      const { count: catCount } = await db.supabase.from('categories').select('*', { count: 'exact', head: true });
      const { count: prodCount } = await db.supabase.from('products').select('*', { count: 'exact', head: true });
      details.counts = { categories: catCount, products: prodCount };
    }

    res.json(details);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'حدث خطأ غير متوقع في الخادم',
    error: err.message
  });
});

module.exports = app;
