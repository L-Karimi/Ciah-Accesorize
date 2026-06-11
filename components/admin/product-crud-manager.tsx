"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, LoaderCircle, Star, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { flatten, safeParse, type InferOutput } from "valibot";
import { FlashBanner } from "@/components/admin/flash-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/lib/actions/admin";
import type { AdminProductsData } from "@/lib/admin";
import { slugify } from "@/lib/slug";
import { adminProductFormSchema } from "@/lib/validations/admin";

type ProductFormValues = InferOutput<typeof adminProductFormSchema>;
type ProductRecord = AdminProductsData["products"][number];
type ProductCategory = AdminProductsData["categories"][number];

interface ProductCrudManagerProps {
  data: AdminProductsData;
}

interface ProductFormCardProps {
  categories: ProductCategory[];
  product?: ProductRecord;
}

interface NewImagePreview {
  id: string;
  file: File;
  previewUrl: string;
}

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

function getProductDefaults(product?: ProductRecord): ProductFormValues {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    categoryId: product?.categoryId ?? "",
    gender: product?.gender ?? "",
    material: product?.material ?? "",
    color: product?.color ?? "",
    size: product?.size ?? "",
    price: product?.price ?? 0,
    discountPrice: product?.discountPrice ?? undefined,
    stock: product?.stock ?? 0,
    featured: product?.featured ?? false,
    published: product?.published ?? false,
    imagePreviewUrls: product?.imageUrls ?? [],
  };
}

function buildFileList(files: File[]) {
  const transfer = new DataTransfer();

  for (const file of files) {
    transfer.items.add(file);
  }

  return transfer.files;
}

function formatPriceInput(value: number) {
  return value === 0 ? "" : `${value}`;
}

function formatStockInput(value: number) {
  return value === 0 ? "" : `${value}`;
}

