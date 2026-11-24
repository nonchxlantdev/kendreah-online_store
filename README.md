# Ken' Dreah Online Store

High-fidelity e-commerce demonstration website for **Ken' Dreah Online Store** — a prospective online-only retail brand shipping to **Belize** and the **United States**, planned for launch in **2027**.

This is a client presentation demo. Product data, pricing, shipping rates and orders are illustrative. No live payments, databases or API keys are required.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn-style UI primitives (Radix)
- Lucide React icons
- Motion (subtle animations)
- Zustand + LocalStorage (cart, wishlist, catalogue, orders)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
```

The production build is a static export in `out/` (required for GitHub Pages).

## Live demo

GitHub Pages: [https://nonchxlantdev.github.io/kendreah-online_store/](https://nonchxlantdev.github.io/kendreah-online_store/)

Repository: [https://github.com/nonchxlantdev/kendreah-online_store](https://github.com/nonchxlantdev/kendreah-online_store)

Pushes to `main` deploy automatically via GitHub Actions.

## Demonstration routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/shop` | Full catalogue with filters |
| `/category/clothes` | Clothes department |
| `/category/footwear` | Footwear department |
| `/category/appliances` | Household appliances |
| `/product/[slug]` | Product detail |
| `/cart` | Cart page (+ slide-out drawer) |
| `/checkout` | Simulated checkout (Belize / USA) |
| `/order-confirmation` | Demo order receipt |
| `/wishlist` | Saved products |
| `/about` | Brand story |
| `/delivery-returns` | Shipping & returns placeholders |
| `/contact` | Contact form (simulated) |
| `/admin` | Store management demo (not in primary nav) |

## Client walkthrough

1. Browse the homepage and open a category.
2. Filter/search on `/shop`, open a product, select size/colour, add to cart.
3. Use the cart drawer or `/cart`, then complete `/checkout` with Belize or USA.
4. Confirm the order on `/order-confirmation`.
5. Visit `/admin` to edit products/stock/orders — changes persist locally and appear on the storefront.
6. Use **Reset Demo Data** under Admin → Settings to restore the sample catalogue and orders.

## Brand

- Hot Pink `#EC008C` · Black `#150E13` · Gold `#D4AF37` · Soft White `#FFF8FB`
- Tagline: **Shop • Save • Enjoy**
- Promise: **Trendy • Quality • Affordable**
- Currency: **USD**
- Payments (demo only): Stripe card flow + PayPal option — no real charges

## Notes

- `/admin` is an unauthenticated local prototype for presentation only.
- Shipping amounts shown at checkout are labelled as illustrative demo rates.
- Imagery is stored under `public/products/` for reliable offline demos.
