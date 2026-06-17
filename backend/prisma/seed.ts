import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ARQIVA database...');

  // ─── Admin User ────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@123456', 12);
  await prisma.user.upsert({
    where: { email: 'admin@arqivastudio.com' },
    update: {},
    create: {
      email: 'admin@arqivastudio.com',
      password: hashedPassword,
      firstName: 'ARQIVA',
      lastName: 'Admin',
      role: 'admin',
      isActive: true,
    },
  });
  console.log('✓ Admin user');

  // ─── Settings ──────────────────────────────────────────────────────────────
  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        companyName: 'ARQIVA Studio',
        tagline: 'Architecture & Interior Design',
        heroTitle: 'We Create Spaces',
        heroTitleAr: 'نصنع فضاءات',
        heroAccent: 'That Inspire',
        heroAccentAr: 'تُلهم وتبهر',
        heroLabel: 'Premium Architecture Studio',
        heroSubtitle:
          'Award-winning architecture and interior design studio crafting timeless environments across the UAE and GCC. From concept to completion, every detail tells a story.',
        heroSubtitleAr:
          'استوديو معماري حائز على جوائز يصنع بيئات خالدة عبر الإمارات ومنطقة الخليج. من الفكرة إلى الإنجاز، كل تفصيل يحكي قصة.',
        heroCta1Text: 'View Our Projects',
        heroCta1Url: '/projects',
        heroCta2Text: 'Start a Project',
        heroCta2Url: '/contact',
        statProjects: 47,
        statCountries: 6,
        statValue: '2.4B+',
        heroImage:
          'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=85',
        profileImage:
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
        description:
          'ARQIVA Studio is a premier architecture and interior design firm based in Dubai, UAE. Founded on the belief that great architecture shapes human experience, we deliver transformative spaces that blend aesthetic vision with functional excellence.',
        descriptionAr:
          'أرقيفا ستوديو هو مكتب معماري وتصميم داخلي رائد مقره دبي، الإمارات العربية المتحدة. تأسس على الاعتقاد بأن الهندسة المعمارية العظيمة تشكل التجربة الإنسانية.',
        mission:
          'To design spaces that elevate human experience through thoughtful architecture, sustainable practices, and meticulous attention to detail.',
        missionAr:
          'تصميم فضاءات ترفع من التجربة الإنسانية من خلال الهندسة المعمارية المتأنية والممارسات المستدامة والاهتمام الدقيق بالتفاصيل.',
        vision:
          'To be the most influential architecture studio in the MENA region, recognized for designs that stand the test of time.',
        visionAr:
          'أن نكون أكثر استوديو معماري تأثيراً في منطقة الشرق الأوسط وشمال أفريقيا.',
        values:
          'Excellence · Integrity · Innovation · Sustainability · Client-First',
        valuesAr:
          'التميز · النزاهة · الابتكار · الاستدامة · العميل أولاً',
        designPhilosophy:
          'Architecture is the art of how to waste space with elegance. We believe every line drawn, every material chosen, and every space crafted must serve a higher purpose — to inspire, to shelter, and to endure.',
        designPhilosophyAr:
          'الهندسة المعمارية هي فن كيفية إهدار المساحة بأناقة. نؤمن بأن كل خط يُرسم وكل مادة تُختار يجب أن تخدم غرضاً أسمى.',
        phone: '+971 4 XXX XXXX',
        whatsapp: '+971 50 XXX XXXX',
        email: 'hello@arqivastudio.com',
        address: 'Level 14, Boulevard Plaza Tower 1, Downtown Dubai, UAE',
        addressAr: 'المستوى 14، برج بولفارد بلازا 1، وسط مدينة دبي، الإمارات',
        location: 'Dubai, United Arab Emirates',
        googleMapUrl: 'https://maps.google.com/?q=Downtown+Dubai',
        workingHours: 'Sunday – Thursday: 9:00 AM – 6:00 PM',
        instagram: 'https://instagram.com/arqivastudio',
        linkedIn: 'https://linkedin.com/company/arqivastudio',
        facebook: 'https://facebook.com/arqivastudio',
        behance: 'https://behance.net/arqivastudio',
        pinterest: 'https://pinterest.com/arqivastudio',
        youtube: 'https://youtube.com/@arqivastudio',
        seoTitle: 'ARQIVA Studio — Architecture & Interior Design Dubai',
        seoDescription:
          'Award-winning architecture and interior design studio in Dubai. Residential, commercial, hospitality and mixed-use projects across UAE and GCC.',
        seoKeywords:
          'architecture dubai, interior design uae, luxury architect, residential design, commercial architecture, hospitality design',
        footerText:
          'Crafting architectural experiences that stand the test of time.',
        footerTextAr: 'نصنع تجارب معمارية تصمد أمام اختبار الزمن.',
        copyrightText: '© 2025 ARQIVA Studio. All rights reserved.',
      },
    });
    console.log('✓ Settings');
  } else {
    console.log('⏩ Settings already exist, skipping');
  }

  // ─── Categories ────────────────────────────────────────────────────────────
  const categories = [
    { name: 'Residential', nameAr: 'سكني', slug: 'residential', description: 'Private villas, apartments, and luxury homes', icon: '🏡', order: 1 },
    { name: 'Commercial', nameAr: 'تجاري', slug: 'commercial', description: 'Office buildings, retail spaces, and business centers', icon: '🏢', order: 2 },
    { name: 'Hospitality', nameAr: 'ضيافة', slug: 'hospitality', description: 'Hotels, resorts, restaurants, and leisure facilities', icon: '🏨', order: 3 },
    { name: 'Interior Design', nameAr: 'تصميم داخلي', slug: 'interior-design', description: 'Bespoke interiors for residential and commercial spaces', icon: '🛋️', order: 4 },
    { name: 'Mixed-Use', nameAr: 'متعدد الاستخدامات', slug: 'mixed-use', description: 'Integrated developments combining multiple functions', icon: '🏙️', order: 5 },
    { name: 'Urban Design', nameAr: 'تصميم حضري', slug: 'urban-design', description: 'Master planning and urban development projects', icon: '🌆', order: 6 },
  ];

  const categoryMap: Record<string, number> = {};
  for (const cat of categories) {
    const result = await prisma.projectCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = result.id;
  }
  console.log('✓ Categories');

  // ─── Services ──────────────────────────────────────────────────────────────
  const services = [
    {
      name: 'Architectural Design',
      nameAr: 'التصميم المعماري',
      slug: 'architectural-design',
      description: 'Comprehensive architectural design services from concept to construction documentation. We translate your vision into buildable, beautiful structures that exceed expectations.',
      descriptionAr: 'خدمات تصميم معماري شاملة من الفكرة إلى وثائق البناء. نترجم رؤيتك إلى هياكل قابلة للبناء وجميلة.',
      benefits: 'Full design package · 3D visualization · Construction documents · On-site supervision · Value engineering',
      icon: 'pencil-ruler',
      order: 1,
    },
    {
      name: 'Interior Design',
      nameAr: 'التصميم الداخلي',
      slug: 'interior-design',
      description: 'Bespoke interior environments that reflect your personality and lifestyle. From furniture selection to lighting design, we curate every detail.',
      descriptionAr: 'بيئات داخلية مصممة خصيصاً تعكس شخصيتك وأسلوب حياتك.',
      benefits: 'Space planning · Material selection · Custom furniture · Lighting design · Art curation',
      icon: 'sofa',
      order: 2,
    },
    {
      name: 'Urban Planning',
      nameAr: 'التخطيط العمراني',
      slug: 'urban-planning',
      description: 'Strategic master planning and urban design solutions that create vibrant, sustainable communities.',
      descriptionAr: 'حلول التخطيط العمراني الاستراتيجي التي تخلق مجتمعات نابضة بالحياة ومستدامة.',
      benefits: 'Master planning · Zoning studies · Infrastructure design · Community engagement',
      icon: 'map',
      order: 3,
    },
    {
      name: 'Project Management',
      nameAr: 'إدارة المشاريع',
      slug: 'project-management',
      description: 'End-to-end project management ensuring your vision is realized on time, within budget, and to the highest quality standards.',
      descriptionAr: 'إدارة شاملة للمشروع من البداية إلى النهاية لضمان تحقيق رؤيتك في الوقت المحدد وضمن الميزانية.',
      benefits: 'Cost control · Timeline management · Quality assurance · Contractor coordination',
      icon: 'clipboard-list',
      order: 4,
    },
    {
      name: 'Sustainable Design',
      nameAr: 'التصميم المستدام',
      slug: 'sustainable-design',
      description: 'Environmentally responsible design solutions that minimize impact while maximizing performance and beauty.',
      descriptionAr: 'حلول تصميم مسؤولة بيئياً تقلل من الأثر البيئي مع تعظيم الأداء والجمال.',
      benefits: 'LEED/BREEAM consulting · Energy modeling · Green materials · Solar design · Water efficiency',
      icon: 'leaf',
      order: 5,
    },
    {
      name: '3D Visualization',
      nameAr: 'التصور ثلاثي الأبعاد',
      slug: '3d-visualization',
      description: 'Photorealistic renders and immersive virtual tours that bring designs to life before a single brick is laid.',
      descriptionAr: 'عروض مصورة فوتوغرافية وجولات افتراضية غامرة تحيي التصاميم قبل وضع أي حجر.',
      benefits: 'Photorealistic renders · 360° virtual tours · Animated walkthroughs · VR experiences',
      icon: 'cube',
      order: 6,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log('✓ Services');

  // ─── Awards ────────────────────────────────────────────────────────────────
  const awards = [
    { title: 'Best Residential Architecture', description: 'Recognized for the Al Barari Private Villa — a masterpiece of desert-contemporary design', issuer: 'MENA Architecture Awards', year: 2024, category: 'Residential', featured: true },
    { title: 'Sustainable Design Excellence', description: 'Awarded for our commitment to net-zero design principles across commercial projects', issuer: 'Gulf Sustainability Awards', year: 2024, category: 'Sustainability', featured: true },
    { title: 'Interior Design of the Year', description: 'Peninsula Tower Penthouse — blending Emirati heritage with contemporary luxury', issuer: 'Dubai Design Week', year: 2023, category: 'Interior', featured: true },
    { title: 'Emerging Studio of the Year', description: 'Recognized as the most impactful new architecture practice in the UAE', issuer: 'Middle East Architect Magazine', year: 2023, category: 'Studio', featured: false },
    { title: 'Commercial Project Award', description: 'Skyline Corporate HQ — redefining the future of workplace architecture', issuer: 'Arabian Property Awards', year: 2022, category: 'Commercial', featured: true },
    { title: 'Community Design Award', description: 'Al Qudra Cultural Village master plan — celebrating heritage through modern design', issuer: 'UAE Ministry of Culture', year: 2022, category: 'Urban', featured: false },
  ];

  for (const award of awards) {
    const exists = await prisma.award.findFirst({ where: { title: award.title, year: award.year } });
    if (!exists) {
      await prisma.award.create({ data: award });
    }
  }
  console.log('✓ Awards');

  // ─── Projects ──────────────────────────────────────────────────────────────
  const projectsData = [
    {
      title: 'Al Barari Private Villa',
      titleAr: 'فيلا البراري الخاصة',
      slug: 'al-barari-private-villa',
      description: 'A 1,200m² private residence nestled within the lush greenery of Al Barari, Dubai — where nature and architecture speak the same language.',
      descriptionAr: 'مقر إقامة خاص بمساحة 1200 متر مربع يقع في وسط الخضرة الغنية في البراري، دبي.',
      projectStory: 'The client came to us with a singular brief: create a home that disappears into its landscape. Set on 3,500m² of mature gardens, the villa was designed to feel like an extension of the natural world around it. Floor-to-ceiling glazing dissolves the boundary between interior and exterior, while a palette of raw limestone, teak, and handmade plaster connects the building to its environment.',
      designConcept: 'Desert-contemporary architecture that celebrates the dialogue between built form and natural landscape. The form is derived from sand dune geometries, softened and refined into livable poetry.',
      challenges: 'Achieving thermal comfort in Dubai\'s climate while maintaining the expansive glass facades required deep facade engineering. Underground mechanical systems were used to preserve clean elevations.',
      solutions: 'Triple-glazed electrochromic glass panels automatically adjust opacity based on solar angle. A geothermal cooling system buried beneath the garden reduces HVAC energy consumption by 40%.',
      clientName: 'Sheikh Mohammed Al Rashidi',
      clientCompany: 'Private Residence',
      country: 'UAE',
      city: 'Dubai',
      projectArea: '1,200 m²',
      status: 'completed',
      budget: 'AED 18M',
      duration: '28 months',
      year: 2024,
      featured: true,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85',
      categorySlug: 'residential',
    },
    {
      title: 'Skyline Corporate Headquarters',
      titleAr: 'المقر الرئيسي لشركة سكايلاين',
      slug: 'skyline-corporate-headquarters',
      description: 'A 45-storey mixed-use tower in Dubai\'s DIFC that redefines the modern workplace through biophilic design and flexible floor plates.',
      descriptionAr: 'برج متعدد الاستخدامات من 45 طابقاً في مركز دبي المالي العالمي يُعيد تعريف بيئة العمل الحديثة.',
      projectStory: 'Skyline Partners wanted a headquarters that would attract top talent in a competitive market. The tower was conceived around a central sky garden — a six-storey atrium that brings daylight 30 floors deep into the building\'s core, creating a vertical park that employees gather around throughout the day.',
      designConcept: 'The tower\'s diagrid structure is both structural and expressive, reducing steel tonnage by 22% while creating a distinctive silhouette on the Dubai skyline. The facade pattern references geometric Islamic art, abstracted through a contemporary lens.',
      challenges: 'Coordinating the sky garden atrium with fire code compliance and structural requirements across multiple floors was the project\'s central engineering challenge.',
      solutions: 'A proprietary smoke management system designed with fire safety consultants enabled the 30m void. The diagrid structure was computed using parametric tools to optimize every node.',
      clientName: 'David Chen',
      clientCompany: 'Skyline Capital Partners',
      country: 'UAE',
      city: 'Dubai',
      projectArea: '68,400 m²',
      status: 'completed',
      budget: 'AED 340M',
      duration: '48 months',
      year: 2023,
      featured: true,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=85',
      categorySlug: 'commercial',
    },
    {
      title: 'Peninsula Tower Penthouse',
      titleAr: 'بنتهاوس برج بينينسولا',
      slug: 'peninsula-tower-penthouse',
      description: 'A 640m² sky residence at the apex of one of Dubai Marina\'s most prestigious towers — a study in how luxury can be both opulent and restrained.',
      descriptionAr: 'مسكن سماوي بمساحة 640 متراً مربعاً في قمة أحد أرقى أبراج دبي مارينا.',
      projectStory: 'The brief was to create a home that felt as expansive as the panoramic views it commanded. We stripped away everything unnecessary, allowing the 270° views of the Marina, Palm Jumeirah, and the Arabian Gulf to become the primary design element. The interiors are composed in negative space — every surface, every piece of furniture was chosen to recede, letting the city be the art.',
      designConcept: 'Emirati heritage motifs filtered through a contemporary Japanese minimalist lens. Hand-carved mashrabiya screens in blackened steel reference traditional Arabic architecture while functioning as privacy screens and solar shading.',
      challenges: 'All materials, furniture, and fixtures needed to be craned into the building on the penthouse floors. Coordinating deliveries around the residential tower\'s operations required meticulous logistics planning.',
      solutions: 'A phased delivery schedule was developed in partnership with the building management. Custom furniture was fabricated in two sections and assembled on-site.',
      clientName: 'Fatima Al Mansoori',
      clientCompany: 'Private Residence',
      country: 'UAE',
      city: 'Dubai',
      projectArea: '640 m²',
      status: 'completed',
      budget: 'AED 12M',
      duration: '18 months',
      year: 2023,
      featured: true,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=85',
      categorySlug: 'interior-design',
    },
    {
      title: 'Oasis Resort & Spa',
      titleAr: 'منتجع واحة وسبا',
      slug: 'oasis-resort-spa',
      description: 'A 240-key luxury resort in Ras Al Khaimah that reimagines the ancient desert caravanserai for the 21st century traveler.',
      descriptionAr: 'منتجع فاخر من 240 غرفة في رأس الخيمة يُعيد تصور خان القوافل الصحراوي القديم للمسافر في القرن الحادي والعشرين.',
      projectStory: 'Set against the dramatic Hajar Mountains, the Oasis Resort celebrates the drama of the Emirati landscape. The master plan is organized around a central wadi — an artificial valley garden that channels cooling breezes through the resort. All 240 keys are pavilion-style, ensuring every room has a private garden and unobstructed mountain views.',
      designConcept: 'The architecture draws from the earth tones and forms of the Hajar Mountains — rough-hewn sandstone, rammed earth walls, and palm-thatch brise-soleil create buildings that feel grown from the desert floor.',
      challenges: 'The site\'s rocky terrain presented significant foundation challenges. The natural topography needed to be preserved as much as possible to avoid disturbing the ecosystem.',
      solutions: 'A hillside foundation system using micro-piles allowed buildings to be placed on steep slopes without major earthworks. Rainwater harvesting from the mountains now supplies 60% of the resort\'s landscape irrigation.',
      clientName: 'Omar Hassan',
      clientCompany: 'Oasis Hospitality Group',
      country: 'UAE',
      city: 'Ras Al Khaimah',
      projectArea: '42,000 m²',
      status: 'completed',
      budget: 'AED 220M',
      duration: '42 months',
      year: 2024,
      featured: true,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=85',
      categorySlug: 'hospitality',
    },
    {
      title: 'Al Qudra Cultural Village',
      titleAr: 'قرية القدرة الثقافية',
      slug: 'al-qudra-cultural-village',
      description: 'A 28-hectare master-planned cultural precinct celebrating Emirati heritage through contemporary architectural expression.',
      descriptionAr: 'منطقة ثقافية مخططة بمساحة 28 هكتاراً تحتفي بالتراث الإماراتي من خلال التعبير المعماري المعاصر.',
      projectStory: 'Commissioned by the UAE Ministry of Culture, the Al Qudra Cultural Village was envisioned as a living museum of Emirati traditions. The master plan is organized around seven courtyards, each dedicated to a different aspect of Emirati culture: poetry, falconry, camel racing, pearl diving, crafts, music, and cuisine.',
      designConcept: 'A vocabulary of wind towers, courtyard houses, and colonnaded souqs — all the typologies of traditional Arabian settlements — reinterpreted through contemporary materials and technologies.',
      challenges: 'Designing for both preservation and accessibility: the site needed to function as a living cultural destination while protecting its historical artifacts.',
      solutions: 'A modular building system using precast concrete panels printed with traditional geometric patterns allows future phases to be added as the village grows.',
      clientName: 'H.E. Dr. Ahmad Al Mulla',
      clientCompany: 'UAE Ministry of Culture',
      country: 'UAE',
      city: 'Dubai',
      projectArea: '280,000 m²',
      status: 'completed',
      budget: 'AED 680M',
      duration: '60 months',
      year: 2022,
      featured: true,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&q=85',
      categorySlug: 'urban-design',
    },
    {
      title: 'Burj Khalifa District Residences',
      titleAr: 'مساكن حي برج خليفة',
      slug: 'burj-khalifa-district-residences',
      description: 'A luxury residential complex comprising three interconnected towers, creating a vertical neighborhood at the heart of Downtown Dubai.',
      descriptionAr: 'مجمع سكني فاخر يضم ثلاثة أبراج مترابطة، يخلق حياً عمودياً في قلب وسط مدينة دبي.',
      projectStory: 'The project brief called for a residential development that could hold its own against the most iconic skyline in the world. The three towers are connected at levels 18 and 36 by sky bridges housing amenities — pools, gyms, and sky gardens — bringing the community together vertically.',
      designConcept: 'The towers step back as they rise, creating terraced gardens on every third level and reducing wind loads at height. The facade uses a deep vertical fins system that filters the harsh afternoon sun while framing views of the Burj Khalifa.',
      challenges: 'Designing within the Downtown Dubai master plan\'s strict height and setback controls while maximizing floor area ratio required extensive negotiation with planning authorities.',
      solutions: 'The sky bridge strategy was key: by concentrating amenities in bridges rather than podiums, we freed up the ground plane for public space and activated the street level.',
      clientName: 'Emaar Properties',
      clientCompany: 'Emaar Development',
      country: 'UAE',
      city: 'Dubai',
      projectArea: '124,600 m²',
      status: 'in-progress',
      budget: 'AED 950M',
      duration: '54 months',
      year: 2025,
      featured: false,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85',
      categorySlug: 'mixed-use',
    },
    {
      title: 'Saadiyat Beach House',
      titleAr: 'بيت شاطئ سعديات',
      slug: 'saadiyat-beach-house',
      description: 'A contemporary beach villa on Saadiyat Island, Abu Dhabi, designed to maximize the dialogue between architecture, sea, and sky.',
      descriptionAr: 'فيلا شاطئية معاصرة في جزيرة السعديات، أبوظبي، صُممت لتعظيم الحوار بين العمارة والبحر والسماء.',
      projectStory: 'The client, a prominent Abu Dhabi family, wanted a beach retreat that felt as open and free as the sea itself. The house is organized around a single long axis — a visual corridor that draws the eye from the entry gate straight through the living spaces and out to the Arabian Gulf. Everything folds away to create an indoor-outdoor living experience.',
      designConcept: 'Monolithic white forms inspired by the bleached coral formations of the Gulf coast. The architecture is deliberately quiet, serving as a neutral canvas against which the colors of the sea and sky can perform.',
      challenges: 'The coastal site required marine-grade specifications for all materials and robust salt-spray protection for the facade elements.',
      solutions: 'A marine-grade aluminum cladding system with concealed fasteners was developed with a specialist manufacturer. All steelwork is hot-dip galvanized and powder-coated.',
      clientName: 'Al Nahyan Family',
      clientCompany: 'Private Residence',
      country: 'UAE',
      city: 'Abu Dhabi',
      projectArea: '820 m²',
      status: 'completed',
      budget: 'AED 22M',
      duration: '24 months',
      year: 2023,
      featured: false,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1200&q=85',
      categorySlug: 'residential',
    },
    {
      title: 'The Boardwalk F&B Destination',
      titleAr: 'وجهة بوردووك للمأكولات والمشروبات',
      slug: 'the-boardwalk-fnb-destination',
      description: 'A 2.4km waterfront F&B promenade at Dubai Creek Harbour, featuring 18 restaurant pavilions emerging from the water on stilts.',
      descriptionAr: 'ممشى للمأكولات والمشروبات على الواجهة البحرية بطول 2.4 كيلومتر في خور دبي هاربر، يضم 18 جناحاً يطفو فوق الماء على ركائز.',
      projectStory: 'The developer wanted a dining destination that would become the social heart of Dubai Creek Harbour. Rather than a conventional mall, we proposed a series of individual restaurant pavilions emerging from the water on timber stilts — each with its own architectural character, connected by a continuous boardwalk.',
      designConcept: 'Maritime industrial vernacular meets contemporary craft. Weathered timber, oxidized copper, and marine-grade steel create a visual language that feels both authentic and timeless.',
      challenges: 'Designing 18 pavilions that each had individual identities while reading as a coherent destination required a sophisticated design control framework.',
      solutions: 'A design code established a shared material palette and dimensional framework within which each pavilion architect could express their individual vision.',
      clientName: 'Emaar Hospitality',
      clientCompany: 'Emaar Group',
      country: 'UAE',
      city: 'Dubai',
      projectArea: '14,800 m²',
      status: 'completed',
      budget: 'AED 85M',
      duration: '30 months',
      year: 2024,
      featured: false,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85',
      categorySlug: 'hospitality',
    },
    {
      title: 'Riyadh Financial District Office Park',
      titleAr: 'حديقة مكاتب حي الرياض المالي',
      slug: 'riyadh-financial-district-office',
      description: 'A four-building commercial campus in Riyadh\'s King Abdullah Financial District, designed around a shaded public garden.',
      descriptionAr: 'حرم تجاري من أربعة مبانٍ في حي الملك عبدالله المالي بالرياض، مصمم حول حديقة عامة مظللة.',
      projectStory: 'KAFD needed commercial space that would attract international tenants to Riyadh. The campus master plan centers on a shaded linear garden — a 180m pergola-covered outdoor room that connects all four buildings and provides a rare outdoor amenity in the Saudi climate.',
      designConcept: 'A contemporary interpretation of the traditional Najdi architecture: thick masonry walls, small apertures on the desert-facing elevations, and generous courtyard spaces on the shaded interior faces.',
      challenges: 'Saudi Arabia\'s Vision 2030 development pace meant the project program changed significantly during design. The buildings needed to be adaptable to either office, residential, or mixed-use.',
      solutions: 'All four buildings were designed with a structural grid and floor plate depth that can accommodate residential, hospitality, or office fit-outs without structural modification.',
      clientName: 'Hamad Al Dossary',
      clientCompany: 'KAFD Development Authority',
      country: 'Saudi Arabia',
      city: 'Riyadh',
      projectArea: '96,000 m²',
      status: 'in-progress',
      budget: 'SAR 680M',
      duration: '56 months',
      year: 2025,
      featured: false,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85',
      categorySlug: 'commercial',
    },
    {
      title: 'Desert Dunes Boutique Hotel',
      titleAr: 'فندق كثبان الصحراء البوتيك',
      slug: 'desert-dunes-boutique-hotel',
      description: 'An 18-suite eco-luxury hotel in the Dubai desert, where each suite is buried partially below ground to maintain thermal mass.',
      descriptionAr: 'فندق بوتيك فاخر من 18 جناحاً في صحراء دبي، حيث يُدفن كل جناح جزئياً تحت الأرض للحفاظ على الكتلة الحرارية.',
      projectStory: 'The brief was radical: create a luxury hotel that produces no net carbon. The solution was inspired by the underground dwellings of Matmata, Tunisia — semi-subterranean rooms cooled by the earth itself. Each suite descends 1.2m below grade, reducing cooling loads by 35% compared to above-grade construction.',
      designConcept: 'Earthship meets desert luxury. The buildings grow from the dunes, their rooflines mimicking the natural topography so that from above, the hotel is nearly invisible.',
      challenges: 'Convincing a luxury hospitality operator that partially subterranean suites would not feel claustrophobic required extensive mock-up testing with focus groups.',
      solutions: 'Full-height clerestory windows on the shaded northern elevations, combined with polished steel light-scoop ceiling elements, flood the rooms with diffuse daylight without direct solar gain.',
      clientName: 'Rami Abdallah',
      clientCompany: 'Desert Experiences LLC',
      country: 'UAE',
      city: 'Dubai',
      projectArea: '8,400 m²',
      status: 'completed',
      budget: 'AED 45M',
      duration: '22 months',
      year: 2022,
      featured: false,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&q=85',
      categorySlug: 'hospitality',
    },
  ];

  const projectIds: Record<string, number> = {};
  for (const proj of projectsData) {
    const { categorySlug, ...data } = proj;
    const categoryId = categoryMap[categorySlug] ?? null;
    const existing = await prisma.project.findUnique({ where: { slug: proj.slug } });
    if (!existing) {
      const created = await prisma.project.create({
        data: { ...data, categoryId, views: Math.floor(Math.random() * 400) + 50, likes: Math.floor(Math.random() * 80) + 10 },
      });
      projectIds[proj.slug] = created.id;
    } else {
      projectIds[proj.slug] = existing.id;
    }
  }
  console.log('✓ Projects');

  // ─── Gallery Images ─────────────────────────────────────────────────────────
  const galleryData: Record<string, string[]> = {
    'al-barari-private-villa': [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80',
    ],
    'skyline-corporate-headquarters': [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    ],
    'peninsula-tower-penthouse': [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80',
      'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&q=80',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    ],
    'oasis-resort-spa': [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
      'https://images.unsplash.com/photo-1540541338537-f24b4f3e3a4b?w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
      'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1200&q=80',
    ],
    'al-qudra-cultural-village': [
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80',
    ],
  };

  for (const [slug, images] of Object.entries(galleryData)) {
    const pid = projectIds[slug];
    if (!pid) continue;
    const existingCount = await prisma.projectImage.count({ where: { projectId: pid } });
    if (existingCount === 0) {
      await prisma.projectImage.createMany({
        data: images.map((url, i) => ({ projectId: pid, imageUrl: url, order: i, galleryName: 'main' })),
      });
    }
  }
  console.log('✓ Gallery images');

  // ─── Testimonials ──────────────────────────────────────────────────────────
  const testimonialsData = [
    {
      clientName: 'Sheikh Mohammed Al Rashidi',
      clientPosition: 'Owner',
      companyName: 'Private Residence',
      rating: 5,
      testimonial: 'ARQIVA delivered a home that exceeded every expectation. Their ability to listen — truly listen — to our needs and translate that into architecture is extraordinary. The villa feels timeless, and every detail was considered with care.',
      testimonialAr: 'قدّمت أرقيفا منزلاً تجاوز كل توقعاتنا. قدرتهم على الاستماع الحقيقي لاحتياجاتنا وترجمة ذلك إلى عمارة هي قدرة استثنائية.',
      featured: true,
      slug: 'al-barari-private-villa',
    },
    {
      clientName: 'David Chen',
      clientPosition: 'CEO',
      companyName: 'Skyline Capital Partners',
      rating: 5,
      testimonial: 'The Skyline HQ has become a genuine competitive advantage for us. We attract better talent, our clients are impressed when they visit, and the space genuinely elevates the way we work. ARQIVA understood our business as much as our architecture.',
      testimonialAr: 'أصبح مقر سكايلاين ميزة تنافسية حقيقية لنا. نجذب مواهب أفضل، عملاؤنا مبهورون في زياراتهم، والمساحة ترفع فعلاً طريقة عملنا.',
      featured: true,
      slug: 'skyline-corporate-headquarters',
    },
    {
      clientName: 'Fatima Al Mansoori',
      clientPosition: 'Owner',
      companyName: 'Private Residence',
      rating: 5,
      testimonial: 'Living in the penthouse is a daily reminder of what great architecture does to your life. ARQIVA created something that feels both intimate and grand — a home that grows with you. Worth every dirham.',
      testimonialAr: 'العيش في البنتهاوس هو تذكير يومي بما تفعله العمارة العظيمة بحياتك. خلقت أرقيفا شيئاً يشعر بأنه حميمي وفخم في آنٍ واحد.',
      featured: true,
      slug: 'peninsula-tower-penthouse',
    },
    {
      clientName: 'Omar Hassan',
      clientPosition: 'Managing Director',
      companyName: 'Oasis Hospitality Group',
      rating: 5,
      testimonial: 'The Oasis Resort has won awards and the reviews speak for themselves. But what I appreciate most is that ARQIVA\'s design is as beautiful five years later as the day it opened. They build for the long term.',
      testimonialAr: 'فاز منتجع الواحة بجوائز والتقييمات تتحدث عن نفسها. لكن ما أقدّره أكثر هو أن تصميم أرقيفا لا يزال جميلاً بعد خمس سنوات كما في يوم افتتاحه.',
      featured: true,
      slug: 'oasis-resort-spa',
    },
    {
      clientName: 'H.E. Dr. Ahmad Al Mulla',
      clientPosition: 'Director General',
      companyName: 'UAE Ministry of Culture',
      rating: 5,
      testimonial: 'Al Qudra Cultural Village has become one of the most visited cultural destinations in the country. ARQIVA\'s design brilliantly honors our heritage while creating an experience that resonates with international visitors.',
      testimonialAr: 'أصبحت قرية القدرة الثقافية من أكثر الوجهات الثقافية زيارةً في البلاد. يكرّم تصميم أرقيفا ببراعة تراثنا مع خلق تجربة تتصل مع الزوار الدوليين.',
      featured: true,
      slug: 'al-qudra-cultural-village',
    },
    {
      clientName: 'Rami Abdallah',
      clientPosition: 'Founder',
      companyName: 'Desert Experiences LLC',
      rating: 5,
      testimonial: 'ARQIVA took our crazy idea — a partially underground luxury hotel in the desert — and made it reality. The result is unlike anything else in the world, and it\'s fully booked every season. That\'s the power of great design.',
      testimonialAr: 'أخذت أرقيفا فكرتنا الجنونية — فندق فاخر تحت الأرض جزئياً في الصحراء — وحوّلتها إلى واقع. النتيجة لا مثيل لها في العالم، ومحجوز بالكامل كل موسم.',
      featured: false,
      slug: 'desert-dunes-boutique-hotel',
    },
  ];

  for (const t of testimonialsData) {
    const { slug, ...tData } = t;
    const projectId = slug ? projectIds[slug] : null;
    const exists = await prisma.testimonial.findFirst({ where: { clientName: t.clientName } });
    if (!exists) {
      await prisma.testimonial.create({ data: { ...tData, projectId: projectId ?? null } });
    }
  }
  console.log('✓ Testimonials');

  // ─── Skills ────────────────────────────────────────────────────────────────
  const skills = [
    { name: 'AutoCAD', category: 'Design Software', proficiency: 'expert', order: 1 },
    { name: 'Revit', category: 'Design Software', proficiency: 'expert', order: 2 },
    { name: 'Rhino 3D', category: 'Design Software', proficiency: 'advanced', order: 3 },
    { name: 'SketchUp', category: 'Design Software', proficiency: 'expert', order: 4 },
    { name: '3ds Max', category: 'Visualization', proficiency: 'advanced', order: 5 },
    { name: 'V-Ray', category: 'Visualization', proficiency: 'advanced', order: 6 },
    { name: 'Lumion', category: 'Visualization', proficiency: 'expert', order: 7 },
    { name: 'Grasshopper', category: 'Parametric Design', proficiency: 'intermediate', order: 8 },
    { name: 'Adobe Photoshop', category: 'Graphics', proficiency: 'advanced', order: 9 },
    { name: 'Adobe InDesign', category: 'Graphics', proficiency: 'advanced', order: 10 },
    { name: 'Project Management', category: 'Professional', proficiency: 'expert', order: 11 },
    { name: 'LEED Certification', category: 'Sustainability', proficiency: 'advanced', order: 12 },
  ];
  for (const skill of skills) {
    await prisma.skill.upsert({ where: { name: skill.name }, update: {}, create: skill });
  }
  console.log('✓ Skills');

  // ─── Education ─────────────────────────────────────────────────────────────
  const educations = [
    { degree: 'Master of Architecture', field: 'Urban Design & Sustainability', institution: 'Architectural Association School of Architecture, London', startYear: 2008, endYear: 2010, description: 'Specialized in parametric urbanism and sustainable design strategies for hot-arid climates.', order: 1 },
    { degree: 'Bachelor of Architecture (Hons)', field: 'Architecture', institution: 'American University of Sharjah', startYear: 2003, endYear: 2008, description: 'First class honours. Final thesis: Reimagining the Souq as a Contemporary Urban Typology.', order: 2 },
  ];
  for (const edu of educations) {
    const exists = await prisma.education.findFirst({ where: { institution: edu.institution } });
    if (!exists) await prisma.education.create({ data: edu });
  }
  console.log('✓ Education');

  // ─── Experience ─────────────────────────────────────────────────────────────
  const experiences = [
    { position: 'Founding Principal', company: 'ARQIVA Studio', startDate: new Date('2015-01-01'), isCurrentRole: true, description: 'Founded ARQIVA Studio with a vision to create architecture that elevates human experience. Led the studio from 3 to 45+ staff, delivering projects valued at over AED 2.4B.', achievements: '47 completed projects · 6 countries · 8 international awards', order: 1 },
    { position: 'Senior Associate', company: 'Zaha Hadid Architects, London', startDate: new Date('2010-06-01'), endDate: new Date('2014-12-31'), description: 'Led design development for major cultural and commercial projects in the MENA region.', achievements: 'Led UAE Pavilion at World Expo · Delivered Heydar Aliyev Centre interiors documentation', order: 2 },
    { position: 'Junior Architect', company: 'Atkins Middle East, Dubai', startDate: new Date('2008-09-01'), endDate: new Date('2010-05-31'), description: 'Worked on large-scale master planning and mixed-use development projects across the GCC.', achievements: 'Contributed to Dubai South master plan · Abu Dhabi 2030 Urban Structure Framework', order: 3 },
  ];
  for (const exp of experiences) {
    const exists = await prisma.experience.findFirst({ where: { company: exp.company } });
    if (!exists) await prisma.experience.create({ data: exp });
  }
  console.log('✓ Experience');

  // ─── Packages ──────────────────────────────────────────────────────────────
  const existingPackages = await prisma.package.findFirst().catch(() => null);
  if (!existingPackages) {
    // Check if Package model exists
    try {
      const pkgCount = await (prisma as any).package.count();
      if (pkgCount === 0) {
        await (prisma as any).package.createMany({
          data: [
            { name: 'Consultation', nameAr: 'استشارة', price: 'AED 2,500', description: 'A focused 90-minute design consultation with our lead architect. Ideal for clients in early stages of planning.', order: 1 },
            { name: 'Concept Design', nameAr: 'تصميم مفهومي', price: 'From AED 45,000', description: 'Full concept design package including site analysis, design brief, mood boards, concept sketches, and 3D massing model.', order: 2 },
            { name: 'Full Architectural Service', nameAr: 'خدمة معمارية كاملة', price: 'Custom', description: 'End-to-end architectural service from concept through construction supervision. Includes all design stages, documentation, and on-site management.', order: 3 },
            { name: 'Interior Design', nameAr: 'تصميم داخلي', price: 'From AED 120/m²', description: 'Comprehensive interior design service including space planning, material selection, custom furniture, lighting design, and procurement.', order: 4 },
          ],
        });
        console.log('✓ Packages');
      }
    } catch {
      console.log('⏩ Package model not found, skipping');
    }
  } else {
    console.log('⏩ Packages already exist, skipping');
  }

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
