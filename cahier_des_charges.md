# Cahier des Charges — Portfolio Professionnel Développeur

**Stack technique :** React.js + Tailwind CSS + Supabase
**Version :** 1.0
**Date :** Juin 2026

---

## 1. Présentation du projet

### 1.1 Contexte
Création d'un site portfolio professionnel destiné à présenter le profil, les compétences et les réalisations d'une développeuse, dans le but de :
- Renforcer sa visibilité professionnelle en ligne
- Attirer des recruteurs, clients freelance ou partenaires
- Centraliser ses projets, son CV et ses informations de contact

### 1.2 Objectifs du projet
- Avoir une vitrine moderne, sobre et crédible
- Permettre une mise à jour facile du contenu (projets, expériences) sans toucher au code
- Offrir une expérience rapide, responsive et accessible
- Optimiser le référencement (SEO) pour apparaître sur les recherches liées à son nom/métier

### 1.3 Public cible
- Recruteurs techniques / RH
- Clients potentiels (missions freelance)
- Autres développeurs / communauté tech

---

## 2. Périmètre fonctionnel

### 2.1 Pages du site (Single Page Application avec sections ou routes)

| Page / Section | Contenu |
|---|---|
| **Accueil (Hero)** | Nom, titre/poste, accroche courte, photo ou illustration, CTA (Voir mes projets / Me contacter) |
| **À propos** | Bio, parcours, valeurs, photo |
| **Compétences** | Liste des technos (front, back, outils) avec niveau ou icônes |
| **Projets / Portfolio** | Grille de projets avec image, description courte, stack utilisée, liens (démo + repo GitHub) |
| **Détail d'un projet** | Page dédiée par projet (optionnel) : contexte, problématique, solution, captures, résultats |
| **Expérience / Parcours** | Timeline expériences professionnelles + formations |
| **Contact** | Formulaire de contact, liens réseaux sociaux (LinkedIn, GitHub, etc.), email |
| **CV téléchargeable** | Bouton de téléchargement du CV en PDF |

### 2.2 Fonctionnalités transverses
- Navigation fluide (scroll smooth ou routing React Router)
- Mode clair / sombre (dark mode) — *optionnel mais recommandé*
- Responsive complet (mobile, tablette, desktop)
- Formulaire de contact fonctionnel (envoi via Supabase ou service mail)
- Back-office léger pour gérer les projets (optionnel, voir §5)
- Animations discrètes (apparition au scroll, transitions)

---

## 3. Architecture technique

### 3.1 Stack
- **Frontend :** React.js (Vite recommandé pour la rapidité de build)
- **Styles :** Tailwind CSS
- **Backend / Base de données :** Supabase (PostgreSQL + Auth + Storage)
- **Hébergement front :** Vercel ou Netlify (gratuit, déploiement continu via Git)
- **Hébergement backend :** Supabase Cloud (offre gratuite suffisante au départ)

### 3.2 Pourquoi Supabase ici
- Stocker dynamiquement les projets (titre, description, image, lien) sans coder en dur
- Gérer le stockage des images de projets (Supabase Storage)
- Gérer le formulaire de contact (table `messages`)
- Authentification simple pour un espace admin (si souhaité)

### 3.3 Arborescence technique suggérée
```
portfolio/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── Timeline.jsx
│   │   ├── ContactForm.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProjectDetail.jsx
│   │   └── Admin.jsx (optionnel)
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── hooks/
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
└── package.json
```

---

## 4. Modélisation des données (Supabase)

### Table `projects`
| Champ | Type | Description |
|---|---|---|
| id | uuid | identifiant unique |
| title | text | titre du projet |
| description | text | description courte |
| content | text | description longue (optionnel) |
| stack | text[] | technologies utilisées |
| image_url | text | image de couverture (Storage) |
| demo_url | text | lien démo live |
| repo_url | text | lien GitHub |
| featured | boolean | mis en avant sur la home |
| created_at | timestamp | date d'ajout |

