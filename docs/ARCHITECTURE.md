# ARQIVA - Architecture & System Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      End User / Browser                       │
└────────────────────────┬──────────────────────────────────────┘
                         │
                    HTTP/HTTPS
                         │
┌────────────────────────▼──────────────────────────────────────┐
│            Frontend (React + TypeScript + Vite)               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Public Pages:                                        │    │
│  │ - Home (Hero, Projects, Services, etc.)             │    │
│  │ - Projects (Grid, Search, Filters)                  │    │
│  │ - Project Details (Full info, Gallery, Comments)    │    │
│  │ - Services (Description, Benefits, Examples)        │    │
│  │ - About (Story, Skills, Experience)                 │    │
│  │ - Contact (Form, Map, Social Links)                 │    │
│  │                                                      │    │
│  │ Admin Pages:                                         │    │
│  │ - Dashboard (Stats, Analytics, Charts)              │    │
│  │ - Projects CMS (CRUD, Bulk Actions, Image Upload)   │    │
│  │ - Services CMS (CRUD, Link to Projects)             │    │
│  │ - Settings (All dynamic content configuration)       │    │
│  │ - Messages (Contact form submissions)                │    │
│  │ - Testimonials (CRUD, Featured)                      │    │
│  │ - Awards (Timeline, Featured)                        │    │
│  │ - Analytics (Views, Likes, Downloads, Trends)       │    │
│  └──────────────────────────────────────────────────────┘    │
└────────────────────────┬──────────────────────────────────────┘
                         │
                    REST API Calls
                    (TanStack Query)
                         │
┌────────────────────────▼──────────────────────────────────────┐
│          Backend API (Node.js + Express + TypeScript)          │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Authentication Routes:                               │    │
│  │ - /api/auth/login (JWT)                             │    │
│  │ - /api/auth/refresh (Refresh Token)                 │    │
│  │ - /api/auth/logout                                  │    │
│  │                                                      │    │
│  │ Public API:                                         │    │
│  │ - /api/projects (GET, Paginated)                    │    │
│  │ - /api/services (GET)                               │    │
│  │ - /api/testimonials (GET)                           │    │
│  │ - /api/awards (GET)                                 │    │
│  │ - /api/settings (GET)                               │    │
│  │ - /api/messages (POST - Contact Form)               │    │
│  │                                                      │    │
│  │ Admin API (Protected):                              │    │
│  │ - /api/projects (POST, PUT, DELETE)                │    │
│  │ - /api/services (POST, PUT, DELETE)                │    │
│  │ - /api/testimonials (POST, PUT, DELETE)            │    │
│  │ - /api/awards (POST, PUT, DELETE)                  │    │
│  │ - /api/settings (PUT)                               │    │
│  │ - /api/messages (GET, DELETE, PATCH)               │    │
│  │ - /api/admin/stats (Analytics & Dashboard)          │    │
│  │ - /api/admin/analytics (Detailed Analytics)         │    │
│  │ - /api/admin/activity (Activity Logs)               │    │
│  │                                                      │    │
│  │ Middleware:                                         │    │
│  │ - JWT Authentication                                │    │
│  │ - Role-Based Access Control                         │    │
│  │ - Input Validation (Zod)                            │    │
│  │ - Rate Limiting                                     │    │
│  │ - CORS                                              │    │
│  │ - Error Handling                                    │    │
│  │ - Activity Logging                                  │    │
│  │ - Analytics Tracking                                │    │
│  └──────────────────────────────────────────────────────┘    │
└────────────────────────┬──────────────────────────────────────┘
                         │
                    SQL Queries
                    (Prisma ORM)
                         │
        ┌────────────────┼────────────────┬──────────────┐
        │                │                │              │
        ▼                ▼                ▼              ▼
   ┌─────────┐     ┌──────────┐     ┌─────────┐    ┌──────────┐
   │PostgreSQL   │ Cloudinary  │ Email Service   │ Analytics │
   │ (Neon)      │ (Images)    │ (Optional)      │ (Tracked) │
   │ Database    │ Storage     │ Notifications   │           │
   └─────────┘     └──────────┘     └─────────┘    └──────────┘
```

## Data Flow

### User Authentication Flow

```
User Login Form
    ↓
Frontend: POST /api/auth/login
    ↓
Backend: Validate credentials
    ↓
Backend: Generate JWT + Refresh Token
    ↓
Store Tokens (localStorage)
    ↓
Authenticated requests (Token in header)
    ↓
Token Refresh (When expired)
    ↓
Continue authenticated session
```

### Project Publishing Flow

```
Admin: Upload Project
    ↓
Admin Dashboard: Project Form (React Hook Form)
    ↓
Validation (Zod)
    ↓
POST /api/projects (with JWT)
    ↓
Backend: Authenticate & Authorize
    ↓
Backend: Validate input
    ↓
Backend: Save to Database (Prisma)
    ↓
Backend: Log activity
    ↓
Frontend: Update project list
    ↓
Public: Project appears on site (if published=true)
    ↓
Frontend: Track views & analytics
```

## Database Architecture

### Core Entities

```
User
├── Permissions
├── Roles
└── ActivityLogs

Settings
├── SocialLinks
└── SEO Pages

Projects
├── ProjectCategory
├── ProjectImages
├── ProjectVideos
├── ProjectFiles
├── ProjectTools
├── Testimonials
└── Comments

