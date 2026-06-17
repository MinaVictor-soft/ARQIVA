import { db } from "./index";
import bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Clear existing data
    console.log("Clearing existing data...");
    await db.testimonial.deleteMany();
    await db.comment.deleteMany();
    await db.projectFile.deleteMany();
    await db.projectVideo.deleteMany();
    await db.projectImage.deleteMany();
    await db.projectTool.deleteMany();
    await db.serviceExample.deleteMany();
    await db.project.deleteMany();
    await db.projectCategory.deleteMany();
    await db.service.deleteMany();
    await db.award.deleteMany();
    await db.education.deleteMany();
    await db.experience.deleteMany();
    await db.certification.deleteMany();
    await db.skill.deleteMany();
    await db.user.deleteMany();
    await db.settings.deleteMany();

    // Create admin user
    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123456", 10);
    await db.user.create({
      data: {
        email: process.env.ADMIN_EMAIL || "admin@arqivastudio.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        isActive: true,
      },
    });

    // Create settings
    console.log("Creating settings...");
    await db.settings.create({
      data: {
        companyName: "ARQIVA Studio & Design",
        description: "Premium architecture and interior design firm specializing in innovative and timeless spaces.",
        mission: "Transform spaces into experiences that inspire and delight our clients.",
        vision: "To be the leading architecture and design studio recognized for excellence and innovation.",
        values: "Innovation, Integrity, Excellence, Sustainability, Client-Centric",
        designPhilosophy: "We believe in designing spaces that are both beautiful and functional, with a focus on timeless elegance and human-centered design.",
        phone: "+1 (555) 123-4567",
        whatsapp: "+1 (555) 123-4567",
        email: "info@arqivastudio.com",
        address: "123 Design Avenue, Creative City, CC 12345",
        location: "Creative City",
        linkedIn: "https://linkedin.com/company/arqiva",
        instagram: "https://instagram.com/arqiva",
        facebook: "https://facebook.com/arqiva",
        behance: "https://behance.net/arqiva",
        seoTitle: "ARQIVA Studio & Design - Premium Architecture & Interior Design",
        seoDescription: "Discover award-winning architecture and interior design solutions by ARQIVA Studio & Design.",
        seoKeywords: "architecture, interior design, design studio, portfolio",
        footerText: "Designing Spaces That Inspire",
        copyrightText: "© 2024 ARQIVA Studio & Design. All rights reserved.",
      },
    });

    // Create project categories
    console.log("Creating project categories...");
    const categories = await Promise.all([
      db.projectCategory.create({
        data: {
          name: "Residential",
          slug: "residential",
          description: "Private homes and residential spaces",
          order: 1,
        },
      }),
      db.projectCategory.create({
        data: {
          name: "Commercial",
          slug: "commercial",
          description: "Office spaces and commercial buildings",
          order: 2,
        },
      }),
      db.projectCategory.create({
        data: {
          name: "Hospitality",
          slug: "hospitality",
          description: "Hotels, restaurants, and hospitality venues",
          order: 3,
        },
      }),
      db.projectCategory.create({
        data: {
          name: "Mixed-Use",
          slug: "mixed-use",
          description: "Combined residential and commercial spaces",
          order: 4,
        },
      }),
      db.projectCategory.create({
        data: {
          name: "Retail",
          slug: "retail",
          description: "Retail and shopping spaces",
          order: 5,
        },
      }),
    ]);

    // Create services
    console.log("Creating services...");
    await Promise.all([
      db.service.create({
        data: {
          name: "Architectural Design",
          slug: "architectural-design",
          description: "Complete architectural design services from concept to execution.",
          benefits: "Expert design solutions tailored to your vision and requirements.",
          process: "Consultation → Concept Design → Design Development → Construction Documents",
          order: 1,
        },
      }),
      db.service.create({
        data: {
          name: "Interior Design",
          slug: "interior-design",
          description: "Comprehensive interior design for residential and commercial spaces.",
          benefits: "Functional and beautiful interior spaces that reflect your brand.",
          process: "Space Planning → Concept Development → Material Selection → Implementation",
          order: 2,
        },
      }),
      db.service.create({
        data: {
          name: "3D Visualization",
          slug: "3d-visualization",
          description: "Photorealistic 3D renderings and visualizations.",
          benefits: "See your project before construction begins.",
          process: "Modeling → Rendering → Post-Production → Delivery",
          order: 3,
        },
      }),
      db.service.create({
        data: {
          name: "Landscape Design",
          slug: "landscape-design",
          description: "Outdoor space design and landscape architecture.",
          benefits: "Beautiful and sustainable outdoor environments.",
          process: "Site Analysis → Conceptual Design → Detailed Design → Implementation",
          order: 4,
        },
      }),
      db.service.create({
        data: {
          name: "Design Consultation",
          slug: "design-consultation",
          description: "Expert consultation for your design projects.",
          benefits: "Professional guidance from experienced architects.",
          process: "Initial Meeting → Analysis → Recommendations → Follow-up",
          order: 5,
        },
      }),
    ]);

    // Create sample projects
    console.log("Creating sample projects...");
    const sampleProjects = [
      {
        title: "Modern Luxury Apartment",
        slug: "modern-luxury-apartment",
        description: "A sophisticated urban apartment with premium finishes.",
        projectStory: "Transforming a historical building into a modern luxury residence.",
        designConcept: "Minimalist elegance meets comfort in this 2000 sqm penthouse.",
        challenges: "Working within heritage constraints while meeting contemporary standards.",
        solutions: "Innovative design approach respecting historical elements.",
        clientName: "John & Jane Smith",
        clientCompany: "Private Client",
        categoryId: categories[0].id,
        country: "USA",
        city: "New York",
        location: "Manhattan",
        projectArea: "2000 sqm",
        status: "completed",
        budget: "$500,000",
        duration: "8 months",
        year: 2023,
        featured: true,
        published: true,
      },
      {
        title: "Corporate Office Design",
        slug: "corporate-office-design",
        description: "State-of-the-art office space for a tech company.",
        projectStory: "Creating an inspiring workplace for a growing tech company.",
        designConcept: "Collaborative spaces designed for innovation and productivity.",
        challenges: "Flexible design for evolving team requirements.",
        solutions: "Modular design system allowing easy reconfiguration.",
        clientName: "TechCorp Inc.",
        clientCompany: "TechCorp",
        categoryId: categories[1].id,
        country: "USA",
        city: "San Francisco",
        location: "SOMA District",
        projectArea: "5000 sqm",
        status: "completed",
        budget: "$1,200,000",
        duration: "12 months",
        year: 2023,
        featured: true,
        published: true,
      },
      {
        title: "Boutique Hotel Design",
        slug: "boutique-hotel-design",
        description: "Luxury boutique hotel with unique architectural identity.",
        projectStory: "Designing a unique hotel experience that blends luxury with local culture.",
        designConcept: "Contemporary design inspired by local architecture and culture.",
        challenges: "Creating luxury amenities in a compact urban location.",
        solutions: "Vertical space optimization and luxury finishes.",
        clientName: "Luxury Hotels Group",
        clientCompany: "Luxury Hotels",
        categoryId: categories[2].id,
        country: "Spain",
        city: "Barcelona",
        location: "Gothic Quarter",
        projectArea: "3500 sqm",
        status: "completed",
        budget: "$2,500,000",
        duration: "18 months",
        year: 2023,
        featured: true,
        published: true,
      },
      {
        title: "Residential Complex",
        slug: "residential-complex",
        description: "Mixed-use residential and commercial development.",
        projectStory: "A landmark residential development transforming the urban landscape.",
        designConcept: "Sustainable living spaces with integrated commercial amenities.",
        challenges: "Managing complex stakeholder requirements and city regulations.",
        solutions: "Collaborative design process with all stakeholders.",
        clientName: "Urban Development Corp",
        clientCompany: "Urban Dev",
        categoryId: categories[3].id,
        country: "Germany",
        city: "Berlin",
        location: "Mitte District",
        projectArea: "15000 sqm",
        status: "completed",
        budget: "$5,000,000",
        duration: "24 months",
        year: 2022,
        featured: true,
        published: true,
      },
      {
        title: "Retail Store Design",
        slug: "retail-store-design",
        description: "Modern retail space for luxury fashion brand.",
        projectStory: "Creating an immersive retail experience for a luxury brand.",
        designConcept: "Minimalist design showcasing products with theatrical lighting.",
        challenges: "High footfall management and security requirements.",
        solutions: "Smart layout design with integrated security systems.",
        clientName: "LuxeBrand",
        clientCompany: "LuxeBrand",
        categoryId: categories[4].id,
        country: "France",
        city: "Paris",
        location: "Champs-Élysées",
        projectArea: "800 sqm",
        status: "completed",
        budget: "$800,000",
        duration: "6 months",
        year: 2023,
        featured: false,
        published: true,
      },
    ];

    for (const project of sampleProjects) {
      await db.project.create({
        data: project,
      });
    }

    // Create awards
    console.log("Creating awards...");
    await Promise.all([
      db.award.create({
        data: {
          title: "Best Residential Design",
          description: "Award for excellence in residential architecture.",
          issuer: "International Architecture Awards",
          year: 2023,
          category: "Residential",
          featured: true,
        },
      }),
      db.award.create({
        data: {
          title: "Sustainable Design Award",
          description: "Recognition for sustainable design practices.",
          issuer: "Green Building Council",
          year: 2023,
          category: "Sustainability",
          featured: true,
        },
      }),
      db.award.create({
        data: {
          title: "Interior Design Excellence",
          description: "Award for outstanding interior design.",
          issuer: "Interior Design Association",
          year: 2022,
          category: "Interior",
          featured: false,
        },
      }),
      db.award.create({
        data: {
          title: "Innovation in Architecture",
          description: "Award for innovative architectural solutions.",
          issuer: "Architecture Today",
          year: 2022,
          category: "Innovation",
          featured: true,
        },
      }),
      db.award.create({
        data: {
          title: "Commercial Design Excellence",
          description: "Award for commercial space design.",
          issuer: "Business Architecture Forum",
          year: 2021,
          category: "Commercial",
          featured: false,
        },
      }),
    ]);

    // Create testimonials
    console.log("Creating testimonials...");
    await Promise.all([
      db.testimonial.create({
        data: {
          clientName: "John Smith",
          clientPosition: "CEO",
          companyName: "TechCorp Inc.",
          rating: 5,
          testimonial: "ARQIVA transformed our office space into an inspiring workplace. Their attention to detail and innovative approach was exceptional.",
          featured: true,
        },
      }),
      db.testimonial.create({
        data: {
          clientName: "Jane Doe",
          clientPosition: "Owner",
          companyName: "Luxury Hotels Group",
          rating: 5,
          testimonial: "Working with ARQIVA was a dream. They created a hotel that exceeds all expectations and delights our guests daily.",
          featured: true,
        },
      }),
      db.testimonial.create({
        data: {
          clientName: "Michael Johnson",
          clientPosition: "Project Manager",
          companyName: "Urban Development Corp",
          rating: 5,
          testimonial: "Professional, creative, and reliable. ARQIVA delivered a complex project on time and within budget.",
          featured: true,
        },
      }),
      db.testimonial.create({
        data: {
          clientName: "Sarah Williams",
          clientPosition: "Brand Director",
          companyName: "LuxeBrand",
          rating: 5,
          testimonial: "The retail space ARQIVA designed perfectly embodies our brand values and creates an unforgettable shopping experience.",
          featured: false,
        },
      }),
      db.testimonial.create({
        data: {
          clientName: "David Brown",
          clientPosition: "Private Client",
          companyName: "Residential Client",
          rating: 5,
          testimonial: "Our apartment is now our sanctuary. ARQIVA understood our vision and created something truly special.",
          featured: false,
        },
      }),
    ]);

    // Create education
    console.log("Creating education...");
    await Promise.all([
      db.education.create({
        data: {
          degree: "Master's",
          field: "Architecture",
          institution: "Swiss Federal Institute of Technology",
          startYear: 2012,
          endYear: 2014,
          description: "Advanced architecture and design theory.",
          order: 1,
        },
      }),
      db.education.create({
        data: {
          degree: "Bachelor's",
          field: "Architecture",
          institution: "University of Design",
          startYear: 2008,
          endYear: 2012,
          description: "Foundation in architecture and design principles.",
          order: 2,
        },
      }),
    ]);

    // Create experience
    console.log("Creating experience...");
    await Promise.all([
      db.experience.create({
        data: {
          position: "Founder & Principal Architect",
          company: "ARQIVA Studio & Design",
          startDate: new Date("2018-01-01"),
          isCurrentRole: true,
          description: "Founded and lead ARQIVA Studio & Design",
          achievements: "20+ award-winning projects, 50+ team members, international recognition",
          order: 1,
        },
      }),
      db.experience.create({
        data: {
          position: "Senior Architect",
          company: "Foster + Partners",
          startDate: new Date("2014-06-01"),
          endDate: new Date("2017-12-31"),
          description: "Led major architectural projects",
          achievements: "Delivered 5 major projects, mentored junior architects",
          order: 2,
        },
      }),
      db.experience.create({
        data: {
          position: "Architect",
          company: "Design Innovations Ltd",
          startDate: new Date("2012-01-01"),
          endDate: new Date("2014-05-31"),
          description: "Worked on residential and commercial projects",
          achievements: "Contributed to 15+ successful projects",
          order: 3,
        },
      }),
    ]);

    // Create certifications
    console.log("Creating certifications...");
    await Promise.all([
      db.certification.create({
        data: {
          name: "LEED Accredited Professional",
          issuer: "U.S. Green Building Council",
          issuedDate: new Date("2018-06-15"),
          credentialUrl: "https://credentials.usgbc.org",
          order: 1,
        },
      }),
      db.certification.create({
        data: {
          name: "Professional Architect License",
          issuer: "International Architecture Board",
          issuedDate: new Date("2015-09-20"),
          order: 2,
        },
      }),
      db.certification.create({
        data: {
          name: "BIM Specialist Certification",
          issuer: "Autodesk",
          issuedDate: new Date("2017-03-10"),
          credentialUrl: "https://autodesk.com",
          order: 3,
        },
      }),
    ]);

    // Create skills
    console.log("Creating skills...");
    await Promise.all([
      // Software Skills
      db.skill.create({
        data: { name: "Revit", category: "Software", proficiency: "expert", order: 1 },
      }),
      db.skill.create({
        data: { name: "AutoCAD", category: "Software", proficiency: "expert", order: 2 },
      }),
      db.skill.create({
        data: { name: "SketchUp", category: "Software", proficiency: "expert", order: 3 },
      }),
      db.skill.create({
        data: { name: "Lumion", category: "Software", proficiency: "advanced", order: 4 },
      }),
      db.skill.create({
        data: { name: "V-Ray", category: "Software", proficiency: "advanced", order: 5 },
      }),
      db.skill.create({
        data: { name: "Photoshop", category: "Software", proficiency: "advanced", order: 6 },
      }),
      db.skill.create({
        data: { name: "Illustrator", category: "Software", proficiency: "intermediate", order: 7 },
      }),
      db.skill.create({
        data: { name: "InDesign", category: "Software", proficiency: "intermediate", order: 8 },
      }),
      // Soft Skills
      db.skill.create({
        data: { name: "Leadership", category: "Soft Skills", proficiency: "expert", order: 9 },
      }),
      db.skill.create({
        data: { name: "Communication", category: "Soft Skills", proficiency: "expert", order: 10 },
      }),
      db.skill.create({
        data: { name: "Problem Solving", category: "Soft Skills", proficiency: "expert", order: 11 },
      }),
      db.skill.create({
        data: { name: "Teamwork", category: "Soft Skills", proficiency: "expert", order: 12 },
      }),
      db.skill.create({
        data: { name: "Presentation", category: "Soft Skills", proficiency: "advanced", order: 13 },
      }),
    ]);

    console.log("✓ Database seeded successfully!");
    await db.$disconnect();
  } catch (error) {
    console.error("✗ Seeding failed:", error);
    await db.$disconnect();
    process.exit(1);
  }
}

seed();
