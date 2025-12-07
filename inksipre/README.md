# Inkspire – Product Customizer & Ratings

Inkspire is a SvelteKit app for browsing products, customizing variants, placing orders, and leaving verified ratings/comments.

## Stack
- SvelteKit + Vite
- Tailwind (unstyled utility usage)
- MySQL (via `mysql2`)
- Stripe (client + server SDKs installed)

## Prerequisites
- Node 18+ (LTS recommended)
- MySQL database
- Copy `./.env` (or create one) with your values:
  - Database connection (host, port, user, password, database)
  - Stripe keys
  - Email/SMTP values if you enable mailers

## Setup
```sh
npm install
# create and configure .env (see above)
# initialize DB schema
mysql -u <user> -p <dbname> < src/lib/database.sql
```

## Run
```sh
npm run dev          # start dev server (port 5177)
npm run dev -- --open
```

## Build & Preview
```sh
npm run build
npm run preview
```

## Lint / Format
```sh
npm run lint
npm run format
```

## Notes
- Ratings are limited to verified buyers (users with an order containing the product).
- Specs accordion and rating summary live on the product page; user rating form gated by auth + purchase.
- DB schema is in `src/lib/database.sql`; run it before first start.***
