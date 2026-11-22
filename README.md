# MentorLagbe — Smart Tuition & Mentorship Platform

A role-based EdTech web app built with **Next.js 16, React 19, TypeScript, Express 5, MongoDB Atlas, BetterAuth + MongoDB Adapter, JWT/JWKS, Stripe Checkout and ImgBB**. It is designed for online/offline group tuition and one-to-one mentorship.

> **Delivery status:** This archive contains a substantial source implementation, **not a claim of 216/216 verified requirements**. The final live site, Stripe and ImgBB transactions, production QA, repository links, test credentials and mandatory meaningful GitHub commits require your own services and verification. The uploaded original Excel progress file was **not modified**.

## Project layout

```
MentorLagbe/
  client/              Next.js App Router frontend
  server/              Express backend + BetterAuth, business routes, tests, scripts
  docs/                Original 220-item master requirement list and delivery audit
  README.md
```

## Start locally (Windows PowerShell)

Install **Node.js 22 LTS or newer** and access to MongoDB Atlas. `MONGODB_URI` may use the non-SRV `mongodb://` connection URI if your Node/Windows DNS resolver rejects `mongodb+srv` SRV lookups.

```powershell
cd server
Copy-Item .env.example .env
npm install
# Edit .env: real MongoDB URI, BETTER_AUTH_SECRET, and your deployment URLs
npm run dev
```

Second terminal:

```powershell
cd client
Copy-Item .env.example .env.local
npm install
npm run dev
```

- Frontend: http://localhost:3000
- API health: http://localhost:5000/health
- Database health: http://localhost:5000/api/db-health
- BetterAuth: http://localhost:5000/api/auth/ok

**Environment example files contain placeholders only.** Generate a new 32+ character `BETTER_AUTH_SECRET` with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. Your uploaded original archive contained an exposed database password in `server/.env.example`; **rotate that MongoDB password in Atlas**. Do not commit `.env`, `.env.local`, real Stripe/ImgBB keys, or authentication secrets.

### Database design

- `mentorlagbe` — **exactly four main business collections**: `users`, `tuitions`, `applications`, `payments`.
- `mentorlagbe_auth` — BetterAuth system collections: `user`, `account`, `session`, `verification`, and JWT key data where needed.

Create the business collections and unique indexes once:

```powershell
cd server
node src/scripts/setupCollections.js
```

### Demo sample data

To create six **synthetic demo tutors**, one demo student, twelve connected Admin-approved tuitions, and one accepted sample application, add a strong `SEED_DEMO_PASSWORD` (12+ characters) to `server/.env`, then:

```powershell
npm run seed
```

The seeded tutor/student emails use `@mentorlagbe.example`. They are synthetic test accounts, not verified real individuals. The script uses upserts so it can be re-run without creating duplicate demo listings.

### Admin account

1. Sign up normally as a Student or Tutor with your intended **demo admin email**.
2. Add `ADMIN_EMAIL=<the registered email>` to `server/.env`.
3. Run `npm run admin` in `server/`.
4. Sign out and sign in again. Admin role changes are never allowed through public signup.

Do not ship real admin passwords in a public README. For assignment testing, create separate disposable demo admin and tutor accounts, share those details only through the private submission channel, and rotate them later.

## Implemented code paths

| Feature | Frontend | Backend |
|---|---|---|
| Auth (email/password, JWT, sessions, Student/Tutor role) | `/sign-up`, `/sign-in`, session context | BetterAuth handler, `/api/auth/token`, JWT verification |
| Public tuition search/filters/pagination | `/tuitions`, `/tuitions/[id]` | `GET /api/tuitions`, `GET /api/tuitions/:id` |
| Tutor post CRUD + 2-free limit | Tutor dashboard | `POST/PATCH/DELETE /api/tuitions`, ownership checks |
| Admin moderation and role management | Admin dashboard | Admin-protected API routes |
| Student apply, track, cancel pending | Student dashboard | Applications API, unique index |
| Tutor accepts/rejects applications | Tutor applicants | Tutor-owned application moderation |
| Stripe payment & server verification | `/pricing`, success/cancel | Checkout sessions via Stripe REST, signed webhook and verified session status |
| Profile and tutor banner image uploads | File upload components | Authenticated ImgBB upload proxy (requires API key) |
| Saved tuition / reviews / theme switch | Public & dashboard UI | Saved IDs in `users`; reviews in `tuitions` |
| 12 realistic linked sample tuitions | Dynamic public display | `npm run seed` (requires MongoDB and demo password) |

**Pro plans:** $15 Tutor and $10 Student (USD); verified successful Stripe payment sets `users.plan=pro` and inserts an idempotent `payments` record. The success URL alone never marks a purchase as paid.

## Test commands

```powershell
cd server
npm test
npm run test:static
cd ../client
npx tsc --noEmit
npm run lint
npm run build
```

A local audit in this delivery environment passed 8/8 Node unit tests, JS syntax checks, TypeScript checks and ESLint with zero errors. **A complete Next production build could not be executed here**: the uploaded Windows `node_modules` contains Windows-only SWC binaries, while this build environment is Linux and cannot reach npm to fetch a Linux binary. Run `npm install` and `npm run build` on your Windows PC before submitting.

## Production deployment

1. Host the frontend on Vercel, or another Next-compatible Node host.
2. Host the Express server on Render/Railway or another always-on Node host.
3. Provide the environment variables listed in `server/.env.example` to the backend; set `NEXT_PUBLIC_API_URL` to the publicly reachable backend origin in the frontend.
4. Set `CLIENT_URL` (one or more comma-separated origins) and `BETTER_AUTH_URL` to actual HTTPS origins. Set `AUTH_CROSS_SITE_COOKIES=true` **only when the web client and API truly require cross-site cookies**, with HTTPS, while recognizing that some browsers block third-party cookies; same-site domains are recommended.
5. For Stripe: set `STRIPE_SECRET_KEY`, register webhook URL `https://YOUR_API/api/stripe/webhook`, listen for `checkout.session.completed` and `checkout.session.async_payment_succeeded`, and add `STRIPE_WEBHOOK_SECRET`.
6. For ImgBB: set `IMGBB_API_KEY` on the **backend only**.
7. Test: signup Student/Tutor, reload dashboard, post tuition, approve as Admin, apply, accept, Stripe test payment, upload image, and navigate/reload each private route.
8. Set actual URLs and disposable demo credentials in your **private** submission form. Do not invent live URLs or publish secrets.

`client` and `server` require separate GitHub repositories with 20 and 12 **meaningful commits respectively**, per assignment. This ZIP does not fabricate a remote commit history; push real work in descriptive incremental commits. See `docs/COMMIT_PLAN.md`.

## Current operational status

The user's earlier Atlas screenshots confirmed database connectivity, 4 main collections, BetterAuth registration, and persistence. Those historic observations do not automatically verify the new code as a complete production system. The 220-item requirement ledger and audit are in `docs/`.
