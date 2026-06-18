#!/bin/bash
# start.sh — runtime startup: ensure deps, seed DB if empty, serve

set -e

WORKSPACE="/home/runner/workspace"
BACKEND_TMP="/tmp/arqiva-backend"

echo "-> Checking runtime dependencies..."

# Check deps wherever they live (direct install from build OR /tmp symlink from dev)
if [ ! -f "$WORKSPACE/backend/node_modules/express/package.json" ]; then
  echo "-> Dependencies missing — installing to /tmp..."
  mkdir -p "$BACKEND_TMP"
  cp "$WORKSPACE/backend/package.json" "$BACKEND_TMP/package.json"

  cd "$BACKEND_TMP"
  NODE_ENV=development npm install --no-audit --no-fund --ignore-scripts 2>&1 \
    | grep -v "^npm warn" | tail -3
  cd "$WORKSPACE"

  rm -rf "$WORKSPACE/backend/node_modules"
  ln -sfn "$BACKEND_TMP/node_modules" "$WORKSPACE/backend/node_modules"

  echo "-> Re-generating Prisma client..."
  "$WORKSPACE/backend/node_modules/.bin/prisma" generate 2>&1 | tail -3
else
  echo "-> Dependencies OK"
fi

echo "-> Checking database seed..."
USER_COUNT=$(node -e "
const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const db = new PrismaClient({ log: [] });
db.user.count().then(n => { console.log(n); db.\$disconnect(); }).catch(() => { console.log(0); });
" 2>/dev/null) || USER_COUNT=0

if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
  echo "-> Database empty — running seed..."
  node backend/dist/db/seed.js 2>&1 | grep -E "✓|✗|Creating|Clearing" || true
  echo "-> Adding project images and gallery..."
  node -e "
const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const db = new PrismaClient({ log: [] });
const covers = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80&auto=format',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&auto=format',
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80&auto=format',
];
const gallery = {
  'modern-luxury-apartment': [
    { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format', caption: 'Living Room', galleryName: 'Interior' },
    { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80&auto=format', caption: 'Master Bedroom', galleryName: 'Interior' },
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format', caption: 'Kitchen', galleryName: 'Interior' },
    { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80&auto=format', caption: 'Bathroom', galleryName: 'Interior' },
    { url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200&q=80&auto=format', caption: 'Terrace View', galleryName: 'Exterior' },
  ],
  'corporate-office-design': [
    { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format', caption: 'Main Office Floor', galleryName: 'Workspace' },
    { url: 'https://images.unsplash.com/photo-1497366754035-f200581ef5fa?w=1200&q=80&auto=format', caption: 'Conference Room', galleryName: 'Workspace' },
    { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80&auto=format', caption: 'Lounge Area', galleryName: 'Common Areas' },
    { url: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&q=80&auto=format', caption: 'Reception', galleryName: 'Common Areas' },
  ],
  'boutique-hotel-design': [
    { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80&auto=format', caption: 'Hotel Exterior', galleryName: 'Exterior' },
    { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80&auto=format', caption: 'Deluxe Suite', galleryName: 'Rooms' },
    { url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80&auto=format', caption: 'Lobby', galleryName: 'Common Areas' },
    { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format', caption: 'Pool Area', galleryName: 'Amenities' },
    { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format', caption: 'Restaurant', galleryName: 'Dining' },
  ],
  'residential-complex': [
    { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80&auto=format', caption: 'Complex Overview', galleryName: 'Exterior' },
    { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80&auto=format', caption: 'Building Facade', galleryName: 'Exterior' },
    { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80&auto=format', caption: 'Living Space', galleryName: 'Interior' },
    { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80&auto=format', caption: 'Rooftop Garden', galleryName: 'Amenities' },
  ],
  'retail-store-design': [
    { url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80&auto=format', caption: 'Store Front', galleryName: 'Exterior' },
    { url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80&auto=format', caption: 'Display Area', galleryName: 'Interior' },
    { url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80&auto=format', caption: 'Fitting Rooms', galleryName: 'Interior' },
    { url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1200&q=80&auto=format', caption: 'Checkout Area', galleryName: 'Interior' },
  ],
};
db.project.findMany({ orderBy: { createdAt: 'asc' } }).then(async ps => {
  for (let i = 0; i < ps.length; i++) {
    await db.project.update({ where: { id: ps[i].id }, data: { coverImage: covers[i % covers.length] } });
    const imgs = gallery[ps[i].slug] || [];
    if (imgs.length) {
      await db.projectImage.deleteMany({ where: { projectId: ps[i].id } });
      for (let j = 0; j < imgs.length; j++)
        await db.projectImage.create({ data: { projectId: ps[i].id, imageUrl: imgs[j].url, caption: imgs[j].caption, galleryName: imgs[j].galleryName, order: j } });
    }
  }
  await db.\$disconnect();
  console.log('Images and gallery set for', ps.length, 'projects');
}).catch(e => { console.error(e); db.\$disconnect(); });
" 2>/dev/null || true
else
  echo "-> Database has data (users: $USER_COUNT) — skipping seed"
fi

echo "-> Checking packages..."
node -e "
const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const db = new PrismaClient({ log: [] });
db.package.count().then(async n => {
  if (n === 0) {
    await db.package.createMany({ data: [
      { title: 'Consultation', titleAr: 'استشارة', description: 'A focused 90-minute design consultation with our lead architect. Ideal for clients in early stages of planning.', price: 2500, currency: 'AED', duration: '90 minutes', features: ['Initial design assessment','Site review & feasibility','Recommendations report','Priority booking for follow-up'], includedServices: [], featured: true, published: true, order: 1 },
      { title: 'Concept Design', titleAr: 'تصميم مفهومي', description: 'Full concept design package including site analysis, design brief, mood boards, concept sketches, and 3D massing model.', price: 45000, currency: 'AED', duration: '4-6 weeks', features: ['Site analysis & design brief','Mood boards & material palette','Concept sketches & floor plans','3D massing model','2 revision rounds'], includedServices: [], featured: true, published: true, order: 2 },
      { title: 'Full Architectural Service', titleAr: 'خدمة معمارية كاملة', description: 'End-to-end architectural service from concept through construction supervision. Includes all design stages, documentation, and on-site management.', price: null, currency: 'AED', duration: 'Project-dependent', features: ['Full concept through construction documents','BIM documentation','3D renders & walkthrough animation','Site supervision','Contractor coordination','Unlimited revisions','Dedicated project manager'], includedServices: [], featured: true, published: true, order: 3 },
      { title: 'Interior Design', titleAr: 'تصميم داخلي', description: 'Comprehensive interior design service including space planning, material selection, custom furniture, lighting design, and procurement.', price: 120, currency: 'AED/m2', duration: '6-10 weeks', features: ['Space planning & layout','Material & finish selection','Custom furniture & millwork','Lighting design','3D renders','Procurement management','2 revision rounds'], includedServices: [], featured: true, published: true, order: 4 },
    ]});
    console.log('-> Packages seeded (4 packages added)');
  } else {
    console.log('-> Packages OK (' + n + ' found)');
  }
  db.\$disconnect();
}).catch(e => { console.log('-> Packages skip:', e.message); db.\$disconnect(); });
" 2>/dev/null || true

echo "-> Building frontend..."
FRONTEND_TMP="/tmp/arqiva-frontend"
if [ "$NODE_ENV" = "production" ]; then
  echo "-> Production: frontend already built by build phase — skipping"
else
  if [ ! -f "$WORKSPACE/frontend/node_modules/vite/package.json" ]; then
    echo "-> Frontend node_modules missing — installing to /tmp..."
    mkdir -p "$FRONTEND_TMP"
    cp "$WORKSPACE/frontend/package.json" "$FRONTEND_TMP/package.json"
    cd "$FRONTEND_TMP"
    NODE_ENV=development npm install --no-audit --no-fund --ignore-scripts 2>&1 \
      | grep -v "^npm warn" | tail -3
    cd "$WORKSPACE"
    rm -rf "$WORKSPACE/frontend/node_modules"
    ln -sfn "$FRONTEND_TMP/node_modules" "$WORKSPACE/frontend/node_modules"
  fi
  cd "$WORKSPACE/frontend" && node_modules/.bin/vite build 2>&1 | tail -3 && cd "$WORKSPACE"
fi

echo "-> Starting server..."
node backend/dist/index.js
