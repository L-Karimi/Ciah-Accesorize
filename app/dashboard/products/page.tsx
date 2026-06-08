import { FlashBanner } from "@/components/admin/flash-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/lib/actions/admin";
import { getAdminProductsData } from "@/lib/admin";

interface AdminProductsPageProps {
  searchParams?: Promise<{
    status?: string | string[];
    error?: string | string[];
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const status = typeof params?.status === "string" ? params.status : undefined;
  const error = typeof params?.error === "string" ? params.error : undefined;
  const data = await getAdminProductsData();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/5 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] sm:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8B5E3C]">Product CRUD</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          Create, edit, and archive products.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          Update pricing, merchandising fields, inventory, and image URLs from one module.
        </p>
      </section>

      <FlashBanner message={status} tone="success" />
      <FlashBanner message={error} tone="error" />
      <FlashBanner message={data.setupError ?? undefined} tone="warning" />

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Create product</CardTitle>
          <CardDescription>
            Add a new catalog item with the full storefront merchandising fields.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Create categories first so products can be assigned correctly.
            </p>
          ) : (
            <form action={createProductAction} className="grid gap-4 lg:grid-cols-2">
              <Input name="name" placeholder="Product name" />
              <Input name="slug" placeholder="product-slug" />
              <div className="lg:col-span-2">
                <Textarea name="description" placeholder="Description" className="min-h-28" />
              </div>
              <select
                name="categoryId"
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring"
                defaultValue=""
              >
                <option value="" disabled>
                  Select category
                </option>
                {data.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Input name="gender" placeholder="Women / Men / Unisex" />
              <Input name="material" placeholder="Leather / Canvas / PU Leather" />
              <Input name="color" placeholder="Black / Brown / Pink" />
              <Input name="size" placeholder="Medium" />
              <Input name="price" type="number" min="0" step="0.01" placeholder="Price" />
              <Input
                name="discountPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="Discount price (optional)"
              />
              <Input name="stock" type="number" min="0" step="1" placeholder="Stock" />
              <div className="rounded-[20px] border border-border/70 bg-[#fcfaf7] px-4 py-3 text-sm">
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="featured" className="size-4" />
                  Featured product
                </label>
                <label className="mt-3 flex items-center gap-3">
                  <input type="checkbox" name="published" className="size-4" />
                  Published
                </label>
              </div>
              <div className="lg:col-span-2">
                <Textarea
                  name="imageUrls"
                  placeholder="One image URL per line"
                  className="min-h-28"
                />
              </div>
              <div className="lg:col-span-2">
                <Button type="submit" className="h-11 rounded-full px-5">
                  Create product
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Existing products</CardTitle>
          <CardDescription>
            Review and update every product currently active in the catalog.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products are available yet.</p>
          ) : (
            data.products.map((product) => (
              <div
                key={product.id}
                className="rounded-[28px] border border-border/70 bg-[#fcfaf7] p-5"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
                      {product.categoryName}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-foreground">
                      {product.name}
                    </h3>
                  </div>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="productId" value={product.id} />
                    <Button type="submit" variant="destructive" className="h-11 rounded-full px-5">
                      Archive
                    </Button>
                  </form>
                </div>

                <form action={updateProductAction} className="grid gap-4 lg:grid-cols-2">
                  <input type="hidden" name="productId" value={product.id} />
                  <Input name="name" defaultValue={product.name} />
                  <Input name="slug" defaultValue={product.slug} />
                  <div className="lg:col-span-2">
                    <Textarea
                      name="description"
                      defaultValue={product.description}
                      className="min-h-28"
                    />
                  </div>
                  <select
                    name="categoryId"
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring"
                    defaultValue={product.categoryId}
                  >
                    {data.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <Input name="gender" defaultValue={product.gender} />
                  <Input name="material" defaultValue={product.material} />
                  <Input name="color" defaultValue={product.color} />
                  <Input name="size" defaultValue={product.size ?? ""} />
                  <Input name="price" type="number" min="0" step="0.01" defaultValue={product.price} />
                  <Input
                    name="discountPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={product.discountPrice ?? ""}
                  />
                  <Input name="stock" type="number" min="0" step="1" defaultValue={product.stock} />
                  <div className="rounded-[20px] border border-border/70 bg-white px-4 py-3 text-sm">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="featured"
                        className="size-4"
                        defaultChecked={product.featured}
                      />
                      Featured product
                    </label>
                    <label className="mt-3 flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="published"
                        className="size-4"
                        defaultChecked={product.published}
                      />
                      Published
                    </label>
                  </div>
                  <div className="lg:col-span-2">
                    <Textarea
                      name="imageUrls"
                      defaultValue={product.imageUrls.join("\n")}
                      className="min-h-28"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Button type="submit" className="h-11 rounded-full px-5">
                      Save changes
                    </Button>
                  </div>
                </form>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
