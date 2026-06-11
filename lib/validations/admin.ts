import {
  array,
  boolean,
  check,
  maxLength,
  minLength,
  minValue,
  nonEmpty,
  number,
  object,
  optional,
  pipe,
  string,
  url,
} from "valibot";

const requiredText = (fieldName: string) =>
  pipe(string(`${fieldName} is required.`), nonEmpty(`${fieldName} is required.`));

export const paymentStatusOptions = ["PENDING", "COMPLETED", "FAILED"] as const;

const productBaseEntries = {
  name: requiredText("Product name"),
  slug: requiredText("Product slug"),
  description: pipe(string(), maxLength(4000, "Description is too long.")),
  categoryId: requiredText("Category"),
  gender: requiredText("Gender"),
  material: requiredText("Material"),
  color: requiredText("Color"),
  size: pipe(string(), maxLength(120, "Size is too long.")),
  price: pipe(number(), minValue(0, "Price cannot be negative.")),
  discountPrice: optional(number()),
  stock: pipe(number(), minValue(0, "Stock cannot be negative.")),
  featured: boolean(),
  published: boolean(),
};

export const adminProductSchema = pipe(
  object({
    ...productBaseEntries,
    existingImageUrls: array(
      pipe(string("Product image is required."), url("Product image URL is invalid.")),
    ),
  }),
  check(
    (input) =>
      typeof input.discountPrice !== "number" || input.discountPrice <= input.price,
    "Discount price cannot be greater than the main price.",
  ),
);

export const adminProductFormSchema = pipe(
  object({
    ...productBaseEntries,
    imagePreviewUrls: pipe(
      array(pipe(string("Product image is required."), minLength(1, "Product image is required."))),
      minLength(1, "Add at least one product image."),
    ),
  }),
  check(
    (input) =>
      typeof input.discountPrice !== "number" || input.discountPrice <= input.price,
    "Discount price cannot be greater than the main price.",
  ),
);

export const adminCategorySchema = object({
  name: requiredText("Category name"),
  slug: requiredText("Category slug"),
  description: pipe(string(), maxLength(1000, "Description is too long.")),
  image: pipe(string(), maxLength(1000, "Image URL is too long.")),
});

export const adminInventorySchema = object({
  productId: requiredText("Product"),
  stock: pipe(number(), minValue(0, "Stock cannot be negative.")),
  featured: boolean(),
  published: boolean(),
});

export const adminOrderSchema = object({
  orderId: requiredText("Order"),
  status: pipe(
    string("Order status is required."),
    nonEmpty("Order status is required."),
    minLength(2, "Order status is required."),
  ),
});
