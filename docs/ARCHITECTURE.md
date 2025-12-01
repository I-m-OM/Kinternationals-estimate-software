# Architecture Documentation

> System Architecture & Design Decisions for Kinternationals Estimate Software

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Choices](#technology-choices)
4. [Application Layers](#application-layers)
5. [Data Flow](#data-flow)
6. [Security Architecture](#security-architecture)
7. [Performance Considerations](#performance-considerations)
8. [Scalability Strategy](#scalability-strategy)

---

## 🎯 System Overview

Kinternationals Estimate Software is a **monolithic full-stack application** built using Next.js 14's App Router architecture. It follows a **server-first approach** with React Server Components (RSC) for optimal performance.

### Core Principles

1. **Server-First Rendering** - Leverage RSC for data fetching
2. **Type Safety** - End-to-end TypeScript coverage
3. **Progressive Enhancement** - Works without JavaScript (where possible)
4. **Security by Default** - Server-side validation on all mutations
5. **Developer Experience** - Fast feedback loops with Hot Module Replacement

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Browser (React Components)                                  │
│  ├── Client Components (Interactive UI)                     │
│  ├── Forms with React Hook Form                             │
│  └── Real-time Updates (Optimistic UI)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP ROUTER                      │
├─────────────────────────────────────────────────────────────┤
│  Server Components (SSR/SSG)                                 │
│  ├── Data Fetching from Database                            │
│  ├── Server Actions (Mutations)                             │
│  └── API Routes (External Integrations)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                    │
├─────────────────────────────────────────────────────────────┤
│  lib/actions/                                                │
│  ├── Customer Actions (CRUD)                                │
│  ├── Estimate Actions (Create, Calculate, Update)           │
│  ├── Product Actions (Catalog Management)                   │
│  └── User Actions (Authentication, Profile)                 │
│                                                              │
│  lib/services/                                               │
│  ├── Pricing Service (Calculations)                         │
│  ├── PDF Service (Quote Generation)                         │
│  ├── Email Service (Notifications)                          │
│  └── Validation Service (Zod Schemas)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA ACCESS LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  Prisma ORM                                                  │
│  ├── Type-safe Database Queries                             │
│  ├── Migrations Management                                  │
│  └── Connection Pooling                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL 15+                                              │
│  ├── Users & Authentication                                 │
│  ├── Customers & Contacts                                   │
│  ├── Products & Catalog                                     │
│  ├── Estimates & Line Items                                 │
│  └── Projects & Status Tracking                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technology Choices

### Why Next.js 14 (App Router)?

| Requirement | Solution | Benefit |
|-------------|----------|---------|
| **Fast Development** | File-based routing, Server Actions | Reduce boilerplate by 40% |
| **Type Safety** | TypeScript + Zod | Catch errors at compile time |
| **Performance** | React Server Components | Reduce bundle size by 60% |
| **SEO (future)** | Server-side rendering | Better search visibility |
| **Authentication** | NextAuth.js v5 | Industry-standard auth |

### Why PostgreSQL?

- **Relational Data**: Estimates have complex relationships
- **ACID Compliance**: Critical for financial data
- **JSON Support**: Flexible storage for product configurations
- **Mature Ecosystem**: Excellent tooling and community

### Why Prisma ORM?

- **Type Safety**: Auto-generated TypeScript types
- **Migration Management**: Version-controlled schema changes
- **Query Builder**: Intuitive, safe database queries
- **Developer Experience**: Best-in-class DX with auto-complete

---

## 📚 Application Layers

### 1. Presentation Layer (`app/` directory)

**Responsibility**: Render UI and handle user interactions

```
app/
├── (auth)/
│   ├── login/page.tsx          # Server Component
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx              # Dashboard shell
│   ├── customers/
│   │   ├── page.tsx            # List view (Server Component)
│   │   ├── [id]/page.tsx       # Detail view
│   │   └── new/page.tsx        # Create form
│   ├── estimates/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── new/page.tsx        # Complex form (Client Component)
│   └── products/
│       └── ...
└── api/
    ├── pdf/route.ts            # PDF generation endpoint
    └── webhooks/route.ts       # External integrations
```

**Patterns**:
- **Server Components** for data fetching (default)
- **Client Components** for interactivity (marked with `"use client"`)
- **Layouts** for shared UI structure
- **Loading/Error States** using `loading.tsx` and `error.tsx`

### 2. Business Logic Layer (`lib/` directory)

**Responsibility**: Application logic and data transformations

```
lib/
├── actions/
│   ├── customers.ts            # Server Actions for customers
│   ├── estimates.ts            # Estimate CRUD + calculations
│   ├── products.ts
│   └── users.ts
├── services/
│   ├── pricing-service.ts      # Pricing engine
│   ├── pdf-service.ts          # PDF generation
│   ├── email-service.ts        # Email notifications
│   └── validation.ts           # Zod schemas
├── auth/
│   ├── auth.config.ts          # NextAuth configuration
│   └── middleware.ts           # Route protection
└── utils/
    ├── format.ts               # Formatting helpers
    ├── calculations.ts         # Math utilities
    └── constants.ts            # App-wide constants
```

**Key Patterns**:

#### Server Actions Example:
```typescript
// lib/actions/customers.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
})

export async function createCustomer(formData: FormData) {
  const validatedFields = customerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const customer = await prisma.customer.create({
    data: validatedFields.data,
  })

  revalidatePath('/dashboard/customers')
  return { success: true, customer }
}
```

### 3. Data Access Layer (Prisma)

**Responsibility**: Database operations with type safety

```typescript
// lib/db/index.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

## 🔄 Data Flow

### Example: Creating an Estimate

```
1. USER ACTION
   └─> User fills estimate form (Client Component)

2. FORM SUBMISSION
   └─> Form data sent to Server Action

3. SERVER ACTION (lib/actions/estimates.ts)
   ├─> Validate input with Zod
   ├─> Calculate pricing (lib/services/pricing-service.ts)
   └─> Save to database via Prisma

4. DATABASE OPERATION
   └─> Prisma creates records in transaction

5. RESPONSE
   ├─> Revalidate cache (revalidatePath)
   └─> Return success/error to client

6. UI UPDATE
   └─> Optimistic UI update or redirect
```

### Server Component Data Fetching

```typescript
// app/(dashboard)/estimates/page.tsx
import { prisma } from '@/lib/db'

export default async function EstimatesPage() {
  // Direct database access in Server Component
  const estimates = await prisma.estimate.findMany({
    include: {
      customer: true,
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return <EstimatesList estimates={estimates} />
}
```

---

## 🔐 Security Architecture

### 1. Authentication Flow (NextAuth.js v5)

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. Login Request
       ▼
┌─────────────────────────┐
│  NextAuth API Route     │
│  /api/auth/[...nextauth]│
└──────┬──────────────────┘
       │ 2. Verify Credentials
       ▼
┌─────────────┐
│  Database   │
└──────┬──────┘
       │ 3. Return User + Session
       ▼
┌─────────────┐
│   JWT/DB    │
│   Session   │
└─────────────┘
```

### 2. Route Protection

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Protect dashboard routes
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        return !!token
      }
      return true
    },
  },
})

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}
```

### 3. Server Action Security

```typescript
// lib/actions/estimates.ts
'use server'

import { auth } from '@/lib/auth'

export async function deleteEstimate(id: string) {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  // Check ownership or admin role
  const estimate = await prisma.estimate.findUnique({
    where: { id },
  })

  if (estimate.userId !== session.user.id && session.user.role !== 'ADMIN') {
    throw new Error('Forbidden')
  }

  await prisma.estimate.delete({ where: { id } })
}
```

### 4. Input Validation (Zod)

```typescript
// lib/services/validation.ts
import { z } from 'zod'

export const estimateSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
  })).min(1),
  discount: z.number().min(0).max(100).optional(),
  notes: z.string().max(1000).optional(),
})
```

---

## ⚡ Performance Considerations

### 1. React Server Components

**Benefits**:
- Zero JavaScript sent for static content
- Direct database access (no API layer)
- Automatic code splitting

**Usage**:
```typescript
// Server Component (default)
async function ProductList() {
  const products = await prisma.product.findMany()
  return <div>{/* render products */}</div>
}

