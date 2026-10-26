// Initial seed data matching Taste the Joy storefront and database schema
const bcrypt = require('bcryptjs');

const seedCategories = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    slug: 'cheesecake',
    name: { ar: 'Cheesecake', en: 'Cheesecake' },
    description: { ar: 'تشيز كيك بارد وفاخر بنكهات فريدة لا تقاوم', en: 'Creamy and rich handcrafted cheesecakes' },
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    slug: 'cakes',
    name: { ar: 'Cakes', en: 'Cakes' },
    description: { ar: 'كيكات مميزة لجميع أعياد الميلاد والاحتفالات', en: 'Celebration and birthday cakes' },
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    slug: 'crunchy',
    name: { ar: 'Crunchy Cake', en: 'Crunchy Cake' },
    description: { ar: 'مزيج القرمشة والشوكولاتة الفاخرة بطبقات كريمية', en: 'Irresistible crunchy chocolate cakes' },
    image_url: 'https://images.unsplash.com/photo-1622551938665-71e5c7d6ea34?q=80&w=800&auto=format&fit=crop',
    sort_order: 3,
    is_active: true
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    slug: 'brownies',
    name: { ar: 'Brownies Box', en: 'Brownies Box' },
    description: { ar: 'بوكسات براونيز ساخنة ومغموسة بالشوكولاتة السائلة', en: 'Customizable rich brownie boxes' },
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
    sort_order: 4,
    is_active: true
  }
];

