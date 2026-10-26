require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { initDB, isSupabase, isPostgres, supabase, query, memoryStore } = require('../config/db');

async function createAdmin() {
  const args = process.argv.slice(2);
  const username = args[0] || 'admin';
  const password = args[1] || 'admin123';

  console.log(`\n======================================================`);
  console.log(`🔐 إنشاء حساب مسؤول جديد (Admin Account Creation)`);
  console.log(`======================================================`);
  console.log(`👤 اسم المستخدم: ${username}`);
  console.log(`🔑 كلمة المرور:   ${password}`);
  console.log(`⏳ جاري الاتصال بقاعدة البيانات والتسجيل...\n`);

  await initDB();

  const passwordHash = bcrypt.hashSync(password, 10);
  const userId = uuidv4();

  // 1. Supabase
  if (isSupabase && supabase) {
    try {
      const { data, error } = await supabase.from('admin_users').upsert({
        user_id: userId,
        username: username,
        password_hash: passwordHash,
        is_active: true
      }, { onConflict: 'username' }).select().single();

      if (error) {
        console.error('❌ خطأ من Supabase:', error.message);
      } else {
        console.log(`✅ تم حفظ الحساب بنجاح في Supabase بدون الحاجة لأي رسالة بريد إلكتروني!`);
        console.log(`🎉 يمكنك الآن تسجيل الدخول في لوحة التحكم بالبيانات التالية:`);
        console.log(`   - اسم المستخدم: ${username}`);
        console.log(`   - كلمة المرور:   ${password}\n`);
      }
      process.exit(0);
    } catch (e) {
      console.error('❌ فشل الحفظ:', e.message);
      process.exit(1);
    }
  }

  // 2. Postgres
  if (isPostgres) {
    try {
      await query(
        `INSERT INTO public.admin_users (user_id, username, password_hash, is_active)
         VALUES ($1, $2, $3, true)
         ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
        [userId, username, passwordHash]
      );
      console.log(`✅ تم حفظ الحساب بنجاح في PostgreSQL!`);
      console.log(`🎉 بيانات الدخول: ${username} / ${password}\n`);
      process.exit(0);
    } catch (e) {
      console.error('❌ فشل الحفظ في PostgreSQL:', e.message);
      process.exit(1);
    }
  }

  // 3. Memory
  const existing = memoryStore.admin_users.find(u => u.username === username);
  if (existing) {
    existing.password_hash = passwordHash;
  } else {
    memoryStore.admin_users.push({
      user_id: userId,
      username,
      password_hash: passwordHash,
      is_active: true
    });
  }

  console.log(`✅ تم حفظ الحساب في المخزن التجريبي المحلي!`);
  console.log(`💡 نصيحة: للربط الدائم، ضع SUPABASE_URL و SUPABASE_ANON_KEY في ملف .env`);
  console.log(`🎉 بيانات الدخول: ${username} / ${password}\n`);
  process.exit(0);
}

createAdmin();
