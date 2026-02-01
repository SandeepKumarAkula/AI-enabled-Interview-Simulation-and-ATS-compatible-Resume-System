# Vercel Environment Variables Setup Guide

## 🚀 Quick Setup Steps

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to your Vercel project**
   - Visit https://vercel.com/dashboard
   - Select your project (AI²SARS)

2. **Navigate to Settings → Environment Variables**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left sidebar

3. **Add each variable below**
   - Click "Add New" for each variable
   - Select environment: **Production**, **Preview**, and **Development** (check all three)
   - Click "Save"

---

## 📋 Required Environment Variables

### Database
```
DATABASE_URL=postgres://d369f3ccd55e4e7b48a7f74340c65a1c0522e454ffc11286d0651f4a4df0d800:sk_nQUljdSrp2rQ6Yx1yMLPA@db.prisma.io:5432/postgres?sslmode=require
```

### Authentication
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=change_this_to_a_long_random_secret_minimum_32_chars
```
⚠️ **Important**: 
- Change `NEXTAUTH_URL` to your actual Vercel deployment URL
- Generate a secure random secret for `NEXTAUTH_SECRET`:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### Email (SMTP) - **CRITICAL FOR VERIFICATION**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=kumarakula44@gmail.com
SMTP_PASSWORD=vssj shpg wnzb svit
SMTP_FROM=kumarakula44@gmail.com
```

⚠️ **Gmail Users**: 
- The `SMTP_PASSWORD` should be an **App Password**, not your regular Gmail password
- Generate at: https://myaccount.google.com/apppasswords
- Remove spaces from the app password if any

### S3 / Object Storage (Optional - for file uploads)
```
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
S3_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
```

### Redis (Optional - for background jobs)
```
REDIS_URL=redis://localhost:6379
```
*Note: For production, use a hosted Redis (Upstash, Redis Cloud, etc.)*

---

## Method 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_USER
vercel env add SMTP_PASSWORD
vercel env add SMTP_FROM
```

When prompted, paste the value and select which environments (production/preview/development).

---

## Method 3: Bulk Import via `.env.production` file

1. **Create a `.env.production` file** (locally, don't commit it)

2. **Copy all variables**:
```env
DATABASE_URL="postgres://d369f3ccd55e4e7b48a7f74340c65a1c0522e454ffc11286d0651f4a4df0d800:sk_nQUljdSrp2rQ6Yx1yMLPA@db.prisma.io:5432/postgres?sslmode=require"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-long-random-secret-here"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="kumarakula44@gmail.com"
SMTP_PASSWORD="vssj shpg wnzb svit"
SMTP_FROM="kumarakula44@gmail.com"
S3_BUCKET="your-bucket-name"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY"
S3_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_KEY"
REDIS_URL="redis://localhost:6379"
```

3. **Run**:
```bash
vercel env pull
```

---

## ✅ Verify Setup

### Check if variables are set:
```bash
vercel env ls
```

### Test email in production:
1. Deploy your app: `vercel --prod`
2. Try registering a new account
3. Check if verification email arrives
4. Check Vercel logs: `vercel logs` or in dashboard

---

## 🔧 Troubleshooting

### Email not sending?

1. **Check SMTP credentials in Vercel dashboard**
   - Settings → Environment Variables
   - Verify SMTP_* variables are set

2. **Gmail App Password**
   - Must use App Password, not regular password
   - Generate at: https://myaccount.google.com/apppasswords
   - Enable 2-factor auth first

3. **Check Vercel logs**:
   ```bash
   vercel logs --follow
   ```
   Or visit: https://vercel.com/your-project/deployments → Select deployment → Runtime Logs

4. **Test SMTP locally first**:
   ```bash
   npm run dev
   ```
   Register a test account and verify email works locally

### Common Errors:

**"SMTP not configured"**
- Missing SMTP_HOST, SMTP_USER, or SMTP_PASSWORD in Vercel

**"Invalid login"**
- Wrong SMTP_PASSWORD or not using App Password for Gmail

**"Connection timeout"**
- SMTP_PORT might be wrong (use 587 for Gmail)
- Check if your hosting provider blocks port 587

---

## 🔐 Security Best Practices

1. ✅ **Never commit `.env` files to Git**
2. ✅ **Use different secrets for production vs development**
3. ✅ **Rotate NEXTAUTH_SECRET periodically**
4. ✅ **Use environment-specific database URLs**
5. ✅ **Enable 2FA on your email account**

---

## 🎯 Quick Checklist After Setup

- [ ] All environment variables added in Vercel dashboard
- [ ] NEXTAUTH_URL matches your deployment URL
- [ ] NEXTAUTH_SECRET is a secure random string (32+ chars)
- [ ] SMTP credentials are correct (App Password for Gmail)
- [ ] Redeploy after adding env variables: `vercel --prod`
- [ ] Test registration flow
- [ ] Verify email arrives within 1-2 minutes
- [ ] Check Vercel logs for any errors

---

## 📞 Need Help?

If emails still don't work after setup:
1. Check runtime logs in Vercel dashboard
2. Verify SMTP credentials work with a test script
3. Try a different SMTP provider (SendGrid, Mailgun, etc.)
4. Ensure database URL is accessible from Vercel servers
