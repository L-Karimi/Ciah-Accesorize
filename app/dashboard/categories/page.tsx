import { FlashBanner } from "@/components/admin/flash-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/admin";
import { getAdminCategoriesData } from "@/lib/admin";

interface AdminCategoriesPageProps {
  searchParams?: Promise<{
    status?: string | string[];
    error?: string | string[];
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const status = typeof params?.status === "string" ? params.status : undefined;
  const error = typeof params?.error === "string" ? params.error : undefined;
  const data = await getAdminCategoriesData();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/5 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] sm:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8B5E3C]">Category CRUD</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          Organize the catalog with clear category management.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          Create and maintain category structure before assigning products or opening new collections.
        </p>
      </section>

      <FlashBanner message={status} tone="success" />
      <FlashBanner message={error} tone="error" />
      <FlashBanner message={data.setupError ?? undefined} tone="warning" />

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Create category</CardTitle>
          <CardDescription>Add a new storefront collection.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCategoryAction} className="grid gap-4 lg:grid-cols-2">
            <Input name="name" placeholder="Category name" />
            <Input name="slug" placeholder="category-slug" />
            <div className="lg:col-span-2">
              <Textarea name="description" placeholder="Description" className="min-h-24" />
            </div>
            <div className="lg:col-span-2">
              <Input name="image" placeholder="Category image URL (optional)" />
            </div>
            <div className="lg:col-span-2">
              <Button type="submit" className="h-11 rounded-full px-5">
                Create category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Existing categories</CardTitle>
          <CardDescription>
            Update category copy and archive unused collections.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-2">
          {data.categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories are available yet.</p>
          ) : (
            data.categories.map((category) => (
              <div
                key={category.id}
                className="rounded-[28px] border border-border/70 bg-[#fcfaf7] p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.productCount} product{category.productCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <form action={deleteCategoryAction}>
                    <input type="hidden" name="categoryId" value={category.id} />
                    <Button type="submit" variant="destructive" className="h-11 rounded-full px-5">
                      Archive
                    </Button>
                  </form>
                </div>

                <form action={updateCategoryAction} className="grid gap-4">
                  <input type="hidden" name="categoryId" value={category.id} />
                  <Input name="name" defaultValue={category.name} />
                  <Input name="slug" defaultValue={category.slug} />
                  <Textarea
                    name="description"
                    defaultValue={category.description ?? ""}
                    className="min-h-24"
                  />
                  <Input name="image" defaultValue={category.image ?? ""} />
                  <Button type="submit" className="h-11 rounded-full px-5">
                    Save changes
                  </Button>
                </form>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
