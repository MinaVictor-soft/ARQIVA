const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if already seeded
  const existingUser = await db.user.findFirst({ where: { email: 'admin@arqivastudio.com' } });
  if (existingUser) {
    console.log('✓ Database already seeded. Skipping.');
    return;
  }

  // Admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 10);
  await db.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@arqivastudio.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    },
  });
  console.log('✓ Admin user created');

  // Settings
  await db.settings.create({
    data: {
      companyName: 'ARQIVA Studio & Design',
      description: 'A luxury architecture and interior design studio dedicated to creating spaces that inspire, endure, and elevate the human experience.',
      mission: 'To craft architectural experiences that transcend the ordinary — designing spaces that are both functionally superior and aesthetically timeless.',
      vision: 'To be recognized globally as the definitive studio for bespoke, luxury architectural and interior design solutions.',
      values: 'Excellence in every detail. Integrity in every relationship. Innovation in every design. Sustainability in every choice.',
      designPhilosophy: 'Architecture is frozen music — every space we create tells a story through the harmony of form, light, material, and purpose.',
      phone: '+1 (555) 123-4567',
      whatsapp: '+1 (555) 123-4567',
      email: 'info@arqivastudio.com',
      address: '123 Design District, New York, NY 10001',
      location: 'New York, USA',
      linkedIn: 'https://linkedin.com/company/arqiva',
      instagram: 'https://instagram.com/arqivastudio',
      behance: 'https://behance.net/arqiva',
      seoTitle: 'ARQIVA Studio & Design — Luxury Architecture & Interior Design',
      seoDescription: 'Award-winning architecture and interior design studio creating extraordinary spaces for discerning clients worldwide.',
      seoKeywords: 'architecture, interior design, luxury, studio, design',
      footerText: 'Creating extraordinary spaces since 2010',
      copyrightText: '© 2026 ARQIVA Studio & Design. All rights reserved.',
    },
  });
  console.log('✓ Settings created');

  // Project Categories
  const categories = await Promise.all([
    db.projectCategory.create({ data: { name: 'Residential', slug: 'residential', description: 'Private homes and luxury residences', icon: '🏠', order: 1 } }),
    db.projectCategory.create({ data: { name: 'Commercial', slug: 'commercial', description: 'Office and business spaces', icon: '🏢', order: 2 } }),
    db.projectCategory.create({ data: { name: 'Hospitality', slug: 'hospitality', description: 'Hotels, restaurants, and leisure', icon: '🏨', order: 3 } }),
    db.projectCategory.create({ data: { name: 'Mixed-Use', slug: 'mixed-use', description: 'Combined residential and commercial', icon: '🏙️', order: 4 } }),
    db.projectCategory.create({ data: { name: 'Retail', slug: 'retail', description: 'Shops and retail environments', icon: '🛍️', order: 5 } }),
  ]);
  console.log('✓ Categories created');

  // Projects
  const projects = [
    { title: 'The Meridian Penthouse', slug: 'meridian-penthouse', description: 'A 4,200 sq ft sky-level penthouse blending Scandinavian minimalism with Arabian luxury. Every surface considered, every material chosen for its tactile and visual quality.', projectStory: 'When our clients approached us with a blank canvas atop one of Manhattan\'s most prestigious addresses, we saw an opportunity to create something truly singular.', designConcept: 'The design draws inspiration from the Nordic tradition of hygge — creating warmth and intimacy within vast open spaces.', challenges: 'The primary challenge was creating distinct zones within an open-plan layout while maintaining visual continuity.', solutions: 'We introduced a series of custom millwork elements that serve as spatial dividers without walls.', clientName: 'Private Client', clientCompany: 'N/A', categoryId: categories[0].id, country: 'USA', city: 'New York', location: 'Manhattan, New York', projectArea: '4,200 sq ft', status: 'completed', budget: '$3.2M', duration: '14 months', year: 2024, featured: true, published: true },
    { title: 'Obsidian Corporate HQ', slug: 'obsidian-corporate-hq', description: 'A 28-floor corporate headquarters designed around the concept of biophilic integration — bringing nature into the workspace to enhance wellbeing and productivity.', projectStory: 'Obsidian Technologies wanted their headquarters to reflect their commitment to innovation and employee wellbeing.', designConcept: 'The design centers on a living wall ecosystem that spans the full height of the building\'s atrium.', challenges: 'Integrating large-scale living installations with the building\'s HVAC and structural systems.', solutions: 'We developed a proprietary irrigation and climate control system specifically for this project.', clientName: 'Obsidian Technologies', clientCompany: 'Obsidian Technologies Inc.', categoryId: categories[1].id, country: 'UAE', city: 'Dubai', location: 'DIFC, Dubai', projectArea: '85,000 sq ft', status: 'completed', budget: '$28M', duration: '36 months', year: 2023, featured: true, published: true },
    { title: 'The Amber Resort & Spa', slug: 'amber-resort-spa', description: 'A boutique resort carved into the cliffs of the Aegean coast, featuring 47 suites that blur the boundary between interior and landscape.', projectStory: 'Set on a dramatic clifftop site in Greece, this resort required a masterful response to both the extraordinary landscape and the vernacular architecture of the region.', designConcept: 'Each suite is oriented to capture specific moments of sunlight, creating a solar calendar embedded into the architecture itself.', clientName: 'Amber Hospitality Group', clientCompany: 'Amber Hospitality', categoryId: categories[2].id, country: 'Greece', city: 'Santorini', location: 'Oia, Santorini, Greece', projectArea: '32,000 sq ft', status: 'completed', budget: '$18M', duration: '28 months', year: 2023, featured: true, published: true },
    { title: 'Haven Residence', slug: 'haven-residence', description: 'A contemplative retreat for a private family, designed as a series of pavilions connected by covered walkways and curated gardens.', clientName: 'Private Client', categoryId: categories[0].id, country: 'UK', city: 'London', location: 'Hampstead, London', projectArea: '6,800 sq ft', status: 'completed', budget: '$4.5M', duration: '18 months', year: 2022, featured: false, published: true },
    { title: 'Lumina Mixed-Use Tower', slug: 'lumina-tower', description: 'A 42-story mixed-use tower combining premium residences, boutique retail, and Class A office space in a single architectural statement.', clientName: 'Lumina Development Group', clientCompany: 'Lumina Group', categoryId: categories[3].id, country: 'Singapore', city: 'Singapore', location: 'Marina Bay, Singapore', projectArea: '320,000 sq ft', status: 'ongoing', budget: '$95M', duration: '54 months', year: 2025, featured: true, published: true },
  ];

  for (const project of projects) {
    await db.project.create({ data: project });
  }
  console.log('✓ Projects created');

  // Services
  const services = [
    { name: 'Architectural Design', slug: 'architectural-design', description: 'From concept to completion, we craft architectural solutions that are both visually stunning and functionally superior. Our process integrates site analysis, spatial planning, and material selection into a cohesive design narrative.', benefits: 'Bespoke designs tailored to your vision and lifestyle. Investment-grade architecture that appreciates over time.', process: 'Discovery → Concept Design → Design Development → Technical Documentation → Construction Administration', order: 1 },
    { name: 'Interior Design', slug: 'interior-design', description: 'We curate interiors that feel both timeless and distinctly personal. Drawing from global influences while remaining rooted in the principles of quality and craftsmanship.', benefits: 'Spaces that enhance daily living. Access to exclusive materials, artisans, and suppliers worldwide.', process: 'Brief Development → Concept Presentation → Material Specification → Procurement → Installation Supervision', order: 2 },
    { name: 'Urban Planning', slug: 'urban-planning', description: 'Master planning and urban design services for developments of all scales. We create frameworks for communities that balance density, livability, and ecological responsibility.', benefits: 'Long-term value creation for large-scale developments. Regulatory expertise and stakeholder management.', process: 'Site Analysis → Master Plan → Community Consultation → Phasing Strategy → Implementation', order: 3 },
    { name: 'Sustainable Design', slug: 'sustainable-design', description: 'Integrating passive design strategies, renewable systems, and sustainable material sourcing to create buildings that perform exceptionally while treading lightly.', benefits: 'Reduced operational costs. LEED/BREEAM certification support. Future-proofed assets.', process: 'Energy Modeling → Passive Design Optimization → Systems Integration → Certification Management', order: 4 },
    { name: 'Project Management', slug: 'project-management', description: 'End-to-end project delivery oversight, ensuring your vision is executed on time, on budget, and to the highest standards of quality.', benefits: 'Single point of accountability. Transparent reporting and communication throughout.', process: 'Program Planning → Contractor Selection → Site Supervision → Quality Control → Handover', order: 5 },
  ];

  for (const service of services) {
    await db.service.create({ data: service });
  }
  console.log('✓ Services created');

  // Testimonials
  const testimonials = [
    { clientName: 'James Whitfield', clientPosition: 'CEO', companyName: 'Whitfield Capital', rating: 5, testimonial: 'ARQIVA transformed our vision into a reality that exceeded every expectation. Their attention to detail and ability to translate abstract ideas into physical spaces is unparalleled. The result is a headquarters our entire organization is proud to inhabit.', featured: true },
    { clientName: 'Sofia Al-Rashid', clientPosition: 'Private Client', companyName: null, rating: 5, testimonial: 'Working with ARQIVA on our family home was a profound experience. They listened deeply, challenged our assumptions in the best possible ways, and delivered a home that genuinely reflects who we are. Five years on, it still feels fresh and timeless.', featured: true },
    { clientName: 'Marcus Chen', clientPosition: 'Managing Director', companyName: 'Amber Hospitality Group', rating: 5, testimonial: 'ARQIVA\'s work on The Amber Resort completely redefined what we thought was possible. The project attracted international press coverage we never anticipated and delivered occupancy rates 40% above projections from day one.', featured: true },
    { clientName: 'Elena Vasquez', clientPosition: 'Founder', companyName: 'Maison Elena', rating: 5, testimonial: 'Our retail flagship is consistently described by customers as the most beautiful shop they\'ve ever been in. ARQIVA understood our brand at its essence and created a space that sells without selling.', featured: true },
    { clientName: 'Dr. William Park', clientPosition: 'Director', companyName: 'Park Foundation', rating: 5, testimonial: 'We entrusted ARQIVA with the restoration and reimagining of a Grade I listed building. They navigated the planning process expertly and delivered a result that honors the building\'s heritage while being thoroughly contemporary.', featured: true },
  ];

  for (const testimonial of testimonials) {
    await db.testimonial.create({ data: testimonial });
  }
  console.log('✓ Testimonials created');

  // Awards
  const awards = [
    { title: 'Aga Khan Award for Architecture', description: 'Recognized for the Amber Resort & Spa for its sensitive response to the natural landscape and contribution to sustainable tourism architecture.', issuer: 'Aga Khan Trust for Culture', year: 2023, category: 'Sustainability & Heritage', featured: true },
    { title: 'RIBA International Prize', description: 'Awarded for the Obsidian Corporate HQ for transforming the nature of workplace design and raising the standard for biophilic integration at scale.', issuer: 'Royal Institute of British Architects', year: 2023, category: 'Commercial Architecture', featured: true },
    { title: 'Dezeen Awards — Interior of the Year', description: 'The Meridian Penthouse was recognized for redefining luxury residential interiors through a masterful synthesis of Scandinavian and Middle Eastern design traditions.', issuer: 'Dezeen Magazine', year: 2024, category: 'Residential Interior', featured: true },
    { title: 'World Architecture Festival Award', description: 'Lumina Tower recognized for its innovative approach to mixed-use programming and the quality of its architectural language.', issuer: 'World Architecture Festival', year: 2024, category: 'Future Projects — Mixed Use', featured: true },
    { title: 'Frame Award — Best Retail Design', description: 'Maison Elena flagship store recognized for creating an immersive brand environment that redefined standards for luxury retail design.', issuer: 'Frame Magazine', year: 2022, category: 'Retail Design', featured: false },
  ];

  for (const award of awards) {
    await db.award.create({ data: award });
  }
  console.log('✓ Awards created');

  console.log('\n✅ Database seeded successfully!');
  console.log('Admin credentials:');
  console.log('  Email: admin@arqivastudio.com');
  console.log('  Password: Admin@123456');
}

main()
  .catch((e) => { console.error('❌ Seeding error:', e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
