-- Portfolio Ilham — Settings table, seed update, stage type
-- Exécuter dans le SQL Editor du dashboard Supabase

-- ─── 1. Ajouter le type "stage" aux expériences ─────────────
alter table if exists public.experiences
  drop constraint if exists experiences_type_check;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'experiences_type_check' and table_name = 'experiences'
  ) then
    alter table public.experiences
      add constraint experiences_type_check
      check (type in ('work', 'education', 'stage'));
  end if;
end $$;

-- ─── 2. Créer la table settings (profil, compétences, langues) ──
create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz default now()
);

alter table public.settings enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'settings_public_read' and tablename = 'settings') then
    create policy "settings_public_read"
      on public.settings for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'settings_admin_all' and tablename = 'settings') then
    create policy "settings_admin_all"
      on public.settings for all
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;

-- ─── 3. Supprimer les anciennes seed data obsolètes ─────────
delete from public.experiences where title like 'Licence Professionnelle%' and type = 'education';
delete from public.experiences where title like 'Technicien Spécialisé%' and type = 'education';
delete from public.experiences where title like 'Baccalauréat%' and type = 'education';

-- ─── 4. Insérer les expériences à jour ──────────────────────
insert into public.experiences (title, company, period, description, type, sort_order)
values
  ('Licence Professionnelle en Informatique', 'École SUP MTI, Oujda', '2025 — 2026',
   'Formation en développement logiciel et web : React, Laravel, PHP, Java, Kotlin, C#, Supabase.', 'education', 1),
  ('Technicien Spécialisé en Développement Digital', 'Centre Mixte de Formation Professionnelle, Oujda', '2023 — 2025',
   'Formation professionnelle en développement web et logiciel : HTML, CSS, JavaScript, React, PHP, Laravel, Java, C# et bases de données.', 'education', 2),
  ('Baccalauréat Sciences Physiques', 'Lycée Omar Ibn Abdelaziz, Oujda', '2020 — 2021',
   'Option Français — fondations scientifiques et rigueur analytique.', 'education', 3),
  ('Stagiaire Développeuse Full-Stack', 'TAGES ENTSI — École des Nouvelles Technologies & Systèmes d''Information', 'Juillet 2026 (1 mois)',
   'Conception d''une SaaS multi-tenant de suivi des obligations réglementaires (CNSS, assurances, médecine du travail) pour PME marocaines : architecture isolée par entreprise, auth par rôles, console d''administration, emails transactionnels, CI/CD. Technologies : React, Laravel, Tailwind CSS, MySQL, Brevo, Docker.', 'stage', 4),
  ('Stagiaire Développeuse Web', 'FSO — Faculté des Sciences d''Oujda (Service Informatique)', 'Mars 2025 (1 mois)',
   'Développement d''un site de commande pour restaurant (sans paiement) : catalogue, panier, gestion des commandes et notifications email selon le statut (reçue, en préparation, prête). Technologies : ReactJS, Bootstrap, PHP.', 'stage', 5);

-- ─── 5. Insérer le profil dans settings ─────────────────────
insert into public.settings (key, value, updated_at)
values ('profile', '{
  "name": "Ilham",
  "fullName": "Ilham El-Alaoui",
  "title": "Développeuse Full-Stack",
  "subtitle": "Licenciée en Informatique — SUP MTI",
  "tagline": "Jeune développeuse Full-Stack passionnée, à la recherche d''une opportunité en CDI pour contribuer à des projets web et logiciels ambitieux.",
  "email": "ilham.elalaoui.128@gmail.com",
  "phone": "+212 7 09 39 88 80",
  "phoneHref": "tel:+212709398880",
  "location": "Oujda, Maroc",
  "seekingType": "travail",
  "jobTarget": "Développeuse Full-Stack",
  "jobContract": "CDI",
  "jobPeriod": "Immédiatement",
  "jobDesc": "Je recherche un poste en CDI en développement web ou logiciel où je pourrai mettre à profit mes compétences en React, Laravel, PHP et Kotlin au sein d''une équipe motivante.",
  "cvUrl": "/cv.pdf",
  "photoUrl": "/photo.png",
  "social": {
    "github": "https://github.com/ilhamelalaoui128",
    "linkedin": "https://linkedin.com/in/ilhamelalaoui"
  },
  "about": {
    "bio": "Développeuse Full-Stack fraîchement diplômée d''une Licence Professionnelle en Informatique à SUP MTI, je recherche un emploi en CDI pour mettre mes compétences en développement web (React, Laravel, Tailwind CSS, PHP) et logiciel (Java, Kotlin, C#) au service de projets concrets.\n\nCurieuse et rigoureuse, j''aime construire des applications complètes — de l''interface utilisateur à la base de données — en accordant une attention particulière à la qualité du code, aux tests et à la sécurité des données.",
    "values": [
      { "label": "Curiosité", "desc": "Envie constante d''apprendre et de maîtriser de nouvelles technologies." },
      { "label": "Rigueur", "desc": "Code structuré, tests automatisés et respect des bonnes pratiques." },
      { "label": "Concret", "desc": "Projets fonctionnels déployés, de l''idée à la mise en production." }
    ],
    "focus": {
      "web": ["React", "Laravel", "Supabase", "PHP"],
      "mobile": ["Java", "Kotlin"]
    },
    "stack": [
      { "category": "Frontend", "items": ["React", "Tailwind CSS", "JavaScript"] },
      { "category": "Backend", "items": ["Laravel", "PHP", "Node.js"] },
      { "category": "Base de données", "items": ["Supabase", "MySQL"] },
      { "category": "Outils", "items": ["Git", "VS Code", "Figma"] }
    ]
  }
}'::jsonb, now())
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ─── 6. Insérer les langues ─────────────────────────────────
insert into public.settings (key, value, updated_at)
values ('languages', '[
  { "name": "Français", "level": "Courant", "percent": 95 },
  { "name": "Anglais", "level": "Intermédiaire", "percent": 65 }
]'::jsonb, now())
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ─── 7. Insérer les compétences ─────────────────────────────
insert into public.settings (key, value, updated_at)
values ('skills', '[
  {
    "category": "Développement Web",
    "items": [
      { "name": "React / Vite", "level": 85 },
      { "name": "JavaScript", "level": 80 },
      { "name": "HTML / CSS", "level": 90 },
      { "name": "Tailwind CSS", "level": 85 },
      { "name": "PHP / Laravel", "level": 75 },
      { "name": "Bootstrap", "level": 80 }
    ]
  },
  {
    "category": "Logiciel & Back-End",
    "items": [
      { "name": "Java (Swing)", "level": 70 },
      { "name": "C#", "level": 65 },
      { "name": "Kotlin", "level": 60 },
      { "name": "Python", "level": 65 }
    ]
  },
  {
    "category": "Data & Outils",
    "items": [
      { "name": "Supabase / PostgreSQL", "level": 80 },
      { "name": "MySQL", "level": 75 },
      { "name": "Git / GitHub", "level": 85 },
      { "name": "Netlify", "level": 80 }
    ]
  }
]'::jsonb, now())
on conflict (key) do update set value = excluded.value, updated_at = now();