// Client Component (interactive)
'use client'
function ProductFilter() {
  const [filter, setFilter] = useState('')
  return <input onChange={(e) => setFilter(e.target.value)} />
}
```

### 2. Database Query Optimization

```typescript
// ❌ Bad: N+1 Query Problem
const estimates = await prisma.estimate.findMany()
for (const estimate of estimates) {
  estimate.customer = await prisma.customer.findUnique({
    where: { id: estimate.customerId }
  })
}

// ✅ Good: Single Query with Includes
const estimates = await prisma.estimate.findMany({
  include: {
    customer: true,
    items: {
      include: { product: true }
    }
  }
})
```

### 3. Caching Strategy

```typescript
// Revalidate after 1 hour
export const revalidate = 3600

// Or use on-demand revalidation
import { revalidatePath } from 'next/cache'

export async function updateProduct(id: string, data: any) {
  await prisma.product.update({ where: { id }, data })
  revalidatePath('/dashboard/products')
}
```

### 4. Streaming and Suspense

```typescript
// app/(dashboard)/estimates/page.tsx
import { Suspense } from 'react'

export default function EstimatesPage() {
  return (
    <div>
      <h1>Estimates</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <EstimatesList />
      </Suspense>
    </div>
  )
}
```

---

## 📈 Scalability Strategy

### Current Scale (MVP)
- **Users**: 1-50 concurrent
- **Data**: <100k records
- **Architecture**: Monolith on single server

### Future Scale Paths

#### Phase 1: Vertical Scaling (500+ users)
- Upgrade server resources
- Add Redis caching
- Enable Prisma connection pooling

#### Phase 2: Horizontal Scaling (1000+ users)
- Multiple Next.js instances behind load balancer
- Separate database server
- CDN for static assets

#### Phase 3: Microservices (if needed)
- Extract PDF generation to separate service
- Separate authentication service
- Message queue for async tasks

---

## 🛠️ Development Best Practices

### 1. Component Organization

```
components/
├── ui/                  # Reusable UI components (buttons, inputs)
├── forms/               # Form components
├── features/
│   ├── customers/       # Customer-specific components
│   ├── estimates/       # Estimate-specific components
│   └── products/        # Product-specific components
└── layouts/             # Layout components
```

### 2. Type Safety

```typescript
// types/index.ts
import { Prisma } from '@prisma/client'

