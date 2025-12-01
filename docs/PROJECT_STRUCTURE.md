# Project Structure Documentation

> Complete file and folder structure for Kinternationals Estimate Software

## 📋 Table of Contents

1. [Overview](#overview)
2. [Root Directory](#root-directory)
3. [App Directory (Next.js App Router)](#app-directory)
4. [Components Directory](#components-directory)
5. [Lib Directory](#lib-directory)
6. [Prisma Directory](#prisma-directory)
7. [Public Directory](#public-directory)
8. [Configuration Files](#configuration-files)
9. [Naming Conventions](#naming-conventions)

---

## 🎯 Overview

This project follows **Next.js 14 App Router** conventions with a clear separation of concerns:

- **`app/`** - Routes, pages, and layouts
- **`components/`** - Reusable React components
- **`lib/`** - Business logic, utilities, and services
- **`prisma/`** - Database schema and migrations
- **`public/`** - Static assets
- **`types/`** - TypeScript type definitions

---

## 📁 Root Directory

```
kinternationals-estimate/
├── app/                          # Next.js App Router
├── components/                   # React components
├── lib/                          # Business logic & utilities
├── prisma/                       # Database schema & migrations
├── public/                       # Static assets
├── types/                        # TypeScript types
├── config/                       # Configuration files
├── docs/                         # Documentation
├── tests/                        # Test files
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment template
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── .prettierrc                  # Prettier configuration
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── middleware.ts                # Next.js middleware (auth)
└── README.md                    # Project documentation
```

---

## 🗂️ App Directory

The `app/` directory uses Next.js 14 App Router with file-based routing.

```
app/
├── (auth)/                       # Authentication routes (route group)
│   ├── login/
│   │   ├── page.tsx             # Login page
│   │   └── loading.tsx          # Loading state
│   ├── register/
│   │   └── page.tsx             # Registration page
│   └── layout.tsx               # Auth layout (centered form)
│
├── (dashboard)/                  # Protected dashboard routes
│   ├── layout.tsx               # Dashboard layout (sidebar + header)
│   ├── page.tsx                 # Dashboard home
│   │
│   ├── customers/               # Customer management
│   │   ├── page.tsx             # Customer list (Server Component)
│   │   ├── loading.tsx          # Loading skeleton
│   │   ├── error.tsx            # Error boundary
│   │   ├── new/
│   │   │   └── page.tsx         # Create customer form
│   │   └── [id]/
│   │       ├── page.tsx         # Customer detail view
│   │       ├── edit/
│   │       │   └── page.tsx     # Edit customer form
│   │       └── loading.tsx
│   │
│   ├── products/                # Product catalog
│   │   ├── page.tsx             # Product list
│   │   ├── new/
│   │   │   └── page.tsx         # Create product
│   │   └── [id]/
│   │       ├── page.tsx         # Product detail
│   │       └── edit/
│   │           └── page.tsx     # Edit product
│   │
│   ├── categories/              # Product categories
│   │   ├── page.tsx             # Category management
│   │   └── new/
│   │       └── page.tsx         # Create category
│   │
│   ├── estimates/               # Estimate management
│   │   ├── page.tsx             # Estimate list
│   │   ├── new/
│   │   │   └── page.tsx         # Create estimate (Complex form)
│   │   └── [id]/
│   │       ├── page.tsx         # Estimate detail view
│   │       ├── edit/
│   │       │   └── page.tsx     # Edit estimate
│   │       ├── preview/
│   │       │   └── page.tsx     # PDF preview
│   │       └── duplicate/
│   │           └── page.tsx     # Duplicate estimate
│   │
│   ├── projects/                # Project tracking
│   │   ├── page.tsx             # Project list
│   │   └── [id]/
│   │       ├── page.tsx         # Project detail
│   │       └── edit/
│   │           └── page.tsx     # Edit project
│   │
│   ├── reports/                 # Reports & analytics
│   │   ├── page.tsx             # Reports dashboard
│   │   ├── sales/
│   │   │   └── page.tsx         # Sales reports
│   │   └── projects/
│   │       └── page.tsx         # Project reports
│   │
│   └── settings/                # Application settings
│       ├── page.tsx             # Settings home
│       ├── profile/
│       │   └── page.tsx         # User profile
│       ├── users/
│       │   └── page.tsx         # User management (Admin only)
│       └── company/
│           └── page.tsx         # Company settings
│
├── api/                         # API routes
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts         # NextAuth.js API handler
│   ├── pdf/
│   │   └── route.ts             # PDF generation endpoint
│   ├── export/
│   │   └── estimates/
│   │       └── route.ts         # Export estimates (CSV/Excel)
│   └── webhooks/
│       └── route.ts             # External webhooks
│
├── layout.tsx                   # Root layout (global styles, fonts)
├── page.tsx                     # Landing page (public)
├── loading.tsx                  # Global loading state
├── error.tsx                    # Global error boundary
├── not-found.tsx               # 404 page
└── globals.css                 # Global styles (Tailwind imports)
```

### Route Groups Explained

- **(auth)** - Parentheses create a route group without affecting URL
  - URL: `/login`, `/register`
  - Shared layout for authentication pages

- **(dashboard)** - Protected routes with dashboard layout
  - URL: `/customers`, `/estimates`, etc.
  - Shared sidebar and header

---

## 🧩 Components Directory

Organized by type and feature.

```
components/
├── ui/                          # Base UI components (shadcn/ui)
│   ├── button.tsx               # Button component
│   ├── input.tsx                # Input component
│   ├── label.tsx                # Label component
│   ├── card.tsx                 # Card component
│   ├── dialog.tsx               # Modal dialog
│   ├── dropdown-menu.tsx        # Dropdown menu
│   ├── select.tsx               # Select dropdown
│   ├── table.tsx                # Table component
│   ├── tabs.tsx                 # Tabs component
│   ├── badge.tsx                # Badge/chip component
│   ├── avatar.tsx               # Avatar component
│   ├── skeleton.tsx             # Loading skeleton
│   ├── toast.tsx                # Toast notifications
│   ├── alert.tsx                # Alert component
│   ├── form.tsx                 # Form wrapper
│   └── ... (other shadcn components)
│
├── layouts/                     # Layout components
│   ├── dashboard-layout.tsx     # Dashboard shell
│   ├── sidebar.tsx              # Sidebar navigation
│   ├── header.tsx               # Top header bar
│   ├── footer.tsx               # Footer
│   └── mobile-nav.tsx           # Mobile navigation
│
├── forms/                       # Form components
│   ├── customer-form.tsx        # Customer create/edit form
│   ├── product-form.tsx         # Product create/edit form
│   ├── category-form.tsx        # Category form
│   ├── estimate-form.tsx        # Estimate form (complex)
│   ├── project-form.tsx         # Project form
│   ├── login-form.tsx           # Login form
│   ├── register-form.tsx        # Registration form
│   └── form-fields/             # Reusable form fields
│       ├── text-field.tsx
│       ├── email-field.tsx
│       ├── phone-field.tsx
│       ├── address-field.tsx
│       ├── select-field.tsx
│       └── date-picker.tsx
│
├── customers/                   # Customer-specific components
│   ├── customer-list.tsx        # Customer table/grid
│   ├── customer-card.tsx        # Customer card view
│   ├── customer-details.tsx     # Customer detail display
│   ├── customer-filters.tsx     # Filter controls
│   └── customer-search.tsx      # Search component
│
├── products/                    # Product-specific components
│   ├── product-list.tsx         # Product table/grid
│   ├── product-card.tsx         # Product card
│   ├── product-details.tsx      # Product detail view
│   ├── product-filters.tsx      # Filter controls
│   ├── product-search.tsx       # Search component
│   └── product-image-gallery.tsx # Image gallery
│
├── categories/                  # Category components
│   ├── category-tree.tsx        # Hierarchical tree view
│   ├── category-list.tsx        # Flat list view
│   └── category-selector.tsx    # Category picker
│
├── estimates/                   # Estimate-specific components
│   ├── estimate-list.tsx        # Estimate table
│   ├── estimate-card.tsx        # Estimate card
│   ├── estimate-details.tsx     # Estimate detail view
│   ├── estimate-builder/        # Estimate creation wizard
│   │   ├── step-1-info.tsx      # Basic info step
│   │   ├── step-2-items.tsx     # Add items step
│   │   ├── step-3-pricing.tsx   # Pricing step
│   │   └── step-4-review.tsx    # Review step
│   ├── estimate-item-row.tsx    # Line item row
│   ├── estimate-summary.tsx     # Pricing summary
│   ├── estimate-preview.tsx     # PDF preview
│   └── estimate-filters.tsx     # Filter controls
│
├── projects/                    # Project components
│   ├── project-list.tsx         # Project table
│   ├── project-card.tsx         # Project card
│   ├── project-timeline.tsx     # Gantt chart / timeline
│   ├── project-status-badge.tsx # Status indicator
│   └── project-progress.tsx     # Progress bar
│
├── reports/                     # Report components
│   ├── sales-chart.tsx          # Sales chart (Chart.js/Recharts)
│   ├── project-chart.tsx        # Project analytics
│   ├── revenue-card.tsx         # Revenue KPI card
│   └── report-filters.tsx       # Date range filters
│
├── auth/                        # Authentication components
│   ├── login-button.tsx         # Login button
│   ├── logout-button.tsx        # Logout button
│   ├── auth-guard.tsx           # Route protection component
│   └── role-badge.tsx           # User role indicator
│
└── shared/                      # Shared/common components
    ├── loading-spinner.tsx      # Loading spinner
    ├── empty-state.tsx          # Empty state placeholder
    ├── error-message.tsx        # Error display
    ├── confirm-dialog.tsx       # Confirmation modal
    ├── data-table.tsx           # Generic data table
    ├── search-input.tsx         # Search input with debounce
    ├── pagination.tsx           # Pagination controls
    ├── breadcrumbs.tsx          # Breadcrumb navigation
    ├── status-badge.tsx         # Generic status badge
    └── page-header.tsx          # Page title + actions
```

---

## 📚 Lib Directory

Business logic, utilities, and services.

```
lib/
├── actions/                     # Server Actions
│   ├── auth.ts                  # Authentication actions
│   ├── customers.ts             # Customer CRUD actions
│   ├── products.ts              # Product CRUD actions
│   ├── categories.ts            # Category CRUD actions
│   ├── estimates.ts             # Estimate CRUD + calculations
│   ├── projects.ts              # Project CRUD actions
│   └── users.ts                 # User management actions
│
├── services/                    # Business logic services
│   ├── pricing-service.ts       # Pricing calculations
│   ├── pdf-service.ts           # PDF generation
│   ├── email-service.ts         # Email notifications
│   ├── export-service.ts        # Data export (CSV/Excel)
│   ├── validation-service.ts    # Zod schemas
│   └── analytics-service.ts     # Analytics calculations
│
├── auth/                        # Authentication
│   ├── auth.config.ts           # NextAuth configuration
│   ├── auth.ts                  # Auth helpers
│   └── session.ts               # Session utilities
│
├── db/                          # Database utilities
│   ├── index.ts                 # Prisma client instance
│   ├── queries/                 # Complex queries
│   │   ├── estimates.ts         # Estimate queries
│   │   ├── customers.ts         # Customer queries
│   │   └── reports.ts           # Report queries
│   └── seed.ts                  # Database seeding
│
├── hooks/                       # Custom React hooks
│   ├── use-debounce.ts          # Debounce hook
│   ├── use-media-query.ts       # Responsive hook
│   ├── use-toast.ts             # Toast notifications
│   └── use-pagination.ts        # Pagination logic
│
├── utils/                       # Utility functions
│   ├── format.ts                # Formatting (currency, date)
│   ├── calculations.ts          # Math utilities
│   ├── constants.ts             # App constants
│   ├── cn.ts                    # Class name utility (clsx)
│   ├── validators.ts            # Validation helpers
│   └── helpers.ts               # General helpers
│
└── pdf/                         # PDF templates
    ├── estimate-template.tsx    # Estimate PDF template
    └── invoice-template.tsx     # Invoice PDF template
```

### Key Files Explained

#### `lib/actions/estimates.ts`
```typescript
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { estimateSchema } from '@/lib/services/validation-service'

export async function createEstimate(data: z.infer<typeof estimateSchema>) {
  // Validate, create estimate, calculate totals
  // Returns { success: boolean, estimate?: Estimate, error?: string }
}

export async function updateEstimate(id: string, data: any) {
  // Update estimate
}

export async function deleteEstimate(id: string) {
  // Soft delete or hard delete
}
```

#### `lib/services/pricing-service.ts`
```typescript
export class PricingService {
  static calculateLineTotal(quantity: number, unitPrice: number, taxRate: number) {
    // Line item calculation
  }

  static calculateEstimateTotal(items: EstimateItem[], discountPercent: number) {
    // Calculate subtotal, tax, discount, total
  }

  static applyDiscount(subtotal: number, discountPercent: number) {
    // Discount calculation
  }
}
```

---

## 🗃️ Prisma Directory

Database schema, migrations, and seeding.

```
prisma/
├── schema.prisma                # Main Prisma schema
├── migrations/                  # Migration history
│   ├── 20250101000000_init/
│   │   └── migration.sql
│   ├── 20250102000000_add_projects/
│   │   └── migration.sql
│   └── migration_lock.toml
├── seed.ts                      # Database seeding script
└── seed-data/                   # Seed data (JSON/CSV)
    ├── categories.json
    ├── products.json
    └── users.json
```

### seed.ts Example
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@kinternationals.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  })

  // Create categories
  await prisma.category.createMany({
    data: [
      { name: 'Cabinets', slug: 'cabinets' },
      { name: 'Countertops', slug: 'countertops' },
      // ...
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
```

---

## 🖼️ Public Directory

Static assets served at root URL.

```
public/
├── images/
│   ├── logo.svg                 # Company logo
│   ├── logo-dark.svg            # Dark mode logo
│   ├── placeholder.png          # Image placeholder
│   └── products/                # Product images
│       └── ...
├── fonts/                       # Custom fonts
│   └── ...
├── icons/                       # Icon assets
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── ...
├── documents/                   # Static documents
│   └── terms-and-conditions.pdf
└── templates/                   # Document templates
    └── estimate-template.pdf
```

---

## ⚙️ Configuration Files

### Root Configuration Files

#### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'yourdomain.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

#### `package.json`
```json
{
  "name": "kinternationals-estimate",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.7.1",
    "next-auth": "^5.0.0-beta.4",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.4",
    "react-hook-form": "@hookform/resolvers": "^3.3.3",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@react-pdf/renderer": "^3.1.14",
    "date-fns": "^3.0.6",
    "lucide-react": "^0.303.0",
    "sonner": "^1.3.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/bcryptjs": "^2.4.6",
    "typescript": "^5",
    "prisma": "^5.7.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10.4.16",
    "tsx": "^4.7.0"
  }
}
```

#### `.env.example`
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kinternationals_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Kinternationals Estimate"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@kinternationals.com"
```

#### `middleware.ts` (Root level)
```typescript
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Custom middleware logic
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}
```

---

## 📝 Naming Conventions

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| **Components** | PascalCase | `CustomerForm.tsx` |
| **Pages** | lowercase | `page.tsx` |
| **Actions** | kebab-case | `customer-actions.ts` |
| **Utils** | kebab-case | `format-currency.ts` |
| **Types** | PascalCase | `EstimateTypes.ts` |

### Code Naming

```typescript
// Components: PascalCase
function CustomerList() {}

// Functions: camelCase
function calculateTotal() {}

// Constants: UPPER_SNAKE_CASE
const MAX_ITEMS = 100

// Types/Interfaces: PascalCase
interface Customer {}
type EstimateStatus = 'DRAFT' | 'SENT'

// Enums: PascalCase
enum UserRole {
  ADMIN = 'ADMIN',
  SALES = 'SALES'
}
```

---

## 📂 Types Directory

```
types/
├── index.ts                     # Main type exports
├── customer.ts                  # Customer types
├── product.ts                   # Product types
├── estimate.ts                  # Estimate types
├── project.ts                   # Project types
├── user.ts                      # User types
└── api.ts                       # API response types
```

### Example: `types/estimate.ts`
```typescript
import { Prisma } from '@prisma/client'

// Extend Prisma types
export type EstimateWithRelations = Prisma.EstimateGetPayload<{
  include: {
    customer: true
    items: {
      include: { product: true }
    }
    user: true
  }
}>

// Custom types
export type EstimateFormData = {
  customerId: string
  title: string
  description?: string
  items: EstimateItemInput[]
  discountPercent?: number
}

export type EstimateItemInput = {
  productId?: string
  description: string
  quantity: number
  unitPrice: number
}
```

---

## 🧪 Tests Directory

```
tests/
├── unit/                        # Unit tests
│   ├── services/
│   │   ├── pricing-service.test.ts
│   │   └── validation-service.test.ts
│   └── utils/
│       └── calculations.test.ts
├── integration/                 # Integration tests
│   ├── api/
│   │   └── estimates.test.ts
│   └── actions/
│       └── customers.test.ts
└── e2e/                        # End-to-end tests
    ├── auth.spec.ts
    ├── estimates.spec.ts
    └── customers.spec.ts
```

---

## 📐 Best Practices

### 1. Component Organization
- Keep components focused (Single Responsibility)
- Use composition over props drilling
- Extract complex logic to custom hooks

### 2. Server vs Client Components
```typescript
// ✅ Server Component (default)
async function ProductList() {
  const products = await prisma.product.findMany()
  return <div>...</div>
}

// ✅ Client Component (interactive)
'use client'
function ProductFilter() {
  const [filter, setFilter] = useState('')
  return <input onChange={(e) => setFilter(e.target.value)} />
}
```

### 3. Import Aliases
```typescript
// Use @ alias for clean imports
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { calculateTotal } from '@/lib/utils/calculations'
```

### 4. Co-location
Keep related files together:
```
estimates/
├── page.tsx                    # Main page
├── loading.tsx                 # Loading state
├── error.tsx                   # Error boundary
└── _components/                # Private components
    ├── estimate-table.tsx
    └── estimate-filters.tsx
```

---

## 🎯 Summary

This structure provides:

✅ **Clear separation of concerns**
✅ **Scalable organization**
✅ **Easy navigation**
✅ **Type safety throughout**
✅ **Consistent naming**
✅ **Maintainable codebase**

**Next Steps**:
1. Initialize Next.js project
2. Set up folder structure
3. Install dependencies
4. Configure Prisma
5. Start building features

---

**Last Updated**: January 2025
