# ✦ Lumina — Curated Luxury Marketplace

A full-stack Next.js marketplace application with authentication, product management, and a polished dark luxury UI.

---

## Project Description

Lumina is a curated luxury marketplace where sellers can list extraordinary products — timepieces, fragrances, textiles, and more. It features:

- **Public landing page** with hero, features, featured products, category browse, testimonials, and CTA
- **Product catalog** with search and category filter
- **Product detail pages** with full descriptions and metadata
- **Authentication** via NextAuth.js (credentials + Google OAuth)
- **Protected pages** for adding and managing products (redirect to `/login` if unauthenticated)
- **Polished dark UI** with Playfair Display + DM Sans typography, gold accent palette, responsive layouts

---

## Tech Stack

- **Next.js 14** (App Router)
- **NextAuth.js v4** (credentials + Google OAuth)
- **CSS Modules** (no external UI library)
- **react-hot-toast** for notifications

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/lumina.git
cd lumina
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.local` and fill in values:

```bash
cp .env.local .env.local
```

Edit `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

To generate a secret:
```bash
openssl rand -base64 32
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Demo credentials

| Email | Password |
|-------|----------|
| demo@lumina.com | demo123 |
| user@test.com | test123 |

---

## Route Summary

| Route | Type | Description |
|-------|------|-------------|
| `/` | Public | Landing page (hero, features, products, categories, testimonials) |
| `/login` | Public | Sign in with credentials or Google |
| `/register` | Public | Create a new account |
| `/products` | Public | Product catalog with search & filter |
| `/products/[id]` | Public | Product detail page |
| `/products/add` | **Protected** | Add a new product (auth required) |
| `/products/manage` | **Protected** | Manage/delete all products (auth required) |
| `/api/products` | API | GET all products / POST new product |
| `/api/products/[id]` | API | GET/DELETE product by ID |
| `/api/auth/[...nextauth]` | API | NextAuth.js authentication handler |

---

## Deployment (Vercel)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

---

## Notes

- Products are stored **in-memory** (resets on server restart). For production, replace `lib/products.js` with a database (e.g., MongoDB, PostgreSQL with Prisma).
- Google OAuth requires setting up credentials in [Google Cloud Console](https://console.developers.google.com) and adding your Vercel URL as an authorized redirect.
