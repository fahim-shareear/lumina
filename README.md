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

## Firebase Setup (Required for Authentication)

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `lumina-marketplace`
4. Enable Google Analytics (optional)
5. Choose Google Analytics account or create new
6. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Enable **Google** provider:
   - Click on Google
   - Toggle "Enable"
   - Enter project name (e.g., "Lumina Marketplace")
   - Add your domain: `localhost` (for development)
   - Click "Save"

### 3. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>)
4. Enter app nickname: "Lumina Web App"
5. **Check "Also set up Firebase Hosting"** (optional)
6. Click "Register app"
7. Copy the config object from the code snippet

### 4. Update Firebase Config

Replace the placeholder config in `lib/firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 5. Update Environment Variables

In `.env.local`, make sure you have:

```env
# Firebase doesn't need additional env vars for basic auth
# Google OAuth is configured in Firebase Console
```

### 6. Test Authentication

1. Start the dev server: `npm run dev`
2. Try registering with email/password
3. Try signing in with Google
4. Both should work once Firebase is properly configured

### Troubleshooting

**Registration/Login not working:**
- Check Firebase Console > Authentication > Users to see if accounts are created
- Check browser console for errors
- Make sure Google provider is enabled in Firebase Console
- Verify your domain is added to authorized domains

**Google OAuth popup blocked:**
- Make sure you're testing on `localhost` or an authorized domain
- Check browser popup blocker settings

**Firebase errors:**
- Verify your config is correct
- Check Firebase Console > Project Settings > General for correct config

Edit `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

To generate a secret:
```bash
openssl rand -base64 32
```

### 4. Set up Stripe

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the dashboard
3. Add them to `.env.local`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Demo credentials

| Email | Password |
|-------|----------|
| demo@lumina.com | demo123 |
| user@test.com | test123 |

---

## Features

- **Shopping Cart**: Add products to cart, view total, adjust quantities
- **Stripe Payments**: Secure checkout with Stripe Elements
- **Authentication**: Firebase Auth with email/password
- **Product Management**: Add, view, and manage products
- **Responsive Design**: Works on all devices

---

## Route Summary

| Route | Type | Description |
|-------|------|-------------|
| `/` | Public | Landing page (hero, features, products, categories, testimonials) |
| `/login` | Public | Sign in with credentials or Google |
| `/register` | Public | Create a new account |
| `/products` | Public | Product catalog with search & filter |
| `/products/[id]` | Public | Product detail page |
| `/cart` | Public | Shopping cart |
| `/checkout` | Public | Payment checkout (requires auth) |
| `/checkout/success` | Public | Payment success confirmation |
| `/products/add` | **Protected** | Add a new product (auth required) |
| `/products/manage` | **Protected** | Manage/delete all products (auth required) |
| `/api/products` | API | GET all products / POST new product |
| `/api/products/[id]` | API | GET/DELETE product by ID |
| `/api/create-payment-intent` | API | Create Stripe payment intent |
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
