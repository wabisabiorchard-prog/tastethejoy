const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const {
  seedCategories,
  seedProducts,
  seedCoupons,
  seedReviews,
  seedSettings,
  defaultAdmin
} = require('../data/seedData');

let pool = null;
let supabase = null;       // Public client (anon key) - respects RLS
let supabaseAdmin = null;  // Admin client (service_role key) - bypasses RLS
let dbMode = 'memory'; // 'supabase' | 'postgres' | 'memory'

// In-Memory store fallback
const memoryStore = {
  categories: JSON.parse(JSON.stringify(seedCategories)),
  products: JSON.parse(JSON.stringify(seedProducts)),
  product_option_groups: [],
  product_option_values: [],
  coupons: JSON.parse(JSON.stringify(seedCoupons)),
  orders: [],
  order_items: [],
  favorites: [],
  reviews: JSON.parse(JSON.stringify(seedReviews)),
  settings: { ...seedSettings },
  admin_users: [
    {
      user_id: 'a1111111-1111-1111-1111-111111111111',
      username: defaultAdmin.username,
      password_hash: defaultAdmin.passwordHash,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],
  orderSequence: 1001
};

// Flatten product options into option tables for memory store
seedProducts.forEach(prod => {
  if (prod.option_groups) {
    prod.option_groups.forEach(og => {
      memoryStore.product_option_groups.push({
        id: og.id,
        product_id: prod.id,
        code: og.code,
        name: og.name,
        is_required: og.is_required,
        min_selections: og.min_selections,
        max_selections: og.max_selections,
        sort_order: og.sort_order
      });
      if (og.values) {
        og.values.forEach(val => {
          memoryStore.product_option_values.push({
            id: val.id,
            group_id: og.id,
            name: val.name,
            price_delta: val.price_delta,
            is_available: val.is_available,
            sort_order: val.sort_order
          });
        });
      }
    });
  }
});

async function initDB() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl = process.env.DATABASE_URL;

  // 1. Try Supabase JS Client (SUPABASE_URL + keys)
  if (supabaseUrl && (supabaseServiceKey || supabaseAnonKey)) {
    try {
      console.log('🔄 Connecting to Supabase via SUPABASE_URL & SUPABASE_KEY...');

      // Always create the admin client with service_role key if available
      // This bypasses RLS and is needed for admin operations
      if (supabaseServiceKey) {
        supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
        console.log('🔑 Service Role Key detected - admin operations will bypass RLS.');
      }

      // Create the public client with anon key (respects RLS)
      if (supabaseAnonKey) {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
      }

      // Use admin client for testing (bypasses RLS)
      const testClient = supabaseAdmin || supabase;

      // Test connection by checking categories
      const { data: catData, error: catError } = await testClient.from('categories').select('id').limit(1);

      if (catError) {
        console.warn('⚠️ Supabase tables not found or error:', catError.message);
        console.log('💡 Tip: Paste your SQL schema into Supabase SQL Editor and click Run.');
        // Still set mode to supabase if we have a client - tables might just be empty
        if (catError.message.includes('does not exist') || catError.message.includes('relation')) {
          console.log('❌ Tables do not exist yet. Falling back...');
        } else {
          // RLS or empty table - still connected
          dbMode = 'supabase';
          console.log('✅ Supabase connected (tables may be empty or RLS-restricted for anon).');
          return;
        }
      } else {
        console.log('✅ Supabase connected successfully via @supabase/supabase-js!');
        dbMode = 'supabase';

        // Check if categories are empty, seed if necessary
        if (!catData || catData.length === 0) {
          console.log('🌱 Seeding initial categories into Supabase...');
          await seedSupabaseData();
        }
        return;
      }
    } catch (err) {
      console.warn('⚠️ Failed to connect to Supabase:', err.message);
    }
  }

  // 2. Try Direct PostgreSQL Connection String (DATABASE_URL)
  if (dbUrl) {
    try {
      console.log('🔄 Attempting to connect to PostgreSQL via DATABASE_URL...');
      pool = new Pool({
        connectionString: dbUrl,
        ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
      });

      const client = await pool.connect();
      console.log('✅ PostgreSQL connected successfully via pg Pool!');
      dbMode = 'postgres';

      // Run schema initialization
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('✅ Database schema verified.');
      }

      // Check if categories exist, otherwise seed
      const catCheck = await client.query('SELECT COUNT(*) FROM public.categories');
      if (parseInt(catCheck.rows[0].count, 10) === 0) {
        console.log('🌱 Seeding initial data into PostgreSQL...');
        await seedPostgresData(client);
      }

      client.release();
      return;
    } catch (err) {
      console.warn('⚠️ Could not connect to PostgreSQL:', err.message);
    }
  }

  // 3. Fallback to in-memory store
  console.log('ℹ️ Running with In-Memory mock store (Fast zero-config mode).');
  console.log('💡 Tip: Set SUPABASE_URL + SUPABASE_ANON_KEY in backend/.env to connect to your Supabase project.');
  dbMode = 'memory';
}

