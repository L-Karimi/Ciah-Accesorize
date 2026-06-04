import type { ProductShowcaseItem } from "@/lib/site";

export type GenderFilter = "Women" | "Men" | "Unisex";
export type MaterialFilter = "Leather" | "PU Leather" | "Canvas" | "Fabric";
export type ColorFilter = "Black" | "Brown" | "Beige" | "Pink" | "White" | "Blue" | "Grey";

export type PriceFilter =
  | "under-1000"
  | "1000-2500"
  | "2500-5000"
  | "above-5000";

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc";

export interface CatalogProduct extends ProductShowcaseItem {
  id: string;
  material: MaterialFilter;
  color: ColorFilter;
  gender: GenderFilter;
  size: string;
  stock: number;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export interface CatalogFilters {
  q: string;
  categories: string[];
  genders: GenderFilter[];
  materials: MaterialFilter[];
  colors: ColorFilter[];
  price?: PriceFilter;
  sort: SortOption;
  page: number;
}

export const catalogCategories = [
  "Ladies Bags",
  "Gents Bags",
  "Handbags",
  "Tote Bags",
  "Sling Bags",
  "Mini Bags",
  "Office Bags",
  "Travel Bags",
] as const;

export const genderOptions: readonly GenderFilter[] = ["Women", "Men", "Unisex"];
export const materialOptions: readonly MaterialFilter[] = [
  "Leather",
  "PU Leather",
  "Canvas",
  "Fabric",
];
export const colorOptions: readonly ColorFilter[] = [
  "Black",
  "Brown",
  "Beige",
  "Pink",
  "White",
  "Blue",
  "Grey",
];

export const priceOptions: ReadonlyArray<{ value: PriceFilter; label: string }> = [
  { value: "under-1000", label: "Under KES 1,000" },
  { value: "1000-2500", label: "KES 1,000 - 2,500" },
  { value: "2500-5000", label: "KES 2,500 - 5,000" },
  { value: "above-5000", label: "Above KES 5,000" },
];

export const sortOptions: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: "featured", label: "Featured first" },
  { value: "newest", label: "Newest arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export const catalogProducts: CatalogProduct[] = [
  {
    id: "p-001",
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
    gender: "Women",
    size: "Large",
    stock: 14,
    featured: true,
    published: true,
    createdAt: "2026-05-28",
  },
  {
    id: "p-002",
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
    gender: "Women",
    size: "Mini",
    stock: 24,
    featured: true,
    published: true,
    createdAt: "2026-06-01",
  },
  {
    id: "p-003",
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
    gender: "Men",
    size: '15"',
    stock: 8,
    featured: true,
    published: true,
    createdAt: "2026-05-24",
  },
  {
    id: "p-004",
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
    gender: "Unisex",
    size: "Medium",
    stock: 17,
    featured: false,
    published: true,
    createdAt: "2026-06-03",
  },
  {
    id: "p-005",
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
    gender: "Unisex",
    size: "Large",
    stock: 11,
    featured: false,
    published: true,
    createdAt: "2026-06-02",
  },
  {
    id: "p-006",
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
    gender: "Women",
    size: "Medium",
    stock: 9,
    featured: false,
    published: true,
    createdAt: "2026-05-30",
  },
  {
    id: "p-007",
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
    gender: "Women",
    size: "Large",
    stock: 19,
    featured: true,
    published: true,
    createdAt: "2026-05-10",
  },
  {
    id: "p-008",
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
    gender: "Men",
    size: '16"',
    stock: 6,
    featured: true,
    published: true,
    createdAt: "2026-05-08",
  },
  {
    id: "p-009",
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
    gender: "Women",
    size: "Mini",
    stock: 15,
    featured: true,
    published: true,
    createdAt: "2026-05-06",
  },
  {
    id: "p-010",
    name: "Blue Mile Messenger",
    slug: "blue-mile-messenger",
    category: "Gents Bags",
    price: 2300,
    material: "Fabric",
    color: "Blue",
    description: "Casual everyday messenger with light structure and weekend comfort.",
    accent: "from-[#dce7f6] via-[#f3f7fc] to-[#ffffff]",
    image: "/bags/sling-bag.svg",
    badge: "Editor Pick",
    gender: "Men",
    size: "Medium",
    stock: 22,
    featured: false,
    published: true,
    createdAt: "2026-05-18",
  },
  {
    id: "p-011",
    name: "Cloud White Carryall",
    slug: "cloud-white-carryall",
    category: "Ladies Bags",
    price: 4900,
    material: "PU Leather",
    color: "White",
    description: "A clean carryall with a bright finish that lifts neutral outfits beautifully.",
    accent: "from-[#ffffff] via-[#f4f4f4] to-[#e8e8e8]",
    image: "/bags/handbag-bag.svg",
    badge: "Fresh Edit",
    gender: "Women",
    size: "Large",
    stock: 10,
    featured: false,
    published: true,
    createdAt: "2026-05-21",
  },
  {
    id: "p-012",
    name: "Daybreak Canvas Tote",
    slug: "daybreak-canvas-tote",
    category: "Tote Bags",
    price: 1900,
    material: "Canvas",
    color: "Beige",
    description: "Soft canvas tote made for errands, campus days, and easy weekend movement.",
    accent: "from-[#f0e6da] via-[#faf6f1] to-[#ffffff]",
    image: "/bags/tote-bag.svg",
    badge: "Value Pick",
    gender: "Unisex",
    size: "Large",
    stock: 28,
    featured: false,
    published: true,
    createdAt: "2026-05-17",
  },
  {
    id: "p-013",
    name: "Grey Route Weekender",
    slug: "grey-route-weekender",
    category: "Travel Bags",
    price: 4700,
    material: "Fabric",
    color: "Grey",
    description: "A versatile overnight bag with practical volume and polished trim.",
    accent: "from-[#d9dbde] via-[#f3f4f5] to-[#ffffff]",
    image: "/bags/travel-bag.svg",
    badge: "Travel Edit",
    gender: "Unisex",
    size: "Large",
    stock: 13,
    featured: false,
    published: true,
    createdAt: "2026-05-26",
  },
  {
    id: "p-014",
    name: "Softline Office Tote",
    slug: "softline-office-tote",
    category: "Office Bags",
    price: 5100,
    material: "Leather",
    color: "Beige",
    description: "Designed for laptops and planners with a softer, more feminine office profile.",
    accent: "from-[#e4d4c2] via-[#faf3ea] to-[#ffffff]",
    image: "/bags/tote-bag.svg",
    badge: "Work Edit",
    gender: "Women",
    size: '14"',
    stock: 7,
    featured: false,
    published: true,
    createdAt: "2026-05-29",
  },
  {
    id: "p-015",
    name: "Minimal Phone Pouch",
    slug: "minimal-phone-pouch",
    category: "Mini Bags",
    price: 950,
    material: "PU Leather",
    color: "Black",
    description: "Compact pouch for quick errands, light dinners, and hands-free days.",
    accent: "from-[#25201e] via-[#4a403c] to-[#e4d6c5]",
    image: "/bags/mini-bag.svg",
    badge: "Under 1K",
    gender: "Unisex",
    size: "Mini",
    stock: 30,
    featured: false,
    published: true,
    createdAt: "2026-05-14",
  },
  {
    id: "p-016",
    name: "Rose Curve Handbag",
    slug: "rose-curve-handbag",
    category: "Handbags",
    price: 4300,
    material: "Leather",
    color: "Pink",
    description: "A curved top-handle silhouette with a soft rose tone and premium detailing.",
    accent: "from-[#f3c5cf] via-[#fff1f5] to-[#ffffff]",
    image: "/bags/handbag-bag.svg",
    badge: "Romantic Edit",
    gender: "Women",
    size: "Medium",
    stock: 12,
    featured: false,
    published: true,
    createdAt: "2026-05-31",
  },
];

