-- Portfolio Ilham — Schéma initial Supabase
-- Exécuter dans le SQL Editor du dashboard Supabase

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── PROJECTS ───────────────────────────────────────────────
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  content text default '',
  stack text[] default '{}',
  image_url text default '',
  demo_url text default '',
  repo_url text default '',
  featured boolean default false,
  created_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "projects_public_read"
  on public.projects for select
  to anon, authenticated
  using (true);

create policy "projects_admin_insert"
  on public.projects for insert
  to authenticated
  with check (true);

create policy "projects_admin_update"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

create policy "projects_admin_delete"
  on public.projects for delete
  to authenticated
  using (true);

-- ─── MESSAGES (contact) ─────────────────────────────────────
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "messages_public_insert"
  on public.messages for insert
  to anon, authenticated
  with check (true);

create policy "messages_admin_read"
  on public.messages for select
  to authenticated
  using (true);

-- ─── EXPERIENCES ────────────────────────────────────────────
create table if not exists public.experiences (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  company text not null default '',
  period text not null default '',
  description text default '',
  type text default 'work' check (type in ('work', 'education')),
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.experiences enable row level security;

create policy "experiences_public_read"
  on public.experiences for select
  to anon, authenticated
  using (true);

create policy "experiences_admin_insert"
  on public.experiences for insert
  to authenticated
  with check (true);

create policy "experiences_admin_update"
  on public.experiences for update
  to authenticated
  using (true)
  with check (true);

create policy "experiences_admin_delete"
  on public.experiences for delete
  to authenticated
  using (true);

-- ─── SEED DATA ──────────────────────────────────────────────
insert into public.projects (title, description, content, stack, image_url, demo_url, repo_url, featured)
values
  (
    'Mini Shop — Plateforme e-commerce',
    'Application e-commerce complète avec catalogue, panier, espace client et tableau de bord d''administration.',
    'Plateforme e-commerce complète avec interface client et dashboard admin. Authentification, stockage d''images et sécurité RLS PostgreSQL.',
    array['React', 'Vite', 'React Router', 'Tailwind CSS', 'Supabase'],
    'https://images.unsplash.com/photo-1557821552-051077196091?w=800&q=80',
    'https://minishopme.netlify.app/', 'https://github.com/ilhamelalaoui128/mini-shop/', true
  ),
  (
    'Quiz Interactif — Application web de quiz',
    'Quiz à choix multiples avec 50+ questions, mode chronométré, historique des scores et plus de 30 tests automatisés.',
    'Application de quiz à 4 étapes avec 50+ questions, mode chronométré, dark mode, navigation clavier et 30+ tests Vitest.',
    array['React', 'Vite', 'Tailwind CSS', 'Vitest'],
    '/projects/quiz.png',
    'https://myquiz4u.netlify.app/', 'https://github.com/ilhamelalaoui128/my-quiz/', true
  );

insert into public.experiences (title, company, period, description, type, sort_order)
values
  ('Licence Professionnelle en Informatique', 'École SUP MTI, Oujda', '2025 — 2026',
   'Formation en cours — développement logiciel et web.', 'education', 1),
  ('Technicien Spécialisé en Développement Digital', 'CMFP, Oujda', '2023 — 2025',
   'Formation en développement web et logiciel : React, PHP, Laravel, Java, C#.', 'education', 2),
  ('Baccalauréat Sciences Physiques', 'Lycée Omar Ibn Abdelaziz, Oujda', '2020 — 2021',
   'Option Français.', 'education', 3);

-- ─── STORAGE (optionnel) ────────────────────────────────────
-- Créer le bucket "project-images" dans Storage > New bucket (public)
-- Puis appliquer ces policies :

-- create policy "images_public_read"
--   on storage.objects for select
--   to anon, authenticated
--   using (bucket_id = 'project-images');

-- create policy "images_admin_upload"
--   on storage.objects for insert
--   to authenticated
--   with check (bucket_id = 'project-images');





