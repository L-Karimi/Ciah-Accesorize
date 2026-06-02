// Site configuration
export const siteConfig = {
  name: "Ciah Accessorize",
  description: "Premium fashion accessories and bags from Kenya",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/ciahaccess",
    github: "https://github.com",
  },
  email: "hello@ciahaccess.com",
  phone: "+254 700 000 000",
};

// Product categories
export const CATEGORIES = [
  { name: "Ladies Bags", slug: "ladies-bags" },
  { name: "Gents Bags", slug: "gents-bags" },
  { name: "Handbags", slug: "handbags" },
  { name: "Tote Bags", slug: "tote-bags" },
  { name: "Sling Bags", slug: "sling-bags" },
  { name: "Mini Bags", slug: "mini-bags" },
  { name: "Office Bags", slug: "office-bags" },
  { name: "Travel Bags", slug: "travel-bags" },
];

// Product properties
export const GENDERS = ["Men", "Women", "Unisex"];
export const MATERIALS = ["Leather", "PU Leather", "Canvas", "Fabric"];
export const COLORS = ["Black", "Brown", "Beige", "Pink", "White", "Blue", "Grey"];

// Branding colors
export const BRAND_COLORS = {
  primary: "#000000",
  white: "#FFFFFF",
  tan: "#D6C2A6",
  brown: "#8B5E3C",
  pink: "#F5D5D8",
};

// Price ranges
export const PRICE_RANGES = [
  { label: "Under KES 1,000", min: 0, max: 1000 },
  { label: "KES 1,000 - 2,500", min: 1000, max: 2500 },
  { label: "KES 2,500 - 5,000", min: 2500, max: 5000 },
  { label: "Above KES 5,000", min: 5000, max: 999999 },
];
