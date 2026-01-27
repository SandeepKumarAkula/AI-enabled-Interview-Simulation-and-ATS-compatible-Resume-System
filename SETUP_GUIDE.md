# Complete Setup Guide - AI²SARS Platform

This guide walks you through setting up the full user authentication, database, admin dashboard, and background processing system.

## ✅ What's Implemented

- **User Authentication**: Registration, login, logout, forgot/reset password with secure HttpOnly cookies
- **Database**: Prisma ORM with Postgres schema for users, resumes (with version history), interviews, videos, and reports
- **Admin Dashboard**: View all users, their resumes, interviews, videos, reports; export data as JSON or CSV
- **User Dashboard**: Upload resumes (S3), view version history, see interviews with video playback and reports
- **S3 Storage**: Presigned upload URLs for direct client uploads (resumes, videos)
- **Background Processing**: BullMQ worker that processes interview videos and generates reports
- **Role-Based Access**: Admin vs regular user permissions enforced on all APIs

---

## 📋 Prerequisites

1. **Node.js 18+** and npm
2. **PostgreSQL database** (local or cloud - e.g., Railway, Supabase, Neon, AWS RDS)
3. **Redis server** (for background job queue - local or cloud)
4. **AWS S3 bucket** (or S3-compatible storage like Cloudflare R2, MinIO)
5. **SMTP server** (for password reset emails - Gmail, SendGrid, Mailgun, etc.)

---

## 🚀 Step-by-Step Setup

### 1. Install Dependencies

```powershell
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file in the project root and update these values:

```env
# Database - Get connection string from your Postgres provider
DATABASE_URL=postgresql://user:password@localhost:5432/aisars

# NextAuth - Generate a secure random secret (32+ chars)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_long_random_secret_min_32_characters

# Admin Credentials - Set your admin email and password
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!

# S3 Storage - AWS or compatible service
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=YOUR_ACCESS_KEY
S3_SECRET_ACCESS_KEY=YOUR_SECRET_KEY

# Email SMTP - For password reset
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourapp@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@yourdomain.com

