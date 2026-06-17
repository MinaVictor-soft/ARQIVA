# ARQIVA Studio & Design - Architecture Portfolio Platform

Complete production-ready full-stack application for architecture studios, design agencies, and personal portfolios.

## 📋 Project Overview

This is a comprehensive enterprise-level architecture portfolio platform featuring:

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Storage**: Cloudinary integration for media
- **Admin Dashboard**: Complete CMS for managing content
- **Deployment**: Ready for Replit with free PostgreSQL (Neon)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon for free hosting)
- Cloudinary account (optional, for image uploads)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Configure .env with your database and other settings
```

**Environment Variables (Backend):**

```env
DATABASE_URL=postgresql://username:password@localhost:5432/arqiva_db
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
ADMIN_EMAIL=admin@arqivastudio.com
ADMIN_PASSWORD=Admin@123456
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Database Setup

```bash
# Create migrations and push schema
npx prisma migrate dev --name init

# Seed the database with sample data
npm run db:seed

# View database in Prisma Studio
npm run db:studio
```

### Start Backend

```bash
npm run dev
```

Server runs at `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Configure .env
```

**Environment Variables (Frontend):**

```env
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Start Frontend

```bash
npm run dev
```

App runs at `http://localhost:5173`

## 🗄️ Database Schema

### Core Tables

**Users**
- id, email, password, firstName, lastName, role, isActive, lastLogin, createdAt, updatedAt

**Projects**
- Full project management with related images, videos, files, tools
- Categories, testimonials, comments tracking
- Views and likes counters

**Services**
- Service definitions with descriptions, benefits, processes
- Service examples linked to projects

**Testimonials**
- Client testimonials with ratings
- Featured testimonials for homepage

**Awards**
- Awards and recognition timeline
- Featured awards display

**Settings**
- Completely dynamic company information
- All content managed from settings
- No hardcoded text

**Analytics**
- Track page views, project views, downloads, contact requests
- Dashboard charts and trends

**Other Tables**
- Education, Experience, Certifications, Skills
- Resume files, Contact requests, Activity logs
- SEO pages, Social links, Messages

## 🔐 Authentication

### Admin Access

Default admin credentials:
- **Email**: `admin@arqivastudio.com`
- **Password**: `Admin@123456`

Admin dashboard: `http://localhost:5173/admin`

### JWT Tokens

