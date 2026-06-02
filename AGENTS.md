# Ciah Accessorize - AI Development Guide

## Project Overview

Build a production-ready ecommerce website for Ciah Accessorize, a Kenyan fashion accessories and bags brand.

The platform should support:

- Ladies Bags
- Gents Bags
- Handbags
- Tote Bags
- Sling Bags
- Mini Bags
- Office Bags
- Travel Bags

The website should be modern, responsive, SEO optimized, mobile-first, and production ready.

---

# Tech Stack

## Frontend

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Valibot

## Backend

- Next.js Server Actions
- Prisma ORM
- PostgreSQL

## Authentication

- Auth.js (NextAuth)

## File Storage

- Cloudinary

## Payment Gateway

- M-Pesa Daraja API

## Deployment

- Vercel

---

# Branding

Business Name:

Ciah Accessorize

Brand Style:

- Premium
- Elegant
- Modern
- Minimalist

Primary Colors:

- #000000
- #FFFFFF
- #D6C2A6
- #8B5E3C
- #F5D5D8

Typography:

- Modern Sans Serif
- Clean and Luxury Feel

Use the supplied logo throughout the website.

---

# Customer Features

## Authentication

- Register
- Login
- Logout
- Forgot Password
- Account Settings

## Store

- Product Listing
- Product Search
- Product Filters
- Product Categories
- Product Reviews
- Wishlist
- Cart
- Checkout

## Orders

- Order History
- Order Tracking
- Payment Status

---

# Admin Features

## Dashboard

- Revenue Analytics
- Orders Analytics
- Customer Analytics
- Inventory Analytics

## Product Management

- Add Product
- Edit Product
- Delete Product
- Upload Multiple Images
- Manage Inventory

## Category Management

- Add Category
- Edit Category
- Delete Category

## Order Management

- View Orders
- Update Order Status
- Process Orders

## Customer Management

- View Customers
- View Order History

---

# Product Fields

Every Product Must Include:

- Name
- Slug
- Description
- Price
- Discount Price
- Category
- Gender
- Material
- Color
- Size
- Stock
- Featured
- Published
- Images

---

# Categories

Default Categories:

- Ladies Bags
- Gents Bags
- Handbags
- Tote Bags
- Sling Bags
- Mini Bags
- Office Bags
- Travel Bags

---

# SEO Requirements

Every page must include:

- Meta Title
- Meta Description
- Open Graph Tags
- Twitter Cards
- Canonical URLs

Implement:

- robots.txt
- sitemap.xml
- Product Schema
- Organization Schema
- Breadcrumb Schema

SEO Keywords:

- Ciah Accessorize
- Bags Kenya
- Handbags Kenya
- Ladies Bags Kenya
- Gents Bags Kenya
- Affordable Bags Nairobi
- Fashion Accessories Kenya

---

# Performance Requirements

Target Lighthouse Score:

- Performance 90+
- SEO 90+
- Accessibility 90+
- Best Practices 90+

Use:

- next/image
- Lazy Loading
- Server Components
- Code Splitting
- Optimized Queries

---

# Security Requirements

- Role Based Access Control
- Protected Admin Routes
- Secure API Routes
- Rate Limiting
- Environment Variables
- Secure M-Pesa Integration

Never expose secrets on the frontend.

---

# Coding Standards

- TypeScript Strict Mode
- Reusable Components
- Clean Architecture
- Proper Error Handling
- Strong Typing
- Valibot Validation
- ESLint
- Prettier

---

# Deployment

Deployment Target:

- Vercel

Database:

- PostgreSQL

Storage:

- Cloudinary

Payments:

- M-Pesa Daraja API

The project must build successfully with:

npm run build

without warnings or errors.