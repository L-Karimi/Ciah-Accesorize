import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

function getDatabaseConfig(databaseUrl: string) {
  const url = new URL(databaseUrl);
  const schema = url.searchParams.get("schema") ?? undefined;

  if (!schema) {
    return {
      connectionString: databaseUrl,
      schema,
    };
  }

  url.searchParams.delete("schema");

  return {
    connectionString: url.toString(),
    schema,
  };
}

const databaseConfig = getDatabaseConfig(connectionString);

const pool = new Pool({
  connectionString: databaseConfig.connectionString,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    pool,
    databaseConfig.schema ? { schema: databaseConfig.schema } : undefined,
  ),
});

async function main() {
  console.log("🌱 Seeding database...");

  const defaultPassword = await hash("password123", 12);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "ladies-bags" },
      update: {},
      create: {
        name: "Ladies Bags",
        slug: "ladies-bags",
        description: "Premium ladies bags and purses for every occasion",
      },
    }),
    prisma.category.upsert({
      where: { slug: "gents-bags" },
      update: {},
      create: {
        name: "Gents Bags",
        slug: "gents-bags",
        description: "Stylish gents bags for work and travel",
      },
    }),
    prisma.category.upsert({
      where: { slug: "handbags" },
      update: {},
      create: {
        name: "Handbags",
        slug: "handbags",
        description: "Elegant handbags for everyday use",
      },
    }),
    prisma.category.upsert({
      where: { slug: "tote-bags" },
      update: {},
      create: {
        name: "Tote Bags",
        slug: "tote-bags",
        description: "Spacious tote bags for shopping and travel",
      },
    }),
    prisma.category.upsert({
      where: { slug: "sling-bags" },
      update: {},
      create: {
        name: "Sling Bags",
        slug: "sling-bags",
        description: "Convenient sling bags for everyday carry",
      },
    }),
    prisma.category.upsert({
      where: { slug: "mini-bags" },
      update: {},
      create: {
        name: "Mini Bags",
        slug: "mini-bags",
        description: "Cute mini bags for essentials",
      },
    }),
    prisma.category.upsert({
      where: { slug: "office-bags" },
      update: {},
      create: {
        name: "Office Bags",
        slug: "office-bags",
        description: "Professional office bags and briefcases",
      },
    }),
    prisma.category.upsert({
      where: { slug: "travel-bags" },
      update: {},
      create: {
        name: "Travel Bags",
        slug: "travel-bags",
        description: "Durable travel bags for all your journeys",
      },
    }),
  ]);

  console.log(`✓ Created ${categories.length} categories`);

  // Sample products data
  const productsData = [
    {
      name: "Classic Black Leather Handbag",
      slug: "classic-black-leather-handbag",
      description:
        "Timeless black leather handbag perfect for any occasion. Made with premium genuine leather.",
      price: 4500,
      discountPrice: 4000,
      gender: "Women",
      material: "Leather",
      color: "Black",
      stock: 15,
      featured: true,
      published: true,
      categoryId: categories[2].id, // Handbags
    },
    {
      name: "Brown Canvas Tote Bag",
      slug: "brown-canvas-tote-bag",
      description:
        "Spacious brown canvas tote bag ideal for shopping and everyday use. Eco-friendly material.",
      price: 2500,
      discountPrice: 2000,
      gender: "Women",
      material: "Canvas",
      color: "Brown",
      stock: 25,
      featured: true,
      published: true,
      categoryId: categories[3].id, // Tote Bags
    },
    {
      name: "Beige Leather Sling Bag",
      slug: "beige-leather-sling-bag",
      description: "Stylish beige leather sling bag for hands-free convenience.",
      price: 3200,
      discountPrice: null,
      gender: "Women",
      material: "Leather",
      color: "Beige",
      stock: 12,
      featured: false,
      published: true,
      categoryId: categories[4].id, // Sling Bags
    },
    {
      name: "Minimalist Mini Crossbody",
      slug: "minimalist-mini-crossbody",
      description:
        "Compact mini bag perfect for carrying essentials. Available in multiple colors.",
      price: 1800,
      discountPrice: 1500,
      gender: "Unisex",
      material: "PU Leather",
      color: "Pink",
      stock: 30,
      featured: true,
      published: true,
      categoryId: categories[5].id, // Mini Bags
    },
    {
      name: "Professional Gents Briefcase",
      slug: "professional-gents-briefcase",
      description:
        "Executive leather briefcase for professionals. Features multiple compartments.",
      price: 6500,
      discountPrice: 5800,
      gender: "Men",
      material: "Leather",
      color: "Black",
      stock: 8,
      featured: true,
      published: true,
      categoryId: categories[6].id, // Office Bags
    },
    {
      name: "Adventure Travel Backpack",
      slug: "adventure-travel-backpack",
      description:
        "Durable fabric backpack designed for travelers. Water-resistant and spacious.",
      price: 4800,
      discountPrice: 4200,
      gender: "Unisex",
      material: "Canvas",
      color: "Grey",
      stock: 10,
      featured: false,
      published: true,
      categoryId: categories[7].id, // Travel Bags
    },
    {
      name: "Elegant Ladies Clutch",
      slug: "elegant-ladies-clutch",
      description:
        "Sophisticated leather clutch perfect for evening events and special occasions.",
      price: 2800,
      discountPrice: 2400,
      gender: "Women",
      material: "Leather",
      color: "Black",
      stock: 18,
      featured: false,
      published: true,
      categoryId: categories[0].id, // Ladies Bags
    },
    {
      name: "Casual Canvas Gents Sling",
      slug: "casual-canvas-gents-sling",
      description: "Casual canvas sling bag perfect for everyday use by men.",
      price: 1900,
      discountPrice: 1600,
      gender: "Men",
      material: "Canvas",
      color: "Blue",
      stock: 22,
      featured: false,
      published: true,
      categoryId: categories[1].id, // Gents Bags
    },
    {
      name: "Luxury Leather Ladies Tote",
      slug: "luxury-leather-ladies-tote",
      description:
        "Premium leather tote bag for the sophisticated woman. Hand-crafted quality.",
      price: 7200,
      discountPrice: 6500,
      gender: "Women",
      material: "Leather",
      color: "Brown",
      stock: 6,
      featured: true,
      published: true,
      categoryId: categories[3].id, // Tote Bags
    },
    {
      name: "Practical Mini Phone Pouch",
      slug: "practical-mini-phone-pouch",
      description:
        "Compact pouch perfect for carrying your phone and small essentials.",
      price: 800,
      discountPrice: null,
      gender: "Unisex",
      material: "PU Leather",
      color: "White",
      stock: 40,
      featured: false,
      published: true,
      categoryId: categories[5].id, // Mini Bags
    },
  ];

  // Create products
  const products = await Promise.all(
    productsData.map((product) =>
      prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product,
      })
    )
  );

  console.log(`✓ Created ${products.length} products`);

  await prisma.productImage.deleteMany({
    where: {
      productId: {
        in: products.slice(0, 5).map((product) => product.id),
      },
    },
  });

  // Create product images
  const imageData = [
    {
      productId: products[0].id,
      url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
      alt: "Classic Black Leather Handbag - Front View",
      order: 0,
    },
    {
      productId: products[0].id,
      url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&crop=entropy",
      alt: "Classic Black Leather Handbag - Side View",
      order: 1,
    },
    {
      productId: products[1].id,
      url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500",
      alt: "Brown Canvas Tote Bag",
      order: 0,
    },
    {
      productId: products[2].id,
      url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
      alt: "Beige Leather Sling Bag",
      order: 0,
    },
    {
      productId: products[3].id,
      url: "https://images.unsplash.com/photo-1639221277285-e83fb2ee9cee?w=500",
      alt: "Minimalist Mini Crossbody",
      order: 0,
    },
  ];

  const images = await Promise.all(
    imageData.map((image) =>
      prisma.productImage.create({
        data: image,
      })
    )
  );

  console.log(`✓ Created ${images.length} product images`);

  // Create sample user
  const user = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {
      password: defaultPassword,
      role: "CUSTOMER",
    },
    create: {
      email: "customer@example.com",
      name: "John Doe",
      phone: "+254700000000",
      password: defaultPassword,
      role: "CUSTOMER",
    },
  });

  console.log("✓ Created sample user");

  await prisma.user.upsert({
    where: { email: "admin@ciahaccessorize.com" },
    update: {
      password: defaultPassword,
      role: "ADMIN",
    },
    create: {
      email: "admin@ciahaccessorize.com",
      name: "Ciah Admin",
      phone: "+254711111111",
      password: defaultPassword,
      role: "ADMIN",
    },
  });

  console.log("✓ Created sample admin");

  const existingOrders = await prisma.order.findMany({
    where: { userId: user.id },
    select: { id: true },
  });

  const existingOrderIds = existingOrders.map((order) => order.id);

  if (existingOrderIds.length > 0) {
    await prisma.payment.deleteMany({
      where: {
        orderId: {
          in: existingOrderIds,
        },
      },
    });

    await prisma.orderItem.deleteMany({
      where: {
        orderId: {
          in: existingOrderIds,
        },
      },
    });

    await prisma.order.deleteMany({
      where: {
        id: {
          in: existingOrderIds,
        },
      },
    });
  }

  await prisma.review.deleteMany({
    where: { userId: user.id },
  });

  await prisma.wishlist.deleteMany({
    where: { userId: user.id },
  });

  await prisma.cartItem.deleteMany({
    where: { userId: user.id },
  });

  await prisma.address.deleteMany({
    where: { userId: user.id },
  });

  // Create sample address
  await prisma.address.create({
    data: {
      userId: user.id,
      firstName: "John",
      lastName: "Doe",
      phone: "+254700000000",
      email: user.email,
      street: "123 Main Street",
      city: "Nairobi",
      county: "Nairobi",
      postalCode: "00100",
      country: "Kenya",
      isDefault: true,
    },
  });

  console.log("✓ Created sample address");

  // Create sample cart items
  await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId: products[0].id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      productId: products[0].id,
      quantity: 1,
    },
  });

  console.log("✓ Created sample cart items");

  // Create sample wishlist
  await prisma.wishlist.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId: products[1].id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      productId: products[1].id,
    },
  });

  console.log("✓ Created sample wishlist");

  // Create sample order
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "CONFIRMED",
      paymentStatus: "COMPLETED",
      total: 9000,
      tax: 1000,
      shippingCost: 500,
      shippingAddress: "123 Main Street, Nairobi, 00100",
      items: {
        create: [
          {
            productId: products[2].id,
            quantity: 2,
            price: products[2].discountPrice || products[2].price,
          },
          {
            productId: products[3].id,
            quantity: 1,
            price: products[3].discountPrice || products[3].price,
          },
        ],
      },
    },
  });

  console.log("✓ Created sample order with items");

  // Create sample payment
  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: 9000,
      currency: "KES",
      status: "COMPLETED",
      method: "MPESA",
      transactionId: "MP2312345678",
      phoneNumber: "+254700000000",
    },
  });

  console.log("✓ Created sample payment");

  // Create sample reviews
  await Promise.all([
    prisma.review.create({
      data: {
        userId: user.id,
        productId: products[0].id,
        rating: 5,
        comment: "Excellent quality! Very satisfied with my purchase.",
      },
    }),
    prisma.review.create({
      data: {
        userId: user.id,
        productId: products[2].id,
        rating: 4,
        comment: "Good product, delivery could be faster.",
      },
    }),
  ]);

  console.log("✓ Created sample reviews");

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