// Extend Prisma types
export type EstimateWithRelations = Prisma.EstimateGetPayload<{
  include: {
    customer: true
    items: { include: { product: true } }
  }
}>
```

### 3. Error Handling

```typescript
// lib/actions/estimates.ts
export async function createEstimate(data: EstimateInput) {
  try {
    const estimate = await prisma.estimate.create({ data })
    revalidatePath('/dashboard/estimates')
    return { success: true, estimate }
  } catch (error) {
    console.error('Failed to create estimate:', error)
    return { success: false, error: 'Failed to create estimate' }
  }
}
```

---

## 📊 Monitoring & Observability

### Logging Strategy
- **Development**: Console logs
- **Production**: Structured logging (Winston/Pino)
- **Error Tracking**: Sentry integration

### Performance Monitoring
- Next.js Analytics (Vercel)
- Custom metrics for critical paths
- Database query performance (Prisma Studio)

---

## 🔄 Deployment Architecture

```
┌──────────────┐
│   GitHub     │
│  Repository  │
└──────┬───────┘
       │ Push
       ▼
┌──────────────┐
│   Vercel     │
│   (CI/CD)    │
└──────┬───────┘
       │ Deploy
       ▼
┌──────────────┐     
│  Next.js App │
│   (Vercel)   │
└──────┬───────┘
       │ Connects to
       ▼
