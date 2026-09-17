-- Shark Swimming Club — initial schema
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Safe to re-run: guards with "if not exists" / "drop policy if exists" where useful.

create extension if not exists "pgcrypto";

-- One row per logged-in client, 1:1 with auth.users.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  client_name text not null default '',
  -- 'cliente' (padre/alumno), 'instructor' (coach) o 'admin' (dueño / contadora).
  -- Solo se cambia desde el panel de administración, nunca desde la app del cliente.
  role text not null default 'cliente' check (role in ('cliente', 'instructor', 'admin')),
  accent text not null default '#FF6A3D',
  two_factor_enabled boolean not null default true,
  biometric_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- A client can register more than one swimmer (e.g. two kids).
create table if not exists swimmers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  age int,
  level text not null default 'Tiburón 1',
  points int not null default 0,
  medical_info text,
  emergency_contact text,
  authorized_pickup text,
  created_at timestamptz not null default now()
);

-- The class catalog — managed by staff (service role), read-only for clients.
create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text not null,
  coach text not null,
  pool text not null default 'Alberca A',
  lane text,
  class_date date not null,
  start_time text not null,
  capacity int not null default 6,
  created_at timestamptz not null default now()
);

-- A swimmer reserving a spot in a class. Unique constraint blocks double-booking.
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  swimmer_id uuid not null references swimmers(id) on delete cascade,
  class_id uuid not null references classes(id) on delete cascade,
  status text not null default 'reservado',
  created_at timestamptz not null default now(),
  unique (swimmer_id, class_id)
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'Plan Olas Premium',
  price numeric not null default 0,
  renews_on date,
  status text not null default 'activa',
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references memberships(id) on delete cascade,
  amount numeric not null,
  label text not null,
  paid_on date not null default current_date
);

create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade, -- null = broadcast to everyone
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists notice_reads (
  notice_id uuid not null references notices(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notice_id, owner_id)
);

-- ---------- Row Level Security ----------
-- Everyone can only ever see/change their own data. Class catalog is
-- read-only for clients — only a service-role connection (staff tools,
-- built later) can insert/update/delete classes.

alter table profiles enable row level security;
alter table swimmers enable row level security;
alter table classes enable row level security;
alter table bookings enable row level security;
alter table memberships enable row level security;
alter table payments enable row level security;
alter table notices enable row level security;
alter table notice_reads enable row level security;

drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own swimmers" on swimmers;
create policy "own swimmers" on swimmers
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "read classes" on classes;
create policy "read classes" on classes
  for select using (auth.role() = 'authenticated');

drop policy if exists "own bookings" on bookings;
create policy "own bookings" on bookings
  for all using (
    exists (select 1 from swimmers s where s.id = swimmer_id and s.owner_id = auth.uid())
  ) with check (
    exists (select 1 from swimmers s where s.id = swimmer_id and s.owner_id = auth.uid())
  );

drop policy if exists "own memberships" on memberships;
create policy "own memberships" on memberships
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "own payments" on payments;
create policy "own payments" on payments
  for select using (
    exists (select 1 from memberships m where m.id = membership_id and m.owner_id = auth.uid())
  );

drop policy if exists "own or broadcast notices" on notices;
create policy "own or broadcast notices" on notices
  for select using (owner_id is null or owner_id = auth.uid());

drop policy if exists "own notice reads" on notice_reads;
create policy "own notice reads" on notice_reads
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ---------- Auto-provision on signup ----------
-- Creates a profile + a first swimmer + a default membership the moment
-- someone signs up, so the app never has to handle "no profile yet".

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, client_name) values (new.id, coalesce(new.raw_user_meta_data->>'client_name', ''));
  insert into public.swimmers (owner_id, name, age, level)
    values (new.id, coalesce(new.raw_user_meta_data->>'swimmer_name', 'Nadador'), null, 'Tiburón 1');
  insert into public.memberships (owner_id, plan, price, status)
    values (new.id, 'Plan Olas Premium', 0, 'activa');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- Sample class catalog ----------
-- Safe to run once; skip if you already seeded classes.
insert into classes (title, level, coach, pool, lane, class_date, start_time, capacity)
select * from (values
  ('Tiburón 1 · Crol', 'Tiburón 1', 'Diana', 'Alberca A', '3', current_date + 1, '9:00 AM', 6),
  ('Tiburón 1 · Respiración', 'Tiburón 1', 'Mario', 'Alberca A', '2', current_date + 1, '11:00 AM', 6),
  ('Tiburón 2 · Crol', 'Tiburón 2', 'Diana', 'Alberca A', '3', current_date + 2, '5:00 PM', 4),
  ('Acondicionamiento', 'Todos los niveles', 'Mario', 'Alberca A', '1', current_date + 2, '9:00 AM', 8)
) as v(title, level, coach, pool, lane, class_date, start_time, capacity)
where not exists (select 1 from classes);
