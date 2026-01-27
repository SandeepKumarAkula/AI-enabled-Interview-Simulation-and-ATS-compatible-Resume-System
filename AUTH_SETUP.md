**Auth & Database Setup**

- Copy `.env.example` to `.env` and set values for `DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, SMTP and S3/Redis if used.
- Install new dependencies:

```powershell
npm install
```

- Generate Prisma client and run migrations:

```powershell
npm run prisma:generate
npm run prisma:migrate
```

- Seed admin user (reads `ADMIN_EMAIL` and `ADMIN_PASSWORD`):

```powershell
npm run prisma:seed
```

- Start dev server:

```powershell
npm run dev
```

Notes:
- Admin credentials are created from `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Keep them secret and store in environment variables on production.
- The simple JWT-based login returns a token — store it in a secure cookie or use it in `Authorization: Bearer <token>` headers for protected API calls.
- For production scale, use a managed Postgres, S3-compatible object storage, Redis for queues, and rotate secrets regularly.