Services
├── ServiceExamples
└── (linked to Projects)

Awards
Testimonials
Messages
ContactRequests

Education
Experience
Certifications
Skills
ResumeFiles

Analytics
```

### Relationships

```
User (1) → (Many) ActivityLog
User (1) → (Many) ProjectComments

Project (Many) → (1) ProjectCategory
Project (1) → (Many) ProjectImage
Project (1) → (Many) ProjectVideo
Project (1) → (Many) ProjectFile
Project (1) → (Many) ProjectTool
Project (1) → (Many) Testimonial
Project (1) → (Many) Comment

Service (1) → (Many) ServiceExample
ServiceExample (Many) → (1) Project

Testimonial (Many) → (1) Project
```

## Security Layers

```
Layer 1: Transport
├── HTTPS/TLS
└── Secure Cookies

Layer 2: Authentication
├── JWT Tokens
├── Refresh Token Rotation
└── Secure Password Hashing

Layer 3: Authorization
├── Role-Based Access Control (RBAC)
├── Protected Routes
└── Admin-Only Endpoints

Layer 4: Input Validation
├── Frontend (Zod)
├── Backend (Zod)
└── Database (Prisma)

Layer 5: Security Headers
├── Helmet
├── CORS
├── CSRF Protection
└── Rate Limiting

Layer 6: Data Protection
├── Activity Logging
├── Audit Trails
└── Data Encryption (at rest)
```

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│        Free Tier Deployment Stack           │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend:        Replit or Vercel          │
│  Backend:         Replit                    │
│  Database:        Neon PostgreSQL           │
│  Storage:         Cloudinary                │
│  Monitoring:      Replit Built-in           │
│                                             │
├─────────────────────────────────────────────┤
│        All Free with Unlimited Bandwidth    │
└─────────────────────────────────────────────┘

Production Upgrade Path:

┌──────────────────────────────────────────────┐
│       Production Deployment Stack            │
├──────────────────────────────────────────────┤
│                                              │
│  Frontend:        Vercel or CloudFlare       │
│  Backend:         AWS, Railway, or Heroku   │
│  Database:        AWS RDS or Neon           │
│  Storage:         AWS S3 or Cloudinary      │
│  CDN:             CloudFlare                │
│  Monitoring:      Sentry, New Relic         │
│  Analytics:       Google Analytics          │
│  Email:           SendGrid or AWS SES       │
│                                              │
└──────────────────────────────────────────────┘
```

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────┐
│         FRONTEND STACK                          │
├─────────────────────────────────────────────────┤
│ React 18 - UI Library                           │
│ ├─ TypeScript - Type Safety                     │
│ ├─ Vite - Build Tool                            │
│ ├─ TailwindCSS - Styling                        │
│ ├─ Framer Motion - Animations                   │
│ ├─ React Router - Navigation                    │
│ ├─ TanStack Query - Data Fetching               │
│ ├─ React Hook Form - Form Management            │
│ ├─ Zod - Validation                             │
│ ├─ Zustand - State Management                   │
│ └─ Lucide React - Icons                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         BACKEND STACK                           │
├─────────────────────────────────────────────────┤
│ Node.js - Runtime                               │
│ ├─ Express - Web Framework                      │
│ ├─ TypeScript - Type Safety                     │
│ ├─ Prisma - ORM                                 │
│ ├─ PostgreSQL - Database                        │
│ ├─ JWT - Authentication                         │
│ ├─ bcrypt - Password Hashing                    │
│ ├─ Zod - Validation                             │
│ ├─ Helmet - Security Headers                    │
│ ├─ CORS - Cross-Origin                          │
│ ├─ Rate Limiting - Protection                   │
│ ├─ Cloudinary - File Storage                    │
│ └─ Nodemailer - Email                           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         DEPLOYMENT STACK                        │
├─────────────────────────────────────────────────┤
│ Neon - PostgreSQL Database (Free)               │
│ Replit - Hosting (Free)                         │
│ Vercel - Frontend Hosting (Free)                │
│ Cloudinary - Image Storage (Free)               │
│ GitHub - Version Control                        │
└─────────────────────────────────────────────────┘
```

## Performance Optimization

```
Frontend:
├── Code Splitting (Route-based)
├── Lazy Loading (Images & Components)
├── Image Optimization (Cloudinary)
├── CSS Minification (Tailwind)
├── Bundle Optimization (Vite)
├── Caching (Browser cache + CDN)
└── Target: Lighthouse 95+

Backend:
├── Database Indexing
├── Query Optimization
├── Response Caching
├── Compression (gzip)
├── Connection Pooling (Prisma)
├── Rate Limiting
└── Response Time: < 200ms
```

## Scalability Considerations

```
Current: Free Tier
├── Projects: Unlimited
├── Users: Unlimited
├── Storage: 10GB (Neon)
├── Bandwidth: Unlimited
└── Cost: $0

Scale: 10K+ Users
├── Upgrade Neon Plan
├── Add Redis for Caching
├── Setup Load Balancing
├── Implement CDN
└── Cost: $20-50/month

Scale: 100K+ Users
├── Managed Database (AWS RDS)
├── Dedicated Servers
├── Global CDN
├── Advanced Analytics
├── Dedicated Support
└── Cost: $500+/month
```

---

**Last Updated**: June 2026
**Version**: 1.0.0
