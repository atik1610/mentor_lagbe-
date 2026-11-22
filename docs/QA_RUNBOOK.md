# MentorLagbe QA / launch checklist

This is a manual QA guide for verifying code in a real environment. Do not tick a requirement verified until evidence exists.

## Setup

1. Rotate any MongoDB password previously exposed in a screenshot or archived example file. Update only `server/.env`.
2. Install Node dependencies in `client/` and `server/` using `npm install`; never include `node_modules` in commits.
3. Set backend `.env` and frontend `.env.local` from placeholder examples; generate BetterAuth secret.
4. Run `node src/scripts/setupCollections.js` inside `server` and inspect four main collections in Atlas.
5. Run `npm run dev` for server, then `npm run dev` for client in a separate terminal.
6. Confirm `/health`, `/api/db-health`, `/api/auth/ok`, `/api/auth/jwks` all load correctly.

## Auth / role tests

- Register Student with valid name, email, password, Student role; check `mentorlagbe_auth.user` role and main `mentorlagbe.users` role/default free.
- Register Tutor and verify Tutor dashboard, default Free plan. Do not accept Admin from public signup.
- Use browser DevTools to attempt unauthorized role changes; ensure `403`/error and no database modifications.
- Reload `/dashboard/student` and `/dashboard/tutor` while authenticated; session must persist.
- Try Student accessing Tutor/Admin endpoints and pages; API must return 403.
- Sign out and revisit dashboard; it must request sign-in.
- Verify `/api/auth/token` provides a token and all protected `/api/*` API calls send Bearer JWT.

## Tuition and application tests

- Tutor Free: create first two listings; third must be blocked (403); Pro Tutor can exceed two after verified Stripe upgrade.
- Every new listing must begin pending, invisible on public site.
- Admin approve; it appears on Browse and Featured latest six.
- Test search by title/subject with regex special characters; filter subject/class/mode and pagination.
- Edit a listing and confirm it needs reapproval; close an approved listing and confirm it's no longer public.
- Student apply with phone/schedule/note; status pending. Duplicate application must return 409.
- Tutor view applicant contact and message, then accept/reject; Student status updates on dashboard.
- Student can cancel only pending applications.
- Different Tutor cannot view/manage another Tutor's posts or applicants.

## Stripe / image provider tests

- Put Stripe test-mode secret in backend env, set webhook secret and configure Stripe CLI or public webhook URL.
- Tutor $15 and Student $10 checkout should have correct amount and currency USD.
- Visiting `/payment/success` with fake or unpaid session must NOT upgrade account.
- Authenticated success route must verify with Stripe; signed webhook must upsert a payment once and set plan Pro.
- Replay valid webhook: exactly one payment record; forged signature: HTTP 400.
- Profile/Tutor banner: choose JPG/PNG/WebP under 4MB and upload via ImgBB; saved URL should appear in MongoDB and UI. Invalid payload must be rejected.

## UI / deployment

- Populate 12 linked demo listings using `npm run seed`; clearly disclose that accounts are demo/synthetic.
- Test on desktop, tablet and mobile. Verify nav, footer, consistent cards, X logo, dark/light toggle, placeholder-free dashboards.
- Test 404, error page, and loading state. Verify all routes direct-load after refresh.
- Host Next.js + Express with HTTPS, set `NEXT_PUBLIC_API_URL`, `CLIENT_URL`, `BETTER_AUTH_URL` and cross-site cookie settings if necessary.
- Test CORS, expired tokens, session persistence, and redirects on production domains, including privacy-restrictive browsers.
- Inspect `npm audit` output before deploying; update vulnerable packages with compatible versions and retest.
- Commit at least 20 meaningful client changes and 12 meaningful server changes to GitHub, then fill real live/frontend/backend URL and private demo credentials in the actual submission.

## Commands

```powershell
cd server
npm test
npm run test:static
cd ../client
npx tsc --noEmit
npm run lint
npm run build
```

The exported ZIP does not contain `.env` secrets, live deployment URLs, credentials or GitHub repository histories.
