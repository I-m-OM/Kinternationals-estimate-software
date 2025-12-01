# Database Schema Documentation

> Complete PostgreSQL database schema for Kinternationals Estimate Software

## 📋 Table of Contents

1. [Overview](#overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Schema Tables](#schema-tables)
4. [Prisma Schema](#prisma-schema)
5. [Relationships](#relationships)
6. [Indexes & Performance](#indexes--performance)
7. [Data Types & Constraints](#data-types--constraints)
8. [Migration Strategy](#migration-strategy)

---

## 🎯 Overview

Our database uses **PostgreSQL 15+** with **Prisma ORM** for type-safe database access. The schema is designed to handle:

- User authentication and authorization
- Customer relationship management
- Product catalog with variants
- Dynamic estimate creation with line items
- Project tracking and status management
- Audit trails for critical operations

### Design Principles

1. **Normalization**: 3NF compliance to reduce redundancy
2. **Referential Integrity**: Foreign keys with cascade rules
3. **Soft Deletes**: Critical data is archived, not deleted
4. **Audit Trail**: Track who created/updated records and when
5. **Flexibility**: JSON fields for dynamic configurations

---

## 🗂️ Entity Relationship Diagram

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ 1:N
       │
       ▼
┌─────────────┐      N:1      ┌──────────────┐
│  Estimate   │◄───────────────┤   Customer   │
└──────┬──────┘                └──────────────┘
       │
       │ 1:N
       │
       ▼
┌─────────────────┐    N:1    ┌──────────────┐
│  EstimateItem   │───────────►│   Product    │
└─────────────────┘            └──────┬───────┘
                                      │
                                      │ 1:N
                                      │
                                      ▼
                               ┌──────────────┐
                               │   Category   │
                               └──────────────┘

┌─────────────┐      1:1      ┌──────────────┐
│  Estimate   │◄──────────────┤   Project    │
└─────────────┘                └──────────────┘
```

---

## 📊 Schema Tables

### 1. **User** - Authentication & Authorization

Stores user accounts for the system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid_generate_v4() | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email (login) |
| `name` | VARCHAR(255) | NOT NULL | Full name |
| `password` | TEXT | NOT NULL | Hashed password |
| `role` | ENUM | NOT NULL, Default: 'SALES' | User role |
| `avatar` | TEXT | NULL | Profile picture URL |
| `isActive` | BOOLEAN | NOT NULL, Default: true | Account status |
| `createdAt` | TIMESTAMP | NOT NULL, Default: now() | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL | Last update timestamp |

**Roles**: `ADMIN`, `MANAGER`, `SALES`

---

### 2. **Customer** - Client Information

Stores customer/client details.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Customer name |
| `email` | VARCHAR(255) | NULL | Email address |
| `phone` | VARCHAR(20) | NULL | Phone number |
| `address` | TEXT | NULL | Full address |
| `city` | VARCHAR(100) | NULL | City |
| `state` | VARCHAR(100) | NULL | State/Province |
| `zipCode` | VARCHAR(20) | NULL | ZIP/Postal code |
| `country` | VARCHAR(100) | NOT NULL, Default: 'India' | Country |
| `notes` | TEXT | NULL | Additional notes |
| `isActive` | BOOLEAN | NOT NULL, Default: true | Active status |
| `createdById` | UUID | FK → User(id) | Created by user |
| `createdAt` | TIMESTAMP | NOT NULL | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL | Last update timestamp |

---

### 3. **Category** - Product Categories

Hierarchical product categorization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Category name |
| `slug` | VARCHAR(100) | NOT NULL, UNIQUE | URL-friendly slug |
| `description` | TEXT | NULL | Category description |
| `parentId` | UUID | FK → Category(id), NULL | Parent category |
| `displayOrder` | INTEGER | NOT NULL, Default: 0 | Sort order |
| `isActive` | BOOLEAN | NOT NULL, Default: true | Active status |
| `createdAt` | TIMESTAMP | NOT NULL | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL | Last update timestamp |

**Examples**: Cabinets, Countertops, Hardware, Appliances

---

### 4. **Product** - Product Catalog

Kitchen components and materials.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `sku` | VARCHAR(50) | UNIQUE, NOT NULL | Stock keeping unit |
| `name` | VARCHAR(255) | NOT NULL | Product name |
| `description` | TEXT | NULL | Detailed description |
| `categoryId` | UUID | FK → Category(id), NOT NULL | Product category |
| `unit` | VARCHAR(20) | NOT NULL, Default: 'piece' | Unit of measure |
| `basePrice` | DECIMAL(10,2) | NOT NULL | Base price |
| `costPrice` | DECIMAL(10,2) | NULL | Cost price (for margin calc) |
| `taxRate` | DECIMAL(5,2) | NOT NULL, Default: 18.00 | Tax percentage |
| `specifications` | JSONB | NULL | Product specs (JSON) |
| `images` | TEXT[] | NULL | Array of image URLs |
| `isActive` | BOOLEAN | NOT NULL, Default: true | Active status |
| `stockQuantity` | INTEGER | NULL | Available stock |
| `createdAt` | TIMESTAMP | NOT NULL | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL | Last update timestamp |

**Specifications JSON Example**:
```json
{
  "material": "Plywood",
  "finish": "Laminate",
  "dimensions": {
    "width": 600,
    "height": 900,
    "depth": 560
  },
  "color": "White"
}
```

---

### 5. **Estimate** - Project Estimates/Quotes

Main estimate/quotation document.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `estimateNumber` | VARCHAR(50) | UNIQUE, NOT NULL | Human-readable ID |
| `customerId` | UUID | FK → Customer(id), NOT NULL | Customer reference |
| `userId` | UUID | FK → User(id), NOT NULL | Created by user |
| `title` | VARCHAR(255) | NOT NULL | Estimate title |
| `description` | TEXT | NULL | Project description |
| `status` | ENUM | NOT NULL, Default: 'DRAFT' | Estimate status |
| `validUntil` | DATE | NULL | Quote validity date |
| `subtotal` | DECIMAL(12,2) | NOT NULL, Default: 0 | Sum of items |
| `discountPercent` | DECIMAL(5,2) | Default: 0 | Discount percentage |
| `discountAmount` | DECIMAL(10,2) | Default: 0 | Fixed discount |
| `taxAmount` | DECIMAL(10,2) | NOT NULL, Default: 0 | Total tax |
| `total` | DECIMAL(12,2) | NOT NULL, Default: 0 | Final total |
| `notes` | TEXT | NULL | Internal notes |
| `termsAndConditions` | TEXT | NULL | T&C for this estimate |
| `createdAt` | TIMESTAMP | NOT NULL | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL | Last update timestamp |

**Status Values**: `DRAFT`, `SENT`, `ACCEPTED`, `REJECTED`, `EXPIRED`

**Estimate Number Format**: `EST-2025-0001`

---

### 6. **EstimateItem** - Line Items in Estimates

Individual products/services in an estimate.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `estimateId` | UUID | FK → Estimate(id), NOT NULL, CASCADE | Parent estimate |
| `productId` | UUID | FK → Product(id), NULL | Product reference |
| `description` | VARCHAR(500) | NOT NULL | Item description |
| `quantity` | DECIMAL(10,2) | NOT NULL | Quantity |
| `unit` | VARCHAR(20) | NOT NULL | Unit of measure |
| `unitPrice` | DECIMAL(10,2) | NOT NULL | Price per unit |
| `taxRate` | DECIMAL(5,2) | NOT NULL | Tax percentage |
| `taxAmount` | DECIMAL(10,2) | NOT NULL | Calculated tax |
| `lineTotal` | DECIMAL(12,2) | NOT NULL | Total for this line |
| `displayOrder` | INTEGER | NOT NULL, Default: 0 | Sort order |
| `specifications` | JSONB | NULL | Custom specs |
| `createdAt` | TIMESTAMP | NOT NULL | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL | Last update timestamp |

**Note**: `productId` can be NULL for custom items not in catalog.

---

### 7. **Project** - Project Tracking

Links estimates to actual projects after acceptance.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `projectNumber` | VARCHAR(50) | UNIQUE, NOT NULL | Human-readable ID |
| `estimateId` | UUID | FK → Estimate(id), UNIQUE, NOT NULL | Source estimate |
| `status` | ENUM | NOT NULL, Default: 'PLANNING' | Project status |
| `startDate` | DATE | NULL | Planned start date |
| `endDate` | DATE | NULL | Planned end date |
| `actualStartDate` | DATE | NULL | Actual start date |
| `actualEndDate` | DATE | NULL | Actual end date |
| `progressPercent` | INTEGER | Default: 0, CHECK: 0-100 | Completion % |
| `assignedToId` | UUID | FK → User(id), NULL | Assigned team member |
| `notes` | TEXT | NULL | Project notes |
| `createdAt` | TIMESTAMP | NOT NULL | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL | Last update timestamp |

**Status Values**: `PLANNING`, `IN_PROGRESS`, `ON_HOLD`, `COMPLETED`, `CANCELLED`

**Project Number Format**: `PRJ-2025-0001`

---

## 🔗 Relationships

### One-to-Many (1:N)

```
User → Estimate (1 user creates many estimates)
User → Customer (1 user creates many customers)
Customer → Estimate (1 customer has many estimates)
Estimate → EstimateItem (1 estimate has many items)
Category → Product (1 category has many products)
Product → EstimateItem (1 product in many estimate items)
Category → Category (Self-referential for hierarchy)
```

### One-to-One (1:1)

```
Estimate ↔ Project (1 estimate becomes 1 project)
```

---

## 🗄️ Prisma Schema

Complete Prisma schema for copy-paste into `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enums
enum UserRole {
  ADMIN
  MANAGER
  SALES
}

enum EstimateStatus {
  DRAFT
  SENT
  ACCEPTED
  REJECTED
  EXPIRED
}

enum ProjectStatus {
  PLANNING
  IN_PROGRESS
  ON_HOLD
  COMPLETED
  CANCELLED
}

// Models
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  role      UserRole @default(SALES)
  avatar    String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  estimates       Estimate[]
  customers       Customer[]
  assignedProjects Project[]

  @@map("users")
}

model Customer {
  id          String   @id @default(uuid())
  name        String
  email       String?
  phone       String?
  address     String?
  city        String?
  state       String?
  zipCode     String?
  country     String   @default("India")
  notes       String?
  isActive    Boolean  @default(true)
  createdById String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  createdBy User       @relation(fields: [createdById], references: [id])
  estimates Estimate[]

  @@map("customers")
}

model Category {
  id           String   @id @default(uuid())
  name         String   @unique
  slug         String   @unique
  description  String?
  parentId     String?
  displayOrder Int      @default(0)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
  products Product[]

  @@map("categories")
}

model Product {
  id             String   @id @default(uuid())
  sku            String   @unique
  name           String
  description    String?
  categoryId     String
  unit           String   @default("piece")
  basePrice      Decimal  @db.Decimal(10, 2)
  costPrice      Decimal? @db.Decimal(10, 2)
  taxRate        Decimal  @default(18.00) @db.Decimal(5, 2)
  specifications Json?
  images         String[]
  isActive       Boolean  @default(true)
  stockQuantity  Int?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  category      Category       @relation(fields: [categoryId], references: [id])
  estimateItems EstimateItem[]

  @@map("products")
}

model Estimate {
  id                 String         @id @default(uuid())
  estimateNumber     String         @unique
  customerId         String
  userId             String
  title              String
  description        String?
  status             EstimateStatus @default(DRAFT)
  validUntil         DateTime?
  subtotal           Decimal        @default(0) @db.Decimal(12, 2)
  discountPercent    Decimal        @default(0) @db.Decimal(5, 2)
  discountAmount     Decimal        @default(0) @db.Decimal(10, 2)
  taxAmount          Decimal        @default(0) @db.Decimal(10, 2)
  total              Decimal        @default(0) @db.Decimal(12, 2)
  notes              String?
  termsAndConditions String?
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt

  // Relations
  customer Customer       @relation(fields: [customerId], references: [id])
  user     User           @relation(fields: [userId], references: [id])
  items    EstimateItem[]
  project  Project?

  @@map("estimates")
}

model EstimateItem {
  id             String   @id @default(uuid())
  estimateId     String
  productId      String?
  description    String
  quantity       Decimal  @db.Decimal(10, 2)
  unit           String
  unitPrice      Decimal  @db.Decimal(10, 2)
  taxRate        Decimal  @db.Decimal(5, 2)
  taxAmount      Decimal  @db.Decimal(10, 2)
  lineTotal      Decimal  @db.Decimal(12, 2)
  displayOrder   Int      @default(0)
  specifications Json?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  estimate Estimate @relation(fields: [estimateId], references: [id], onDelete: Cascade)
  product  Product? @relation(fields: [productId], references: [id])

  @@map("estimate_items")
}

model Project {
  id              String        @id @default(uuid())
  projectNumber   String        @unique
  estimateId      String        @unique
  status          ProjectStatus @default(PLANNING)
  startDate       DateTime?
  endDate         DateTime?
  actualStartDate DateTime?
  actualEndDate   DateTime?
  progressPercent Int           @default(0)
  assignedToId    String?
  notes           String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  estimate   Estimate @relation(fields: [estimateId], references: [id])
  assignedTo User?    @relation(fields: [assignedToId], references: [id])

  @@map("projects")
}
```

---

## 🔍 Indexes & Performance

### Recommended Indexes

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role) WHERE is_active = true;

-- Customer searches
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_created_by ON customers(created_by_id);

-- Product catalog
CREATE INDEX idx_products_category ON products(category_id) WHERE is_active = true;
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_name_gin ON products USING gin(to_tsvector('english', name));

-- Estimate queries
CREATE INDEX idx_estimates_customer ON estimates(customer_id);
CREATE INDEX idx_estimates_user ON estimates(user_id);
CREATE INDEX idx_estimates_status ON estimates(status);
CREATE INDEX idx_estimates_created_at ON estimates(created_at DESC);
CREATE INDEX idx_estimates_number ON estimates(estimate_number);

-- Estimate items
CREATE INDEX idx_estimate_items_estimate ON estimate_items(estimate_id);
CREATE INDEX idx_estimate_items_product ON estimate_items(product_id);

-- Project tracking
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_assigned ON projects(assigned_to_id);
CREATE INDEX idx_projects_estimate ON projects(estimate_id);
```

---

## 🛡️ Data Types & Constraints

### Decimal Precision

- **Prices**: `DECIMAL(10,2)` - Up to 99,999,999.99
- **Totals**: `DECIMAL(12,2)` - Up to 9,999,999,999.99
- **Percentages**: `DECIMAL(5,2)` - Up to 999.99%
- **Quantities**: `DECIMAL(10,2
