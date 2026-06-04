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
  image: string;
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
  image: string;
  badge: string;
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  accent: string;
}

export interface ReviewItem {
  name: string;
  title: string;
  quote: string;
  rating: number;
}

export interface InstagramItem {
  caption: string;
  image: string;
}

export const siteConfig = {
  name: "Ciah Accessorize",
  description:
    "Premium bags and fashion accessories in Kenya, from elegant handbags to polished travel and office carry.",
  url: "https://ciah-accessorize.vercel.app",
  tagline: "Luxury bags, designed for Nairobi rhythm.",
  keywords: [
    "Ciah Accessorize",
    "Bags Kenya",
    "Handbags Kenya",
    "Ladies Bags Kenya",
    "Gents Bags Kenya",
    "Affordable Bags Nairobi",
    "Fashion Accessories Kenya",
  ],
};

export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/#featured-products", label: "Featured" },
  { href: "/#new-arrivals", label: "New Arrivals" },
  { href: "/#categories", label: "Categories" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/account", label: "Account" },
];

export const categoryShowcase: CategoryShowcaseItem[] = [
  {
    name: "Ladies Bags",
    slug: "ladies-bags",
    description: "Elegant silhouettes for weekday polish and evening softness.",
    eyebrow: "Refined Everyday",
    accent: "from-[#111111] via-[#3b281f] to-[#8B5E3C]",
    image: "/bags/handbag-bag.svg",
  },
  {
    name: "Gents Bags",
    slug: "gents-bags",
    description: "Structured carry pieces for business travel and city movement.",
    eyebrow: "Sharp Utility",
    accent: "from-[#8B5E3C] via-[#5c3d28] to-[#111111]",
    image: "/bags/brief-bag.svg",
  },
  {
    name: "Tote Bags",
    slug: "tote-bags",
    description: "Roomy statement totes with premium finishes and practical ease.",
    eyebrow: "Carry More",
    accent: "from-[#d6c2a6] via-[#f5d5d8] to-[#ffffff]",
    image: "/bags/tote-bag.svg",
  },
  {
    name: "Travel Bags",
    slug: "travel-bags",
    description: "Durable, polished companions for road trips and airport gates.",
    eyebrow: "Go Further",
    accent: "from-[#f5d5d8] via-[#d6c2a6] to-[#8B5E3C]",
    image: "/bags/travel-bag.svg",
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
    image: "/bags/tote-bag.svg",
    badge: "Featured",
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
    image: "/bags/mini-bag.svg",
    badge: "Featured",
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
    image: "/bags/brief-bag.svg",
    badge: "Featured",
  },
];

export const newArrivals: ProductShowcaseItem[] = [
  {
    name: "Amani Sling",
    slug: "amani-sling",
    category: "Sling Bags",
    price: 3200,
    material: "Canvas",
    color: "Beige",
    description: "Lightweight daily carry with a modern strap and soft neutral tone.",
    accent: "from-[#f4ede4] via-[#d6c2a6] to-[#ffffff]",
    image: "/bags/sling-bag.svg",
    badge: "New",
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
    image: "/bags/travel-bag.svg",
    badge: "New",
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
    image: "/bags/handbag-bag.svg",
    badge: "New",
  },
];

export const bestSellers: ProductShowcaseItem[] = [
  {
    name: "Malaika Everyday Tote",
    slug: "malaika-everyday-tote",
    category: "Ladies Bags",
    price: 5400,
    material: "Leather",
    color: "Brown",
    description: "A soft-structured staple designed for all-day carry and easy polish.",
    accent: "from-[#ceb295] via-[#f3e6d6] to-[#ffffff]",
    image: "/bags/tote-bag.svg",
    badge: "Best Seller",
  },
  {
    name: "Cityline Executive Brief",
    slug: "cityline-executive-brief",
    category: "Gents Bags",
    price: 8600,
    material: "Leather",
    color: "Black",
    description: "Sharp office styling with room for essentials, devices, and documents.",
    accent: "from-[#141212] via-[#43332c] to-[#d6c2a6]",
    image: "/bags/brief-bag.svg",
    badge: "Best Seller",
  },
  {
    name: "Petal Mini Evening Bag",
    slug: "petal-mini-evening-bag",
    category: "Mini Bags",
    price: 2800,
    material: "PU Leather",
    color: "Pink",
    description: "A polished mini bag with a romantic finish and compact elegance.",
    accent: "from-[#f2c4ce] via-[#fdeef1] to-[#ffffff]",
    image: "/bags/mini-bag.svg",
    badge: "Best Seller",
  },
];

export const heroHighlights = [
  "Kenyan luxury carry, modern and practical",
  "Structured office bags, mini bags, travel pieces",
  "Soft neutrals and premium finishes inspired by global fashion houses",
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

export const customerReviews: ReviewItem[] = [
  {
    name: "Achieng O.",
    title: "Corporate stylist",
    quote:
      "The finish feels expensive and the structure holds beautifully. My office bag finally looks as polished as the rest of my wardrobe.",
    rating: 5,
  },
  {
    name: "Miriam K.",
    title: "Frequent traveler",
    quote:
      "I ordered a travel bag and a mini crossbody. Both arrived looking refined, practical, and far better than I expected online.",
    rating: 5,
  },
  {
    name: "Brian N.",
    title: "Creative director",
    quote:
      "The gents range feels elevated without being loud. Clean lines, strong materials, and very easy to style for work.",
    rating: 5,
  },
];

export const instagramFeed: InstagramItem[] = [
  { caption: "Weekend neutrals and soft structure.", image: "/bags/mini-bag.svg" },
  { caption: "Boardroom-ready carry in rich dark tones.", image: "/bags/brief-bag.svg" },
  { caption: "Travel light, travel polished.", image: "/bags/travel-bag.svg" },
  { caption: "Statement tote for the daily edit.", image: "/bags/tote-bag.svg" },
];

export const footerCollections = [
  "Ladies Bags",
  "Office Bags",
  "Mini Bags",
  "Travel Bags",
];