function StatusChip({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? "bg-[#efe3d3] text-[#6f492e]"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

function ProductFormCard({ categories, product }: ProductFormCardProps) {
  const isEditing = Boolean(product);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newImagesRef = useRef<NewImagePreview[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(product?.imageUrls ?? []);
  const [newImages, setNewImages] = useState<NewImagePreview[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [nameValue, setNameValue] = useState(product?.name ?? "");
  const [featuredValue, setFeaturedValue] = useState(product?.featured ?? false);
  const [publishedValue, setPublishedValue] = useState(product?.published ?? false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(product?.slug));
  const {
    register,
    setValue,
    getValues,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: getProductDefaults(product),
  });

  const nameRegistration = register("name");
  const slugRegistration = register("slug");
  const featuredRegistration = register("featured");
  const publishedRegistration = register("published");

  useEffect(() => {
    const previewUrls = [
      ...existingImages,
      ...newImages.map((image) => image.previewUrl),
    ];

    setValue("imagePreviewUrls", previewUrls, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (previewUrls.length > 0) {
      clearErrors("imagePreviewUrls");
    }
  }, [clearErrors, existingImages, newImages, setValue]);

  useEffect(() => {
    if (slugManuallyEdited) {
      return;
    }

    const generatedSlug = slugify(nameValue);

    setValue("slug", generatedSlug, {
      shouldDirty: generatedSlug.length > 0,
      shouldValidate: true,
    });
  }, [nameValue, setValue, slugManuallyEdited]);

  useEffect(() => {
    newImagesRef.current = newImages;
  }, [newImages]);

  useEffect(() => {
    return () => {
      for (const image of newImagesRef.current) {
        URL.revokeObjectURL(image.previewUrl);
      }
    };
  }, []);

  async function submitForm(formElement: HTMLFormElement) {
    const previewUrls = [
      ...existingImages,
      ...newImages.map((image) => image.previewUrl),
    ];

    if (previewUrls.length === 0) {
      setError("imagePreviewUrls", {
        type: "manual",
        message: "Add at least one product image.",
      });
      return;
    }

    const discountPrice = getValues("discountPrice");
    const price = getValues("price");

    if (
      typeof discountPrice === "number" &&
      discountPrice > price
    ) {
      setError("discountPrice", {
        type: "manual",
        message: "Discount price cannot be greater than the main price.",
      });
      return;
    }

    const formData = new FormData(formElement);
    const action = isEditing ? updateProductAction : createProductAction;
    const result = await action(formData);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    if (!isEditing) {
      reset(getProductDefaults());
      setExistingImages([]);
      setNameValue("");
      setFeaturedValue(false);
      setPublishedValue(false);
      setSlugManuallyEdited(false);

      for (const image of newImages) {
        URL.revokeObjectURL(image.previewUrl);
      }

      setNewImages([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    router.refresh();
  }

  function syncFileInput(nextImages: NewImagePreview[]) {
    if (!fileInputRef.current) {
      return;
    }

    fileInputRef.current.files = buildFileList(nextImages.map((image) => image.file));
  }

  function appendFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) {
      return;
    }

    const selectedFiles = Array.from(fileList);
    const acceptedFiles = selectedFiles.filter(
      (file) => file.type.startsWith("image/") && file.size <= MAX_IMAGE_SIZE_BYTES,
    );

    if (acceptedFiles.length !== selectedFiles.length) {
      toast.error("Only image files up to 8 MB can be added to a product.");
    }

    if (acceptedFiles.length === 0) {
      return;
    }

    const appendedImages = acceptedFiles.map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    const nextImages = [...newImages, ...appendedImages];

    setNewImages(nextImages);
    syncFileInput(nextImages);
  }

  function removeExistingImage(url: string) {
    setExistingImages(existingImages.filter((imageUrl) => imageUrl !== url));
  }

  function removeNewImage(imageId: string) {
    const imageToRemove = newImages.find((image) => image.id === imageId);

    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    const nextImages = newImages.filter((image) => image.id !== imageId);
    setNewImages(nextImages);
    syncFileInput(nextImages);
  }

  async function archiveProduct() {
    if (!product) {
      return;
    }

    const shouldArchive = window.confirm(
      `Archive ${product.name}? It will be removed from active product management.`,
    );

    if (!shouldArchive) {
      return;
    }

    const result = await deleteProductAction(product.id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.refresh();
  }

  const allPreviewItems = [
    ...existingImages.map((url) => ({
      id: url,
      url,
      label: "Existing image",
      isExisting: true,
    })),
    ...newImages.map((image) => ({
      id: image.id,
      url: image.previewUrl,
      label: image.file.name,
      isExisting: false,
    })),
  ];

  return (
    <div className="rounded-[28px] border border-border/70 bg-[#fcfaf7] p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
            {product?.categoryName ?? "New catalog item"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-foreground">
              {product?.name ?? "Create a new product"}
            </h3>
            <StatusChip
              active={publishedValue}
              activeLabel="Published"
              inactiveLabel="Draft"
            />
            <StatusChip
              active={featuredValue}
              activeLabel="Featured"
              inactiveLabel="Standard"
            />
          </div>
        </div>

        {product ? (
          <Button
            type="button"
            variant="destructive"
            className="h-11 rounded-full px-5"
            onClick={() => {
              void archiveProduct();
            }}
          >
            Archive
          </Button>
        ) : null}
      </div>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          clearErrors();
          setIsSaving(true);

          const previewUrls = [
            ...existingImages,
            ...newImages.map((image) => image.previewUrl),
          ];
          const validationResult = safeParse(adminProductFormSchema, {
            ...getValues(),
            imagePreviewUrls: previewUrls,
          });

          if (!validationResult.success) {
            const flattenedIssues = flatten(validationResult.issues);
            const fieldIssues = flattenedIssues.nested ?? {};

            for (const [fieldName, fieldMessages] of Object.entries(fieldIssues)) {
              const firstMessage = fieldMessages?.[0];

              if (!firstMessage) {
                continue;
              }

              setError(fieldName as keyof ProductFormValues, {
                type: "manual",
                message: firstMessage,
              });
            }

            if (flattenedIssues.root?.[0]) {
              toast.error(flattenedIssues.root[0]);
            }

            setIsSaving(false);
            return;
          }

          try {
            await submitForm(event.currentTarget);
          } finally {
            setIsSaving(false);
          }
        }}
        className="grid gap-4 lg:grid-cols-2"
      >
        {product ? <input type="hidden" name="productId" value={product.id} /> : null}
        {existingImages.map((url) => (
          <input key={url} type="hidden" name="existingImageUrls" value={url} />
        ))}

        <FormField id={`${product?.id ?? "create"}-name`} label="Product name" error={errors.name?.message}>
          <Input
            id={`${product?.id ?? "create"}-name`}
            placeholder="Product name"
            autoComplete="off"
            {...nameRegistration}
            onChange={(event) => {
              setNameValue(event.target.value);
              nameRegistration.onChange(event);
            }}
          />
        </FormField>

        <FormField
          id={`${product?.id ?? "create"}-slug`}
          label="Slug"
          helper="Generated from the name unless you edit it manually."
          error={errors.slug?.message}
        >
          <Input
            id={`${product?.id ?? "create"}-slug`}
            placeholder="product-slug"
            autoComplete="off"
            {...slugRegistration}
            onChange={(event) => {
              setSlugManuallyEdited(true);
              slugRegistration.onChange(event);
            }}
          />
        </FormField>

        <FormField
          id={`${product?.id ?? "create"}-description`}
          label="Description"
          error={errors.description?.message}
          className="lg:col-span-2"
        >
          <Textarea
            id={`${product?.id ?? "create"}-description`}
            placeholder="Describe the product, finish, and ideal use."
            className="min-h-28"
            {...register("description")}
          />
        </FormField>

        <FormField
          id={`${product?.id ?? "create"}-category`}
          label="Category"
          error={errors.categoryId?.message}
        >
          <select
            id={`${product?.id ?? "create"}-category`}
            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring"
            {...register("categoryId")}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id={`${product?.id ?? "create"}-gender`} label="Gender" error={errors.gender?.message}>
          <Input
            id={`${product?.id ?? "create"}-gender`}
            placeholder="Women / Men / Unisex"
            {...register("gender")}
          />
        </FormField>

        <FormField id={`${product?.id ?? "create"}-material`} label="Material" error={errors.material?.message}>
          <Input
            id={`${product?.id ?? "create"}-material`}
            placeholder="Leather / Canvas / PU Leather"
            {...register("material")}
          />
        </FormField>

        <FormField id={`${product?.id ?? "create"}-color`} label="Color" error={errors.color?.message}>
          <Input
            id={`${product?.id ?? "create"}-color`}
            placeholder="Black / Brown / Pink"
            {...register("color")}
          />
        </FormField>

        <FormField id={`${product?.id ?? "create"}-size`} label="Size" error={errors.size?.message}>
          <Input
            id={`${product?.id ?? "create"}-size`}
            placeholder="Medium"
            {...register("size")}
          />
        </FormField>

        <FormField id={`${product?.id ?? "create"}-price`} label="Price (KES)" error={errors.price?.message}>
          <Input
            id={`${product?.id ?? "create"}-price`}
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            defaultValue={formatPriceInput(getValues("price"))}
            {...register("price", {
              valueAsNumber: true,
            })}
          />
        </FormField>

        <FormField
          id={`${product?.id ?? "create"}-discountPrice`}
          label="Discount price"
          helper="Leave blank if there is no sale price."
          error={errors.discountPrice?.message}
        >
          <Input
            id={`${product?.id ?? "create"}-discountPrice`}
            type="number"
            min="0"
            step="0.01"
            placeholder="Discount price"
            defaultValue={
              typeof getValues("discountPrice") === "number"
                ? `${getValues("discountPrice")}`
                : ""
            }
            {...register("discountPrice", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
        </FormField>

        <FormField id={`${product?.id ?? "create"}-stock`} label="Stock" error={errors.stock?.message}>
          <Input
            id={`${product?.id ?? "create"}-stock`}
            type="number"
            min="0"
            step="1"
            placeholder="Stock"
            defaultValue={formatStockInput(getValues("stock"))}
            {...register("stock", {
              valueAsNumber: true,
            })}
          />
        </FormField>

        <div className="rounded-[20px] border border-border/70 bg-white px-4 py-4 text-sm lg:col-span-2">
          <p className="font-medium text-foreground">Visibility</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex items-start gap-3 rounded-2xl border border-border/60 px-4 py-3">
              <input
                type="checkbox"
                className="mt-1 size-4"
                {...featuredRegistration}
                onChange={(event) => {
                  setFeaturedValue(event.target.checked);
                  featuredRegistration.onChange(event);
                }}
              />
              <span>
                <span className="block font-medium text-foreground">Featured product</span>
                <span className="block text-muted-foreground">
                  Highlight this item in merchandising surfaces.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-2xl border border-border/60 px-4 py-3">
              <input
                type="checkbox"
                className="mt-1 size-4"
                {...publishedRegistration}
                onChange={(event) => {
                  setPublishedValue(event.target.checked);
                  publishedRegistration.onChange(event);
                }}
              />
              <span>
                <span className="block font-medium text-foreground">Published</span>
                <span className="block text-muted-foreground">
                  Leave this unchecked to keep the product as a draft.
                </span>
              </span>
            </label>
          </div>
        </div>

        <FormField
          id={`${product?.id ?? "create"}-images`}
          label="Product images"
          helper="Upload multiple images. Previews appear instantly before upload."
          error={errors.imagePreviewUrls?.message}
          className="lg:col-span-2"
        >
          <div className="rounded-[24px] border border-dashed border-[#d6c2a6] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">Cloudinary image upload</p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, WEBP, and other image formats up to 8 MB each.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full px-5"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                    fileInputRef.current.click();
                  }
                }}
              >
                <Upload className="size-4" />
                Add images
              </Button>
            </div>

            <input
              ref={fileInputRef}
              id={`${product?.id ?? "create"}-images`}
              type="file"
              name="newImages"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => {
                appendFiles(event.target.files);
              }}
            />

            {allPreviewItems.length === 0 ? (
              <div className="mt-5 flex min-h-40 flex-col items-center justify-center rounded-[20px] bg-[#fcfaf7] px-6 py-8 text-center">
                <ImagePlus className="size-10 text-[#8B5E3C]" />
                <p className="mt-3 font-medium text-foreground">Image preview required</p>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Add at least one product image so you can review the gallery before saving.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {allPreviewItems.map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-[20px] border border-border/70 bg-[#fcfaf7]"
                  >
                    <div className="relative aspect-square bg-white">
                      <Image
                        src={image.url}
                        alt={image.label}
                        fill
                        unoptimized
                        sizes="(min-width: 1280px) 18rem, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {image.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {image.isExisting ? "Already saved" : "Ready to upload"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${image.label}`}
                        onClick={() => {
                          if (image.isExisting) {
                            removeExistingImage(image.url);
                            return;
                          }

                          removeNewImage(image.id);
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormField>

        <div className="lg:col-span-2 flex flex-wrap gap-3">
          <Button type="submit" className="h-11 rounded-full px-5" disabled={isSaving}>
            {isSaving ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save changes"
            ) : publishedValue ? (
              "Create and publish"
            ) : (
              "Save draft"
            )}
          </Button>
          {!isEditing ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full px-5"
              onClick={() => {
                reset(getProductDefaults());
                setExistingImages([]);
                setNameValue("");
                setFeaturedValue(false);
                setPublishedValue(false);
                setSlugManuallyEdited(false);

                for (const image of newImages) {
                  URL.revokeObjectURL(image.previewUrl);
                }

                setNewImages([]);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              Reset form
            </Button>
          ) : null}
          {publishedValue && featuredValue ? (
            <p className="flex items-center gap-2 text-sm text-[#6f492e]">
              <Star className="size-4 fill-current" />
              This product is visible and marked as featured.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export function ProductCrudManager({ data }: ProductCrudManagerProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/5 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] sm:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8B5E3C]">Milestone 13</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          Product CRUD with drafts, featured flags, and Cloudinary uploads.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          Build products with generated slugs, multiple image previews, and production-ready
          upload handling from one admin workspace.
        </p>
      </section>

      <FlashBanner message={data.setupError ?? undefined} tone="warning" />

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Create product</CardTitle>
          <CardDescription>
            Add a new catalog item with validation, draft support, and Cloudinary-backed images.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Create categories first so products can be assigned correctly.
            </p>
          ) : (
            <ProductFormCard categories={data.categories} />
          )}
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Existing products</CardTitle>
          <CardDescription>
            Review, refine, publish, feature, or archive every active product in the catalog.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products are available yet.</p>
          ) : (
            data.products.map((product) => (
              <ProductFormCard
                key={product.id}
                categories={data.categories}
                product={product}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