function priceMatches(price: number, filter?: PriceFilter) {
  if (!filter) {
    return true;
  }

  switch (filter) {
    case "under-1000":
      return price < 1000;
    case "1000-2500":
      return price >= 1000 && price <= 2500;
    case "2500-5000":
      return price > 2500 && price <= 5000;
    case "above-5000":
      return price > 5000;
    default:
      return true;
  }
}

export function filterCatalogProducts(
  products: CatalogProduct[],
  filters: CatalogFilters,
) {
  const filtered = products.filter((product) => {
    const matchesQuery =
      !filters.q ||
      [
        product.name,
        product.category,
        product.description,
        product.material,
        product.color,
        product.gender,
      ]
        .join(" ")
        .toLowerCase()
        .includes(filters.q.toLowerCase());

    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);

    const matchesGender =
      filters.genders.length === 0 || filters.genders.includes(product.gender);

    const matchesMaterial =
      filters.materials.length === 0 ||
      filters.materials.includes(product.material);

    const matchesColor =
      filters.colors.length === 0 || filters.colors.includes(product.color);

    return (
      product.published &&
      matchesQuery &&
      matchesCategory &&
      matchesGender &&
      matchesMaterial &&
      matchesColor &&
      priceMatches(product.price, filters.price)
    );
  });

  return filtered.sort((left, right) => {
    switch (filters.sort) {
      case "price-asc":
        return left.price - right.price;
      case "price-desc":
        return right.price - left.price;
      case "name-asc":
        return left.name.localeCompare(right.name);
      case "newest":
        return (
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        );
      case "featured":
      default:
        return Number(right.featured) - Number(left.featured) || right.price - left.price;
    }
  });
}

