# ARQIVA - Neon PostgreSQL & Replit Deployment Guide

Complete guide to deploy ARQIVA using free Neon PostgreSQL and Replit.

## Prerequisites

- GitHub account (for code hosting)
- Neon account (free PostgreSQL)
- Replit account (free Node.js hosting)
- Cloudinary account (free tier for images)

## Part 1: Neon PostgreSQL Setup

### Step 1: Create Neon Account

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create a new project
4. Choose PostgreSQL version (default recommended)
5. Set project name: `arqiva-db`

### Step 2: Create Database

1. In Neon console, click "Databases"
2. Create new database or use default
3. Get connection string:
   - Click "Connection string"
   - Copy the full string starting with `postgresql://`
   - Keep this safe, you'll need it for environment variables

Format: `postgresql://[user]:[password]@[host]/[database]`

## Part 2: Prepare Code for Deployment

### Backend Configuration

1. **Update backend/.env**:

```env
# Database
DATABASE_URL=postgresql://[your-neon-connection-string]

# JWT
JWT_SECRET=generate-a-strong-random-string-here
JWT_REFRESH_SECRET=generate-another-strong-random-string-here
JWT_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=30d

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-replit-domain.repl.co

# Admin
ADMIN_EMAIL=admin@arqivastudio.com
ADMIN_PASSWORD=Admin@123456
```

### Frontend Configuration

1. **Update frontend/.env.production**:

```env
VITE_API_URL=https://your-backend-replit.repl.co
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## Part 3: Replit Deployment

### Backend Deployment

1. **Create Replit Project**:
   - Go to https://replit.com
   - Click "Create Replit"
   - Select "Node.js"
   - Name: `arqiva-backend`

2. **Upload Code**:
   - Option A: Connect GitHub repo
   - Option B: Upload files directly
   - Make sure backend directory is root

3. **Setup .replit File**:

```
run = "npm install && npm run build && npm start"
entrypoint = "dist/index.js"
```

4. **Configure Environment Variables**:
   - Click "Secrets" (lock icon)
   - Add all variables from backend/.env

5. **Database Migration**:
   - In Replit console:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

6. **Deploy**:
   - Click "Run" button
   - Get your Replit URL (shown in webview URL)
   - Copy the base URL (e.g., `https://arqiva-backend.replit.dev`)

### Frontend Deployment

**Option A: Replit (Recommended)**

1. **Create Frontend Replit**:
   - Click "Create Replit"
   - Select "Vite + React + TypeScript"
   - Name: `arqiva-frontend`

2. **Upload Code**:
   - Upload frontend folder contents

3. **Setup .replit File**:

```
run = "npm install && npm run build && npm run preview"
entrypoint = "dist/index.html"
```

4. **Configure Environment Variables**:
   - Add `VITE_API_URL` pointing to your backend Replit URL
   - Add `VITE_CLOUDINARY_CLOUD_NAME`

5. **Deploy**:
   - Click "Run"
   - Frontend is live!

**Option B: Vercel (Better for Frontend)**

1. Go to https://vercel.com
2. Import project from GitHub
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables
5. Deploy

## Part 4: Cloudinary Setup (Optional)

For image uploads in admin panel:

1. Go to https://cloudinary.com
2. Sign up for free
3. In dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

4. Update environment variables in Replit with these values

## Part 5: Verification

### Backend Verification

1. Visit: `https://your-backend-replit.repl.co/health`
2. Should return: `{"status":"ok","timestamp":"..."}`

3. Test endpoints:
   - Login: `POST /api/auth/login`
   - Get projects: `GET /api/projects`
   - Get settings: `GET /api/settings`

### Frontend Verification

1. Visit: `https://your-frontend-replit.repl.co`
2. Should see homepage
3. Test admin login at `/admin/login`

## Database Management

### Prisma Studio (Cloud-Based)

```bash
npx prisma studio
```

Or use Neon dashboard directly.

### Backup & Restore

1. **Backup**:
   - Use Neon dashboard
   - Click "Backups"
   - Create snapshot

2. **Restore**:
   - Select snapshot
   - Confirm restore

## Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

Solution:
- Verify DATABASE_URL in Replit secrets
- Check Neon connection string format
- Ensure network access allowed

### Migration Errors

**Error**: `Migration failed`

Solution:
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or rollback specific migration
npx prisma migrate resolve --rolled-back <migration-name>
```

### Seed Data Issues

**Error**: `Seed failed`

Solution:
```bash
# Clear and reseed
npm run db:seed
```

### Frontend API Errors

**Error**: `CORS error`, `API not found`

Solution:
- Verify `VITE_API_URL` in frontend .env
- Check backend is running
- Verify CORS headers on backend

## Performance Tips

1. **Database**: Neon free tier allows 10GB storage
2. **Frontend**: Use Vercel for better performance
3. **Caching**: Configure browser cache headers
4. **Images**: Optimize with Cloudinary
5. **Monitoring**: Use Replit metrics

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS (automatic on Replit/Vercel)
- [ ] Configure CORS properly
- [ ] Set secure cookies
- [ ] Validate all inputs
- [ ] Monitor activity logs
- [ ] Regular backups

## Production Deployment

For production use:

1. Use separate domain name
2. Set `NODE_ENV=production`
3. Disable Prisma logging
4. Enable rate limiting
5. Setup error logging
6. Configure email notifications
7. Setup monitoring
8. Enable database backups

## Scaling Beyond Free Tier

When you need to scale:

### Database
- Upgrade Neon plan
- Or use AWS RDS
- Or use Railway

### Hosting
- Upgrade Replit to Boost
- Or use Railway, Heroku, or AWS
- Or use self-hosted VPS

### Monitoring
- Setup Sentry for errors
- Use New Relic for monitoring
- Configure uptime monitoring

## Getting Help

- Check Neon docs: https://neon.tech/docs
- Check Replit docs: https://docs.replit.com
- Check Prisma docs: https://www.prisma.io/docs
- Review logs in Replit console

---

**Last Updated**: June 2026
**Version**: 1.0.0
