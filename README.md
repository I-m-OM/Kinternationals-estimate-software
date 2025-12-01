# Kinternationals Estimate Software

> A modern, full-stack Kitchen Estimation & Quotation Management System built with Next.js 14, PostgreSQL, and TypeScript.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)](https://www.prisma.io/)

## 🎯 Project Overview

Kinternationals Estimate Software is a comprehensive solution for kitchen design and installation businesses to:

- ✅ Create detailed kitchen estimates with real-time pricing
- 📊 Manage customer relationships and project history
- 🏗️ Maintain product catalogs (cabinets, countertops, hardware)
- 📄 Generate professional PDF quotations
- 👥 Handle multi-user access with role-based permissions
- 📈 Track project status from estimate to completion

---

## 🚀 Tech Stack

### Core Technologies
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL 15+](https://www.postgresql.org/)
- **ORM**: [Prisma 5](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5](https://next-auth.js.org/)

### UI/UX
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Additional Libraries
- **PDF Generation**: [react-pdf/renderer](https://react-pdf.org/)
- **State Management**: React Context + Server Actions
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Notifications**: [sonner](https://sonner.emilkowal.ski/)

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.17 or higher
- **npm** or **pnpm** (recommended)
- **PostgreSQL** 15+ installed and running
- **Git** for version control

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/I-m-OM/Kinternationals-estimate-software.git
cd Kinternationals-estimate-software
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended for faster installs)
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kinternationals_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Kinternationals Estimate"

# Optional: Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with sample data (optional)
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
kinternationals-estimate/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   ├── (dashboard)/         # Protected dashboard routes
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── forms/               # Form components
│   ├── estimates/           # Estimate-specific components
│   └── layouts/             # Layout components
├── lib/                     # Utility functions
│   ├── db/                  # Database utilities
│   ├── auth/                # Authentication helpers
│   ├── actions/             # Server Actions
│   └── utils/               # Helper functions
├── prisma/                  # Prisma ORM
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Migration files
│   └── seed.ts              # Database seeding
├── public/                  # Static assets
├── types/                   # TypeScript type definitions
└── config/                  # Configuration files
```

See [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) for detailed explanations.

---

## 🎨 Features

### Phase 1: Core Functionality ✅
- [ ] User Authentication (Login/Register)
- [ ] Customer Management (CRUD)
- [ ] Product Catalog Management
- [ ] Basic Estimate Creation

### Phase 2: Advanced Features 🚧
- [ ] Dynamic Estimate Builder
- [ ] Real-time Pricing Calculations
- [ ] PDF Quote Generation
- [ ] Project Status Tracking

### Phase 3: Enhancement 📅
- [ ] Advanced Reporting & Analytics
- [ ] Email Notifications
- [ ] Multi-currency Support
- [ ] Mobile Responsive Design

---

## 🗄️ Database Schema

Our PostgreSQL database includes:

- **Users** - Authentication and user management
- **Customers** - Client information
- **Products** - Kitchen components catalog
- **Estimates** - Project estimates/quotes
- **EstimateItems** - Line items in estimates
- **Projects** - Project tracking

See [docs/DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) for complete schema details.

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

---

## 📦 Build & Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t kinternationals-estimate .

# Run container
docker run -p 3000:3000 kinternationals-estimate
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## 🔐 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `NEXTAUTH_SECRET` | Authentication secret | ✅ |
| `NEXT_PUBLIC_APP_URL` | Public app URL | ✅ |
| `SMTP_HOST` | Email server host | ❌ |
| `SMTP_PORT` | Email server port | ❌ |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Commit Convention
```
feat: Add new feature
fix: Bug fix
docs: Documentation updates
style: Code style changes
refactor: Code refactoring
test: Test updates
chore: Maintenance tasks
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Reset database
npx prisma migrate reset
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Prisma Client Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Project Structure](./docs/PROJECT_STRUCTURE.md)
- [API Reference](./docs/API_REFERENCE.md) _(Coming Soon)_
- [Deployment Guide](./docs/DEPLOYMENT.md) _(Coming Soon)_

---

## 📞 Support

For questions or issues:
- 📧 Email: support@kinternationals.com
- 🐛 Issues: [GitHub Issues](https://github.com/I-m-OM/Kinternationals-estimate-software/issues)

---

## 📄 License

This project is proprietary software owned by Kinternationals.

---

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies.

**Development Status**: 🚧 Active Development

**Last Updated**: January 2025
