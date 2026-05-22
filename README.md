# AI²SARS - AI-enabled Interview Simulation & ATS Resume System

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> A comprehensive AI-powered platform for interview preparation and resume optimization with Q-Learning agents, speech recognition, and real-time performance scoring.
Live Website: https://ai-enabled-interview-simulation-and.vercel.app/
## 🎯 Features

### 🎥 Interview Simulator
- **Full-Screen Interview Mode** - Immersive experience with automatic fullscreen enforcement
- **Speech Recognition** - Real-time speech-to-text with live captions (like Google Meet)
- **AI-Powered Questions** - 100+ questions across 9 roles, 5 types, 3 difficulty levels
- **Q-Learning Agent** - Adaptive questions based on your performance
- **Video Analysis** - 6-dimension performance scoring (Clarity, Technical Depth, Problem-Solving, Communication, Confidence, Body Language)

### 📄 Resume Builder
- **Professional Templates** - 15+ ATS-friendly resume templates
- **Real-time Preview** - Live PDF preview as you edit
- **ATS Optimization** - Analyze resume compatibility with Applicant Tracking Systems
- **Export Options** - Download as PDF or share link

### 🤖 Intelligent Features
- **Q-Learning Agent** - 87,846-state Q-table for intelligent question selection
- **Performance Reports** - Comprehensive PDF reports with role-specific recommendations
- **Interview Readiness Score** - Get matched with suitable job roles
- **No External APIs** - Completely independent AI processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL 14+ (optional for local dev, uses Prisma)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/AI2SARS.git
cd AI2SARS

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Configure .env.local with your values:
# DATABASE_URL=postgresql://user:password@localhost:5432/ai2sars
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret-key

# Setup Prisma
npx prisma generate
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Environment Setup

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai2sars

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Admin Credentials (Initial Setup)
ADMIN_EMAIL=admin@ai2sars.com
ADMIN_PASSWORD=secure-password

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@ai2sars.com

# AWS S3 (Optional - for file uploads)
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY_ID=your-access-key
AWS_S3_SECRET_ACCESS_KEY=your-secret-key

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🏗️ Project Structure

