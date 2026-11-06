# Atelier — Minimalist Luxury E-Commerce Experience

> A human-centered, production-grade e-commerce application inspired by high-end luxury fashion and industrial design houses. Built with React 19, TypeScript, Tailwind CSS v4, Lucide icons, and zero-latency hash routing.

---

## ✦ Table of Contents

- [Overview](#overview)
- [Design Philosophy](#design-philosophy)
- [Architecture & Page Directory](#architecture--page-directory)
- [Core Features](#core-features)
  - [1. Universal 16-Page Architecture](#1-universal-16-page-architecture)
  - [2. Mobile-First Optimization & Device Simulator](#2-mobile-first-optimization--device-simulator)
  - [3. Dedicated Wishlist System](#3-dedicated-wishlist-system)
  - [4. Verified Customer Review System](#4-verified-customer-review-system)
  - [5. PCI-DSS Compliant Checkout & 3D Secure Simulation](#5-pci-dss-compliant-checkout--3d-secure-simulation)
  - [6. Real-Time GPS Courier Telemetry](#6-real-time-gps-courier-telemetry)
  - [7. Local Image Asset Architecture](#7-local-image-asset-architecture)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [License](#license)

---

## ✦ Overview

**Atelier** is an editorial, modern lifestyle e-commerce platform offering a cohesive, tactile shopping journey. It features:
- An ultra-fast, zero-friction interface designed for mobile and desktop screens.
- Full 16-page coverage with hash routing synchronization (`#shop`, `#product-detail`, `#categories`, `#cart`, `#wishlist`, `#checkout`, `#orders`, `#profile`, etc.).
- Robust client-side persistence for the shopping bag, saved wishlist, customer orders, reviews, and authentication.
- Seamless dual-mode interaction: fast slideout drawers for quick actions and dedicated standalone pages for deep exploration.

---

## ✦ Design Philosophy

- **Minimal Luxury & Architectural Restraint**: Clean lines, generous whitespace, warm neutral background tones (`bg-stone-50`), and deep charcoal ink (`text-stone-900`).
- **Zero-Pill Discipline**: Product metadata is cleanly set with unboxed typography and subtle dividers (`·`) rather than colorful badges or visual clutter.
- **Human-Centered Micro-Interactions**: Real-time stock alerts, live delivery progress meters, tactile button feedback, and non-intrusive floating toast notifications.
- **Accessible & Responsive**: Full WCAG AA contrast compliance, explicit touch targets (minimum 44×44px), semantic HTML5 elements, and fluid layouts from 320px mobile phones up to 4K ultra-wide displays.

---

## ✦ Architecture & Page Directory

The application implements all 16 required e-commerce pages:

| # | Page Route | Component | Key Highlights |
|---|---|---|---|
| 1 | `home` | `src/pages/HomePage.tsx` | Hero campaign, live trust banner, category showcase, best sellers, brand ethos, customer testimonials, newsletter. |
| 2 | `shop` | `src/pages/ShopPage.tsx` | Full catalog, category pills, search bar, price filters, in-stock toggle, sorting (popular, price, rating), pagination. |
| 3 | `product-detail` | `src/pages/ProductDetailPage.tsx` | Multi-image gallery with zoom, color & size variants, live stock indicators, verified customer reviews tab, "Write a Review" form, related products. |
| 4 | `categories` | `src/pages/CategoriesPage.tsx` | Visual visualizer for Apparel, Footwear, Leather Goods, and Lifestyle Ceramics with item counters and direct collection filters. |
| 5 | `search` | `src/pages/SearchResultsPage.tsx` | Real-time live query search with result counts, suggested keyword tags, and empty state fallbacks. |
| 6 | `cart` | `src/pages/CartPage.tsx` | Itemized table, dynamic quantity modification, complimentary delivery progress bar, promo code engine (`SAVE15`, `VIP20`), order summary. |
| 7 | `wishlist` | `src/pages/WishlistPage.tsx` | Dedicated liked items ledger, one-tap "Move to Bag", "Move All to Bag", empty state curation. |
| 8 | `checkout` | `src/components/CheckoutModal.tsx` | 3-step mobile checkout: Shipping Address, Shipping Method, Encrypted Payment (Card, Apple Pay, Google Pay) with 3D Secure verification. |
| 9 | `login` | `src/pages/LoginPage.tsx` | Luxury sign-in interface with 1-tap Demo Login (`Elena Rostova`) and password recovery helper. |
| 10 | `register` | `src/pages/RegisterPage.tsx` | Atelier Society member onboarding, password security meter, newsletter preference, instant account generation. |
| 11 | `profile` | `src/pages/ProfilePage.tsx` | Customer dashboard, loyalty tier (Private Client Gold), editable shipping address, fast action shortcuts, secure sign out. |
| 12 | `orders` | `src/pages/OrderHistoryPage.tsx` | Complete order history, status filter tabs (All, Processing, Out for Delivery, Delivered), item breakdowns, copy tracking number, live GPS launcher. |
| 13 | `about` | `src/pages/AboutPage.tsx` | Brand manifesto, 3 pillars of craftsmanship (Raw Provenance, Small-Batch Guilds, Lifetime Service), workshop locations in Biella, Florence, and Kyoto. |
| 14 | `contact` | `src/pages/ContactPage.tsx` | Concierge communication form with live response confirmation, physical showroom addresses (San Francisco & Milan), phone and hours. |
| 15 | `faq` | `src/pages/FAQPage.tsx` | Collapsible accordion categorized into Orders & Shipping, Sizing & Materials, Returns & Exchanges, and Payment & Security. |
| 16 | `404` | `src/pages/NotFoundPage.tsx` | Editorial archival page with instant catalog search input, navigation buttons, and recommended product cards. |

---

## ✦ Core Features

### 1. Universal 16-Page Architecture
Every page is a fully typed, self-contained React component that connects to the global app state. The URL hash remains in sync with the viewport (`#shop`, `#cart`, etc.), enabling standard browser navigation (Back and Forward buttons) and shareable deep links.

### 2. Mobile-First Optimization & Device Simulator
- **Fixed Mobile Bottom Navigation**: High-contrast, touch-optimized bar with Explore, Collections, Saved (with badge count), Bag (with badge count), and Account.
- **Desktop Device Simulator**: Includes an interactive toggle (`Mobile Frame`) that renders the entire application inside an iPhone 16 Pro mockup with a Dynamic Island and scrolling screen.

### 3. Dedicated Wishlist System
- Persistent liked items via `localStorage`.
- Move individual items or batch "Move All to Cart".
- Seamlessly accessible through the desktop header icon, mobile bottom navigation, and dedicated `#wishlist` route.

### 4. Verified Customer Review System
- Integrated rating breakdowns and verified buyer badges.
- Interactive "Write a Review" form allowing customers with verified purchase history to submit star ratings, fit assessments (Runs Small / True to Size / Runs Large), titles, and comments.

### 5. PCI-DSS Compliant Checkout & 3D Secure Simulation
- Full form validation for shipping and billing addresses.
- Real-time Luhn algorithm card formatting and brand detection (Visa, Mastercard, Amex).
- Simulated 3D Secure bank authorization modal with one-time verification code.

### 6. Real-Time GPS Courier Telemetry
- Interactive vector map displaying real-time courier position relative to the destination.
- Simulated delivery progress steps: Order Placed → Picked & Packed → In Transit → Out for Delivery → Delivered.
- Live telemetry controls (Accelerate Delivery / Reset Simulation).

### 7. Local Image Asset Architecture
All product and campaign imagery is organized within `public/images/`:
```
public/
└── images/
    ├── hero/
    │   └── hero-fashion-minimal.jpg
    └── products/
        ├── product-merino-knit.jpg
        ├── product-leather-tote.jpg
        ├── product-minimal-sneaker.jpg
        └── product-ceramic-mug.jpg
```
All images use clean descriptive filenames, high-resolution photography, and fallback image loaders.

---

## ✦ Directory Structure

```
├── public/
│   └── images/
│       ├── hero/
│       └── products/
├── src/
│   ├── components/
│   │   ├── CartDrawer.tsx
│   │   ├── CheckoutModal.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileBottomNav.tsx
│   │   ├── Navbar.tsx
│   │   ├── OrderHistoryDrawer.tsx
│   │   ├── OrderTrackingModal.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetailModal.tsx
│   │   ├── ToastContainer.tsx
│   │   ├── WishlistDrawer.tsx
│   │   └── WishlistSection.tsx
│   ├── data/
│   │   ├── products.ts
│   │   └── reviews.ts
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── FAQPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── OrderHistoryPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── SearchResultsPage.tsx
│   │   ├── ShopPage.tsx
│   │   └── WishlistPage.tsx
│   ├── types/
│   │   └── ecommerce.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ✦ Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install
```

### Development
```bash
# Start the local development server
npm run dev
```
The application will launch on `http://localhost:3000`.

### Building for Production
```bash
# Typecheck and build optimized static assets
npm run build
```

---

## ✦ Testing & Quality Assurance

- **TypeScript Compilation**: Run `tsc --noEmit` to verify type safety across all components and page modules.
- **ESLint**: Run `npm run lint` to enforce clean imports and code standards.
- **Cross-Browser Verification**: Tested on Chrome, Safari, Firefox, and mobile WebKit.

---

## ✦ License

This project is licensed under the Apache 2.0 License.
