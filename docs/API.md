# ARQIVA - API Documentation

Complete REST API reference for ARQIVA Backend.

## Base URL

```
Local: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Use JWT Bearer token in Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    // Error details (development only)
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Data retrieved",
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

## Authentication Endpoints

### Login

```
POST /auth/login
```

**Request Body**:
```json
{
  "email": "admin@arqivastudio.com",
  "password": "Admin@123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@arqivastudio.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

### Register

```
POST /auth/register
```

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Refresh Token

```
POST /auth/refresh
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGci..."
}
```

### Get Current User

```
GET /auth/me
```

**Headers**:
```
Authorization: Bearer <access_token>
```

### Logout

```
POST /auth/logout
```

## Projects Endpoints

### Get All Projects

```
GET /projects?page=1&limit=10&category=residential&year=2023&featured=true
```

**Query Parameters**:
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10, max: 100)
- `category` (string) - Filter by category slug
- `year` (number) - Filter by year
- `featured` (boolean) - Only featured projects

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Modern Luxury Apartment",
      "slug": "modern-luxury-apartment",
      "description": "...",
      "views": 250,
      "likes": 45,
      "category": { ... },
      "images": [ ... ]
    }
  ],
  "pagination": { ... }
}
```

### Get Project by Slug

```
GET /projects/:slug
```

**Response**: Returns full project with all details

### Create Project

```
POST /projects
```

**Headers**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "New Project",
  "slug": "new-project",
  "description": "Project description",
  "projectStory": "Project story...",
  "designConcept": "Design concept...",
  "challenges": "Challenges...",
  "solutions": "Solutions...",
  "clientName": "Client Name",
  "clientCompany": "Company",
  "categoryId": 1,
  "country": "USA",
  "city": "New York",
  "location": "Manhattan",
  "projectArea": "2000 sqm",
  "status": "completed",
  "budget": "$500,000",
  "duration": "8 months",
  "year": 2024,
  "featured": true,
  "published": true
}
```

### Update Project

```
PUT /projects/:id
```

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Request Body**: Same as create (all fields optional)

### Delete Project

```
DELETE /projects/:id
```

### Add Project Image

```
POST /projects/:projectId/images
```

**Request Body**:
```json
{
  "imageUrl": "https://...",
  "caption": "Image caption",
  "order": 0
}
```

### Like Project

```
POST /projects/:id/like
```

## Services Endpoints

### Get All Services

```
GET /services
```

### Get Service by Slug

```
GET /services/:slug
```

### Create Service

```
POST /services
```

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Request Body**:
```json
{
  "name": "Architectural Design",
  "slug": "architectural-design",
  "description": "...",
  "benefits": "...",
  "process": "...",
  "order": 1
}
```

### Update Service

```
PUT /services/:id
```

### Delete Service

```
DELETE /services/:id
```

## Testimonials Endpoints

### Get All Testimonials

```
GET /testimonials?featured=true
```

### Create Testimonial

```
POST /testimonials
```

**Request Body**:
```json
{
  "projectId": 1,
  "clientName": "John Smith",
  "clientPosition": "CEO",
  "companyName": "Company",
  "rating": 5,
  "testimonial": "Great work...",
  "featured": true
}
```

### Update Testimonial

```
PUT /testimonials/:id
```

### Delete Testimonial

```
DELETE /testimonials/:id
```

## Awards Endpoints

### Get All Awards

```
GET /awards?page=1&limit=10&year=2024&featured=true
```

### Create Award

```
POST /awards
```

**Request Body**:
```json
{
  "title": "Best Design",
  "description": "...",
  "issuer": "Design Magazine",
  "year": 2024,
  "category": "Design",
  "featured": true
}
```

### Update Award

```
PUT /awards/:id
```

### Delete Award

```
DELETE /awards/:id
```

## Messages Endpoints

### Submit Contact Form

```
POST /messages
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Project Inquiry",
  "message": "I'm interested in..."
}
```

### Get All Messages (Admin)

```
GET /messages?page=1&limit=10&read=false
```

### Get Message Details (Admin)

```
GET /messages/:id
```

### Delete Message (Admin)

```
DELETE /messages/:id
```

### Mark as Replied (Admin)

```
PATCH /messages/:id/replied
```

## Settings Endpoints

### Get Settings

```
GET /settings
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "companyName": "ARQIVA Studio & Design",
    "logo": "url...",
    "description": "...",
    "mission": "...",
    "vision": "...",
    "phone": "+1 (555) 123-4567",
    "email": "info@arqivastudio.com",
    "linkedIn": "...",
    "instagram": "...",
    "seoTitle": "...",
    "seoDescription": "..."
  }
}
```

### Update Settings (Admin)

```
PUT /settings
```

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Request Body**:
```json
{
  "companyName": "Updated Name",
  "description": "Updated description",
  "mission": "...",
  "vision": "...",
  "phone": "...",
  "email": "...",
  "linkedIn": "...",
  "instagram": "...",
  "seoTitle": "...",
  "seoDescription": "..."
}
```

## Admin Dashboard Endpoints

### Get Dashboard Stats

```
GET /admin/stats
```

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalProjects": 25,
    "totalViews": 15000,
    "totalLikes": 850,
    "totalMessages": 42,
    "totalTestimonials": 10,
    "totalAwards": 8,
    "recentProjects": [...],
    "topProjects": [...]
  }
}
```

### Get Analytics

```
GET /admin/analytics?startDate=2024-01-01&endDate=2024-12-31&eventType=PROJECT_VIEWED
```

### Get Activity Logs

```
GET /admin/activity
```

## Error Codes

### 400 Bad Request

Validation error, missing required fields, or invalid input

### 401 Unauthorized

Missing or invalid authentication token

### 403 Forbidden

Insufficient permissions or role not allowed

### 404 Not Found

Resource doesn't exist

### 409 Conflict

Unique constraint violation (e.g., duplicate email)

### 429 Too Many Requests

Rate limit exceeded

### 500 Internal Server Error

Server error, check logs

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Header**: `RateLimit-Remaining`

## CORS

Allowed Origins:
- `http://localhost:5173` (development)
- Your frontend domain (production)

## Common Queries

### Get Featured Projects

```
GET /projects?featured=true&limit=6
```

### Get Projects by Category

```
GET /projects?category=residential&limit=12
```

### Get Recent Projects

```
GET /projects?limit=10&sortBy=createdAt
```

### Get Featured Testimonials

```
GET /testimonials?featured=true
```

### Get Awards by Year

```
GET /awards?year=2024&limit=20
```

## Webhooks (Future)

- Project published
- Contact form submitted
- New testimonial added
- Message received

## API Versioning

Current API version: `v1` (part of base URL)

Future versions will use `/api/v2`, etc.

## SDKs

JavaScript/TypeScript SDK coming soon.

## Support

- Check endpoint documentation
- Review response examples
- Check error messages
- View backend logs

---

**API Version**: 1.0.0
**Last Updated**: June 2026