- **Access Token**: 7 days (configurable)
- **Refresh Token**: 30 days (configurable)
- **Secure Cookies**: HTTP-only, secure, SameSite strict

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/login              - User login
POST   /api/auth/register           - User registration (admin only)
POST   /api/auth/refresh            - Refresh access token
POST   /api/auth/logout             - Logout
GET    /api/auth/me                 - Get current user
```

### Projects

```
GET    /api/projects                - Get all projects (paginated)
GET    /api/projects/:slug          - Get project details
POST   /api/projects                - Create project (admin)
PUT    /api/projects/:id            - Update project (admin)
DELETE /api/projects/:id            - Delete project (admin)
POST   /api/projects/:projectId/images - Add project image (admin)
POST   /api/projects/:id/like       - Like a project
```

### Services

```
GET    /api/services                - Get all services
GET    /api/services/:slug          - Get service details
POST   /api/services                - Create service (admin)
PUT    /api/services/:id            - Update service (admin)
DELETE /api/services/:id            - Delete service (admin)
```

### Testimonials

```
GET    /api/testimonials            - Get testimonials
POST   /api/testimonials            - Create testimonial (admin)
PUT    /api/testimonials/:id        - Update testimonial (admin)
DELETE /api/testimonials/:id        - Delete testimonial (admin)
```

### Awards

```
GET    /api/awards                  - Get awards
POST   /api/awards                  - Create award (admin)
PUT    /api/awards/:id              - Update award (admin)
DELETE /api/awards/:id              - Delete award (admin)
```

### Messages

```
POST   /api/messages                - Submit contact form
GET    /api/messages                - Get messages (admin)
GET    /api/messages/:id            - Get message (admin)
DELETE /api/messages/:id            - Delete message (admin)
PATCH  /api/messages/:id/replied    - Mark as replied (admin)
```

### Settings

```
GET    /api/settings                - Get settings (public)
PUT    /api/settings                - Update settings (admin)
```

### Admin Dashboard

```
GET    /api/admin/stats             - Dashboard statistics
GET    /api/admin/analytics         - Analytics data
GET    /api/admin/activity          - Activity logs
```

## 🎨 Design Tokens

### Colors

- **Primary Black**: #0A0908
- **Luxury Burgundy**: #49111C
- **Warm White**: #F2F4F3
- **Architectural Beige**: #A9927D
- **Stone Brown**: #5E503F

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Font Sizes

```
Display: 4rem (700)
H1: 3rem (700)
H2: 2.25rem (700)
H3: 1.875rem (600)
H4: 1.5rem (600)
H5: 1.25rem (600)
Body Large: 1.125rem
Body: 1rem
Small: 0.875rem
Caption: 0.75rem
```

## 📦 Features

### Frontend

- ✅ Responsive design (mobile-first)
- ✅ SEO optimized (meta tags, Open Graph, schema markup)
- ✅ Dynamic content from API
- ✅ Smooth animations (Framer Motion)
- ✅ Form validation (React Hook Form + Zod)
- ✅ State management (Zustand)
- ✅ Data fetching (TanStack Query)
- ✅ Image optimization
- ✅ Lazy loading
- ✅ Dark/Light theme support

### Backend

- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Input validation (Zod)
- ✅ Error handling
- ✅ Rate limiting
- ✅ CORS enabled
- ✅ Security headers (Helmet)
- ✅ Activity logging
- ✅ Analytics tracking
- ✅ Database migrations

### Admin Dashboard

- ✅ Projects management (CRUD)
- ✅ Services management
- ✅ Testimonials management
- ✅ Awards management
- ✅ Messages management
- ✅ Settings management
- ✅ Analytics dashboard
- ✅ Activity logs
- ✅ Image uploads
- ✅ Bulk actions

## 🚢 Deployment

### Replit Deployment

1. **Create Neon PostgreSQL Database** (Free):
   - Go to https://neon.tech
   - Create account and database
   - Copy connection string

2. **Create Replit Project**:
   - Go to https://replit.com
   - Create new project
   - Connect GitHub repo or upload code

3. **Environment Variables**:
   ```
   DATABASE_URL=neon_connection_string
   JWT_SECRET=generate_strong_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NODE_ENV=production
   ```

4. **Build & Deploy**:
   ```bash
   npm install
   npm run build
   npm start
   ```

### Production Checklist

- [ ] Update JWT secrets
- [ ] Configure email service
- [ ] Set up Cloudinary
- [ ] Configure domain/DNS
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all features
- [ ] Performance optimization
- [ ] Security audit

## 📊 Seed Data

Database includes:

- **10 Architecture Projects** with various categories
- **10 Testimonials** from satisfied clients
- **10 Awards** from prestigious organizations
- **5 Services** with detailed descriptions
- **Skills**: Software and soft skills
- **Education**: Academic background
- **Experience**: Professional history
- **Certifications**: Professional credentials
- **Company Settings**: All business information

## 🔒 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ CSRF protection
- ✅ XSS protection
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Rate limiting
- ✅ CORS configured
- ✅ Helmet for security headers
- ✅ Secure cookies
- ✅ Input validation

## ⚡ Performance

Target: **Lighthouse Score 95+**

Optimizations:
- Code splitting
- Lazy loading
- Image optimization (WebP)
- Caching strategies
- Compression
- Prefetching
- No layout shifts
- Fast initial paint

## 📱 Responsive Design

- Mobile First approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly interfaces
- Accessibility AA compliant
- Keyboard navigation support
- Screen reader support

## 🛠️ Development

### Scripts

**Backend**:
```bash
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Run production build
npm run db:push        # Push schema to database
npm run db:migrate     # Run migrations
npm run db:seed        # Seed database
npm run db:studio      # Open Prisma Studio
npm run lint           # Run ESLint
```

**Frontend**:
```bash
npm run dev            # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run type-check   # Check TypeScript types
```

## 📝 Documentation

### API Documentation

Full OpenAPI/Swagger documentation available at `/api/docs` (implement in production)

### Database

View schema in Prisma Studio:
```bash
npx prisma studio
```

## 🤝 Support

For issues and questions:
1. Check the documentation
2. Review seed data for examples
3. Check activity logs for errors
4. Review database schema

## 📄 License

Proprietary - All rights reserved

## 👥 Team

Built with ❤️ by the ARQIVA team

---

**Last Updated**: June 2026
**Version**: 1.0.0
