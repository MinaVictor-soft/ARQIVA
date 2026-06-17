import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[@$!%*?&]/, "Password must contain a special character"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Project Schemas
export const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  titleAr: z.string().optional(),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  coverImage: z.string().optional(),
  projectStory: z.string().optional(),
  designConcept: z.string().optional(),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  clientName: z.string().optional(),
  clientCompany: z.string().optional(),
  categoryId: z.number().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  location: z.string().optional(),
  projectArea: z.string().optional(),
  status: z.string().default("completed"),
  budget: z.string().optional(),
  duration: z.string().optional(),
  year: z.number().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const updateProjectSchema = createProjectSchema.partial();

// Service Schemas
export const createServiceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().optional(),
  benefits: z.string().optional(),
  process: z.string().optional(),
  order: z.number().default(0),
});

export const updateServiceSchema = createServiceSchema.partial();

// Testimonial Schemas
export const createTestimonialSchema = z.object({
  projectId: z.number().optional(),
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  clientPosition: z.string().optional(),
  companyName: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  testimonial: z.string().min(10, "Testimonial must be at least 10 characters"),
  featured: z.boolean().default(false),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

// Award Schemas
export const createAwardSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  issuer: z.string().optional(),
  year: z.number().min(1900).max(2100),
  category: z.string().optional(),
  featured: z.boolean().default(false),
});

export const updateAwardSchema = createAwardSchema.partial();

// Contact Schemas
export const createMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const createContactRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  serviceInterest: z.string().optional(),
  message: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

// Settings Schemas
export const updateSettingsSchema = z.object({
  companyName: z.string().optional(),
  description: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  values: z.string().optional(),
  designPhilosophy: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  location: z.string().optional(),
  linkedIn: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  behance: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
