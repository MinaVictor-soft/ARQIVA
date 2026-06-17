import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ARQIVA Studio & Design API',
      version: '1.0.0',
      description: 'Complete REST API for ARQIVA Architecture Portfolio Platform',
    },
    servers: [
      { url: 'http://localhost:5000/api', description: 'Local Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@arqivastudio.com' },
            password: { type: 'string', example: 'Admin@123456' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'user'] },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            clientName: { type: 'string' },
            city: { type: 'string' },
            year: { type: 'integer' },
            featured: { type: 'boolean' },
            published: { type: 'boolean' },
            views: { type: 'integer' },
            likes: { type: 'integer' },
            coverImage: { type: 'string' },
          },
        },
        Service: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            benefits: { type: 'string' },
            process: { type: 'string' },
          },
        },
        Testimonial: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            clientName: { type: 'string' },
            clientPosition: { type: 'string' },
            companyName: { type: 'string' },
            testimonial: { type: 'string' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            featured: { type: 'boolean' },
          },
        },
        Award: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            issuer: { type: 'string' },
            year: { type: 'integer' },
            category: { type: 'string' },
            featured: { type: 'boolean' },
          },
        },
        Message: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            subject: { type: 'string' },
            message: { type: 'string' },
            read: { type: 'boolean' },
            replied: { type: 'boolean' },
            createdAt: { type: 'string' },
          },
        },
        Settings: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            companyName: { type: 'string' },
            logo: { type: 'string' },
            description: { type: 'string' },
            mission: { type: 'string' },
            vision: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'string' },
            linkedIn: { type: 'string' },
            instagram: { type: 'string' },
            seoTitle: { type: 'string' },
            seoDescription: { type: 'string' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array', items: {} },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                page: { type: 'integer' },
                limit: { type: 'integer' },
                pages: { type: 'integer' },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Projects', description: 'Project management' },
      { name: 'Services', description: 'Service management' },
      { name: 'Testimonials', description: 'Testimonial management' },
      { name: 'Awards', description: 'Awards management' },
      { name: 'Messages', description: 'Contact form & messages' },
      { name: 'Settings', description: 'Company settings management' },
      { name: 'Admin', description: 'Admin dashboard & analytics' },
    ],
    paths: {
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
          responses: {
            200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Current user info' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh access token',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } } } },
          responses: { 200: { description: 'New tokens' } },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Logged out' } },
        },
      },
      '/projects': {
        get: {
          tags: ['Projects'],
          summary: 'Get all projects',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category slug' },
            { name: 'featured', in: 'query', schema: { type: 'boolean' } },
            { name: 'year', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { 200: { description: 'List of projects', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedResponse' } } } } },
        },
        post: {
          tags: ['Projects'],
          summary: 'Create project',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'slug'],
                  properties: {
                    title: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' },
                    year: { type: 'integer' },
                    featured: { type: 'boolean', default: false },
                    published: { type: 'boolean', default: true },
                    categoryId: { type: 'integer' },
                    city: { type: 'string' },
                    country: { type: 'string' },
                    clientName: { type: 'string' },
                    projectArea: { type: 'string' },
                    budget: { type: 'string' },
                    duration: { type: 'string' },
                    status: { type: 'string', enum: ['completed', 'ongoing', 'concept'] },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Project created' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/projects/{slug}': {
        get: {
          tags: ['Projects'],
          summary: 'Get project by slug',
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Project details', content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } }, 404: { description: 'Not found' } },
        },
        put: {
          tags: ['Projects'],
          summary: 'Update project',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } },
          responses: { 200: { description: 'Updated' }, 401: { description: 'Unauthorized' } },
        },
        delete: {
          tags: ['Projects'],
          summary: 'Delete project',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/projects/{id}/like': {
        post: {
          tags: ['Projects'],
          summary: 'Like a project',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Liked' } },
        },
      },
      '/services': {
        get: {
          tags: ['Services'],
          summary: 'Get all services',
          responses: { 200: { description: 'List of services' } },
        },
        post: {
          tags: ['Services'],
          summary: 'Create service',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'slug'],
                  properties: {
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' },
                    benefits: { type: 'string' },
                    process: { type: 'string' },
                    order: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/services/{slug}': {
        get: { tags: ['Services'], summary: 'Get service by slug', parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Service details' }, 404: { description: 'Not found' } } },
        put: { tags: ['Services'], summary: 'Update service', security: [{ bearerAuth: [] }], parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Service' } } } }, responses: { 200: { description: 'Updated' } } },
        delete: { tags: ['Services'], summary: 'Delete service', security: [{ bearerAuth: [] }], parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/testimonials': {
        get: {
          tags: ['Testimonials'],
          summary: 'Get all testimonials',
          parameters: [{ name: 'featured', in: 'query', schema: { type: 'boolean' } }],
          responses: { 200: { description: 'List of testimonials' } },
        },
        post: {
          tags: ['Testimonials'],
          summary: 'Create testimonial',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['clientName', 'testimonial'],
                  properties: {
                    clientName: { type: 'string' },
                    clientPosition: { type: 'string' },
                    companyName: { type: 'string' },
                    testimonial: { type: 'string' },
                    rating: { type: 'integer', minimum: 1, maximum: 5 },
                    featured: { type: 'boolean' },
                    projectId: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/testimonials/{id}': {
        put: { tags: ['Testimonials'], summary: 'Update testimonial', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Testimonial' } } } }, responses: { 200: { description: 'Updated' } } },
        delete: { tags: ['Testimonials'], summary: 'Delete testimonial', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/awards': {
        get: {
          tags: ['Awards'],
          summary: 'Get all awards',
          parameters: [
            { name: 'featured', in: 'query', schema: { type: 'boolean' } },
            { name: 'year', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { 200: { description: 'List of awards' } },
        },
        post: {
          tags: ['Awards'],
          summary: 'Create award',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'year'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    issuer: { type: 'string' },
                    year: { type: 'integer' },
                    category: { type: 'string' },
                    featured: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/awards/{id}': {
        put: { tags: ['Awards'], summary: 'Update award', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Award' } } } }, responses: { 200: { description: 'Updated' } } },
        delete: { tags: ['Awards'], summary: 'Delete award', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/messages': {
        get: {
          tags: ['Messages'],
          summary: 'Get all messages (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'read', in: 'query', schema: { type: 'boolean' } },
          ],
          responses: { 200: { description: 'Messages list' } },
        },
        post: {
          tags: ['Messages'],
          summary: 'Submit contact form (public)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'subject', 'message'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    subject: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Message sent' } },
        },
      },
      '/messages/{id}': {
        get: { tags: ['Messages'], summary: 'Get message details', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Message details' } } },
        delete: { tags: ['Messages'], summary: 'Delete message', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/messages/{id}/replied': {
        patch: { tags: ['Messages'], summary: 'Mark as replied', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Marked as replied' } } },
      },
      '/settings': {
        get: { tags: ['Settings'], summary: 'Get company settings (public)', responses: { 200: { description: 'Settings data', content: { 'application/json': { schema: { $ref: '#/components/schemas/Settings' } } } } } },
        put: { tags: ['Settings'], summary: 'Update settings (admin)', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Settings' } } } }, responses: { 200: { description: 'Updated' } } },
      },
      '/admin/stats': {
        get: {
          tags: ['Admin'],
          summary: 'Get dashboard statistics',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Dashboard stats',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      totalProjects: { type: 'integer' },
                      totalViews: { type: 'integer' },
                      totalLikes: { type: 'integer' },
                      totalMessages: { type: 'integer' },
                      totalTestimonials: { type: 'integer' },
                      totalAwards: { type: 'integer' },
                      recentProjects: { type: 'array' },
                      topProjects: { type: 'array' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/admin/analytics': {
        get: {
          tags: ['Admin'],
          summary: 'Get analytics data',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'eventType', in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Analytics data' } },
        },
      },
      '/admin/activity': {
        get: {
          tags: ['Admin'],
          summary: 'Get activity logs',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Activity logs' } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
