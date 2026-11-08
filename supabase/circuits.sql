-- Circuitos propios (pestaña Circuitos → Crear mi circuito).
-- Pegar en Supabase → SQL Editor → Run. Se puede correr más de una vez sin problema.
create table if not exists public.circuits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  icon text,
  config jsonb not null,           -- { work, rest, rounds, roundRest, exercises:[{key}|{name}] }
  created_at timestamptz not null default now()
);
create index if not exists circuits_user on public.circuits (user_id);

alter table public.circuits enable row level security;
drop policy if exists "cada usuario ve y edita solo sus circuitos" on public.circuits;
create policy "cada usuario ve y edita solo sus circuitos" on public.circuits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
