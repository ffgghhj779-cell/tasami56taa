-- تسامي — مرحلة 1: طلبات شراء أونلاين (بدون بوابة دفع بعد)

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  business_name text not null,
  phone text not null,
  city text not null,
  address text not null default '',
  notes text not null default '',
  status text not null default 'new'
    check (status in (
      'new',
      'confirmed',
      'preparing',
      'out_for_delivery',
      'delivered',
      'cancelled'
    )),
  payment_status text not null default 'pending'
    check (payment_status in (
      'pending',
      'awaiting_transfer',
      'paid',
      'failed',
      'refunded'
    )),
  payment_method text not null default 'later'
    check (payment_method in ('later', 'bank_transfer', 'card')),
  subtotal_sar numeric(12,2) not null default 0,
  total_sar numeric(12,2) not null default 0,
  currency text not null default 'SAR',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_payment_status_idx on public.orders (payment_status);
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_phone_idx on public.orders (phone);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  catalog_id text not null,
  title text not null,
  image_url text not null default '',
  unit text not null default 'وحدة',
  unit_price_sar numeric(12,2) not null,
  quantity numeric(12,2) not null check (quantity > 0),
  line_total_sar numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- Helpers for RLS
create or replace function public.is_team_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'staff')
  );
$$;

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Orders policies
drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
  on public.orders for insert
  to anon, authenticated
  with check (
    user_id is null
    or user_id = auth.uid()
  );

drop policy if exists "Customers read own orders" on public.orders;
create policy "Customers read own orders"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid() or public.is_team_member());

drop policy if exists "Team manage orders" on public.orders;
create policy "Team manage orders"
  on public.orders for update
  to authenticated
  using (public.is_team_member())
  with check (public.is_team_member());

drop policy if exists "Team delete orders" on public.orders;
create policy "Team delete orders"
  on public.orders for delete
  to authenticated
  using (public.is_team_member());

-- Order items
drop policy if exists "Anyone can insert order items" on public.order_items;
create policy "Anyone can insert order items"
  on public.order_items for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id is null or o.user_id = auth.uid() or public.is_team_member())
    )
  );

drop policy if exists "Read order items with order access" on public.order_items;
create policy "Read order items with order access"
  on public.order_items for select
  to authenticated
  using (
    public.is_team_member()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "Team update order items" on public.order_items;
create policy "Team update order items"
  on public.order_items for update
  to authenticated
  using (public.is_team_member())
  with check (public.is_team_member());

drop policy if exists "Team delete order items" on public.order_items;
create policy "Team delete order items"
  on public.order_items for delete
  to authenticated
  using (public.is_team_member());

-- Atomic create for guests + logged-in customers (bypasses select-after-insert RLS)
create or replace function public.create_store_order(
  p_order_number text,
  p_user_id uuid,
  p_business_name text,
  p_phone text,
  p_city text,
  p_address text,
  p_notes text,
  p_payment_method text,
  p_items jsonb
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_subtotal numeric(12,2) := 0;
  v_item jsonb;
  v_qty numeric;
  v_price numeric;
  v_payment_status text;
begin
  if p_user_id is not null and p_user_id is distinct from auth.uid() then
    raise exception 'invalid user_id';
  end if;

  if p_payment_method is null or p_payment_method not in ('later', 'bank_transfer', 'card') then
    raise exception 'invalid payment_method';
  end if;

  if p_business_name is null or length(trim(p_business_name)) < 2 then
    raise exception 'business_name required';
  end if;
  if p_phone is null or length(trim(p_phone)) < 8 then
    raise exception 'phone required';
  end if;
  if p_city is null or length(trim(p_city)) < 2 then
    raise exception 'city required';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'empty cart';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::numeric;
    v_price := (v_item->>'unit_price_sar')::numeric;
    if v_qty is null or v_qty <= 0 or v_price is null or v_price < 0 then
      raise exception 'invalid item';
    end if;
    v_subtotal := v_subtotal + (v_qty * v_price);
  end loop;

  v_payment_status := case
    when p_payment_method = 'bank_transfer' then 'awaiting_transfer'
    else 'pending'
  end;

  insert into public.orders (
    order_number, user_id, business_name, phone, city, address, notes,
    payment_method, payment_status, status, subtotal_sar, total_sar, currency
  ) values (
    p_order_number,
    p_user_id,
    trim(p_business_name),
    trim(p_phone),
    trim(p_city),
    coalesce(trim(p_address), ''),
    coalesce(trim(p_notes), ''),
    p_payment_method,
    v_payment_status,
    'new',
    v_subtotal,
    v_subtotal,
    'SAR'
  )
  returning * into v_order;

  insert into public.order_items (
    order_id, catalog_id, title, image_url, unit, unit_price_sar, quantity, line_total_sar
  )
  select
    v_order.id,
    coalesce(i->>'catalog_id', ''),
    coalesce(i->>'title', ''),
    coalesce(i->>'image_url', ''),
    coalesce(i->>'unit', 'وحدة'),
    (i->>'unit_price_sar')::numeric,
    (i->>'quantity')::numeric,
    (i->>'unit_price_sar')::numeric * (i->>'quantity')::numeric
  from jsonb_array_elements(p_items) as i;

  return json_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'total_sar', v_order.total_sar,
    'payment_status', v_order.payment_status,
    'payment_method', v_order.payment_method,
    'status', v_order.status
  );
end;
$$;

revoke all on function public.create_store_order(text, uuid, text, text, text, text, text, text, jsonb) from public;
grant execute on function public.create_store_order(text, uuid, text, text, text, text, text, text, jsonb) to anon, authenticated;
