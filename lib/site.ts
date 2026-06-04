export interface NavItem {
  href: string;
  label: string;
}

export interface CategoryShowcaseItem {
  name: string;
  slug: string;
  description: string;
  eyebrow: string;
  accent: string;
}

export interface ProductShowcaseItem {
  name: string;
  slug: string;
  category: string;
  price: number;
  material: string;
  color: string;
  description: string;
  accent: string;
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  accent: string;
}

export const siteConfig = {
  name: "Ciah Accessorize",
  description:
    "Premium Kenyan bags and accessories with a refined, modern storefront experience.",
  url: "https://ciah-accessorize.vercel.app",
  tagline: "Luxury bags, designed for Nairobi rhythm.",
};

export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/#collections", label: "Collections" },
  { href: "/#featured", label: "Featured" },
  { href: "/#contact", label: "Contact" },
  { href: "/account", label: "Account" },
];

export const categoryShowcase: CategoryShowcaseItem[] = [
  {
    name: "Ladies Bags",
    slug: "ladies-bags",
    description: "Elegant silhouettes for weekday polish and evening softness.",
    eyebrow: "Refined Everyday",
    accent: "from-[#111111] via-[#3b281f] to-[#8B5E3C]",
  },
  {
    name: "Gents Bags",
    slug: "gents-bags",
    description: "Structured carry pieces for business travel and city movement.",
    eyebrow: "Sharp Utility",
    accent: "from-[#8B5E3C] via-[#5c3d28] to-[#111111]",
  },
  {
    name: "Tote Bags",
    slug: "tote-bags",
    description: "Roomy statement totes with premium finishes and practical ease.",
    eyebrow: "Carry More",
    accent: "from-[#d6c2a6] via-[#f5d5d8] to-[#ffffff]",
  },
  {
    name: "Travel Bags",
    slug: "travel-bags",
    description: "Durable, polished companions for road trips and airport gates.",
    eyebrow: "Go Further",
    accent: "from-[#f5d5d8] via-[#d6c2a6] to-[#8B5E3C]",
  },
];

export const featuredProducts: ProductShowcaseItem[] = [
  {
    name: "Kisa Structured Tote",
    slug: "kisa-structured-tote",
    category: "Tote Bags",
    price: 6500,
    material: "Leather",
    color: "Brown",
    description: "A roomy leather tote with soft lining and a polished city profile.",
    accent: "from-[#d6c2a6] via-[#f0e5d6] to-[#ffffff]",
  },
  {
    name: "Nia Mini Crossbody",
    slug: "nia-mini-crossbody",
    category: "Mini Bags",
    price: 2400,
    material: "PU Leather",
    color: "Pink",
    description: "Compact essentials bag with a playful finish and gold-tone trim.",
    accent: "from-[#f5d5d8] via-[#f8e5e8] to-[#ffffff]",
  },
  {
    name: "Safari Office Brief",
    slug: "safari-office-brief",
    category: "Office Bags",
    price: 7800,
    material: "Leather",
    color: "Black",
    description: "A confident office bag designed for laptops, files, and meetings.",
    accent: "from-[#111111] via-[#2a211f] to-[#8B5E3C]",
  },
  {
    name: "Amani Sling",
    slug: "amani-sling",
    category: "Sling Bags",
    price: 3200,
    material: "Canvas",
    color: "Beige",
    description: "Lightweight daily carry with a modern strap and soft neutral tone.",
    accent: "from-[#f4ede4] via-[#d6c2a6] to-[#ffffff]",
  },
  {
    name: "Mara Travel Holdall",
    slug: "mara-travel-holdall",
    category: "Travel Bags",
    price: 8200,
    material: "Canvas",
    color: "Grey",
    description: "Weekend-ready volume with reinforced handles and luxury details.",
    accent: "from-[#d7d7d7] via-[#f3f3f3] to-[#ffffff]",
  },
  {
    name: "Zuri Handheld",
    slug: "zuri-handheld",
    category: "Handbags",
    price: 5900,
    material: "Leather",
    color: "Black",
    description: "A sculpted handbag with a timeless shape and understated hardware.",
    accent: "from-[#111111] via-[#4b352c] to-[#d6c2a6]",
  },
];

export const sampleCartItems: CartItem[] = [
  {
    name: "Kisa Structured Tote",
    price: 6500,
    quantity: 1,
    accent: "from-[#d6c2a6] to-[#ffffff]",
  },
  {
    name: "Nia Mini Crossbody",
    price: 2400,
    quantity: 2,
    accent: "from-[#f5d5d8] to-[#ffffff]",
  },
];

export const footerCollections = [
  "Ladies Bags",
  "Office Bags",
  "Mini Bags",
  "Travel Bags",
];