export function buildCatalogHref(filters: CatalogFilters, page?: number) {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }

  filters.categories.forEach((value) => params.append("category", value));
  filters.genders.forEach((value) => params.append("gender", value));
  filters.materials.forEach((value) => params.append("material", value));
  filters.colors.forEach((value) => params.append("color", value));

  if (filters.price) {
    params.set("price", filters.price);
  }

  if (filters.sort && filters.sort !== "featured") {
    params.set("sort", filters.sort);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export function parseCatalogFilters(params?: {
  q?: string | string[];
  category?: string | string[];
  gender?: string | string[];
  material?: string | string[];
  color?: string | string[];
  price?: string | string[];
  sort?: string | string[];
  page?: string | string[];
}) {
  const toArray = (value?: string | string[]) =>
    value ? (Array.isArray(value) ? value : [value]) : [];

  const q = Array.isArray(params?.q) ? params?.q[0] ?? "" : params?.q ?? "";
  const sortValue = Array.isArray(params?.sort)
    ? params?.sort[0]
    : params?.sort;
  const priceValue = Array.isArray(params?.price)
    ? params?.price[0]
    : params?.price;
  const pageValue = Array.isArray(params?.page)
    ? params?.page[0]
    : params?.page;
  const page = Math.max(1, Number(pageValue ?? "1") || 1);

  return {
    q,
    categories: toArray(params?.category).filter((value): value is string =>
      catalogCategories.includes(value as (typeof catalogCategories)[number]),
    ),
    genders: toArray(params?.gender).filter((value): value is GenderFilter =>
      genderOptions.includes(value as GenderFilter),
    ),
    materials: toArray(params?.material).filter((value): value is MaterialFilter =>
      materialOptions.includes(value as MaterialFilter),
    ),
    colors: toArray(params?.color).filter((value): value is ColorFilter =>
      colorOptions.includes(value as ColorFilter),
    ),
    price: priceOptions.some((option) => option.value === priceValue)
      ? (priceValue as PriceFilter)
      : undefined,
    sort: sortOptions.some((option) => option.value === sortValue)
      ? (sortValue as SortOption)
      : "featured",
    page,
  } satisfies CatalogFilters;
}