### Table `messages` (formulaire de contact)
| Champ | Type | Description |
|---|---|---|
| id | uuid | identifiant unique |
| name | text | nom de l'expéditeur |
| email | text | email |
| message | text | contenu du message |
| created_at | timestamp | date de réception |

### Table `experiences` (optionnel, pour timeline dynamique)
| Champ | Type | Description |
|---|---|---|
| id | uuid | identifiant unique |
| title | text | poste / formation |
| company | text | entreprise / école |
| period | text | dates |
| description | text | détails |

> **Sécurité :** mise en place de policies RLS (Row Level Security) sur Supabase — lecture publique sur `projects`/`experiences`, écriture restreinte à l'utilisateur authentifié (admin).

---

## 5. Espace admin (optionnel mais recommandé)

Pour que ton amie puisse ajouter/modifier ses projets sans coder :
- Authentification simple via Supabase Auth (email/mot de passe, un seul compte admin)
- Page `/admin` protégée : formulaire CRUD pour gérer les projets et expériences
- Upload d'images vers Supabase Storage

*Alternative plus simple :* si elle est à l'aise avec le code, elle peut aussi modifier directement les données dans le dashboard Supabase sans interface admin dédiée — réduit le temps de développement.

---

## 6. Design / UX

- **Style :** sobre, professionnel, moderne (beaucoup de blanc/espace, une couleur d'accent forte)
- **Typographie :** une police lisible et moderne (Inter, Poppins, ou similaire)
- **Charte graphique :** à définir avec elle (2-3 couleurs principales + neutres)
- **Responsive :** mobile-first avec Tailwind (breakpoints sm/md/lg/xl)
- **Accessibilité :** contrastes suffisants, balises sémantiques, alt sur les images

---

## 7. SEO & Performance

- Balises meta (title, description) dynamiques par page
- Open Graph pour partage réseaux sociaux (image de preview)
- Lazy loading des images
- Score Lighthouse cible : 90+ sur Performance/SEO/Accessibilité
- Sitemap.xml + robots.txt
- Nom de domaine personnalisé recommandé (ex. prenomnom.dev)

---

## 8. Sécurité

- Variables d'environnement (clé Supabase) jamais exposées en clair dans le repo (`.env`)
- RLS activé sur toutes les tables Supabase
- Validation des champs du formulaire de contact (anti-spam basique, ex. honeypot ou reCAPTCHA)

---

## 9. Livrables attendus

- Code source complet sur un repo GitHub (privé ou public selon souhait)
- Site déployé et accessible en ligne (URL de production)
- Base Supabase configurée avec les tables et policies
- Documentation rapide (README) : comment lancer le projet en local, comment ajouter un projet
- Identifiants admin (si espace admin développé)

---

## 10. Planning indicatif

| Phase | Durée estimée |
|---|---|
| Cadrage + maquette (wireframe) | 2-3 jours |
| Setup technique (React + Tailwind + Supabase) | 1 jour |
| Développement des sections statiques (Hero, About, Skills) | 2-3 jours |
| Intégration dynamique (Projects, Contact via Supabase) | 2-3 jours |
| Espace admin (si inclus) | 2 jours |
| Tests, responsive, SEO, déploiement | 1-2 jours |
| **Total** | **~10-14 jours** (à ajuster selon disponibilité) |

---

## 11. Évolutions futures possibles

- Blog technique intégré (articles stockés dans Supabase)
- Statistiques de visites (Plausible, Umami)
- Internationalisation (FR/EN)
- Newsletter / abonnement
- Témoignages clients

---

## 12. Hypothèses prises pour ce document

*(à ajuster selon les retours de ton amie)*
- Le site est une **vitrine personnelle** (pas e-commerce, pas de paiement)
- Un seul administrateur (elle-même)
- Hébergement sur offres gratuites (Vercel + Supabase free tier) suffisant pour démarrer