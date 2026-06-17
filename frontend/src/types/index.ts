// User
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

// Projects
export interface ProjectCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  createdAt: string;
}

export interface ProjectImage {
  id: number;
  projectId: number;
  imageUrl: string;
  caption?: string;
  order: number;
  createdAt: string;
}

export interface Project {
  id: number;
  title: string;
  titleAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  projectStory?: string;
  designConcept?: string;
  challenges?: string;
  solutions?: string;
  clientName?: string;
  clientCompany?: string;
  categoryId?: number;
  category?: ProjectCategory;
  country?: string;
  city?: string;
  location?: string;
  projectArea?: string;
  status: string;
  budget?: string;
  duration?: string;
  year?: number;
  featured: boolean;
  coverImage?: string;
  views: number;
  likes: number;
  shares?: number;
  published: boolean;
  images?: ProjectImage[];
  videos?: any[];
  files?: any[];
  tools?: any[];
  testimonials?: Testimonial[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

// Services
export interface Service {
  id: number;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  benefits?: string;
  process?: string;
  icon?: string;
  order: number;
  examples?: ServiceExample[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceExample {
  id: number;
  serviceId: number;
  projectId?: number;
  title: string;
  project?: Project;
  createdAt: string;
}

// Testimonials
export interface Testimonial {
  id: number;
  projectId?: number;
  clientName: string;
  clientPosition?: string;
  companyName?: string;
  rating: number;
  testimonial: string;
  clientImage?: string;
  featured: boolean;
  project?: Project;
  createdAt: string;
}

// Awards
export interface Award {
  id: number;
  title: string;
  description?: string;
  issuer?: string;
  year: number;
  category?: string;
  image?: string;
  featured: boolean;
  createdAt: string;
}

// Messages
export interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

// Settings
export interface Settings {
  id: number;
  companyName: string;
  tagline?: string;
  logo?: string;
  darkLogo?: string;
  favicon?: string;
  // Hero
  heroImage?: string;
  heroTitle?: string;
  heroTitleAr?: string;
  heroAccent?: string;
  heroAccentAr?: string;
  heroLabel?: string;
  heroSubtitle?: string;
  heroSubtitleAr?: string;
  heroCta1Text?: string;
  heroCta1Url?: string;
  heroCta2Text?: string;
  heroCta2Url?: string;
  // Stats
  statProjects?: number;
  statCountries?: number;
  statValue?: string;
  // Company
  profileImage?: string;
  description?: string;
  descriptionAr?: string;
  mission?: string;
  missionAr?: string;
  vision?: string;
  visionAr?: string;
  values?: string;
  valuesAr?: string;
  designPhilosophy?: string;
  designPhilosophyAr?: string;
  // Contact
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  addressAr?: string;
  location?: string;
  workingHours?: string;
  googleMapUrl?: string;
  // Social
  linkedIn?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  behance?: string;
  pinterest?: string;
  youtube?: string;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  // Footer
  footerText?: string;
  footerTextAr?: string;
  copyrightText?: string;
  // Assets
  resumePdf?: string;
  updatedAt: string;
}

// Education
export interface Education {
  id: number;
  degree: string;
  field: string;
  institution: string;
  startYear: number;
  endYear?: number;
  description?: string;
  order: number;
  createdAt: string;
}

// Experience
export interface Experience {
  id: number;
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrentRole: boolean;
  description?: string;
  achievements?: string;
  order: number;
  createdAt: string;
}

// Skills
export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  order: number;
  createdAt: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
