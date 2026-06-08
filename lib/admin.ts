import "server-only";

import { prisma } from "@/lib/prisma";
import {
  getDatabaseSetupErrorMessage,
  isPrismaSetupError,
} from "@/lib/prisma-errors";

export interface AdminMetricCard {
  label: string;
  value: string;
  helper: string;
}

export interface AdminOverviewData {
  metrics: AdminMetricCard[];
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: Date;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    categoryName: string;
    published: boolean;
  }>;
  recentCustomers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    orderCount: number;
  }>;
  setupError: string | null;
}

export interface AdminProductsData {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice: number | null;
    stock: number;
    gender: string;
    material: string;
    color: string;
    size: string | null;
    featured: boolean;
    published: boolean;
    categoryId: string;
    categoryName: string;
    imageUrls: string[];
    createdAt: Date;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  setupError: string | null;
}

export interface AdminCategoriesData {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    productCount: number;
    createdAt: Date;
  }>;
  setupError: string | null;
}

export interface AdminInventoryData {
  items: Array<{
    id: string;
    name: string;
    categoryName: string;
    stock: number;
    published: boolean;
    featured: boolean;
    price: number;
    updatedAt: Date;
  }>;
  setupError: string | null;
}

export interface AdminOrdersData {
  orders: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    status: string;
    paymentStatus: string;
    total: number;
    itemCount: number;
    shippingAddress: string | null;
    createdAt: Date;
  }>;
  setupError: string | null;
}

export interface AdminCustomersData {
  customers: Array<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    createdAt: Date;
    orderCount: number;
    totalSpend: number;
    lastOrderDate: Date | null;
    recentOrders: Array<{
      id: string;
      total: number;
      status: string;
      createdAt: Date;
    }>;
  }>;
  setupError: string | null;
}