async function seedSupabaseData() {
  // Use admin client to bypass RLS when seeding
  const client = supabaseAdmin || supabase;
  try {
    for (const cat of seedCategories) {
      await client.from('categories').upsert(cat, { onConflict: 'slug' });
    }

    for (const prod of seedProducts) {
      const { option_groups, ...pData } = prod;
      await client.from('products').upsert(pData, { onConflict: 'slug' });

      if (option_groups) {
        for (const og of option_groups) {
          const { values, ...ogData } = og;
          await client.from('product_option_groups').upsert({
            ...ogData,
            product_id: prod.id
          }, { onConflict: 'product_id,code' });

          if (values) {
            for (const val of values) {
              await client.from('product_option_values').upsert({
                ...val,
                group_id: og.id
              }, { onConflict: 'id' });
            }
          }
        }
      }
    }

    for (const c of seedCoupons) {
      await client.from('coupons').upsert(c, { onConflict: 'code' });
    }

    for (const r of seedReviews) {
      await client.from('reviews').upsert(r, { onConflict: 'id' });
    }

    await client.from('settings').upsert(seedSettings, { onConflict: 'id' });
    console.log('✅ Seed data successfully added to Supabase!');
  } catch (err) {
    console.warn('⚠️ Error while seeding Supabase:', err.message);
  }
}

async function seedPostgresData(client) {
  for (const cat of seedCategories) {
    await client.query(
      `INSERT INTO public.categories (id, slug, name, description, image_url, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (slug) DO NOTHING`,
      [cat.id, cat.slug, cat.name, cat.description, cat.image_url, cat.sort_order, cat.is_active]
    );
  }

  for (const prod of seedProducts) {
    await client.query(
      `INSERT INTO public.products (id, category_id, slug, name, description, base_price, currency, images, is_available, is_featured, occasion, badge)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (slug) DO NOTHING`,
      [
        prod.id,
        prod.category_id,
        prod.slug,
        prod.name,
        prod.description,
        prod.base_price,
        prod.currency,
        prod.images,
        prod.is_available,
        prod.is_featured,
        prod.occasion,
        prod.badge
      ]
    );

    if (prod.option_groups) {
      for (const og of prod.option_groups) {
        await client.query(
          `INSERT INTO public.product_option_groups (id, product_id, code, name, is_required, min_selections, max_selections, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (product_id, code) DO NOTHING`,
          [og.id, prod.id, og.code, og.name, og.is_required, og.min_selections, og.max_selections, og.sort_order]
        );

        if (og.values) {
          for (const val of og.values) {
            await client.query(
              `INSERT INTO public.product_option_values (id, group_id, name, price_delta, is_available, sort_order)
               VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
              [val.id, og.id, val.name, val.price_delta, val.is_available, val.sort_order]
            );
          }
        }
      }
    }
  }

  for (const c of seedCoupons) {
    await client.query(
      `INSERT INTO public.coupons (id, code, discount_type, discount_value, minimum_subtotal, starts_at, ends_at, usage_limit, used_count, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (code) DO NOTHING`,
      [c.id, c.code, c.discount_type, c.discount_value, c.minimum_subtotal, c.starts_at, c.ends_at, c.usage_limit, c.used_count, c.is_active]
    );
  }

  for (const r of seedReviews) {
    await client.query(
      `INSERT INTO public.reviews (id, guest_id, product_id, author_name, rating, comment, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
      [r.id, r.guest_id, r.product_id, r.author_name, r.rating, r.comment, r.status, r.created_at]
    );
  }

  await client.query(
    `INSERT INTO public.settings (id, store_name, whatsapp, instagram, phone, delivery_fee, about_text)
     VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
    [seedSettings.id, seedSettings.store_name, seedSettings.whatsapp, seedSettings.instagram, seedSettings.phone, seedSettings.delivery_fee, seedSettings.about_text]
  );

  await client.query(
    `INSERT INTO public.admin_users (user_id, username, password_hash, is_active)
     VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO NOTHING`,
    ['a1111111-1111-1111-1111-111111111111', defaultAdmin.username, defaultAdmin.passwordHash, true]
  );
}

// Query helper for Postgres
async function query(text, params = []) {
  if (dbMode === 'postgres' && pool) {
    return pool.query(text, params);
  }
  return null;
}

module.exports = {
  initDB,
  query,
  get supabase() {
    return supabaseAdmin || supabase;
  },
  // Admin client that bypasses RLS (service_role key)
  get supabaseAdmin() {
    return supabaseAdmin || supabase;
  },
  get dbMode() {
    return dbMode;
  },
  get isPostgres() {
    return dbMode === 'postgres';
  },
  get isSupabase() {
    return dbMode === 'supabase';
  },
  memoryStore,
  pool
};
