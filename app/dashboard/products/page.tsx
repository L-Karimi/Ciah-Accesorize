import { ProductCrudManager } from "@/components/admin/product-crud-manager";
import { getAdminProductsData } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const data = await getAdminProductsData();

  return <ProductCrudManager data={data} />;
}
