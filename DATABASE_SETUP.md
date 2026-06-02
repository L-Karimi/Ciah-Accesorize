# Database Setup and Migration Guide

This guide explains how to set up and manage the Ciah Accessorize database.

## Prerequisites

Before running migrations and seeding, ensure you have:

1. **PostgreSQL** installed and running
2. **Database created** (or credentials to create one)
3. **Environment variables** configured in `.env.local`

## Step 1: Configure Database Connection

Edit `.env.local` with your PostgreSQL connection details:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ciah_accessorize"
```

Format:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

## Step 2: Update Prisma Configuration

The `prisma.config.js` file automatically reads DATABASE_URL from environment variables:

```javascript
module.exports = {
  datasourceUrl: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/ciah_accessorize",
};
```

## Step 3: Generate Prisma Client

Generate the Prisma Client based on the schema:

```bash
npm run db:generate
```

This creates:
- `node_modules/@prisma/client` - Prisma client library
- `prisma/schema.prisma` - Validated schema
- Type definitions for all models

## Step 4: Create Initial Migration

Create the first migration from the schema:

```bash
npm run db:migrate -- --name init
```

This will:
1. Validate the schema
2. Generate SQL migration file
3. Execute the migration
4. Update `prisma/migrations` directory

**Migration will be saved to**: `prisma/migrations/{timestamp}-init/migration.sql`

## Step 5: Seed the Database

Populate the database with sample data:

```bash
npm run db:seed
```

This will create:
- ✅ 8 product categories
- ✅ 10 sample products with images
- ✅ Sample customer account
- ✅ Sample orders and payments
- ✅ Sample reviews

## Step 6: Verify Database

Open Prisma Studio to view the data:

```bash
npm run db:studio
```

This opens a visual database explorer at `http://localhost:5555`

## Database Schema Summary

### Tables Created

| Table | Records | Purpose |
|-------|---------|---------|
| users | 1 | Customer accounts |
| categories | 8 | Product categories |
| products | 10 | Product catalog |
| product_images | 5+ | Product images |
| cart_items | 1+ | Shopping cart |
| wishlists | 1+ | Saved products |
| orders | 1+ | Customer orders |
| order_items | 2+ | Items in orders |
| payments | 1+ | Payment records |
| addresses | 1+ | Shipping addresses |
| reviews | 2+ | Product reviews |

### Key Models

**User**
- id, email, password, name, phone
- role (CUSTOMER/ADMIN)
- Relationships: addresses, orders, wishlists, cartItems, reviews

**Product**
- id, name, slug, description
- price, discountPrice
- gender, material, color, size
- stock, featured, published
- Relationships: category, images, cartItems, wishlists, reviews, orderItems

**Category**
- id, name, slug, description, image
- Relationships: products

**Order**
- id, userId, status, total
- tax, shippingCost
- paymentStatus, shippingAddress
- Relationships: user, items (orderItems), payment

## Common Operations

### Reset Database

⚠️ **Warning**: This deletes all data!

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Recreate from schema
3. Run all migrations
4. Seed the database

### Create New Migration

After modifying `prisma/schema.prisma`:

```bash
npm run db:migrate -- --name descriptive_name
```

Example:
```bash
npm run db:migrate -- --name add_discount_codes
```

### Push Schema to Database

For development only - applies schema without migrations:

```bash
npm run db:push
```

### View Migration Status

```bash
npx prisma migrate status
```

### Inspect Database

```bash
npm run db:studio
```

## Troubleshooting

### Connection Error

**Error**: `error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in `.env.local`
3. Verify host, port, and credentials

### Migration Conflict

**Error**: `Error: Migration history conflicts...`

**Solution**:
```bash
npx prisma migrate resolve --rolled-back <migration_name>
```

### Schema Validation Error

**Error**: `Prisma schema validation error`

**Solution**:
1. Check `prisma/schema.prisma` for syntax errors
2. Run `npm run db:generate` to validate
3. Check Prisma documentation

## Development Workflow

### When Working on Features

1. **Modify schema** in `prisma/schema.prisma`
2. **Create migration**: `npm run db:migrate -- --name feature_name`
3. **Test migration**: Verify data integrity
4. **Update types**: `npm run db:generate`
5. **Use new types** in your code

### Before Committing

```bash
# Check schema validity
npm run db:generate

# Test migrations
npx prisma migrate deploy

# Verify with studio
npm run db:studio
```

## Production Deployment

### Pre-deployment Checklist

- [ ] All migrations committed to version control
- [ ] Schema changes tested locally
- [ ] No sensitive data in seed file
- [ ] Backup taken of production database
- [ ] DATABASE_URL set in production environment

### Deploy Migrations

```bash
# On production server
npx prisma migrate deploy
```

Never use `prisma migrate reset` in production!

## Prisma CLI Commands

```bash
# View all available commands
npx prisma --help

# Database operations
npx prisma db push          # Push schema to database
npx prisma db seed         # Run seed file
npx prisma db execute      # Execute custom SQL

# Migrations
npx prisma migrate dev     # Create and apply migration
npx prisma migrate deploy  # Apply migrations
npx prisma migrate status  # View migration status
npx prisma migrate reset   # ⚠️ Drop and recreate DB

# Generate
npx prisma generate        # Generate Prisma Client

# Studio
npx prisma studio          # Open visual database explorer

# Validate
npx prisma validate        # Validate schema syntax
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL Connection String](https://www.postgresql.org/docs/current/libpq-connect.html)

---

**Last Updated**: 2024
**Prisma Version**: 7.8.0
**Database**: PostgreSQL
