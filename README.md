# Portfolio Ilham

Portfolio professionnel développé avec **React + Vite + Tailwind CSS + Supabase**, conforme au cahier des charges.

## Fonctionnalités

- Sections : Hero, À propos, Compétences, Projets, Parcours, Contact
- Page détail par projet (`/projects/:id`)
- Mode clair / sombre
- Formulaire de contact (Supabase + honeypot anti-spam)
- Espace admin CRUD (`/admin`) avec Supabase Auth
- Données de démonstration intégrées (fonctionne sans Supabase)
- SEO : meta tags, Open Graph, robots.txt, sitemap.xml

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer en local
npm run dev

# Build production
npm run build
```

Le site tourne sur `http://localhost:5173` — **aucune config Supabase requise** pour la preview (données fallback).

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Exécuter le SQL : `supabase/migrations/001_initial_schema.sql`
3. Créer un utilisateur admin : **Authentication > Users > Add user**
4. Copier `.env.example` vers `.env` :

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

5. Redémarrer le serveur dev

## Personnalisation du contenu

| Fichier | Contenu |
|---------|---------|
| `src/lib/data.js` | Profil, bio, compétences, liens sociaux |
| `public/cv.pdf` | Votre CV téléchargeable |
| Supabase dashboard | Projets et expériences dynamiques |
| `/admin` | Gestion CRUD des projets |

## Déploiement (Vercel)

```bash
npm i -g vercel
vercel
```

Ajouter les variables d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans le dashboard Vercel.

## Structure

```
src/
├── components/    # UI réutilisable
├── pages/         # Home, ProjectDetail, Admin
├── lib/           # Supabase, API, données statiques
└── hooks/         # Theme, scroll reveal
```

## Stack

- React 19 + Vite 6
- Tailwind CSS 3
- React Router 7
- Supabase (PostgreSQL + Auth)
- Framer Motion
- Lucide React

---

*Cahier des charges : `cahier_des_charges.md`*
