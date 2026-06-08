import { FlashBanner } from "@/components/admin/flash-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateInventoryAction } from "@/lib/actions/admin";
import { getAdminInventoryData } from "@/lib/admin";

interface AdminInventoryPageProps {
  searchParams?: Promise<{
    status?: string | string[];
    error?: string | string[];
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage({
  searchParams,
}: AdminInventoryPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const status = typeof params?.status === "string" ? params.status : undefined;
  const error = typeof params?.error === "string" ? params.error : undefined;
  const data = await getAdminInventoryData();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/5 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] sm:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8B5E3C]">Inventory</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          Manage stock, featured placement, and publish state.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          This module is tuned for quick inventory decisions without opening the full product editor.
        </p>
      </section>

      <FlashBanner message={status} tone="success" />
      <FlashBanner message={error} tone="error" />
      <FlashBanner message={data.setupError ?? undefined} tone="warning" />

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Inventory management</CardTitle>
          <CardDescription>
            Prioritize low-stock items and update merchandising flags in place.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No inventory records are available yet.</p>
          ) : (
            data.items.map((item) => (
              <form
                key={item.id}
                action={updateInventoryAction}
                className="rounded-[24px] border border-border/70 bg-[#fcfaf7] p-4"
              >
                <input type="hidden" name="productId" value={item.id} />
                <div className="grid gap-4 xl:grid-cols-[1.4fr,0.7fr,0.8fr] xl:items-center">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.categoryName} · KES {item.price.toLocaleString()} · Updated{" "}
                      {item.updatedAt.toLocaleDateString("en-KE")}
                    </p>
                  </div>
                  <Input
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={item.stock}
                  />
                  <div className="rounded-[20px] border border-border/70 bg-white px-4 py-3 text-sm">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="featured"
                        className="size-4"
                        defaultChecked={item.featured}
                      />
                      Featured
                    </label>
                    <label className="mt-3 flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="published"
                        className="size-4"
                        defaultChecked={item.published}
                      />
                      Published
                    </label>
                  </div>
                </div>
                <div className="mt-4">
                  <Button type="submit" className="h-11 rounded-full px-5">
                    Save inventory
                  </Button>
                </div>
              </form>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