┌──────────────┐
│  PostgreSQL  │
│   Database   │
└──────────────┘
```

### Production Deployment Flow

1. **Code Push** → GitHub repository
2. **Auto Deploy** → Vercel detects changes
3. **Build Process**:
   - Install dependencies
   - Run Prisma generate
   - Build Next.js app
   - Run database migrations (if needed)
4. **Deploy** → Production environment
5. **Health Check** → Verify deployment

### Environment-specific Configuration

```typescript
// config/env.ts
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  database: {
    url: process.env.DATABASE_URL!,
    poolSize: process.env.NODE_ENV === 'production' ? 10 : 5,
  },
  auth: {
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pdf: {
    maxSize: 10 * 1024 * 1024, // 10MB
  },
}
```

---

## 🔒 Backup & Recovery

### Database Backup Strategy

```bash
# Daily automated backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Point-in-time recovery (Vercel Postgres)
# Automatic with Vercel Postgres Pro plan
```

### Data Retention Policy

- **Estimates**: Retain indefinitely
- **Audit Logs**: 1 year
- **User Sessions**: 30 days
- **Deleted Records**: Soft delete, archive after 90 days

---

## 📈 Future Architecture Improvements

### Phase 1 (Current - MVP)
✅ Monolithic Next.js application
✅ Single PostgreSQL database
✅ Server-side rendering

### Phase 2 (Growth - 1000+ users)
- [ ] Redis caching layer
- [ ] CDN for static assets
- [ ] Database read replicas
- [ ] Background job processing (BullMQ)

### Phase 3 (Scale - 10,000+ users)
- [ ] Microservices for PDF generation
- [ ] Elasticsearch for advanced search
- [ ] Message queue (RabbitMQ/Kafka)
- [ ] Multi-region deployment

### Phase 4 (Enterprise)
- [ ] Kubernetes orchestration
- [ ] API Gateway (Kong/AWS API Gateway)
- [ ] Real-time collaboration (WebSockets)
- [ ] Advanced analytics platform

---

## 🎓 Learning Resources

### Next.js 14
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

### Prisma
- [Prisma Docs](https://www.prisma.io/docs)
- [Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## 🤝 Contributing to Architecture

When proposing architectural changes:

1. **Document the Problem**: What are we trying to solve?
2. **Propose Solution**: What's the technical approach?
3. **Trade-offs**: What are the pros/cons?
4. **Migration Path**: How do we get there?
5. **Testing Strategy**: How do we verify it works?

### Architecture Decision Records (ADR)

Create ADRs for significant decisions in `docs/adr/`:

```markdown
# ADR 001: Use Next.js App Router

## Status
Accepted

## Context
Need to choose between Pages Router and App Router for new project.

## Decision
Use Next.js 14 App Router with React Server Components.

## Consequences
- **Positive**: Better performance, modern patterns, type safety
- **Negative**: Newer API, smaller community knowledge base
- **Risks**: Migration complexity if we need to change later
```

---

## 📊 Architecture Metrics

### Key Performance Indicators

| Metric | Target | Current |
|--------|--------|---------|
| **Page Load Time** | < 2s | TBD |
| **API Response Time** | < 500ms | TBD |
| **Database Query Time** | < 100ms | TBD |
| **PDF Generation Time** | < 3s | TBD |
| **Uptime** | 99.9% | TBD |

### Monitoring Dashboard

Track in production:
- Request latency (p50, p95, p99)
- Error rate
- Database connection pool usage
- Memory/CPU utilization
- Active user sessions

---

## 🔧 Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "prisma.prisma",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

### Chrome DevTools Tips

- **React DevTools**: Debug component tree
- **Lighthouse**: Performance auditing
- **Network Tab**: Monitor API calls
- **Performance Tab**: Identify bottlenecks

---

## 🎯 Architecture Checklist

Before deploying to production:

- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Error tracking set up (Sentry)
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Rate limiting implemented
- [ ] Load testing completed
- [ ] Documentation updated

---

## 📞 Architecture Support

For architecture questions:
- Review this document first
- Check existing ADRs in `docs/adr/`
- Discuss in team meetings
- Document decisions made

---

**Architecture Version**: 1.0  
**Last Updated**: January 2025  
**Next Review**: March 2025

---

## Appendix A: Technology Comparison

### Why Not These Alternatives?

| Alternative | Why We Didn't Choose It |
|------------|-------------------------|
| **React + Express** | More boilerplate, separate deployments |
| **Remix** | Smaller ecosystem, less mature |
| **SvelteKit** | Team familiarity with React |
| **Ruby on Rails** | Prefer JavaScript/TypeScript full-stack |
| **Django** | Prefer JavaScript ecosystem |
| **MongoDB** | Need strong relational integrity |

### Alternative Considered for Future

- **tRPC**: Type-safe APIs (if we split frontend/backend)
- **GraphQL**: Flexible querying (for complex data needs)
- **Turborepo**: Monorepo management (if we add mobile app)

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **RSC** | React Server Components - server-rendered React components |
| **SSR** | Server-Side Rendering - HTML generated on server |
| **SSG** | Static Site Generation - HTML generated at build time |
| **ISR** | Incremental Static Regeneration - update static pages |
| **ORM** | Object-Relational Mapping - database abstraction layer |
| **ACID** | Atomicity, Consistency, Isolation, Durability |
| **CRUD** | Create, Read, Update, Delete operations |

---

