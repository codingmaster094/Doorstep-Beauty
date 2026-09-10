Bloom At Home is a premium women beauty home-service platform for Surat, built with Next.js, Payload CMS, MongoDB, and Tailwind CSS.

## Local setup

1. Copy `.env.example` to `.env` and set `PAYLOAD_SECRET` plus a MongoDB `DATABASE_URL`.
2. `npm install`
3. Start MongoDB locally (default URI is `mongodb://127.0.0.1/hbs`).
4. `npm run dev`
5. In another terminal: `npm run seed`
6. Open `http://localhost:3000` and admin at `http://localhost:3000/admin`

Seed admin (change after first login):

- Email: `SEED_ADMIN_EMAIL`
- Password: `SEED_ADMIN_PASSWORD`

## Notes

- Prices are calculated on the server. The client never decides the final amount.
- Home visit charges come from site defaults, a service-specific fixed amount, or the selected service area.
- Online payments are isolated in `src/lib/payments/razorpay.ts` and activate when Razorpay env keys are present.
- Seed data is fictional demo content.
