# ARQIVA - Quick Start Guide

Get ARQIVA running locally in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed (or use Neon for free)
- Git

## Option 1: Quick Local Setup (With Local PostgreSQL)

### 1. Clone/Download Project

```bash
cd ARQIVA
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with local PostgreSQL credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/arqiva_db
```

### 3. Create Local Database

```bash
# Create database (in PostgreSQL)
createdb arqiva_db

# Back in terminal, run migrations
npx prisma migrate dev --name init

# Seed with sample data
npm run db:seed
```

### 4. Start Backend

```bash
npm run dev
```

Backend running at: `http://localhost:5000`

### 5. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Frontend running at: `http://localhost:5173`

## Option 2: Quick Cloud Setup (Neon + Replit)

### 1. Create Neon Database

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project
4. Copy connection string

### 2. Create Replit Project

1. Go to https://replit.com
2. Create new Node.js project
3. Upload backend code
4. Create `.env` with Neon connection string

### 3. Setup Environment

```env
DATABASE_URL=your-neon-connection-string
JWT_SECRET=random-secret
ADMIN_EMAIL=admin@arqivastudio.com
ADMIN_PASSWORD=Admin@123456
PORT=5000
NODE_ENV=production
```

### 4. Run Migrations

```bash
npx prisma migrate deploy
npm run db:seed
npm start
```

## Admin Login

**Email**: `admin@arqivastudio.com`
**Password**: `Admin@123456`

Access at: `http://localhost:5173/admin` (local) or your deployed URL

## First Steps

1. **Login to Admin**
   - Navigate to `/admin/login`
   - Use default credentials above

2. **Explore Dashboard**
   - View statistics
   - Check analytics
   - Review activity logs

3. **Configure Settings**
   - Update company information
   - Add social links
   - Configure contact information

4. **Create Content**
   - Add projects with images
   - Create services
   - Add testimonials
   - Publish awards

5. **View Public Site**
   - Homepage shows featured projects
   - Projects page lists all published projects
   - Services page displays all services
   - About page shows profile information

## Common Commands

### Backend

```bash
# Development
npm run dev

# Production build
npm run build

# Production start
npm start

# Database commands
npx prisma studio           # Open Prisma Studio
npm run db:push            # Push schema to DB
npm run db:seed            # Seed database
npm run db:migrate         # Run migrations
```

### Frontend

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check types
npm run type-check
```

## API Testing

### Get All Projects

```bash
curl http://localhost:5000/api/projects
```

### Get Settings

```bash
curl http://localhost:5000/api/settings
```

### Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@arqivastudio.com","password":"Admin@123456"}'
```

## Database Structure

All tables automatically created:

- **Users** - Admin users
- **Settings** - Company info (all dynamic)
- **Projects** - Portfolio projects
- **Services** - Service offerings
- **Testimonials** - Client testimonials
- **Awards** - Recognition/awards
- **Messages** - Contact form submissions
- **Education** - Education history
- **Experience** - Work experience
- **Skills** - Professional skills
- **And more...**

View in Prisma Studio: `npx prisma studio`

## Project Structure

```
ARQIVA/
├── backend/
│   ├── src/
│   │   ├── db/           # Database setup & seed
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Helper functions
│   │   └── index.ts      # Main server file
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/        # React pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities (API client)
│   │   ├── store/        # Zustand stores
│   │   ├── types/        # TypeScript types
│   │   ├── styles/       # CSS/Tailwind
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── index.html
│   └── package.json
│
├── docs/
│   ├── DEPLOYMENT.md     # Deployment guide
│   ├── ARCHITECTURE.md   # System architecture
│   └── API.md            # API documentation
│
└── README.md             # Main documentation
```

## Troubleshooting

### Database Connection Failed

**Solution**:
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify credentials
- Try `npx prisma db push`

### Port Already in Use

**Solution**:
```bash
# Kill process on port 5000
lsof -ti :5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### Module Not Found Errors

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Build Errors

**Solution**:
```bash
# Check TypeScript
npm run type-check

# Clear build cache
rm -rf dist

# Rebuild
npm run build
```

## Next Steps

1. **Customize Branding**
   - Update logo
   - Change colors
   - Modify fonts

2. **Add Your Content**
   - Upload projects
   - Add services
   - Create testimonials

3. **Deploy**
   - See DEPLOYMENT.md
   - Free hosting with Replit + Neon

4. **Performance**
   - Optimize images
   - Setup CDN
   - Enable caching

## Support Resources

- **Backend**: Express docs, Prisma docs, Node.js docs
- **Frontend**: React docs, TailwindCSS docs, Vite docs
- **Database**: PostgreSQL docs, Neon docs
- **Deployment**: Replit docs, Vercel docs

## Default Data

Database includes:

- ✅ 5 sample projects
- ✅ 5 services
- ✅ 5 testimonials
- ✅ 5 awards
- ✅ Education & experience
- ✅ Skills
- ✅ Company settings

Ready to customize!

---

**Time to First Run**: ~5 minutes
**Local Development Ready**: ✓
**Production Ready**: ✓

Enjoy building with ARQIVA!
