# Spec 05 — Imprevista Site Restructure: Thesis / Work / Shop

**Status:** Draft — pending Charles's review
**Hard constraint:** No checkout yet. The shop is a catalog, not a commerce backend. Design the data model so Stripe Checkout can slot in later without a rewrite.

## Overview

Restructure imprevista.com into three destinations under one nav:

| Section | Route | Job |
|---------|-------|-----|
| **Thesis** | `/` | Why this portfolio exists — the edge-finding thesis. Mostly exists today. |
| **Work** | `/work`, `/work/[slug]` | Product portfolio — what's been built and why. Absorbs the current product grid + detail pages. No personal bio. |
| **Shop** | `/shop`, `/shop/[slug]` | Physical products Charles makes. Modeled on wrektek.com/shop (Squarespace-style product pages). Catalog-only until checkout is added. |

## 1. Thesis (homepage)

Keep the existing homepage: `HeroCanvas` → `ThesisSection` → `MultipliersGrid`. Changes:

- Remove `ProductGrid` from the homepage (it moves to `/work`). Replace with a short two-card teaser section linking to **Work** and **Shop**.
- Thesis stays the single narrative surface: struggling moment → multipliers → "see the work."

## 2. Work (portfolio)

- `/work` = the current `ProductGrid`, unchanged in design, on its own page with a one-line intro ("Software products built on the edge-finding thesis").
- `/work/[slug]` = the existing `/products/[slug]` pages, moved. Add permanent redirects from `/products/*` → `/work/*` in `next.config.ts` (the old URLs are in the sitemap and may be indexed).
- Data stays in `src/data/products.ts`. No content changes in this spec.
- No CV/bio layer — product portfolio only (per Charles).

## 3. Shop (new)

### Reference behavior (wrektek.com/shop/p/paster-pooper)

- Product page: multi-image carousel on top, price (with strikethrough compare-at price when on sale), variant selector (e.g. 12 color combos), spec bullets (dimensions, material, "3D printed in the USA in UV-resistant ASA"), links to manual PDF / video, related products below.
- Copy tone: casual and direct ("Patch up targets in a jiffy") backed by concrete specs. Matches the house "conversational, not salesy" voice.

### Shop index — `/shop`

- Grid of product cards: primary photo, name, price, status badge (`Available` / `Sold out` / `Coming soon`).
- House design language (rounded-xl cards, shadow-sm, OKLch tokens) — not a Squarespace clone visually, but the same information architecture.

### Product page — `/shop/[slug]`

Two-column on desktop (gallery left, buy panel right), stacked on mobile:

1. **Gallery** — image carousel with thumbnails. Photos are the product; support 10–20 images per product like the reference.
2. **Buy panel** — name, price (+ optional compare-at price), variant selector (visual swatches for colors), status.
3. **CTA (pre-checkout placeholder)** — since there's no checkout: primary button is **"Email to order"** (`mailto:` with product + selected variant prefilled in the subject) plus a note ("Checkout coming soon — email me and I'll invoice you"). One component (`ProductBuyPanel`) so swapping in Stripe Checkout later touches one file.
4. **Description** — short paragraph + bullet list.
5. **Specs table** — dimensions, material, print details, compatibility. Concrete numbers, wrektek-style.
6. **Links** — optional: instructions PDF, video, reviews.
7. **Related products** — reuse the cross-sell pattern already in the codebase.

### Data model — `src/data/shop.ts` (static, no DB)

```ts
interface ShopProduct {
  slug: string;
  name: string;
  tagline: string;
  price: number;              // cents
  compareAtPrice?: number;    // cents — renders strikethrough
  status: "available" | "sold-out" | "coming-soon";
  images: string[];           // /shop/<slug>/1.jpg … in public/
  variants?: { name: string; options: { label: string; available: boolean }[] }[];
  description: string;
  bullets: string[];
  specs: { label: string; value: string }[];
  links?: { label: string; url: string }[];
  related?: string[];         // slugs
  metaTitle: string;
  metaDescription: string;
  stripePriceId?: string;     // future — checkout hook, unused for now
}
```

Static TS file, same pattern as `products.ts`. No Supabase, no inventory logic — status is hand-edited. When checkout lands, `stripePriceId` + a `/api/checkout` route is the upgrade path.

### Photos

Product photos go in `public/shop/<slug>/`. **Blocking input:** need actual photos from Charles per product — no placeholders shipped to prod.

## 4. Shared changes

- **Nav** (`src/components/nav.tsx`): `Thesis (home) · Work · Shop`. Active state per house pattern.
- **Sitemap** (`src/app/sitemap.ts`): add `/work`, `/work/[slug]`, `/shop`, `/shop/[slug]`; drop `/products/*`.
- **Footer**: add shop link.
- Design system: house tokens throughout; no new dependencies except (maybe) a lightweight carousel — prefer `embla-carousel-react` (shadcn's carousel component wraps it).

## 5. Explicitly out of scope

- Checkout, cart, payments, tax, shipping calculation (later spec)
- Inventory management / order tracking
- Personal CV or bio content
- Any redesign of existing thesis or product-detail content

## 6. Open questions (resolve before build)

1. **Launch products** — which physical products go in the shop first, and do photos exist? (Need: names, prices, variants, specs, photo sets.)
2. **Pre-checkout CTA** — is "Email to order" right, or would you rather a "Notify me" (no commerce implication) until checkout exists?
3. **Shop domain** — `/shop` on imprevista.com per the restructure decision, confirming no desire for a separate storefront domain.

## Build order (once approved)

1. Move product grid to `/work`, redirects, nav — small, ships alone.
2. Shop data model + index + product page with 1 real product.
3. Photos + remaining products.

---
**Synopsis:** Restructures imprevista.com into thesis/work/shop; shop is a wrektek-style catalog for things you make, with a data model that takes Stripe Checkout later without rework. ROI: one site becomes both the portfolio and the sales channel for physical products, shippable in 2–3 small increments.
