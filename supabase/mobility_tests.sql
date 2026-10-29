-- Tests mensuales de movilidad (pestaña Movilidad → Tests).
-- Pegar en Supabase → SQL Editor → Run. Se puede correr más de una vez sin problema.
create table if not exists public.mobility_tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  test_key text not null,          -- ej: 'knee_wall', 'sit_reach'
  side text,                       -- 'left' | 'right' | null si no es por lado
  value numeric not null,          -- cm, segundos, o escala 0=no 1=casi 2=sí
  test_date date not null default current_date,
  created_at timestamptz not null default now()
);
create index if not exists mobility_tests_user_date on public.mobility_tests (user_id, test_date);

alter table public.mobility_tests enable row level security;
drop policy if exists "cada usuario ve y edita solo sus tests" on public.mobility_tests;
create policy "cada usuario ve y edita solo sus tests" on public.mobility_tests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