const seedProducts = [
  {
    id: 'p1111111-1111-1111-1111-111111111111',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    slug: 'cheesecake-pistachio',
    name: { ar: 'Cheesecake بيستاشيو', en: 'Pistachio Cheesecake' },
    description: { ar: 'تشيز كيك ناعم بطعم البيستاشيو الأصيل مع طبقة زبدة الفستق الإيطالية وقاعدة بسكويت مقرمشة.', en: 'Velvety cheesecake infused with pure Italian pistachio cream.' },
    base_price: 1800,
    currency: 'DZD',
    images: ['https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop'],
    is_available: true,
    is_featured: true,
    occasion: 'special',
    badge: 'best',
    option_groups: [
      {
        id: 'og111111-1111-1111-1111-111111111111',
        code: 'size',
        name: { ar: 'الحجم', en: 'Size' },
        is_required: true,
        min_selections: 1,
        max_selections: 1,
        sort_order: 1,
        values: [
          { id: 'ov11', name: { ar: 'قطعة فردية (1 شخص)', en: 'Individual slice' }, price_delta: 0, is_available: true, sort_order: 1 },
          { id: 'ov12', name: { ar: 'قالب عائلي صغير (4 أشخاص)', en: 'Small cake (4 pax)' }, price_delta: 1600, is_available: true, sort_order: 2 },
          { id: 'ov13', name: { ar: 'قالب عائلي كبير (8 أشخاص)', en: 'Large cake (8 pax)' }, price_delta: 3200, is_available: true, sort_order: 3 }
        ]
      },
      {
        id: 'og111111-2222-2222-2222-222222222222',
        code: 'topping',
        name: { ar: 'إضافات التزيين', en: 'Toppings' },
        is_required: false,
        min_selections: 0,
        max_selections: 2,
        sort_order: 2,
        values: [
          { id: 'ov21', name: { ar: 'رشة فستق حلبي مفروم', en: 'Crushed pistachio' }, price_delta: 150, is_available: true, sort_order: 1 },
          { id: 'ov22', name: { ar: 'صوص إضافي', en: 'Extra drizzle sauce' }, price_delta: 100, is_available: true, sort_order: 2 }
        ]
      }
    ]
  },
  {
    id: 'p2222222-2222-2222-2222-222222222222',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    slug: 'cheesecake-chocolate',
    name: { ar: 'Cheesecake شوكولا بلجيكية', en: 'Belgian Chocolate Cheesecake' },
    description: { ar: 'طبقات شوكولا غنية فاخرة فوق قاعدة بسكويت مقرمشة مع غاناش شوكولاتة داكنة.', en: 'Rich Belgian chocolate cheesecake with smooth dark chocolate ganache.' },
    base_price: 1700,
    currency: 'DZD',
    images: ['https://images.unsplash.com/photo-1567234669003-dce7a7a88821?q=80&w=800&auto=format&fit=crop'],
    is_available: true,
    is_featured: true,
    occasion: 'special',
    badge: 'best',
    option_groups: [
      {
        id: 'og222222-1111-1111-1111-111111111111',
        code: 'size',
        name: { ar: 'الحجم', en: 'Size' },
        is_required: true,
        min_selections: 1,
        max_selections: 1,
        sort_order: 1,
        values: [
          { id: 'ov31', name: { ar: 'قطعة فردية', en: 'Single piece' }, price_delta: 0, is_available: true, sort_order: 1 },
          { id: 'ov32', name: { ar: 'قالب عائلي متوسط (6 أشخاص)', en: 'Medium cake' }, price_delta: 2200, is_available: true, sort_order: 2 }
        ]
      }
    ]
  },
  {
    id: 'p3333333-3333-3333-3333-333333333333',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    slug: 'cheesecake-snickers',
    name: { ar: 'Cheesecake سنيكرز', en: 'Snickers Cheesecake' },
    description: { ar: 'مزيج الكراميل المالح والفول السوداني المحمص مع كريمة تشيز كيك وشوكولاتة مذابة.', en: 'Sweet caramel, crunchy peanuts, and creamy chocolate cheesecake.' },
    base_price: 1900,
    currency: 'DZD',
    images: ['https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop'],
    is_available: true,
    is_featured: false,
    occasion: 'gift',
    badge: 'new',
    option_groups: []
  },
  {
    id: 'p4444444-4444-4444-4444-444444444444',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    slug: 'cheesecake-strawberry',
    name: { ar: 'Cheesecake فراولة طازجة', en: 'Strawberry Cheesecake' },
    description: { ar: 'انتعاش الفراولة الطبيعية مع الكوليز المحضر طازجًا فوق طبقة كريمية غنية.', en: 'Refreshing fresh strawberry compote over smooth silky cheesecake.' },
    base_price: 1700,
    currency: 'DZD',
    images: ['https://images.unsplash.com/photo-1524351199678-941a58a3df50?q=80&w=800&auto=format&fit=crop'],
    is_available: true,
    is_featured: false,
    occasion: 'valentine',
    badge: null,
    option_groups: []
  },
  {
    id: 'p5555555-5555-5555-5555-555555555555',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    slug: 'birthday-celebration-cake',
    name: { ar: 'كيك عيد ميلاد فاخر', en: 'Birthday Celebration Cake' },
    description: { ar: 'كيك احتفالي راقٍ محشو بألذ النكهات ومزين بحرفية عالية ليكون نجم حفلتك.', en: 'Stunning customizable birthday cake crafted to make your moments unforgettable.' },
    base_price: 3500,
    currency: 'DZD',
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'],
    is_available: true,
    is_featured: true,
    occasion: 'birthday',
    badge: 'best',
    option_groups: [
      {
        id: 'og555555-1111-1111-1111-111111111111',
        code: 'sponge_flavor',
        name: { ar: 'نكهة الكيك (السبونج)', en: 'Sponge Flavor' },
        is_required: true,
        min_selections: 1,
        max_selections: 1,
        sort_order: 1,
        values: [
          { id: 'ov51', name: { ar: 'فانيلا مدغشقر', en: 'Madagascar Vanilla' }, price_delta: 0, is_available: true, sort_order: 1 },
          { id: 'ov52', name: { ar: 'شوكولاتة سويسرية', en: 'Swiss Chocolate' }, price_delta: 200, is_available: true, sort_order: 2 },
          { id: 'ov53', name: { ar: 'ريد فيلفيت Red Velvet', en: 'Red Velvet' }, price_delta: 300, is_available: true, sort_order: 3 }
        ]
      },
      {
        id: 'og555555-2222-2222-2222-222222222222',
        code: 'cake_size',
        name: { ar: 'عدد الأشخاص', en: 'Cake Size' },
        is_required: true,
        min_selections: 1,
        max_selections: 1,
        sort_order: 2,
        values: [
          { id: 'ov54', name: { ar: '6 إلى 8 أشخاص (قطر 18 سم)', en: '6-8 Persons' }, price_delta: 0, is_available: true, sort_order: 1 },
          { id: 'ov55', name: { ar: '10 إلى 14 شخص (قطر 22 سم)', en: '10-14 Persons' }, price_delta: 1500, is_available: true, sort_order: 2 },
          { id: 'ov56', name: { ar: '16 إلى 20 شخص (طابقين)', en: '16-20 Persons' }, price_delta: 3500, is_available: true, sort_order: 3 }
        ]
      }
    ]
  },
  {
    id: 'p6666666-6666-6666-6666-666666666666',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    slug: 'valentine-heart-cake',
    name: { ar: 'Valentine Heart Cake', en: 'Valentine Heart Cake' },
    description: { ar: 'تصميم رومانسي على شكل قلب مزين بالورود وكريمة التوت، الهدية المثالية لأجمل الذكريات.', en: 'Romantic heart-shaped cake dressed in delicate berries and floral touch.' },
    base_price: 3200,
    currency: 'DZD',
    images: ['https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop'],
    is_available: true,
    is_featured: false,
    occasion: 'valentine',
    badge: 'new',
    option_groups: []
  },
  {
    id: 'p7777777-7777-7777-7777-777777777777',
    category_id: 'c3333333-3333-3333-3333-333333333333',
    slug: 'crunchy-cake-pistachio',
    name: { ar: 'Crunchy Cake بيستاشيو', en: 'Pistachio Crunchy Cake' },
    description: { ar: 'قرمشة ساحرة بالفيوتين الإيطالي مع طبقات الفستق والكريمة الغنية.', en: 'Irresistible crispy feuilletine layers combined with pistachio praline.' },
    base_price: 2100,
    currency: 'DZD',
    images: ['https://images.unsplash.com/photo-1622551938665-71e5c7d6ea34?q=80&w=800&auto=format&fit=crop'],
    is_available: true,
    is_featured: true,
    occasion: 'gift',
    badge: 'new',
    option_groups: []
  },
  {
    id: 'p8888888-8888-8888-8888-888888888888',
    category_id: 'c3333333-3333-3333-3333-333333333333',
    slug: 'crunchy-cake-bueno',
    name: { ar: 'Crunchy Cake Bueno', en: 'Kinder Bueno Crunchy Cake' },
    description: { ar: 'مستوحى من طعم Kinder Bueno المفضل، طبقات البندق والشوكولاتة المقرمشة التي تأسر الحواس.', en: 'Inspired by beloved Kinder Bueno with crunchy hazelnut wafers.' },
    base_price: 2200,
    currency: 'DZD',
    images: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop'],
    is_available: true,
    is_featured: true,
    occasion: 'party',
    badge: 'best',
    option_groups: []
  },
  {
    id: 'p9999999-9999-9999-9999-999999999999',
    category_id: 'c4444444-4444-4444-4444-444444444444',
    slug: 'brownies-box-custom',
    name: { ar: 'Brownies Box مخصص 🍫', en: 'Customizable Brownies Box' },
    description: { ar: 'بوكس براونيز فادجي طازج، اختاري عدد الحبات ونوع صوص الشوكولاتة الذائب واستمتعي بأروع لحظات الحلاوة.', en: 'Warm, fudgy brownie bites customizable with your choice of melted drizzle.' },
    base_price: 1200,
    currency: 'DZD',
    images: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop'],
    is_available: true,
    is_featured: true,
    occasion: 'special',
    badge: 'best',
    option_groups: [
      {
        id: 'og999999-1111-1111-1111-111111111111',
        code: 'pieces_count',
        name: { ar: 'عدد الحبات', en: 'Pieces Count' },
        is_required: true,
        min_selections: 1,
        max_selections: 1,
        sort_order: 1,
        values: [
          { id: 'ov91', name: { ar: '5 حبات', en: '5 Pieces' }, price_delta: 0, is_available: true, sort_order: 1 },
          { id: 'ov92', name: { ar: '6 حبات', en: '6 Pieces' }, price_delta: 200, is_available: true, sort_order: 2 },
          { id: 'ov93', name: { ar: '7 حبات', en: '7 Pieces' }, price_delta: 400, is_available: true, sort_order: 3 },
          { id: 'ov94', name: { ar: '8 حبات', en: '8 Pieces' }, price_delta: 600, is_available: true, sort_order: 4 },
          { id: 'ov95', name: { ar: '9 حبات', en: '9 Pieces' }, price_delta: 800, is_available: true, sort_order: 5 },
          { id: 'ov96', name: { ar: '10 حبات', en: '10 Pieces' }, price_delta: 1000, is_available: true, sort_order: 6 }
        ]
      },
      {
        id: 'og999999-2222-2222-2222-222222222222',
        code: 'sauce_flavor',
        name: { ar: 'نوع الشوكولاتة والصوص', en: 'Sauce Flavor' },
        is_required: true,
        min_selections: 1,
        max_selections: 1,
        sort_order: 2,
        values: [
          { id: 'ov97', name: { ar: 'بيستاشيو إيطالي (Pistachio)', en: 'Italian Pistachio' }, price_delta: 0, is_available: true, sort_order: 1 },
          { id: 'ov98', name: { ar: 'شوكولاتة الحليب الفاخرة (Milk Chocolate)', en: 'Milk Chocolate' }, price_delta: 0, is_available: true, sort_order: 2 },
          { id: 'ov99', name: { ar: 'بندق نوتيلا (Hazelnut)', en: 'Hazelnut' }, price_delta: 0, is_available: true, sort_order: 3 }
        ]
      }
    ]
  }
];

