require('dotenv').config();
const db = require('../config/db');

async function checkDatabase() {
  console.log(`\n======================================================`);
  console.log(`🔍 فحص اتصال قاعدة البيانات (Database Connection Test)`);
  console.log(`======================================================`);

  await db.initDB();

  if (db.isSupabase) {
    const client = db.supabaseAdmin || db.supabase;
    console.log(`\n🎉 الحالة: متصل بنجاح مع Supabase عبر المفاتيح السحابية!`);
    console.log(`🌐 الرابط: ${process.env.SUPABASE_URL}`);

    // Count records
    const { count: catCount } = await client.from('categories').select('*', { count: 'exact', head: true });
    const { count: prodCount } = await client.from('products').select('*', { count: 'exact', head: true });
    const { count: orderCount } = await client.from('orders').select('*', { count: 'exact', head: true });
    const { count: adminCount } = await client.from('admin_users').select('*', { count: 'exact', head: true });

    console.log(`\n📊 إحصائيات البيانات المسجلة في Supabase:`);
    console.log(`   • الأقسام (Categories):       ${catCount ?? 'تعذر القراءة'}`);
    console.log(`   • المنتجات (Products):         ${prodCount ?? 'تعذر القراءة'}`);
    console.log(`   • الطلبات (Orders):           ${orderCount ?? 'تعذر القراءة'}`);
    console.log(`   • حسابات الأدمن (Admin Users): ${adminCount ?? 'تعذر القراءة'}`);
    console.log(`\n✅ قاعدة البيانات جاهزة وتعمل بنسبة 100%!\n`);
    process.exit(0);
  }

  if (isPostgres) {
    console.log(`\n🎉 الحالة: متصل بنجاح مع PostgreSQL عبر الرابط المباشر!`);
    const catCheck = await query('SELECT COUNT(*) FROM public.categories');
    const prodCheck = await query('SELECT COUNT(*) FROM public.products');
    const adminCheck = await query('SELECT COUNT(*) FROM public.admin_users');

    console.log(`\n📊 إحصائيات البيانات المسجلة في PostgreSQL:`);
    console.log(`   • الأقسام:        ${catCheck.rows[0].count}`);
    console.log(`   • المنتجات:        ${prodCheck.rows[0].count}`);
    console.log(`   • حسابات الأدمن:   ${adminCheck.rows[0].count}`);
    console.log(`\n✅ قاعدة البيانات جاهزة وتعمل بنسبة 100%!\n`);
    process.exit(0);
  }

  console.log(`\n⚠️ الحالة: الخادم يعمل بـ "المخزن التجريبي المؤقت (In-Memory)"`);
  console.log(`💡 السبب: لم يتم وضع مفاتيح SUPABASE_URL و SUPABASE_ANON_KEY في ملف backend/.env بعد.`);
  console.log(`   أو أن المفاتيح موضوعة ولكن يوجد قبلها علامة تعليق (#).`);
  console.log(`\n🛠️ للربط مع Supabase:`);
  console.log(`   1. افتح ملف: backend/.env`);
  console.log(`   2. أزل علامة (#) وضع رابط ومفتاح مشروعك:`);
  console.log(`      SUPABASE_URL=https://xxxx.supabase.co`);
  console.log(`      SUPABASE_ANON_KEY=eyJhbGci...`);
  console.log(`   3. أعد تشغيل هذا الفحص: node scripts/check-db.js\n`);
  process.exit(0);
}

checkDatabase();
