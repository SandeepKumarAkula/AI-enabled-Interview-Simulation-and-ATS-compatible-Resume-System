# 🚀 Quick Reference - AI²SARS Platform

## 📝 Your Admin Credentials Setup

**Edit `.env` file:**
```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=YourSecurePassword123!
```

**Then run:**
```powershell
npm run prisma:seed
```

---

## ⚡ Quick Start (After Setting Up Database)

```powershell
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

**In separate terminal (optional):**
```powershell
npx ts-node scripts/start-worker.ts
```

---

## 🔗 Important URLs

- **Main Site**: http://localhost:3000
- **Register**: http://localhost:3000/auth/register
- **Login**: http://localhost:3000/auth/login
- **User Resumes**: http://localhost:3000/dashboard/resumes
- **User Interviews**: http://localhost:3000/dashboard/interviews
- **Admin Dashboard**: http://localhost:3000/admin
- **Admin JSON Export**: http://localhost:3000/api/admin/export/users
- **Admin CSV Export**: http://localhost:3000/api/admin/export/users/csv

---

## 📋 Required Services

| Service | Purpose | Free Options |
|---------|---------|--------------|
| **PostgreSQL** | Main database | Supabase, Neon, Railway |
| **Redis** | Job queue | Upstash, Redis Cloud |
| **S3 Storage** | Files/videos | AWS S3, Cloudflare R2 |
| **SMTP** | Password reset emails | Gmail (app password), SendGrid |

---

## 🎯 What You Can Do as Admin

1. Login with your admin credentials
2. Visit `/admin` to see all users
3. View counts: resumes per user, interviews per user
4. Export all data as JSON or CSV
5. Access all user data, resumes, videos, reports

---

## 👥 What Regular Users Can Do

1. Register and login
2. Upload resumes (stored in S3)
3. View resume version history
4. Create interviews
5. Upload interview videos
6. View their interviews with video playback
7. Download their interview reports
8. Reset password via email

---

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `.env` | **Your config** (credentials, DB, S3, SMTP) |
| `SETUP_GUIDE.md` | Complete setup instructions |
| `IMPLEMENTATION_COMPLETE.md` | Full feature documentation |
| `prisma/schema.prisma` | Database structure |
| `lib/worker.ts` | Background job processor |

---

## 🔧 Common Commands

```powershell
# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Create tables
npm run prisma:studio      # View data in GUI
npm run prisma:seed        # Create admin user

# Development
npm run dev                # Start Next.js server
npm run build              # Build for production
npm run start              # Start production server

# Worker
npx ts-node scripts/start-worker.ts  # Process background jobs
```

---

## ⚠️ Before First Run

1. ✅ Install Node.js 18+
2. ✅ Set up Postgres database
3. ✅ Set up Redis (optional, for worker)
4. ✅ Create S3 bucket
5. ✅ Get SMTP credentials
6. ✅ Update `.env` with real values
7. ✅ Set your admin email and password in `.env`

---

## 🆘 Troubleshooting

**Database connection failed?**
- Check `DATABASE_URL` in `.env`
- Ensure Postgres is running
- Test connection: `psql -U user -h host -p 5432 -d dbname`

**Can't install packages?**
- Already fixed! All package versions are compatible
- Just run `npm install`

**Admin login not working?**
- Run `npm run prisma:seed` again
- Check `.env` has correct `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- Verify seed output shows "Admin user ensured"

**Uploads failing?**
- Check S3 credentials in `.env`
- Verify bucket exists and has correct permissions
- Check bucket CORS policy

---

## 📚 Documentation Files

1. **SETUP_GUIDE.md** - Complete step-by-step setup
2. **IMPLEMENTATION_COMPLETE.md** - All features explained
3. **AUTH_SETUP.md** - Authentication details
4. **This file** - Quick reference

---

## 🎉 You're Ready!

Everything is implemented and ready to run. Just:
1. Set up your database
2. Configure `.env`
3. Run the commands above
4. Start building!

**Need help?** Check `SETUP_GUIDE.md` for detailed instructions.
