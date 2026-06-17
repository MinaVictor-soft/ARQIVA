# ARQIVA - Getting Started Checklist

Complete this checklist to get ARQIVA running locally or in production.

## 🎯 Phase 1: Local Development Setup (15 minutes)

### Backend Setup
- [ ] Navigate to backend directory: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] Copy environment template: `cp .env.example .env`
- [ ] Edit `.env` with your PostgreSQL credentials
  - [ ] Set `DATABASE_URL` to local PostgreSQL
  - [ ] Generate random JWT secrets (32+ chars)
  - [ ] Keep default admin credentials
- [ ] Install Prisma CLI globally (optional): `npm install -g prisma`

### Database Setup
- [ ] Create PostgreSQL database locally
- [ ] Or signup for Neon: https://neon.tech
- [ ] If Neon:
  - [ ] Create new project
  - [ ] Copy connection string to `DATABASE_URL`
- [ ] Run: `npx prisma migrate dev --name init`
- [ ] Verify database created: Check PostgreSQL or Neon console
- [ ] Seed data: `npm run db:seed`
- [ ] View data in Prisma Studio: `npx prisma studio`

### Start Backend
- [ ] Run: `npm run dev`
- [ ] Verify server running: Visit `http://localhost:5000/health`
- [ ] Should see: `{"status":"ok","timestamp":"..."}`
- [ ] Keep terminal open

### Frontend Setup
- [ ] Open new terminal
- [ ] Navigate to frontend: `cd ../frontend`
- [ ] Install dependencies: `npm install`
- [ ] Copy environment: `cp .env.example .env`
- [ ] Edit `.env`:
  - [ ] `VITE_API_URL=http://localhost:5000`
  - [ ] Add Cloudinary name if available (optional)

### Start Frontend
- [ ] Run: `npm run dev`
- [ ] Verify running: Visit `http://localhost:5173`
- [ ] Should see homepage loading
- [ ] Keep terminal open

## 🔐 Phase 2: Authentication & Admin Access (5 minutes)

### Test Admin Login
- [ ] Visit: `http://localhost:5173/admin/login`
- [ ] Enter credentials:
  - [ ] Email: `admin@arqivastudio.com`
  - [ ] Password: `Admin@123456`
- [ ] Click Login
- [ ] Should redirect to admin dashboard
- [ ] Verify seeing dashboard with stats

### Verify API Endpoints
- [ ] Test in browser or Postman:
  - [ ] `GET http://localhost:5000/api/projects` - Should return projects
  - [ ] `GET http://localhost:5000/api/services` - Should return services
  - [ ] `GET http://localhost:5000/api/settings` - Should return settings
  - [ ] `GET http://localhost:5000/api/awards` - Should return awards

## 🎨 Phase 3: Explore Features (10 minutes)

### Backend Features
- [ ] Check all projects: `/api/projects`
- [ ] Check testimonials: `/api/testimonials`
- [ ] Check awards: `/api/awards`
- [ ] Check settings: `/api/settings`
- [ ] Test Prisma Studio: `npx prisma studio`

### Frontend Features
- [ ] Homepage - View featured projects
- [ ] Projects page - View all projects with filters
- [ ] Services page - View all services
- [ ] About page - View profile info
- [ ] Contact page - View contact form

### Admin Features
- [ ] Dashboard - View statistics & analytics
- [ ] Projects - View, edit, create, delete
- [ ] Services - Manage services
- [ ] Settings - Update company information
- [ ] Messages - View contact submissions

## 📱 Phase 4: Customization (Optional)

### Update Company Information
- [ ] Go to Admin > Settings
- [ ] Update company name
- [ ] Add logo URL (or use placeholder)
- [ ] Update description, mission, vision
- [ ] Add contact information
- [ ] Add social media links
- [ ] Save changes

### Create New Project
- [ ] Go to Admin > Projects
- [ ] Click "New Project"
- [ ] Fill in project details:
  - [ ] Title & Slug
  - [ ] Description
  - [ ] Project story
  - [ ] Client information
  - [ ] Category
  - [ ] Location info
  - [ ] Budget & Duration
  - [ ] Year
  - [ ] Mark as featured (if homepage display)
  - [ ] Mark as published
- [ ] Save project
- [ ] Verify appearing on projects page

### Add Services
- [ ] Go to Admin > Services
- [ ] Create new service with:
  - [ ] Name & slug
  - [ ] Description
  - [ ] Benefits
  - [ ] Process steps
- [ ] Save and verify on services page

## 🚀 Phase 5: Deployment (30 minutes)

### Option A: Neon + Replit (Recommended)

#### Step 1: Create Neon Database
- [ ] Visit https://neon.tech
- [ ] Sign up with GitHub
- [ ] Create new project
- [ ] Get connection string
- [ ] Save connection string securely

#### Step 2: Create Replit Backend
- [ ] Visit https://replit.com
- [ ] Create new Node.js project
- [ ] Name it: `arqiva-backend`
- [ ] Upload backend folder contents
- [ ] Click "Secrets" (lock icon)
- [ ] Add environment variables:
  - [ ] `DATABASE_URL` (from Neon)
  - [ ] `JWT_SECRET` (strong random string)
  - [ ] `JWT_REFRESH_SECRET` (strong random string)
  - [ ] `ADMIN_EMAIL` and `ADMIN_PASSWORD`
  - [ ] `NODE_ENV=production`
  - [ ] Other config variables
