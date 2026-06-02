# Ciah Accessorize

A production-ready ecommerce platform for Ciah Accessorize, a premium fashion accessories and bags brand based in Kenya.

## Overview

Ciah Accessorize is a modern, responsive, and SEO-optimized ecommerce website that showcases a curated collection of ladies bags, gents bags, handbags, tote bags, sling bags, mini bags, office bags, and travel bags.

### Key Features

- **Product Catalog**: Browse and filter premium accessories and bags
- **User Authentication**: Secure registration, login, and account management
- **Shopping Cart**: Easy-to-use cart management
- **Order Management**: Track orders and payment status
- **Admin Dashboard**: Manage products, categories, inventory, and orders
- **SEO Optimized**: Full SEO support with metadata, sitemaps, and structured data
- **Performance**: Optimized for Lighthouse scores (90+)

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Reusable component library
- **React Hook Form** - Efficient form management
- **Valibot** - Lightweight validation

### Backend
- **Next.js Server Actions** - Server-side operations
- **Prisma ORM** - Database management
- **PostgreSQL** - Relational database

### Additional Services
- **Auth.js (NextAuth)** - Authentication and authorization
- **Cloudinary** - Image hosting and optimization
- **M-Pesa Daraja API** - Payment processing

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ciah-accessorize
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual configuration:
- Database connection string
- NextAuth credentials
- Cloudinary API keys
- M-Pesa Daraja credentials

4. **Set up the database**
```bash
npx prisma migrate dev --name init
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── home/             # Home page components
├── config/               # Site configuration
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── utils.ts         # Common utilities
│   └── validations/     # Valibot schemas
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── types/               # TypeScript type definitions
└── .env.local          # Environment variables (not committed)
```

## Development

### Running Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run TypeScript type checking
npx tsc --noEmit
```

### Database Management

```bash
# Create a new migration
npx prisma migrate dev --name <migration-name>

# Run migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

## Performance Targets

- **Lighthouse Performance**: 90+
- **Lighthouse SEO**: 90+
- **Lighthouse Accessibility**: 90+
- **Lighthouse Best Practices**: 90+

## Code Standards

- **TypeScript Strict Mode** enabled
- **ESLint** for code quality
- **Prettier** for code formatting
- **Valibot** for runtime validation
- **Accessibility best practices** (WCAG)
- **Server components** for optimal performance
- **Server-side rendering** where beneficial

## Branding Guidelines

### Brand Colors
- Primary: #000000 (Black)
- Accent: #D6C2A6 (Tan)
- Dark Brown: #8B5E3C
- Light Pink: #F5D5D8
- White: #FFFFFF

### Typography
- Modern Sans-Serif fonts
- Clean and luxury aesthetic
- Elegant spacing and hierarchy

## Deployment

The application is optimized for deployment on **Vercel**:

```bash
# Deploy to Vercel
npm run build
vercel deploy
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] All secrets secured
- [ ] Build succeeds without warnings
- [ ] Linting passes
- [ ] Tests pass
- [ ] SEO meta tags configured
- [ ] Lighthouse scores validated

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

Copyright © 2026 Ciah Accessorize. All rights reserved.
