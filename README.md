# Portfolio Backend API

Backend API for portfolio website built with Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js 22 (TypeScript)
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Auth**: JWT with bcryptjs
- **File Upload**: Multer
- **Deployment**: CapRover (Docker)

## Features

- **Authentication**: JWT-based auth with register/login
- **Projects CRUD**: Manage portfolio projects
- **Blog CRUD**: Blog posts management
- **Testimonials CRUD**: Client testimonials
- **File Upload**: Image uploads with Multer
- **CV/Resume**: PDF file management

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create project (auth) |
| PUT | `/api/projects/:id` | Update project (auth) |
| DELETE | `/api/projects/:id` | Delete project (auth) |
| GET | `/api/blog` | List all blog posts |
| POST | `/api/blog` | Create blog post (auth) |
| PUT | `/api/blog/:id` | Update blog post (auth) |
| DELETE | `/api/blog/:id` | Delete blog post (auth) |
| GET | `/api/testimonials` | List testimonials |
| POST | `/api/testimonials` | Create testimonial (auth) |
| PUT | `/api/testimonials/:id` | Update testimonial (auth) |
| DELETE | `/api/testimonials/:id` | Delete testimonial (auth) |
| POST | `/api/upload` | Upload image (auth) |
| GET | `/api/cv` | Get CV info |
| PUT | `/api/cv` | Update CV (auth) |

## Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Setup database
npx prisma generate
npx prisma migrate dev
npm run prisma:seed

# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-secret-key"
PORT=3001
```

## Deployment (CapRover)

The project includes a `captain-definition` and `Dockerfile` for CapRover deployment.

```bash
# Build and deploy via CapRover CLI or dashboard
caprover deploy
```

## Database Schema

Defined in `prisma/schema.prisma`:
- **User**: Authentication
- **Project**: Portfolio projects
- **Blog**: Blog posts
- **Testimonial**: Client testimonials
- **CV**: Resume/CV data