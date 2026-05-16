# Bargain Booze — Langdale Road, Dunstable

Mobile-friendly online shop for **Bargain Booze** at 62 Langdale Rd, Dunstable LU6 3BS.

## Features

- **Customers:** browse products, register/login, basket, checkout (Stripe or demo mode), collection or local delivery, order tracking with status updates
- **Delivery:** postcode validation against an allowed local list (LU6 area)
- **Promotions:** BOGOF, 2-for price, 3-for price
- **Admin:** manage products, promotions, delivery postcodes, and order fulfilment statuses

## Quick start

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo accounts (after seed)

| Role     | Email                                   | Password    |
|----------|-----------------------------------------|-------------|
| Admin    | admin@bargainbooze-langdale.co.uk       | Admin123!   |

Create a customer account via **Register**.

### Stripe payments

Copy `.env.example` to `.env` and add Stripe keys.

- **Delivery:** must be paid online via Stripe before the order is confirmed.
- **Collection:** customer can **pay in store when collecting** or **pay online** via Stripe.

Without Stripe configured, collection orders can still be placed (pay in store only); delivery checkout is disabled.

For webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Tech stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS
- Prisma + SQLite (swap `DATABASE_URL` for PostgreSQL/Neon in production)
- Auth.js (NextAuth v5) with credentials
- Stripe Checkout

## Admin

Sign in as admin, then visit [/admin](http://localhost:3000/admin).

Product images can be **uploaded** in Admin → Products (stored in `public/uploads/products/`). External image URLs are still supported as a fallback.

> **Production note:** Local file uploads persist on the server filesystem. For serverless hosting (e.g. Vercel), use object storage (S3, Vercel Blob) instead.