- [ ] Click "Run"
- [ ] Wait for server to start
- [ ] Copy Replit URL (appears in webview)
- [ ] Test health check endpoint

#### Step 3: Database Migration
- [ ] In Replit console, run:
  ```bash
  npx prisma migrate deploy
  npm run db:seed
  ```
- [ ] Verify migrations completed
- [ ] Check data in Neon dashboard

#### Step 4: Create Replit Frontend
- [ ] Create new Vite + React project
- [ ] Or create Node.js project
- [ ] Upload frontend folder contents
- [ ] Add environment variables:
  - [ ] `VITE_API_URL` (your backend Replit URL)
  - [ ] `VITE_CLOUDINARY_CLOUD_NAME` (if using images)
- [ ] Click "Run"
- [ ] Verify frontend accessible

### Option B: Vercel + Railway

- [ ] See DEPLOYMENT.md for detailed steps
- [ ] Frontend: Deploy to Vercel
- [ ] Backend: Deploy to Railway or similar
- [ ] Database: Use Neon

## ✅ Phase 6: Verification Checklist

### Backend Verification
- [ ] `GET /health` returns OK
- [ ] `POST /auth/login` works
- [ ] `GET /projects` returns data
- [ ] `GET /services` returns data
- [ ] `GET /settings` returns company info
- [ ] Database contains seed data
- [ ] Admin can create new content
- [ ] Activity logs show actions

### Frontend Verification
- [ ] Homepage loads
- [ ] Projects page displays projects
- [ ] Project detail page works
- [ ] Services page displays services
- [ ] Contact form submits
- [ ] Admin login works
- [ ] Admin dashboard shows stats
- [ ] Admin can create/edit projects

### Database Verification
- [ ] Neon dashboard shows data
- [ ] Prisma Studio shows all tables
- [ ] Seed data present (50+ records)
- [ ] Relationships working correctly
- [ ] No connection errors

## 🔒 Phase 7: Security Checklist

- [ ] Change default admin password
- [ ] Generate strong JWT secrets (32+ characters)
- [ ] Enable HTTPS (automatic on Replit/Vercel)
- [ ] Set secure CORS origins
- [ ] Configure rate limiting
- [ ] Enable activity logging
- [ ] Setup error monitoring
- [ ] Backup database
- [ ] Test input validation
- [ ] Verify XSS protection

## 📊 Phase 8: Performance Optimization

- [ ] Test Lighthouse score (target: 95+)
- [ ] Optimize images (use Cloudinary)
- [ ] Enable caching headers
- [ ] Minify CSS/JS (automatic in production)
- [ ] Setup CDN if needed
- [ ] Monitor database queries
- [ ] Test with real data
- [ ] Verify load times

## 🐛 Phase 9: Testing

- [ ] Test all API endpoints
- [ ] Test admin functions
- [ ] Test authentication flow
- [ ] Test form submissions
- [ ] Test error handling
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Test with different data sets

## 📚 Documentation Review

- [ ] Read README.md
- [ ] Read QUICK_START.md
- [ ] Review ARCHITECTURE.md
- [ ] Check API.md for endpoints
- [ ] Review DEPLOYMENT.md
- [ ] Bookmark all docs

## 🎉 Success Criteria

You're ready when:

✅ Backend running locally on port 5000
✅ Frontend running locally on port 5173
✅ Admin login working with default credentials
✅ Seed data visible in database
✅ All API endpoints responding
✅ Projects page displaying projects
✅ Admin dashboard showing stats
✅ Contact form submitting
✅ No console errors
✅ Deployed to Replit/Neon successfully
✅ Production site accessible
✅ Admin accessible in production

## 🆘 Troubleshooting

### "Cannot connect to database"
- [ ] Check DATABASE_URL in .env
- [ ] Verify PostgreSQL running
- [ ] Try: `npx prisma db push`

### "Port already in use"
- [ ] Kill process: `lsof -ti :5000 | xargs kill -9`
- [ ] Or use different port: `PORT=5001 npm run dev`

### "Module not found"
- [ ] Run: `npm install`
- [ ] Check node_modules exists

### "Build errors"
- [ ] Run: `npm run type-check`
- [ ] Check TypeScript errors
- [ ] Clear cache: `rm -rf dist`

### "Admin login not working"
- [ ] Verify email and password
- [ ] Check backend running
- [ ] Check browser console for errors
- [ ] Verify JWT tokens being set

### "API returning 401"
- [ ] Check access token in localStorage
- [ ] Try login again
- [ ] Check token expiration
- [ ] Try refreshing token

## 📞 Getting Help

1. Check QUICK_START.md
2. Review relevant docs
3. Check error messages
4. Look at backend logs
5. Check browser console
6. Review database structure

## 🎯 Next Steps After Setup

1. **Customize Content**
   - Update company info
   - Add your projects
   - Create your services

2. **Enhance Features**
   - Add more pages
   - Create custom components
   - Add email notifications

3. **Optimize Performance**
   - Setup CDN
   - Optimize images
   - Enable caching

4. **Launch Marketing**
   - Setup analytics
   - Configure SEO
   - Share on social media

## 📝 Notes

- Save all important credentials securely
- Keep database backups
- Monitor server logs
- Track user analytics
- Gather feedback

---

**Estimated Time**: 1-2 hours for complete setup
**Difficulty**: Intermediate
**Support**: See docs or check logs

Good luck! You're building something amazing! 🎨✨