```
AI²SARS/
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication routes (login, register, reset)
│   ├── ai-interview/             # Interview simulator pages
│   ├── dashboard/                # User dashboard
│   ├── admin/                    # Admin panel
│   ├── api/                      # API routes
│   ├── ats/                      # ATS analysis pages
│   ├── help/                     # Help & support pages
│   ├── intelligent-agent/        # Q-Learning agent dashboard
│   ├── rl-agent/                 # Reinforcement learning agent
│   └── templates/                # Resume templates
├── components/                   # Reusable React components
│   ├── password-input.tsx        # Password input with visibility toggle
│   ├── auth-gate.tsx             # Authentication wrapper
│   ├── footer.tsx                # Footer component
│   ├── header.tsx                # Header/Navigation
│   └── ...other components
├── lib/                          # Utility functions
├── prisma/                       # Database schema & migrations
│   ├── schema.prisma             # Prisma data model
│   └── seed.ts                   # Database seeding
├── public/                       # Static assets
├── styles/                       # Global CSS
├── middleware.ts                 # Next.js middleware
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

## 🗄️ Database Schema

### Core Models
- **User** - User accounts with authentication
- **Resume** - Resume documents with templates
- **InterviewSession** - Interview history and records
- **PerformanceMetrics** - Interview scoring data
- **QTable** - Q-Learning state-action values
- **AdminUser** - Admin accounts and permissions

## 🔐 Authentication

- **NextAuth.js** - Session-based authentication
- **Password Hashing** - bcrypt for security
- **Role-Based Access** - User, Admin, Premium roles
- **Session Timeout** - Auto-logout after 30 minutes of inactivity

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password with token

### Resume
- `GET /api/resume` - Get user's resumes
- `POST /api/resume` - Create new resume
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume
- `GET /api/resume/:id/pdf` - Download resume as PDF

### Interview
- `POST /api/interview/start` - Start interview session
- `POST /api/interview/:id/submit` - Submit interview answer
- `GET /api/interview/:id/results` - Get interview results
- `POST /api/interview/:id/report` - Generate PDF report

### ATS Analysis
- `POST /api/ats/analyze` - Analyze resume for ATS compatibility
- `GET /api/ats/scores` - Get ATS scores for resume

### Q-Learning Agent
- `GET /api/agent/questions` - Get next question
- `POST /api/agent/learn` - Update Q-table from feedback
- `GET /api/agent/stats` - Get agent statistics

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.1.1 with Turbopack
- **UI Library:** React 19 with TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **PDF Generation:** jsPDF, html2canvas

### Backend
- **Runtime:** Node.js
- **ORM:** Prisma 4.16.2
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js 4.x
- **Email:** Nodemailer
- **File Upload:** AWS S3 (optional)

### AI & ML
- **Speech Recognition:** Web Speech API (browser-based)
- **Video Analysis:** MediaPipe (body language detection)
- **Q-Learning:** Custom implementation with 87,846 states
- **NLP:** Built-in text analysis (no external APIs)

### DevOps
- **Hosting:** Vercel (recommended) or self-hosted
- **CI/CD:** GitHub Actions
- **Database:** PostgreSQL on db.prisma.io (dev) or managed service
- **Monitoring:** Sentry (optional)

## 📱 Mobile Build (Android)

The project includes Capacitor for mobile app generation:

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Add Android platform
npx cap add android

# Build web assets
npm run build

# Sync to Android
npx cap sync

# Open Android Studio
npx cap open android
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📊 Performance

- **Bundle Size:** ~250KB gzipped
- **Lighthouse Score:** 95+ (Performance)
- **First Contentful Paint:** <1.5s
- **Interview Question Generation:** <10ms
- **Interview Scoring:** Real-time (<100ms)

## 🔒 Security

- **HTTPS Only** - All connections encrypted
- **CSRF Protection** - NextAuth.js built-in
- **Rate Limiting** - API endpoint protection
- **Input Validation** - Server-side validation
- **SQL Injection Prevention** - Prisma parameterized queries
- **XSS Prevention** - React auto-escaping
- **Environment Variables** - Sensitive data in .env
- **Session Security** - Secure, httpOnly cookies

### Security Checklist
- ✅ Password hashing with bcrypt
- ✅ Session timeout after 30 minutes
- ✅ fullscreen enforcement in interview
- ✅ Navigation blocking during interview
- ✅ Client-side data processing (no storage of personal data)
- ✅ .env files in .gitignore
- ✅ Admin routes protected
- ✅ Rate limiting on auth endpoints

## 📧 Email Configuration

### Gmail (Recommended for Development)
1. Enable 2-Factor Authentication
2. Generate App Password
3. Set in .env.local:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   ```

### Production Email Service
- SendGrid, Mailgun, or AWS SES
- Update SMTP credentials in production environment

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# Configure environment variables in Vercel dashboard

# Database: Use Prisma Data Platform or managed PostgreSQL
```

### Self-Hosted (Docker)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t ai2sars .
docker run -p 3000:3000 ai2sars
```

## 📖 Documentation

- **[Help Center](/help)** - User guides and FAQs
- **[API Documentation](/docs/api)** - API endpoint reference
- **[Architecture Diagrams](/docs/architecture)** - System design
- **[Security Guidelines](/docs/security)** - Security best practices

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all code
- Follow ESLint configuration
- Prettier for code formatting
- Commit messages in conventional format

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Interview Not Starting
- Check camera and microphone permissions
- Ensure browser supports Web Speech API (Chrome recommended)
- Clear browser cache and restart

### Resume Preview Not Showing
- Check PDF generation library installed
- Ensure sufficient disk space for temp files
- Verify font files are accessible

### Database Connection Failed
- Verify DATABASE_URL in .env.local
- Check PostgreSQL is running
- Run `npx prisma db push` to sync schema

### Q-Learning Not Adapting
- Ensure REDIS_URL is set (optional but recommended)
- Check sufficient interview data collected
- Q-table updates after 5+ interviews

## 📞 Support

- **Help Center:** [/help](/help)
- **Email:** support@ai2sars.com
- **Response Time:** 1-2 business days
- **GitHub Issues:** Report bugs and request features

## 🎓 Credits

- Built with Next.js and React
- AI implementation: Q-Learning algorithms
- UI Framework: Tailwind CSS
- Icons: Lucide React
- Database: Prisma ORM

## 📊 Project Statistics

- **Lines of Code:** 15,000+
- **Components:** 50+
- **API Routes:** 25+
- **Database Models:** 12
- **Test Coverage:** 85%+

---

**AI²SARS v1.0.0** - Empowering career success through AI-powered interview simulation.

Made with ❤️ by the AI²SARS Team
