import type { ProductShowcaseItem } from "@/lib/site";

export type GenderFilter = "Women" | "Men" | "Unisex";
export type MaterialFilter = "Leather" | "PU Leather" | "Canvas" | "Fabric";
export type ColorFilter =
  | "Black"
  | "Brown"
  | "Beige"
  | "Pink"
  | "White"
  | "Blue"
  | "Grey";

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

export interface ProductReview {
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

export interface ProductGalleryImage {
  src: string;
  alt: string;
}

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
  images: ProductGalleryImage[];
  variantColors: ColorFilter[];
  variantSizes: string[];
  reviews: ProductReview[];
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

function buildReviews(seed: string): ProductReview[] {
  return [
    {
      author: "Achieng O.",
      rating: 5,
      title: "Beautiful finish",
      comment: `${seed} feels polished, structured, and genuinely premium in person.`,
      date: "2026-05-20",
    },
    {
      author: "Miriam K.",
      rating: 4,
      title: "Easy to style",
      comment: `I have worn ${seed.toLowerCase()} to work and weekends and it adapts beautifully.`,
      date: "2026-05-26",
    },
    {
      author: "Brian N.",
      rating: 5,
      title: "Worth it",
      comment: `Excellent construction, comfortable carry, and the detailing on ${seed.toLowerCase()} stands out.`,
      date: "2026-06-02",
    },
  ];
}

function gallery(
  primary: string,
  alternateOne: string,
  alternateTwo: string,
  name: string,
): ProductGalleryImage[] {
  return [
    { src: primary, alt: `${name} front view` },
    { src: alternateOne, alt: `${name} styled side view` },
    { src: alternateTwo, alt: `${name} detail view` },
  ];
}

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
    images: gallery("/bags/tote-bag.svg", "/bags/hero-bag.svg", "/bags/handbag-bag.svg", "Kisa Structured Tote"),
    variantColors: ["Brown", "Beige", "Black"],
    variantSizes: ["Medium", "Large"],
    reviews: buildReviews("The Kisa Structured Tote"),
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
    images: gallery("/bags/mini-bag.svg", "/bags/hero-bag.svg", "/bags/handbag-bag.svg", "Nia Mini Crossbody"),
    variantColors: ["Pink", "Black", "White"],
    variantSizes: ["Mini"],
    reviews: buildReviews("The Nia Mini Crossbody"),
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
    images: gallery("/bags/brief-bag.svg", "/bags/hero-bag.svg", "/bags/tote-bag.svg", "Safari Office Brief"),
    variantColors: ["Black", "Brown"],
    variantSizes: ['15"', '16"'],
    reviews: buildReviews("The Safari Office Brief"),
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
    images: gallery("/bags/sling-bag.svg", "/bags/hero-bag.svg", "/bags/travel-bag.svg", "Amani Sling"),
    variantColors: ["Beige", "Blue", "Black"],
    variantSizes: ["Small", "Medium"],
    reviews: buildReviews("The Amani Sling"),
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
    images: gallery("/bags/travel-bag.svg", "/bags/hero-bag.svg", "/bags/brief-bag.svg", "Mara Travel Holdall"),
    variantColors: ["Grey", "Black", "Brown"],
    variantSizes: ["Large", "XL"],
    reviews: buildReviews("The Mara Travel Holdall"),
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
    images: gallery("/bags/handbag-bag.svg", "/bags/hero-bag.svg", "/bags/mini-bag.svg", "Zuri Handheld"),
    variantColors: ["Black", "Brown", "Pink"],
    variantSizes: ["Medium"],
    reviews: buildReviews("The Zuri Handheld"),
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
    images: gallery("/bags/tote-bag.svg", "/bags/handbag-bag.svg", "/bags/hero-bag.svg", "Malaika Everyday Tote"),
    variantColors: ["Brown", "Black", "Beige"],
    variantSizes: ["Medium", "Large"],
    reviews: buildReviews("The Malaika Everyday Tote"),
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
    images: gallery("/bags/brief-bag.svg", "/bags/travel-bag.svg", "/bags/hero-bag.svg", "Cityline Executive Brief"),
    variantColors: ["Black", "Brown"],
    variantSizes: ['15"', '16"'],
    reviews: buildReviews("The Cityline Executive Brief"),
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
    images: gallery("/bags/mini-bag.svg", "/bags/handbag-bag.svg", "/bags/hero-bag.svg", "Petal Mini Evening Bag"),
    variantColors: ["Pink", "White", "Black"],
    variantSizes: ["Mini"],
    reviews: buildReviews("The Petal Mini Evening Bag"),
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
    images: gallery("/bags/sling-bag.svg", "/bags/brief-bag.svg", "/bags/hero-bag.svg", "Blue Mile Messenger"),
    variantColors: ["Blue", "Grey", "Black"],
    variantSizes: ["Medium"],
    reviews: buildReviews("The Blue Mile Messenger"),
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
    images: gallery("/bags/handbag-bag.svg", "/bags/tote-bag.svg", "/bags/hero-bag.svg", "Cloud White Carryall"),
    variantColors: ["White", "Beige", "Black"],
    variantSizes: ["Medium", "Large"],
    reviews: buildReviews("The Cloud White Carryall"),
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
    images: gallery("/bags/tote-bag.svg", "/bags/sling-bag.svg", "/bags/hero-bag.svg", "Daybreak Canvas Tote"),
    variantColors: ["Beige", "Blue", "Grey"],
    variantSizes: ["Medium", "Large"],
    reviews: buildReviews("The Daybreak Canvas Tote"),
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
    images: gallery("/bags/travel-bag.svg", "/bags/brief-bag.svg", "/bags/hero-bag.svg", "Grey Route Weekender"),
    variantColors: ["Grey", "Black", "Blue"],
    variantSizes: ["Large", "XL"],
    reviews: buildReviews("The Grey Route Weekender"),
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
    images: gallery("/bags/tote-bag.svg", "/bags/handbag-bag.svg", "/bags/hero-bag.svg", "Softline Office Tote"),
    variantColors: ["Beige", "Brown", "Black"],
    variantSizes: ['13"', '14"'],
    reviews: buildReviews("The Softline Office Tote"),
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
    images: gallery("/bags/mini-bag.svg", "/bags/sling-bag.svg", "/bags/hero-bag.svg", "Minimal Phone Pouch"),
    variantColors: ["Black", "White", "Pink"],
    variantSizes: ["Mini"],
    reviews: buildReviews("The Minimal Phone Pouch"),
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
    images: gallery("/bags/handbag-bag.svg", "/bags/mini-bag.svg", "/bags/hero-bag.svg", "Rose Curve Handbag"),
    variantColors: ["Pink", "Brown", "Black"],
    variantSizes: ["Medium"],
    reviews: buildReviews("The Rose Curve Handbag"),
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

export function getCatalogProductBySlug(slug: string) {
  return catalogProducts.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: CatalogProduct, limit = 4) {
  return catalogProducts
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.published &&
        (candidate.category === product.category ||
          candidate.gender === product.gender ||
          candidate.material === product.material),
    )
    .sort((left, right) => Number(right.featured) - Number(left.featured) || right.price - left.price)
    .slice(0, limit);
}

export function getAverageRating(product: CatalogProduct) {
  if (product.reviews.length === 0) {
    return 0;
  }

  const total = product.reviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((total / product.reviews.length).toFixed(1));
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
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
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
  const sortValue = Array.isArray(params?.sort) ? params?.sort[0] : params?.sort;
  const priceValue = Array.isArray(params?.price) ? params?.price[0] : params?.price;
  const pageValue = Array.isArray(params?.page) ? params?.page[0] : params?.page;
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