async function withAdminFallback<T>(operation: () => Promise<T>, fallback: T): Promise<{
  data: T;
  setupError: string | null;
}> {
  try {
    return {
      data: await operation(),
      setupError: null,
    };
  } catch (error) {
    if (!isPrismaSetupError(error)) {
      throw error;
    }

    return {
      data: fallback,
      setupError: getDatabaseSetupErrorMessage("load admin data"),
    };
  }
}

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString()}`;
}

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  const { data, setupError } = await withAdminFallback(async () => {
    const [
      revenueAggregate,
      orderCount,
      productCount,
      customerCount,
      lowStockProducts,
      recentOrders,
      recentCustomers,
    ] = await prisma.$transaction([
      prisma.order.aggregate({
        where: {
          deletedAt: null,
          paymentStatus: "COMPLETED",
        },
        _sum: {
          total: true,
        },
      }),
      prisma.order.count({
        where: {
          deletedAt: null,
        },
      }),
      prisma.product.count({
        where: {
          deletedAt: null,
        },
      }),
      prisma.user.count({
        where: {
          deletedAt: null,
          role: "CUSTOMER",
        },
      }),
      prisma.product.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: [
          {
            stock: "asc",
          },
          {
            updatedAt: "desc",
          },
        ],
        include: {
          category: true,
        },
        take: 5,
      }),
      prisma.order.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        take: 5,
      }),
      prisma.user.findMany({
        where: {
          deletedAt: null,
          role: "CUSTOMER",
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          orders: {
            where: {
              deletedAt: null,
            },
            select: {
              id: true,
            },
          },
        },
        take: 5,
      }),
    ]);

    return {
      metrics: [
        {
          label: "Revenue",
          value: formatCurrency(revenueAggregate._sum.total ?? 0),
          helper: "Completed payments",
        },
        {
          label: "Orders",
          value: `${orderCount}`,
          helper: "Active orders recorded",
        },
        {
          label: "Products",
          value: `${productCount}`,
          helper: "Published and draft inventory",
        },
        {
          label: "Customers",
          value: `${customerCount}`,
          helper: "Registered customer accounts",
        },
      ],
      lowStockProducts: lowStockProducts.map((product) => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        categoryName: product.category.name,
        published: product.published,
      })),
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customerName: order.user.name ?? "Customer",
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      })),
      recentCustomers: recentCustomers.map((customer) => ({
        id: customer.id,
        name: customer.name ?? "Customer",
        email: customer.email,
        createdAt: customer.createdAt,
        orderCount: customer.orders.length,
      })),
    };
  }, {
    metrics: [
      { label: "Revenue", value: formatCurrency(0), helper: "Completed payments" },
      { label: "Orders", value: "0", helper: "Active orders recorded" },
      { label: "Products", value: "0", helper: "Published and draft inventory" },
      { label: "Customers", value: "0", helper: "Registered customer accounts" },
    ],
    recentOrders: [],
    lowStockProducts: [],
    recentCustomers: [],
  });

  return {
    ...data,
    setupError,
  };
}

export async function getAdminProductsData(): Promise<AdminProductsData> {
  const { data, setupError } = await withAdminFallback(async () => {
    const [products, categories] = await prisma.$transaction([
      prisma.product.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: true,
          images: {
            orderBy: {
              order: "asc",
            },
          },
        },
      }),
      prisma.category.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description ?? "",
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        gender: product.gender,
        material: product.material,
        color: product.color,
        size: product.size,
        featured: product.featured,
        published: product.published,
        categoryId: product.categoryId,
        categoryName: product.category.name,
        imageUrls: product.images.map((image) => image.url),
        createdAt: product.createdAt,
      })),
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })),
    };
  }, {
    products: [],
    categories: [],
  });

  return {
    ...data,
    setupError,
  };
}

export async function getAdminCategoriesData(): Promise<AdminCategoriesData> {
  const { data, setupError } = await withAdminFallback(async () => {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
      include: {
        products: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
          },
        },
      },
    });

    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        productCount: category.products.length,
        createdAt: category.createdAt,
      })),
    };
  }, {
    categories: [],
  });

  return {
    ...data,
    setupError,
  };
}

export async function getAdminInventoryData(): Promise<AdminInventoryData> {
  const { data, setupError } = await withAdminFallback(async () => {
    const items = await prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [
        {
          stock: "asc",
        },
        {
          name: "asc",
        },
      ],
      include: {
        category: true,
      },
    });

    return {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        categoryName: item.category.name,
        stock: item.stock,
        published: item.published,
        featured: item.featured,
        price: item.discountPrice ?? item.price,
        updatedAt: item.updatedAt,
      })),
    };
  }, {
    items: [],
  });

  return {
    ...data,
    setupError,
  };
}

export async function getAdminOrdersData(): Promise<AdminOrdersData> {
  const { data, setupError } = await withAdminFallback(async () => {
    const orders = await prisma.order.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            quantity: true,
          },
        },
      },
    });

    return {
      orders: orders.map((order) => ({
        id: order.id,
        customerName: order.user.name ?? "Customer",
        customerEmail: order.user.email,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
      })),
    };
  }, {
    orders: [],
  });

  return {
    ...data,
    setupError,
  };
}

export async function getAdminCustomersData(): Promise<AdminCustomersData> {
  const { data, setupError } = await withAdminFallback(async () => {
    const customers = await prisma.user.findMany({
      where: {
        deletedAt: null,
        role: "CUSTOMER",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orders: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    return {
      customers: customers.map((customer) => ({
        id: customer.id,
        name: customer.name ?? "Customer",
        email: customer.email,
        phone: customer.phone,
        createdAt: customer.createdAt,
        orderCount: customer.orders.length,
        totalSpend: customer.orders.reduce((total, order) => total + order.total, 0),
        lastOrderDate: customer.orders[0]?.createdAt ?? null,
        recentOrders: customer.orders.slice(0, 3),
      })),
    };
  }, {
    customers: [],
  });

  return {
    ...data,
    setupError,
  };
}