# Redis - For background job processing
REDIS_URL=redis://localhost:6379
```

**Database Options:**
- **Local**: Install Postgres locally or use Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres`
- **Cloud Free Tier**: [Supabase](https://supabase.com), [Neon](https://neon.tech), [Railway](https://railway.app)

**Redis Options:**
- **Local**: Install Redis or use Docker: `docker run -d -p 6379:6379 redis`
- **Cloud Free Tier**: [Upstash](https://upstash.com), [Redis Cloud](https://redis.com/try-free/)

### 3. Generate Prisma Client

```powershell
npm run prisma:generate
```

### 4. Run Database Migrations

This creates all tables (User, Resume, ResumeVersion, Interview, Video, Report, etc.):

```powershell
npm run prisma:migrate
```

If migration succeeds, you'll see: `✔ Migration applied successfully`

### 5. Seed Admin User

This creates your admin account from the env variables:

```powershell
npm run prisma:seed
```

You should see: `Admin user ensured: admin@yourdomain.com`

### 6. Start the Development Server

```powershell
npm run dev
```

The app will be available at: http://localhost:3000

### 7. Start the Background Worker (Optional, in separate terminal)

For processing interview videos and generating reports:

```powershell
npx ts-node scripts/start-worker.ts
```

---

## 🎯 Using the Platform

### User Flow

1. **Register**: Visit http://localhost:3000/auth/register
   - Create a new account with email and password
   
2. **Login**: Visit http://localhost:3000/auth/login
   - Login with your credentials (cookie-based session)
   
3. **Upload Resume**: 
   - Go to http://localhost:3000/dashboard/resumes
   - Use the upload form to select a file
   - System: Gets presigned URL → uploads to S3 → creates Resume + ResumeVersion in DB
   
4. **View Interviews**: http://localhost:3000/dashboard/interviews
   - See all your interviews with embedded video players and downloadable reports

5. **Forgot Password**: http://localhost:3000/auth/forgot
   - Enter email → receive reset link via SMTP → set new password

### Admin Flow

1. **Login as Admin**: Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in `.env`

2. **Admin Dashboard**: http://localhost:3000/admin
   - View all users
   - See resume counts and interview counts per user
   - Download user data:
     - JSON export: http://localhost:3000/api/admin/export/users
     - CSV export: http://localhost:3000/api/admin/export/users/csv

3. **Admin has full access** to all API endpoints including user data

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login (sets HttpOnly cookie)
- `POST /api/auth/logout` - Logout (clears cookie)
- `POST /api/auth/forgot-password` - Request reset token
- `POST /api/auth/reset-password` - Apply new password

### Resumes (Protected)
- `GET /api/resumes` - List current user's resumes
- `POST /api/resumes` - Create resume with initial version

### Uploads (Protected)
- `POST /api/uploads/presign` - Get S3 presigned upload URL
- `POST /api/uploads/complete` - Finalize upload and create DB record

### Interviews (Protected)
- `GET /api/interviews` - List current user's interviews
- `POST /api/interviews` - Create interview
- `POST /api/interviews/attach-video` - Attach video and enqueue processing
- `POST /api/interviews/attach-report` - Attach report

### Admin (Admin Only)
- `GET /api/admin/users` - List all users with data
- `GET /api/admin/export/users` - Export JSON
- `GET /api/admin/export/users/csv` - Export CSV

---

## 🔐 Security Features

✅ **Password Hashing**: bcrypt with salt rounds  
✅ **HttpOnly Cookies**: Prevents XSS token theft  
✅ **Secure Sessions**: JWT with 30-day expiration  
✅ **Role-Based Access**: Admin vs USER enforced at API level  
✅ **Time-Limited Reset Tokens**: Password reset tokens expire in 1 hour  
✅ **S3 Presigned URLs**: Client uploads directly without exposing credentials  

### Production Security Checklist

- [ ] Set `NODE_ENV=production` and use HTTPS
- [ ] Rotate `NEXTAUTH_SECRET` regularly
- [ ] Use strong, unique admin password
- [ ] Enable database SSL/TLS
- [ ] Add rate limiting (use helmet middleware)
- [ ] Add CSRF protection for forms
- [ ] Set up database backups
- [ ] Use managed Redis (persistent data)
- [ ] Configure S3 bucket policies (private by default)
- [ ] Enable CloudWatch/monitoring for background jobs

---

## 🛠️ Database Management

### View Data (Prisma Studio)
```powershell
npm run prisma:studio
```
Opens GUI at http://localhost:5555 to browse and edit data

### Reset Database (Careful!)
```powershell
npx prisma migrate reset
npm run prisma:seed
```

### Add New Migrations
After modifying `prisma/schema.prisma`:
```powershell
npx prisma migrate dev --name your_migration_name
```

---

## 🎬 Background Worker Details

The worker (`lib/worker.ts`) processes jobs from the `video-processing` queue:

1. **Triggered by**: `POST /api/interviews/attach-video`
2. **Job Data**: `{ interviewId, s3Key, videoId }`
3. **Processing** (placeholder - replace with real logic):
   - Download video from S3
   - Run analysis (FFmpeg for transcoding, ML model for scoring)
   - Generate report JSON
4. **Result**: Upload report to S3 and create Report record linked to Interview

**To run worker in production:**
```bash
# Use a process manager like PM2
npm install -g pm2
pm2 start scripts/start-worker.ts --interpreter ts-node
```

---

## 📊 Scaling Recommendations

### For Large Data Volumes

1. **Database**:
   - Use connection pooling (PgBouncer)
   - Add indexes on frequently queried fields
   - Enable read replicas for analytics
   - Consider partitioning large tables

2. **Storage**:
   - Use CDN for video/resume delivery (CloudFront + S3)
   - Set S3 lifecycle policies to archive old files to Glacier
   - Implement multipart uploads for large videos

3. **Background Processing**:
   - Run multiple worker instances
   - Use BullMQ Pro for advanced features
   - Consider serverless functions (AWS Lambda, Cloudflare Workers) for video processing
   - Add job retry and dead-letter queues

4. **Caching**:
   - Cache user sessions in Redis
   - Use Next.js ISR for static pages
   - Cache resume/interview lists with short TTL

---

## 🐛 Troubleshooting

### "Can't reach database server"
- Verify Postgres is running: `psql -U user -h localhost -p 5432`
- Check `DATABASE_URL` connection string
- Ensure firewall allows port 5432

### "Redis connection failed"
- Verify Redis is running: `redis-cli ping` (should return PONG)
- Check `REDIS_URL` in `.env`

### "S3 upload fails"
- Verify AWS credentials and permissions
- Check bucket CORS policy allows PUT from your domain
- Test credentials with AWS CLI: `aws s3 ls s3://your-bucket`

### "SMTP email not sending"
- Check SMTP credentials
- For Gmail: enable "App Passwords" (not regular password)
- Check SMTP logs in terminal

### "Migration failed"
- Drop and recreate database if in development
- Check Prisma schema for syntax errors
- Ensure database user has CREATE TABLE permissions

---

## 📝 Development Commands

```powershell
# Development
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint code

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open database GUI
npm run prisma:seed      # Seed admin user

# Worker
npx ts-node scripts/start-worker.ts  # Start background job processor
```

---

## 🎉 You're All Set!

Your platform now has:
- ✅ Complete user authentication system
- ✅ Admin dashboard with full user visibility
- ✅ Resume upload with S3 storage and version history
- ✅ Interview video storage and report generation
- ✅ Background job processing
- ✅ Secure role-based access control

**Next Steps:**
1. Customize the UI with your branding
2. Replace placeholder report generation with real ML/analysis
3. Add more features (profile editing, notifications, analytics)
4. Deploy to production (Vercel, AWS, Railway)

For questions or issues, check the existing documentation files or review the code comments.
