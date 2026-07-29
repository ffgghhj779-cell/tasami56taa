-- تسامي الوطنية — schema أولي (leads + CMS + RLS)
-- Project: wksivqjlabpiwfzuwuwh

create extension if not exists "pgcrypto";

-- ─── Quote / lead requests ───────────────────────────────────────────
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  business text not null,
  phone text not null,
  city text not null,
  product text not null,
  quantity text not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'closed', 'spam')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quote_requests_created_at_idx
  on public.quote_requests (created_at desc);
create index if not exists quote_requests_status_idx
  on public.quote_requests (status);

-- ─── CMS: products ───────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  form_value text not null,
  description text not null default '',
  image_url text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_sort_idx
  on public.products (sort_order, created_at);

-- ─── CMS: testimonials ───────────────────────────────────────────────
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  role text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_sort_idx
  on public.testimonials (sort_order, created_at);

-- ─── CMS: FAQs ───────────────────────────────────────────────────────
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists faqs_sort_idx
  on public.faqs (sort_order, created_at);

-- ─── updated_at trigger ──────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists quote_requests_set_updated_at on public.quote_requests;
create trigger quote_requests_set_updated_at
  before update on public.quote_requests
  for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────────────
alter table public.quote_requests enable row level security;
alter table public.products enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;

-- Quotes: anyone can submit; only signed-in admins can read/update
drop policy if exists "Anyone can insert quote requests" on public.quote_requests;
create policy "Anyone can insert quote requests"
  on public.quote_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read quote requests" on public.quote_requests;
create policy "Admins can read quote requests"
  on public.quote_requests for select
  to authenticated
  using (true);

drop policy if exists "Admins can update quote requests" on public.quote_requests;
create policy "Admins can update quote requests"
  on public.quote_requests for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete quote requests" on public.quote_requests;
create policy "Admins can delete quote requests"
  on public.quote_requests for delete
  to authenticated
  using (true);

-- Products: public read active; admins full CRUD
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
  on public.products for select
  to anon, authenticated
  using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

-- Testimonials
drop policy if exists "Public can read active testimonials" on public.testimonials;
create policy "Public can read active testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials"
  on public.testimonials for all
  to authenticated
  using (true)
  with check (true);

-- FAQs
drop policy if exists "Public can read active faqs" on public.faqs;
create policy "Public can read active faqs"
  on public.faqs for select
  to anon, authenticated
  using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "Admins manage faqs" on public.faqs;
create policy "Admins manage faqs"
  on public.faqs for all
  to authenticated
  using (true)
  with check (true);

-- ─── Seed content (idempotent via title/question match) ──────────────
insert into public.products (title, form_value, description, image_url, sort_order)
select * from (values
  (
    'دواجن مبردة',
    'دواجن مبردة',
    'كميات تبدأ من 10 كرتون. منتجات معتمدة ومذبوحة وفق الشريعة الإسلامية، مطابقة لمواصفات هيئة الغذاء والدواء.',
    '/products/chilled-poultry.jpg?v=3',
    1
  ),
  (
    'دواجن فريش',
    'دواجن فريش',
    'كميات تبدأ من 10 كرتون. طازجة يومياً لتلبية احتياجات المطاعم والأسواق المركزية.',
    '/products/fresh-poultry.jpg?v=3',
    2
  ),
  (
    'بطاطس شرائح (مجمدة)',
    'بطاطس شرائح مجمدة',
    'كميات تبدأ من 20 كيس. بطاطس شرائح جاهزة للقلي تلبي احتياجات قطاع المطاعم.',
    '/products/fries.jpg?v=3',
    3
  ),
  (
    'بيض طازج (مزارع)',
    'بيض طازج',
    'كميات تبدأ من 50 كرتونة. بيض مائدة طازج عالي الجودة من مزارع معتمدة.',
    '/products/eggs.jpg?v=3',
    4
  ),
  (
    'أفخاذ دجاج كاملة',
    'دواجن مبردة',
    'بالعظم والجلد؛ يسعر بالوزن. منتجات معتمدة ومطابقة لأعلى معايير الجودة.',
    '/products/chicken-legs.jpg?v=3',
    5
  ),
  (
    'صدور دجاج بدون عظم',
    'دواجن مبردة',
    'بدون عظم وجلد؛ يسعر بالوزن. منتجة في منشآت تلبي أعلى معايير السلامة الغذائية.',
    '/products/chicken-breast.jpg?v=3',
    6
  )
) as v(title, form_value, description, image_url, sort_order)
where not exists (select 1 from public.products limit 1);

insert into public.testimonials (quote, author, role, sort_order)
select * from (values
  (
    'تسامي الوطنية كانت المورد الأكثر موثوقية لمنتجات الدواجن لدينا طوال السنوات الأربع الماضية. سلاسل التبريد لديهم خالية من العيوب.',
    'أحمد المنصوري',
    'موزع، الرياض',
    1
  ),
  (
    'الامتثال لمعايير الحلال، الجودة المتسقة، والأسعار التنافسية — هذا بالضبط ما تتطلبه أسواقنا وعملائنا بشكل دائم.',
    'خالد الراشد',
    'مستورد، جدة',
    2
  ),
  (
    'منتجاتهم من الدواجن تلبي باستمرار معايير قطاع التجزئة والخدمات الغذائية لدينا بدقة متناهية.',
    'عبدالله السالم',
    'مالك مطاعم، الدمام',
    3
  )
) as v(quote, author, role, sort_order)
where not exists (select 1 from public.testimonials limit 1);

insert into public.faqs (question, answer, sort_order)
select * from (values
  (
    'ما هي المنتجات التي تقوم مؤسسة تسامي الوطنية بتوريدها؟',
    'نحن متخصصون في توريد الدواجن المبردة والمجمدة، البطاطس المجهزة، والبيض الطازج بكميات الجملة للمطاعم والأسواق المركزية.',
    1
  ),
  (
    'لماذا نختار تسامي الوطنية كشريك توريد؟',
    'لأننا نضمن الجودة العالية، الأسعار التنافسية، وسلاسل الإمداد المبردة الموثوقة التي تضمن وصول المنتجات طازجة وآمنة.',
    2
  ),
  (
    'هل توفرون منتجات معتمدة بشهادة حلال؟',
    'نعم، جميع منتجاتنا معتمدة بشهادة حلال ومطابقة لاشتراطات هيئة الغذاء والدواء في المملكة العربية السعودية.',
    3
  ),
  (
    'كيف يمكنني طلب تسعيرة لمنتجاتكم؟',
    'يمكنك طلب تسعيرة عن طريق تعبئة النموذج في أسفل الصفحة، أو التواصل معنا مباشرة عبر الواتساب أو البريد الإلكتروني.',
    4
  ),
  (
    'ما هو الوقت المعتاد لتوصيل الطلبات؟',
    'يختلف وقت التوصيل بناءً على الكمية والمدينة، ولكننا نتميز بسرعة الاستجابة والتوصيل خلال 24-48 ساعة للطلبات المجدولة.',
    5
  )
) as v(question, answer, sort_order)
where not exists (select 1 from public.faqs limit 1);
