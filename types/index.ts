// User types
export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Product types
export type Gender = "Men" | "Women" | "Unisex";
export type Material = "Leather" | "PU Leather" | "Canvas" | "Fabric";
export type Color = "Black" | "Brown" | "Beige" | "Pink" | "White" | "Blue" | "Grey";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  featured: boolean;
  published: boolean;
  stock: number;
  gender: Gender;
  material: Material;
  color: Color;
  size: string | null;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  order: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Order types
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  tax: number;
  shippingCost: number;
  paymentStatus: PaymentStatus;
  shippingAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Notification {
  id: string;
  userId: string;
  orderId: string | null;
  title: string;
  message: string;
  createdAt: Date;
  readAt: Date | null;
}

// Cart types
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product?: Product;
}

// Address types
export interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  county: string;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string | null;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