const seedCoupons = [
  {
    id: 'cp111111-1111-1111-1111-111111111111',
    code: 'JOY10',
    discount_type: 'percentage',
    discount_value: 10,
    minimum_subtotal: 2000,
    starts_at: new Date('2024-01-01').toISOString(),
    ends_at: new Date('2028-12-31').toISOString(),
    usage_limit: 500,
    used_count: 14,
    is_active: true
  },
  {
    id: 'cp222222-2222-2222-2222-222222222222',
    code: 'SWEET500',
    discount_type: 'fixed',
    discount_value: 500,
    minimum_subtotal: 3500,
    starts_at: new Date('2024-01-01').toISOString(),
    ends_at: new Date('2028-12-31').toISOString(),
    usage_limit: 200,
    used_count: 5,
    is_active: true
  }
];

const seedReviews = [
  {
    id: 'r1111111-1111-1111-1111-111111111111',
    guest_id: 'g1111111-1111-1111-1111-111111111111',
    product_id: 'p1111111-1111-1111-1111-111111111111',
    author_name: 'أمينة ع.',
    rating: 5,
    comment: 'حلويات رائعة وطعم أصيل، البيستاشيو خيالي ونعاود نطلب أكيد 🤎',
    status: 'approved',
    created_at: new Date('2026-10-15T14:30:00Z').toISOString()
  },
  {
    id: 'r2222222-2222-2222-2222-222222222222',
    guest_id: 'g2222222-2222-2222-2222-222222222222',
    product_id: 'p5555555-5555-5555-5555-555555555555',
    author_name: 'ياسين ب.',
    rating: 5,
    comment: 'الكيك جاء بالظبط كيما في الصورة وطعمه خفيف جدًا، خدمة احترافية وتوصيل في الموعد!',
    status: 'approved',
    created_at: new Date('2026-10-18T18:15:00Z').toISOString()
  },
  {
    id: 'r3333333-3333-3333-3333-333333333333',
    guest_id: 'g3333333-3333-3333-3333-333333333333',
    product_id: 'p8888888-8888-8888-8888-888888888888',
    author_name: 'سارة م.',
    rating: 5,
    comment: 'البوينو كرانشي شيء رهيب، التغليف أنيق ويشرف في المناسبات. ربي يباركلكم!',
    status: 'approved',
    created_at: new Date('2026-10-21T11:20:00Z').toISOString()
  }
];

const seedSettings = {
  id: 'main',
  store_name: 'Taste the Joy 🤎',
  whatsapp: '213555000000',
  instagram: 'taste.the.joy',
  phone: '0555000000',
  delivery_fee: 500,
  about_text: 'قصة Taste the Joy تبدأ من شغف بسيط بالحلويات الراقية، لنقدم لكم تشكيلة متميزة من Cheesecake وكيكات وBrownies Box محضّرة بأجود المكونات وبكل حب، باش كل مناسبة تكون أحلى.'
};

const defaultAdmin = {
  username: 'admin',
  passwordHash: bcrypt.hashSync('admin123', 10)
};

module.exports = {
  seedCategories,
  seedProducts,
  seedCoupons,
  seedReviews,
  seedSettings,
  defaultAdmin
};
