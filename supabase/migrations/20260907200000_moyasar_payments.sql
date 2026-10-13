-- Phase 2: Moyasar payment fields + secure RPCs

alter table public.orders
  add column if not exists payment_token uuid not null default gen_random_uuid(),
  add column if not exists moyasar_payment_id text,
  add column if not exists paid_at timestamptz,
  add column if not exists payment_raw jsonb;

create unique index if not exists orders_payment_token_uidx
  on public.orders (payment_token);

create unique index if not exists orders_moyasar_payment_id_uidx
  on public.orders (moyasar_payment_id)
  where moyasar_payment_id is not null;

-- Update create_store_order to return payment_token and set card pending correctly
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
    when p_payment_method = 'card' then 'pending'
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
    'status', v_order.status,
    'payment_token', v_order.payment_token
  );
end;
$$;

-- Public (token-gated) payment info for Moyasar form
create or replace function public.get_order_for_payment(p_token uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
begin
  if p_token is null then
    raise exception 'token required';
  end if;

  select * into v_order from public.orders where payment_token = p_token;
  if not found then
    return null;
  end if;

  return json_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'total_sar', v_order.total_sar,
    'currency', v_order.currency,
    'payment_status', v_order.payment_status,
    'payment_method', v_order.payment_method,
    'business_name', v_order.business_name,
    'moyasar_payment_id', v_order.moyasar_payment_id,
    'paid_at', v_order.paid_at
  );
end;
$$;

revoke all on function public.get_order_for_payment(uuid) from public;
grant execute on function public.get_order_for_payment(uuid) to anon, authenticated;

-- Attach Moyasar payment id before 3DS redirect
create or replace function public.attach_moyasar_payment(
  p_token uuid,
  p_payment_id text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
begin
  if p_token is null or p_payment_id is null or length(trim(p_payment_id)) < 8 then
    raise exception 'invalid args';
  end if;

  update public.orders
  set moyasar_payment_id = trim(p_payment_id),
      updated_at = now()
  where payment_token = p_token
    and payment_status <> 'paid'
  returning * into v_order;

  if not found then
    select * into v_order from public.orders where payment_token = p_token;
    if not found then
      raise exception 'order not found';
    end if;
  end if;

  return json_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'moyasar_payment_id', v_order.moyasar_payment_id,
    'payment_status', v_order.payment_status
  );
end;
$$;

revoke all on function public.attach_moyasar_payment(uuid, text) from public;
grant execute on function public.attach_moyasar_payment(uuid, text) to anon, authenticated;

-- Mark paid after server-side Moyasar verification (secret-gated via service role / edge)
create or replace function public.mark_order_paid_by_moyasar(
  p_payment_id text,
  p_amount_halalas integer,
  p_currency text default 'SAR',
  p_raw jsonb default '{}'::jsonb
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_expected integer;
begin
  if p_payment_id is null or length(trim(p_payment_id)) < 8 then
    raise exception 'payment_id required';
  end if;

  select * into v_order
  from public.orders
  where moyasar_payment_id = trim(p_payment_id)
     or (p_raw ? 'metadata' and payment_token::text = coalesce(p_raw->'metadata'->>'payment_token', ''))
     or (p_raw ? 'metadata' and order_number = coalesce(p_raw->'metadata'->>'order_number', ''))
  order by created_at desc
  limit 1;

  if not found then
    raise exception 'order not found for payment';
  end if;

  v_expected := round(v_order.total_sar * 100)::integer;
  if p_amount_halalas is distinct from v_expected then
    raise exception 'amount mismatch: expected %, got %', v_expected, p_amount_halalas;
  end if;

  if upper(coalesce(p_currency, 'SAR')) <> upper(coalesce(v_order.currency, 'SAR')) then
    raise exception 'currency mismatch';
  end if;

  update public.orders
  set payment_status = 'paid',
      payment_method = 'card',
      moyasar_payment_id = trim(p_payment_id),
      paid_at = coalesce(paid_at, now()),
      payment_raw = coalesce(p_raw, payment_raw),
      status = case when status = 'new' then 'confirmed' else status end,
      updated_at = now()
  where id = v_order.id
  returning * into v_order;

  return json_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'payment_status', v_order.payment_status,
    'status', v_order.status,
    'paid_at', v_order.paid_at,
    'total_sar', v_order.total_sar
  );
end;
$$;

revoke all on function public.mark_order_paid_by_moyasar(text, integer, text, jsonb) from public;
-- Only service role / backend should call this; do NOT grant to anon
grant execute on function public.mark_order_paid_by_moyasar(text, integer, text, jsonb) to service_role;
