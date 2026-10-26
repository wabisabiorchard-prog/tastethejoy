-- ==========================================================
-- Taste the Joy - PostgreSQL / Supabase Database Schema
-- ==========================================================

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key default gen_random_uuid(),
  username text unique,
  password_hash text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  name jsonb not null,
  description jsonb not null default '{}'::jsonb,
  base_price numeric(12,2) not null check (base_price >= 0),
  currency text not null default 'DZD',
  images text[] not null default '{}',
  is_available boolean not null default true,
  is_featured boolean not null default false,
  occasion text default 'special',
  badge text default null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_option_groups (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  code text not null,
  name jsonb not null,
  is_required boolean not null default false,
  min_selections integer not null default 0,
  max_selections integer not null default 1,
  sort_order integer not null default 0,
  unique(product_id, code)
);

create table if not exists public.product_option_values (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null
    references public.product_option_groups(id) on delete cascade,
  name jsonb not null,
  price_delta numeric(12,2) not null default 0,
  is_available boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null
    check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(12,2) not null check (discount_value > 0),
  minimum_subtotal numeric(12,2) not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  usage_limit integer,
  used_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_name text not null,
  phone text not null,
  fulfillment_type text not null
    check (fulfillment_type in ('delivery', 'pickup')),
  wilaya text,
  address text,
  notes text,
  scheduled_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in (
      'new', 'reviewing', 'preparing',
      'ready', 'completed', 'cancelled'
    )),
  payment_method text not null default 'cash_on_delivery',
  coupon_id uuid references public.coupons(id) on delete set null,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  discount_total numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null check (total >= 0),
  currency text not null default 'DZD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    fulfillment_type = 'pickup'
    or (wilaya is not null and address is not null)
  )
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name jsonb not null,
  unit_price numeric(12,2) not null,
  quantity integer not null check (quantity > 0),
  options_snapshot jsonb not null default '[]'::jsonb,
  line_total numeric(12,2) not null
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(guest_id, product_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null,
  product_id uuid not null references public.products(id) on delete cascade,
  author_name text,
  rating integer not null check (rating between 1 and 5),
  comment text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique(guest_id, product_id)
);

create table if not exists public.settings (
  id text primary key default 'main',
  store_name text not null default 'Taste the Joy 🤎',
  whatsapp text not null default '213555000000',
  instagram text not null default 'taste.the.joy',
  phone text not null default '0555000000',
  delivery_fee numeric(12,2) not null default 500,
  about_text text not null default 'قصة Taste the Joy تبدأ من شغف بسيط بالحلويات الراقية، لنقدم لكم تشكيلة متميزة من Cheesecake وكيكات وBrownies Box محضّرة بأجود المكونات وبكل حب.',
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_reviews_status on public.reviews(status);
create index if not exists idx_option_values_group on public.product_option_values(group_id);
