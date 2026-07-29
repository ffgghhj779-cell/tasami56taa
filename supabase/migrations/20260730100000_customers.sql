-- Customer accounts + link quote requests to users

-- Expand roles to include customers
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'staff', 'customer'));

-- Link leads to auth users (nullable for guest submissions)
alter table public.quote_requests
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists quote_requests_user_id_idx
  on public.quote_requests (user_id);

-- Customers can read their own quote requests
drop policy if exists "Customers can read own quote requests" on public.quote_requests;
create policy "Customers can read own quote requests"
  on public.quote_requests for select
  to authenticated
  using (auth.uid() = user_id);

-- Keep insert open; allow setting user_id to self only
drop policy if exists "Anyone can insert quote requests" on public.quote_requests;
create policy "Anyone can insert quote requests"
  on public.quote_requests for insert
  to anon, authenticated
  with check (
    user_id is null
    or user_id = auth.uid()
  );

-- Signup trigger: respect metadata role, default customer
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_role text;
begin
  chosen_role := coalesce(new.raw_user_meta_data->>'role', 'customer');

  if lower(coalesce(new.email, '')) = 'osamakhalil740@gmail.com' then
    chosen_role := 'admin';
  elsif chosen_role not in ('admin', 'staff', 'customer') then
    chosen_role := 'customer';
  end if;

  -- Never allow self-assigning admin via public signup metadata
  if chosen_role = 'admin'
     and lower(coalesce(new.email, '')) <> 'osamakhalil740@gmail.com' then
    chosen_role := 'customer';
  end if;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    chosen_role
  )
  on conflict (id) do update
    set full_name = excluded.full_name;

  return new;
end;
$$;
