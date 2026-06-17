// seed-expanded.cjs — Run with: node seed-expanded.cjs
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding expanded data...');

  // ─── Categories ───────────────────────────────────────────────────────────
  const catData = [
    { name: 'Architectural Design', slug: 'architectural-design', icon: '🏛️' },
    { name: 'Interior Design', slug: 'interior-design', icon: '🛋️' },
    { name: 'Landscape Design', slug: 'landscape-design', icon: '🌿' },
    { name: 'Urban Design', slug: 'urban-design', icon: '🏙️' },
    { name: '3D Visualization', slug: '3d-visualization', icon: '🎨' },
  ];

  const cats = {};
  for (const c of catData) {
    const cat = await prisma.projectCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, slug: c.slug, icon: c.icon },
    });
    cats[c.slug] = cat;
  }
  console.log('✓ Categories');

  // ─── Architecture Projects ─────────────────────────────────────────────────
  const archProjects = [
    {
      title: 'Lumina Mixed-Use Tower',
      slug: 'lumina-mixed-use-tower',
      description: 'A 42-story mixed-use tower redefining Singapore\'s skyline with biophilic design principles.',
      projectStory: 'The Lumina Tower was conceived as a vertical village — a self-contained ecosystem that blurs the boundary between living, working, and public space.',
      designConcept: 'Inspired by the growth patterns of tropical vegetation, the tower\'s cascading terraces create a series of sky gardens at every third floor.',
      challenges: 'Integrating 8,000 sqm of green space within a high-density urban footprint while maintaining structural integrity.',
      solutions: 'Cantilevered garden platforms supported by a diagrid exoskeleton, allowing column-free interior spaces with panoramic views.',
      clientName: 'Meridian Group', clientCompany: 'Meridian Development Pte Ltd',
      country: 'Singapore', city: 'Singapore', location: 'Marina Bay, Singapore',
      projectArea: '48,500', status: 'completed', budget: '$420M', duration: '4 years', year: 2025,
      featured: true, published: true, views: 0, likes: 0, categorySlug: 'architectural-design',
    },
    {
      title: 'Obsidian Corporate HQ',
      slug: 'obsidian-corporate-hq',
      description: 'A monolithic 28-story headquarters for a global technology firm in the heart of Dubai.',
      projectStory: 'The Obsidian HQ responds to Dubai\'s extreme climate through passive cooling strategies embedded directly into its architectural form.',
      designConcept: 'The building\'s dark polished facade reflects the desert sky while internal courtyards channel cool breezes.',
      challenges: 'Achieving LEED Platinum certification in an extreme desert climate without compromising the dramatic aesthetic vision.',
      solutions: 'Triple-glazed facades, automated external shading, and a rooftop solar canopy generating 40% of the building\'s energy needs.',
      clientName: 'Atlas Technologies', clientCompany: 'Atlas Technologies DMCC',
      country: 'UAE', city: 'Dubai', location: 'DIFC, Dubai',
      projectArea: '62,000', status: 'completed', budget: '$380M', duration: '5 years', year: 2023,
      featured: true, published: true, views: 0, likes: 0, categorySlug: 'architectural-design',
    },
    {
      title: 'Elara Cultural Centre',
      slug: 'elara-cultural-centre',
      description: 'A groundbreaking cultural institution celebrating contemporary Arab art and architecture.',
      projectStory: 'Inspired by the patterns of traditional Islamic geometry, Elara is a building that performs as both gallery and artwork.',
      designConcept: 'The perforated stone facade filters light into constantly shifting geometric patterns throughout the day.',
      challenges: 'Creating a 21st-century cultural institution that authentically references traditional architectural heritage without pastiche.',
      solutions: 'Computational facade design creating parametric mashrabiya screens, digitally fabricated using CNC stone cutting.',
      clientName: 'Ministry of Culture', clientCompany: 'Qatar Foundation',
      country: 'Qatar', city: 'Doha', location: 'Katara Cultural Village, Doha',
      projectArea: '35,000', status: 'completed', budget: '$290M', duration: '6 years', year: 2024,
      featured: true, published: true, views: 0, likes: 0, categorySlug: 'architectural-design',
    },
    {
      title: 'Solstice Residential Tower',
      slug: 'solstice-residential-tower',
      description: 'A 55-unit luxury residential tower optimized for solar access and natural ventilation.',
      projectStory: 'Every apartment in Solstice is designed to receive at least 4 hours of direct sunlight daily, with living spaces oriented to capture prevailing sea breezes.',
      designConcept: 'The tower\'s angled form tracks the path of the sun throughout the year, maximizing daylight in winter and providing shade in summer.',
      challenges: 'Meeting the developer\'s requirement for 100% natural ventilation in a dense urban context.',
      solutions: 'Wind tunnel testing to optimize building orientation; cross-ventilated plans with operable facades.',
      clientName: 'Helio Properties', clientCompany: 'Helio Residential Group',
      country: 'Australia', city: 'Sydney', location: 'Circular Quay, Sydney',
      projectArea: '28,000', status: 'completed', budget: '$210M', duration: '3 years', year: 2024,
      featured: false, published: true, views: 0, likes: 0, categorySlug: 'architectural-design',
    },
    {
      title: 'Verdant Research Campus',
      slug: 'verdant-research-campus',
      description: 'A net-zero innovation campus for a leading pharmaceutical company.',
      projectStory: 'The Verdant Campus is designed as a living laboratory — a place where sustainability research is embedded in every building system.',
      designConcept: 'Low-rise buildings connected by an extensive network of covered walkways and experimental gardens.',
      challenges: 'Designing flexible laboratory spaces that can adapt to rapidly evolving research requirements.',
      solutions: 'Modular structural system allowing reconfiguration of lab spaces without major construction.',
      clientName: 'BioNova Sciences', clientCompany: 'BioNova Sciences AG',
      country: 'Switzerland', city: 'Basel', location: 'Basel Innovation District',
      projectArea: '85,000', status: 'in-progress', budget: '$650M', duration: '7 years', year: 2025,
      featured: false, published: true, views: 0, likes: 0, categorySlug: 'architectural-design',
    },
    {
      title: 'Seraph Hospitality Resort',
      slug: 'seraph-hospitality-resort',
      description: 'A 180-key ultra-luxury resort carved into the Oman mountains.',
      projectStory: 'Seraph emerges from the rocky landscape as if it has always been there, with villas cascading down the cliff face.',
      designConcept: 'The resort is organized as a series of villages connected by a dramatic cliff-hugging pathway.',
      challenges: 'Constructing on extreme terrain while minimizing environmental impact.',
      solutions: 'Prefabricated villa modules helicoptered to site; minimal foundation footprints using rock anchors.',
      clientName: 'Six Senses', clientCompany: 'IHG Hotels & Resorts',
      country: 'Oman', city: 'Muscat', location: 'Al Hajar Mountains, Oman',
      projectArea: '42,000', status: 'in-progress', budget: '$480M', duration: '5 years', year: 2025,
      featured: true, published: true, views: 0, likes: 0, categorySlug: 'architectural-design',
    },
    {
      title: 'Onyx Financial Plaza',
      slug: 'onyx-financial-plaza',
      description: 'Twin 38-story office towers connected by a spectacular 7-story sky bridge.',
      projectStory: 'The sky bridge between the Onyx towers has become a destination in itself — a public viewing platform and event space suspended 150m above the city.',
      designConcept: 'The towers lean slightly toward each other, creating a gateway form visible from across the city.',
      challenges: 'Engineering the 85m sky bridge to accommodate differential movement between the two independently oscillating towers.',
      solutions: 'Flexible connection system with seismic isolators allowing 400mm of independent movement.',
      clientName: 'Pinnacle Capital', clientCompany: 'Pinnacle Capital Holdings',
      country: 'Malaysia', city: 'Kuala Lumpur', location: 'Tun Razak Exchange, KL',
      projectArea: '112,000', status: 'completed', budget: '$720M', duration: '6 years', year: 2022,
      featured: false, published: true, views: 0, likes: 0, categorySlug: 'architectural-design',
    },
    {
      title: 'Glacier Retreat',
      slug: 'glacier-retreat',
      description: 'An ultra-exclusive 8-villa mountain retreat in Iceland\'s volcanic highlands.',
      projectStory: 'Glacier Retreat is the most remote luxury project we have undertaken — accessible only by helicopter, surrounded by lava fields and glaciers.',
      designConcept: 'Volcanic stone and weathered Corten steel villas that disappear into the landscape.',
      challenges: 'Building in Iceland\'s extreme climate with limited construction access.',
      solutions: 'Complete prefabrication in Reykjavik workshops; assembly on site in just 8 weeks per villa.',
      clientName: 'Nomadic Luxury', clientCompany: 'Nomadic Luxury Resorts',
      country: 'Iceland', city: 'Reykjavik', location: 'Icelandic Highlands',
      projectArea: '8,500', status: 'completed', budget: '$95M', duration: '2 years', year: 2023,
      featured: false, published: true, views: 0, likes: 0, categorySlug: 'architectural-design',
    },
    {
      title: 'The Meridian Penthouse',
      slug: 'meridian-penthouse',
      description: 'A three-floor penthouse occupying the summit of Manhattan\'s newest residential tower.',
      projectStory: 'The Meridian Penthouse was designed from the inside out — every room positioned to capture a specific iconic view of New York City.',
      designConcept: 'Floating staircases, double-height spaces, and a rooftop infinity pool at 280m above street level.',
      challenges: 'Integrating 2,800 sqft of outdoor terraces into a structural system designed for pure office use.',
      solutions: 'Structural steel modifications and custom drainage systems installed before the building topped out.',
      clientName: 'Private Client', clientCompany: 'Private',
      country: 'USA', city: 'New York', location: 'Midtown Manhattan, New York',
      projectArea: '1,850', status: 'completed', budget: '$45M', duration: '2 years', year: 2024,
      featured: true, published: true, views: 0, likes: 0, categorySlug: 'architectural-design',
    },
    {
      title: 'Nova Tech Park',
      slug: 'nova-tech-park',
      description: 'A 200,000 sqm mixed-use tech park designed for the future of work.',
      projectStory: 'Nova Tech Park abandons the traditional office campus model in favor of a dense urban mixed-use district with streets, squares, and a diverse mix of uses.',
      designConcept: 'Five distinct buildings united by a shared elevated park that forms the new ground plane.',
      challenges: 'Creating genuine urban vitality in what was previously a suburban office park location.',
      solutions: 'Ground floor retail activation, public plazas, and a mix of tenants ranging from startups to Fortune 500 companies.',
      clientName: 'Nexus REIT', clientCompany: 'Nexus Real Estate Investment Trust',
      country: 'South Korea', city: 'Seoul', location: 'Pangyo Techno Valley, Seoul',
      projectArea: '200,000', status: 'completed', budget: '$1.2B', duration: '8 years', year: 2023,
      featured: false, published: true, views: 0, likes: 0, categorySlug: 'architectural-design',
    },
  ];

  // ─── Interior Design Projects ──────────────────────────────────────────────
  const interiorProjects = [
    {
      title: 'The Amber Resort & Spa — Interiors',
      slug: 'amber-resort-spa',
      description: 'Complete interior design for a 95-room luxury resort in Santorini.',
      projectStory: 'We were commissioned to create a complete interior narrative for Amber — from grand lobby to private villas.',
      designConcept: 'A palette drawn from the Aegean: weathered limestone, deep indigo, and warm terracotta.',
      challenges: 'Sourcing locally made materials and crafts to achieve an authentic sense of place.',
      solutions: 'Collaboration with eight Cycladic artisans; custom ceramic tiles, hand-woven textiles, and iron metalwork.',
      clientName: 'Amber Collection', clientCompany: 'Amber Hospitality Group',
      country: 'Greece', city: 'Santorini', location: 'Oia, Santorini',
      projectArea: '18,500', status: 'completed', budget: '$28M', duration: '2 years', year: 2023,
      featured: true, published: true, views: 0, likes: 0, categorySlug: 'interior-design',
    },
    {
      title: 'Haven Private Residence',
      slug: 'haven-residence',
      description: 'Interior architecture for a 1,200 sqm private villa in the Swiss Alps.',
      projectStory: 'A family home designed to be a true refuge — warm, grounded, and completely timeless.',
      designConcept: 'Natural materials — stone, timber, wool — creating a harmonious connection with the alpine landscape.',
      challenges: 'Integrating sophisticated home automation without losing the warmth of natural materials.',
      solutions: 'Concealed technology within custom millwork; smart home systems with analogue override for every function.',
      clientName: 'Private Client', clientCompany: 'Private',
      country: 'Switzerland', city: 'Gstaad', location: 'Gstaad, Switzerland',
      projectArea: '1,200', status: 'completed', budget: '$18M', duration: '18 months', year: 2024,
      featured: true, published: true, views: 0, likes: 0, categorySlug: 'interior-design',
    },
    {
      title: 'Noir Signature Restaurant',
      slug: 'noir-signature-restaurant',
      description: 'Interior design for a two Michelin star dining destination in Hong Kong.',
      projectStory: 'Chef Yuki Tanaka\'s flagship restaurant needed a space that matched his cuisine — deeply considered, technically precise, and emotionally resonant.',
      designConcept: 'Darkness as luxury. A monochromatic interior where light is the primary material.',
      challenges: 'Creating intimate dining booths for 60 covers without fragmenting the space.',
      solutions: 'Curved acoustic partitions that provide privacy without visual separation.',
      clientName: 'Chef Yuki Tanaka', clientCompany: 'YT Hospitality Group',
      country: 'Hong Kong', city: 'Hong Kong', location: 'Central, Hong Kong',
      projectArea: '680', status: 'completed', budget: '$4.2M', duration: '8 months', year: 2024,
      featured: false, published: true, views: 0, likes: 0, categorySlug: 'interior-design',
    },
    {
      title: 'Skyline Penthouse — Manhattan',
      slug: 'skyline-penthouse-manhattan',
      description: 'Interior design for a 950 sqm penthouse with 360° views of New York.',
      projectStory: 'The client wanted something that felt completely different from every other Manhattan penthouse — personal, curated, and timeless.',
      designConcept: 'Mid-century modernism reinterpreted through a contemporary material palette.',
      challenges: 'Integrating the client\'s 300-piece art collection without the apartment feeling like a gallery.',
      solutions: 'Art-specific lighting design by Isometrix London; custom display furniture that adapts to the collection.',
      clientName: 'Private Client', clientCompany: 'Private',
      country: 'USA', city: 'New York', location: 'Upper East Side, New York',
      projectArea: '950', status: 'completed', budget: '$22M', duration: '2 years', year: 2022,
      featured: false, published: true, views: 0, likes: 0, categorySlug: 'interior-design',
    },
    {
      title: 'Palazzo Privé — Interiors',
      slug: 'palazzo-prive-interiors',
      description: 'Interior renovation of a 16th-century Venetian palazzo into a private residence.',
      projectStory: 'The challenge was to sensitively restore and reimagine one of Venice\'s most historic residential palazzi for a 21st-century family.',
      designConcept: 'Old and new in constant dialogue — preserved frescoes alongside contemporary furniture by Ronan and Erwan Bouroullec.',
      challenges: 'UNESCO heritage restrictions; no structural modifications permitted.',
      solutions: 'Every intervention was reversible; concealed services routed through existing voids.',
      clientName: 'Private Client', clientCompany: 'Private',
      country: 'Italy', city: 'Venice', location: 'Grand Canal, Venice',
      projectArea: '2,400', status: 'completed', budget: '$35M', duration: '3 years', year: 2023,
      featured: true, published: true, views: 0, likes: 0, categorySlug: 'interior-design',
    },
    {
      title: 'Atlas Private Members Club',
      slug: 'atlas-private-members-club',
      description: 'Interior design for London\'s most exclusive new private members club.',
      projectStory: 'Atlas was conceived as the antithesis of the typical members club — no dark wood panelling, no hunting trophies; instead, a space that feels like someone\'s very extraordinary home.',
      designConcept: 'Seven rooms, each designed as a complete world: the library, the garden room, the bar, the dining room, the screening room, the garden, and the private dining suites.',
      challenges: 'Serving a membership that includes heads of state, CEOs, and international artists — each with different expectations.',
      solutions: 'Flexibility built into every space through moveable partitions, multi-function furniture, and adaptable lighting.',
      clientName: 'Atlas Holding Group', clientCompany: 'Atlas Members Ltd',
      country: 'UK', city: 'London', location: 'Mayfair, London',
      projectArea: '3,200', status: 'completed', budget: '$24M', duration: '2 years', year: 2024,
      featured: false, published: true, views: 0, likes: 0, categorySlug: 'interior-design',
    },
    {
      title: 'Nomad Superyacht Interior',
      slug: 'nomad-superyacht-interior',
      description: 'Interior design for a 72m superyacht — conceived as a floating retreat.',
      projectStory: 'The owners of Nomad wanted a yacht that felt nothing like a yacht — more like a Japanese ryokan that could travel the world\'s oceans.',
      designConcept: 'Wabi-sabi principles applied to marine interior design: natural imperfection, transient beauty, simplicity.',
      challenges: 'Meeting strict marine fire safety requirements while using natural materials.',
      solutions: 'Fire-retardant treatments for natural wood and textile; bespoke marine-grade stone composite panels.',
      clientName: 'Private Client', clientCompany: 'Private',
      country: 'Monaco', city: 'Monaco', location: 'Port Hercule, Monaco',
      projectArea: '2,800', status: 'completed', budget: '$42M', duration: '2.5 years', year: 2024,
      featured: false, published: true, views: 0, likes: 0, categorySlug: 'interior-design',
    },
    {
      title: 'Elysian Hotel — Suite Collection',
      slug: 'elysian-hotel-suite-collection',
      description: 'Design of 12 signature suites for a 5-star hotel in Paris.',
      projectStory: 'Each of the 12 suites tells a different story drawn from French cultural history — the explorer, the artist, the diplomat, the couturier.',
      designConcept: 'Narrative-driven design: every suite is a complete world with its own color palette, material selection, and art programme.',
      challenges: 'Creating 12 completely distinct suites within a shared hotel infrastructure.',
      solutions: 'Modular design system with fixed plumbing cores and flexible decorative elements.',
      clientName: 'Elysian Hotels', clientCompany: 'Elysian Luxury Hotels & Resorts',
      country: 'France', city: 'Paris', location: '8th Arrondissement, Paris',
      projectArea: '4,200', status: 'completed', budget: '$31M', duration: '18 months', year: 2023,
      featured: false, published: true, views: 0, likes: 0, categorySlug: 'interior-design',
    },
    {
      title: 'Cypress Corporate Headquarters',
      slug: 'cypress-corporate-headquarters',
      description: 'Workplace design for the global HQ of a 12,000-person technology company.',
      projectStory: 'Cypress challenged us to reimagine what an office could be — not a place you have to go, but a place you want to go.',
      designConcept: 'The Cypress HQ is organized as a campus within a building — neighborhoods, streets, and parks replacing traditional office floors.',
      challenges: 'Achieving Activity-Based Working across all 24 floors while maintaining departmental cohesion.',
      solutions: 'Each floor has a distinct character and a different type of collaborative space; wayfinding system guides employees to the right environment for each task.',
      clientName: 'Cypress Technologies', clientCompany: 'Cypress Technologies Inc',
      country: 'USA', city: 'San Francisco', location: 'Mission Bay, San Francisco',
      projectArea: '72,000', status: 'completed', budget: '$180M', duration: '3 years', year: 2024,
      featured: true, published: true, views: 0, likes: 0, categorySlug: 'interior-design',
    },
    {
      title: 'Sable Wellness Retreat',
      slug: 'sable-wellness-retreat',
      description: 'Interior design for an award-winning spa and wellness destination in Bali.',
      projectStory: 'Sable is designed around the Balinese concept of Tri Hita Karana — harmony between people, nature, and the divine.',
      designConcept: 'A material palette of volcanic stone, reclaimed teak, and living bamboo screens.',
      challenges: 'Creating genuine tranquility in a highly commercial wellness destination.',
      solutions: 'Acoustic design eliminating mechanical noise; natural ventilation replacing air conditioning; circadian lighting throughout.',
      clientName: 'Sable Wellness Group', clientCompany: 'Sable International',
      country: 'Indonesia', city: 'Bali', location: 'Ubud, Bali',
      projectArea: '12,000', status: 'completed', budget: '$16M', duration: '18 months', year: 2023,
      featured: false, published: true, views: 0, likes: 0, categorySlug: 'interior-design',
    },
  ];

  // Insert projects
  for (const p of [...archProjects, ...interiorProjects]) {
    const { categorySlug, ...projectData } = p;
    const cat = cats[categorySlug];
    try {
      await prisma.project.upsert({
        where: { slug: p.slug },
        update: {},
        create: { ...projectData, categoryId: cat?.id || null },
      });
    } catch (e) {
      console.error(`  Failed: ${p.title}`, e.message);
    }
  }
  console.log('✓ Projects (20 total)');

  // ─── Services ─────────────────────────────────────────────────────────────
  const services = [
    { name: 'Architectural Design', slug: 'architectural-design', description: 'From concept to construction documents, we create buildings that define their context and endure across generations.', benefits: 'Comprehensive design service from feasibility through completion\nIntegrated structural and MEP coordination\nSustainability-led design approach\nFull planning and regulatory approval management', process: 'Brief development → Concept design → Design development → Technical design → Construction documentation → Site oversight', order: 1 },
    { name: 'Interior Design', slug: 'interior-design', description: 'Luxury interior environments that balance aesthetic ambition with functional excellence.', benefits: 'Complete FF&E specification and procurement\nCustom furniture and joinery design\nArt curation and placement\nLighting design coordination', process: 'Design brief → Concept → Space planning → Material selection → FF&E procurement → Installation supervision', order: 2 },
    { name: 'Landscape Design', slug: 'landscape-design', description: 'Exterior environments that extend the architectural vision into the landscape.', benefits: 'Masterplan through to planting design\nWater features and hardscape design\nSustainable planting specification\nLong-term maintenance planning', process: 'Site analysis → Masterplan → Detailed design → Specification → Implementation → Handover', order: 3 },
    { name: 'Urban Design', slug: 'urban-design', description: 'Shaping the public realm — streets, squares, and neighborhoods that bring communities together.', benefits: 'Masterplanning at urban scale\nPublic realm design\nDevelopment framework creation\nCommunity engagement', process: 'Urban analysis → Vision development → Masterplan → Phasing strategy → Implementation guidance', order: 4 },
    { name: 'Architectural Visualization', slug: 'architectural-visualization', description: 'Photorealistic renders and immersive virtual environments that bring designs to life before construction begins.', benefits: 'Marketing-quality still renders\nAnimation and walkthrough videos\nVR-ready 3D models\nInteractive real-time experiences', process: 'Design brief → Modelling → Lighting setup → Rendering → Post-production → Delivery', order: 5 },
    { name: '3D Rendering', slug: '3d-rendering', description: 'Studio-quality architectural imagery that communicates design intent with stunning clarity.', benefits: 'Ultra-high resolution stills\nPanorama and 360° renders\nConcept sketches and artistic impressions\nFast turnaround for marketing campaigns', process: 'Drawings supplied → 3D modelling → Texturing → Lighting → Final render → Revisions', order: 6 },
    { name: 'Design Consultation', slug: 'design-consultation', description: 'Expert advice and design guidance for clients navigating complex design decisions.', benefits: 'One-to-one sessions with senior architects\nDesign review and critique\nProgramme and brief development\nCost and feasibility assessment', process: 'Discovery call → Brief analysis → Workshop session → Recommendations report → Follow-up', order: 7 },
    { name: 'Project Development', slug: 'project-development', description: 'End-to-end project management from land acquisition through practical completion.', benefits: 'Feasibility and due diligence\nProcurement strategy\nContractor management\nRisk mitigation', process: 'Opportunity analysis → Feasibility → Planning → Procurement → Delivery → Handover', order: 8 },
    { name: 'Construction Documentation', slug: 'construction-documentation', description: 'Precision technical drawings and specifications that translate design intent into buildable reality.', benefits: 'Fully coordinated drawing packages\nBIM-compliant deliverables\nSpecification writing\nSchedule preparation', process: 'Design freeze → Coordination → Drawing production → Specification → Issue for construction → RFI management', order: 9 },
    { name: 'Project Coordination', slug: 'project-coordination', description: 'Specialist coordination services ensuring complex multi-disciplinary projects run seamlessly.', benefits: 'Programme management\nDesign team coordination\nClient reporting\nQuality control', process: 'Programme development → Team establishment → Regular design reviews → Issue resolution → Milestone reporting', order: 10 },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }
  console.log('✓ Services (10 total)');

  // ─── Awards ───────────────────────────────────────────────────────────────
  const awards = [
    { title: 'World Architecture Festival — Building of the Year', description: 'Awarded for the Lumina Mixed-Use Tower, recognizing outstanding architectural achievement at urban scale.', issuer: 'World Architecture Festival', year: 2025, category: 'Architecture', featured: true },
    { title: 'RIBA International Prize', description: 'Internationally recognized prize celebrating the world\'s best new buildings.', issuer: 'Royal Institute of British Architects', year: 2024, category: 'Architecture', featured: true },
    { title: 'AHEAD Global — Hotel Interior of the Year', description: 'For The Amber Resort & Spa interior design project.', issuer: 'AHEAD Awards', year: 2024, category: 'Hospitality Design', featured: false },
    { title: 'Dezeen Awards — Interior Designer of the Year', description: 'Celebrating exceptional talent and consistent delivery of world-class interior environments.', issuer: 'Dezeen', year: 2023, category: 'Interior Design', featured: true },
    { title: 'Aga Khan Award for Architecture', description: 'Recognizing architectural excellence that serves the social, historical, and environmental challenges of communities across the world.', issuer: 'Aga Khan Trust for Culture', year: 2022, category: 'Architecture', featured: false },
    { title: 'AIA Institute Honor Award for Architecture', description: 'The highest honor bestowed by the American Institute of Architects.', issuer: 'American Institute of Architects', year: 2023, category: 'Architecture', featured: false },
    { title: 'INSIDE World Festival — Workplace of the Year', description: 'For the Cypress Corporate Headquarters workplace design.', issuer: 'INSIDE World Festival of Interiors', year: 2024, category: 'Workplace', featured: false },
    { title: 'Green Good Design Award', description: 'Recognizing projects that demonstrate excellence in sustainable design.', issuer: 'European Centre for Architecture', year: 2024, category: 'Sustainability', featured: false },
    { title: 'Architectural Record Design Vanguard', description: 'Recognizing the 10 most innovative young architecture firms globally.', issuer: 'Architectural Record', year: 2021, category: 'Recognition', featured: false },
    { title: 'Wallpaper Design Award — Best Private House', description: 'For Haven Private Residence in Gstaad, Switzerland.', issuer: 'Wallpaper Magazine', year: 2024, category: 'Residential', featured: true },
  ];

  for (const a of awards) {
    await prisma.award.upsert({
      where: { id: (await prisma.award.findFirst({ where: { title: a.title } }))?.id || 0 },
      update: {},
      create: a,
    });
  }
  console.log('✓ Awards (10 total)');

  // ─── Testimonials ─────────────────────────────────────────────────────────
  const testimonials = [
    { clientName: 'James Meridian', clientPosition: 'CEO', companyName: 'Meridian Group', rating: 5, testimonial: 'ARQIVA delivered something we genuinely did not believe was possible. Lumina Tower exceeded every expectation and has been recognized globally as a landmark of contemporary architecture. Their process is exceptional — transparent, collaborative, and inspiring throughout.', featured: true },
    { clientName: 'Sarah Chen', clientPosition: 'Managing Director', companyName: 'Atlas Technologies', rating: 5, testimonial: 'Working with ARQIVA on our Dubai headquarters was a transformative experience. They challenged our brief in the best possible way and delivered a building that has fundamentally changed how our employees feel about coming to work.', featured: true },
    { clientName: 'Alexandre Dubois', clientPosition: 'VP Real Estate', companyName: 'Amber Collection', rating: 5, testimonial: 'Our Santorini resort has been covered by every major design publication. The response from guests has been extraordinary — people specifically choose us because of the interior design. ARQIVA understood our brand better than we did.', featured: true },
    { clientName: 'Mei-Lin Zhang', clientPosition: 'Private Client', companyName: 'Private', rating: 5, testimonial: 'ARQIVA transformed our Manhattan penthouse into the home we had always imagined but could never quite articulate. They listened deeply, then exceeded everything we hoped for.', featured: false },
    { clientName: 'Thomas Richter', clientPosition: 'Director of Real Estate', companyName: 'Nexus REIT', rating: 5, testimonial: 'The Nova Tech Park has outperformed every financial projection. The quality of the architecture has attracted tenants we never thought possible. ARQIVA\'s vision for the project was ahead of the market.', featured: false },
    { clientName: 'Isabelle Fontaine', clientPosition: 'General Manager', companyName: 'Elysian Hotels', rating: 5, testimonial: 'Every one of our 12 signature suites tells a story that guests love. The ARQIVA team created something that feels genuinely unique in Paris — and in the world. Occupancy in the suites is consistently above 90%.', featured: false },
    { clientName: 'Ryan O\'Sullivan', clientPosition: 'Head of Real Estate', companyName: 'Cypress Technologies', rating: 5, testimonial: 'Our new headquarters has been a talent attraction and retention tool we never expected. Employees regularly cite the office as one of their favourite things about working at Cypress. ARQIVA delivered more than a building — they changed our culture.', featured: true },
    { clientName: 'Hiroshi Tanaka', clientPosition: 'Executive Chef', companyName: 'YT Hospitality Group', rating: 5, testimonial: 'Noir has received two Michelin stars and numerous design awards since opening. The atmosphere created by ARQIVA is inseparable from the dining experience. Guests describe it as one of the most memorable rooms they have ever sat in.', featured: false },
    { clientName: 'Claudia Berger', clientPosition: 'CEO', companyName: 'Sable Wellness Group', rating: 5, testimonial: 'From day one, ARQIVA understood that wellness design requires a different kind of attention. The result is a space that genuinely delivers on our promise of transformation. Our guest satisfaction scores are the highest in the industry.', featured: false },
    { clientName: 'Lord James Harrington', clientPosition: 'Chairman', companyName: 'Atlas Members Ltd', rating: 5, testimonial: 'Atlas is everything we imagined and more. ARQIVA created seven distinct rooms that feel like the most beautiful private home in London. Our founding membership sold out in six weeks. The design was the selling point.', featured: false },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { clientName: t.clientName, companyName: t.companyName } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log('✓ Testimonials (10 total)');

  // ─── Skills ───────────────────────────────────────────────────────────────
  const skills = [
    // Software
    { name: 'Revit Architecture', category: 'software', proficiency: 'expert', order: 1 },
    { name: 'AutoCAD', category: 'software', proficiency: 'expert', order: 2 },
    { name: 'Rhino 3D', category: 'software', proficiency: 'expert', order: 3 },
    { name: 'SketchUp Pro', category: 'software', proficiency: 'advanced', order: 4 },
    { name: 'Grasshopper', category: 'software', proficiency: 'advanced', order: 5 },
    { name: 'ArchiCAD', category: 'software', proficiency: 'advanced', order: 6 },
    // Rendering & Visualization
    { name: 'V-Ray', category: 'design', proficiency: 'expert', order: 1 },
    { name: 'Lumion', category: 'design', proficiency: 'expert', order: 2 },
    { name: 'Enscape', category: 'design', proficiency: 'advanced', order: 3 },
    { name: 'Adobe Photoshop', category: 'design', proficiency: 'expert', order: 4 },
    { name: 'Adobe InDesign', category: 'design', proficiency: 'expert', order: 5 },
    { name: 'Adobe Illustrator', category: 'design', proficiency: 'advanced', order: 6 },
    // Technical
    { name: 'BIM Management', category: 'technical', proficiency: 'expert', order: 1 },
    { name: 'Structural Coordination', category: 'technical', proficiency: 'advanced', order: 2 },
    { name: 'Sustainable Design (LEED/BREEAM)', category: 'technical', proficiency: 'advanced', order: 3 },
    { name: 'Construction Documentation', category: 'technical', proficiency: 'expert', order: 4 },
    // Soft Skills
    { name: 'Client Presentation', category: 'soft', proficiency: 'expert', order: 1 },
    { name: 'Design Leadership', category: 'soft', proficiency: 'expert', order: 2 },
    { name: 'Project Management', category: 'soft', proficiency: 'advanced', order: 3 },
    { name: 'Team Mentoring', category: 'soft', proficiency: 'advanced', order: 4 },
    // Languages
    { name: 'English', category: 'language', proficiency: 'expert', order: 1 },
    { name: 'Arabic', category: 'language', proficiency: 'advanced', order: 2 },
    { name: 'French', category: 'language', proficiency: 'intermediate', order: 3 },
  ];

  for (const s of skills) {
    await prisma.skill.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }
  console.log('✓ Skills (23 total)');

  // ─── Education ────────────────────────────────────────────────────────────
  const education = [
    { degree: 'Master of Architecture', field: 'Advanced Architectural Design', institution: 'Architectural Association School of Architecture', startYear: 2012, endYear: 2014, description: 'Research focus on parametric urbanism and climate-responsive facade systems. Thesis: "Adaptive Facades in Extreme Climates."', order: 1 },
    { degree: 'Bachelor of Architecture (Honours)', field: 'Architecture', institution: 'University of Cairo — Faculty of Fine Arts', startYear: 2007, endYear: 2012, description: 'First Class Honours. Dean\'s List for five consecutive years. Awarded the Faculty Prize for Outstanding Graduate Design Project.', order: 2 },
    { degree: 'Executive Programme', field: 'Real Estate Development', institution: 'Harvard Graduate School of Design', startYear: 2018, endYear: 2018, description: 'Intensive executive education programme covering real estate development, investment, and market analysis.', order: 3 },
  ];

  for (const e of education) {
    const existing = await prisma.education.findFirst({ where: { degree: e.degree, institution: e.institution } });
    if (!existing) await prisma.education.create({ data: e });
  }
  console.log('✓ Education');

  // ─── Experience ───────────────────────────────────────────────────────────
  const experience = [
    { position: 'Founder & Principal Architect', company: 'ARQIVA Studio & Design', startDate: new Date('2016-01-01'), isCurrentRole: true, description: 'Founded ARQIVA with a vision to create a design studio that operates at the intersection of luxury, sustainability, and technical innovation.', achievements: 'Built studio from 2 to 40 professionals\nDelivered 60+ projects in 20 countries\n$2B+ of built work\nMultiple international awards', order: 1 },
    { position: 'Associate Principal', company: 'Zaha Hadid Architects', startDate: new Date('2014-06-01'), endDate: new Date('2015-12-31'), isCurrentRole: false, description: 'Led design development for major cultural and civic projects across the Middle East and Asia.', achievements: 'Project lead on $1.2B cultural centre in Riyadh\nManaged team of 12 designers\nCo-authored three built projects', order: 2 },
    { position: 'Senior Architect', company: 'Foster + Partners', startDate: new Date('2010-09-01'), endDate: new Date('2014-05-31'), isCurrentRole: false, description: 'Specialist in sustainable tall buildings and complex mixed-use developments.', achievements: 'Technical lead on three super-tall towers\nDeveloped practice-wide BIM standards\nDesigned and delivered 4 award-winning projects', order: 3 },
  ];

  for (const e of experience) {
    const existing = await prisma.experience.findFirst({ where: { position: e.position, company: e.company } });
    if (!existing) await prisma.experience.create({ data: e });
  }
  console.log('✓ Experience');

  // ─── Update Settings ──────────────────────────────────────────────────────
  await prisma.settings.updateMany({
    data: {
      companyName: 'ARQIVA Studio & Design',
      description: 'A luxury architecture and interior design studio operating globally. We create spaces that inspire, endure, and elevate the human experience — from concept through completion.',
      mission: 'To craft architectural experiences that transcend the ordinary — spaces that are both functionally superior and aesthetically timeless.',
      vision: 'To be the most respected architecture and design studio in the world, known for buildings and interiors of lasting cultural significance.',
      values: 'Excellence without compromise.\nAuthenticity in every detail.\nSustainability as obligation.\nCreativity as discipline.',
      designPhilosophy: 'We believe that the most enduring architecture emerges from a deep understanding of place, culture, and the people who inhabit a space. Every project begins with listening.',
      phone: '+971 4 123 4567',
      whatsapp: '+971501234567',
      email: 'studio@arqivastudio.com',
      address: 'Gate District 7, DIFC, Dubai, UAE',
      location: 'Dubai, UAE',
      seoTitle: 'ARQIVA Studio & Design — Luxury Architecture & Interior Design',
      seoDescription: 'Award-winning architecture and interior design studio creating exceptional spaces globally. From concept to completion.',
      seoKeywords: 'architecture, interior design, luxury design, architectural firm, Dubai architect, award-winning architecture',
      footerText: 'Designing Spaces That Inspire',
      copyrightText: `© ${new Date().getFullYear()} ARQIVA Studio & Design. All rights reserved.`,
      linkedIn: 'https://linkedin.com/company/arqiva',
      instagram: 'https://instagram.com/arqivastudio',
      behance: 'https://behance.net/arqivastudio',
    },
  });
  console.log('✓ Settings updated');

  console.log('\n✅ Expanded seed complete!');
  console.log('   Architecture Projects: 10');
  console.log('   Interior Design Projects: 10');
  console.log('   Services: 10');
  console.log('   Awards: 10');
  console.log('   Testimonials: 10');
  console.log('   Skills: 23');
  console.log('   Education: 3 records');
  console.log('   Experience: 3 records');

  // Packages
  await prisma.package.deleteMany({});
  const pkgData = [
    {
      title: 'Essentials',
      description: 'Ideal for compact residential and boutique commercial spaces seeking a refined design direction.',
      price: 5000,
      currency: 'USD',
      duration: '4–6 weeks',
      features: JSON.stringify(['Initial concept development', 'Space planning & layout', 'Material palette curation', 'Mood board & 3D renders (up to 5 views)', '2 revision rounds']),
      includedServices: JSON.stringify(['Concept Design', 'Space Planning', '3D Visualization']),
      featured: false,
      published: true,
      order: 1,
    },
    {
      title: 'Signature',
      description: 'Our most popular package for full-service residential and commercial projects with premium deliverables.',
      price: 15000,
      currency: 'USD',
      duration: '8–12 weeks',
      features: JSON.stringify(['Full architectural concept & design', 'Detailed construction drawings', 'Interior design & FF&E selection', '3D renders + walkthrough animation', 'Site supervision (up to 6 visits)', 'Contractor coordination', '4 revision rounds']),
      includedServices: JSON.stringify(['Architecture', 'Interior Design', 'FF&E', 'Construction Drawings', 'Site Supervision']),
      featured: true,
      published: true,
      order: 2,
    },
    {
      title: 'Prestige',
      description: 'Bespoke, white-glove service for luxury villas, flagship retail, and landmark hospitality projects.',
      price: null,
      currency: 'USD',
      duration: 'Custom timeline',
      features: JSON.stringify(['Tailored scope for any project scale', 'Full BIM documentation', 'Custom furniture & millwork design', 'Photorealistic CGI & VR walkthrough', 'Unlimited revisions', 'Dedicated project manager', 'Full procurement management', 'Post-handover support (3 months)']),
      includedServices: JSON.stringify(['Full Architecture', 'Interior Design', 'BIM', 'Custom Furniture', 'Procurement', 'Project Management']),
      featured: false,
      published: true,
      order: 3,
    },
  ];
  for (const pkg of pkgData) {
    await prisma.package.create({ data: pkg });
  }
  console.log('   Packages: 3');
}

main()
  .catch(e => { console.error('Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
