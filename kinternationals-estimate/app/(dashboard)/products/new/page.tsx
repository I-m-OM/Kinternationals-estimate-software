import { ProductForm } from "@/components/products/product-form";
import { getCategories } from "@/lib/actions/categories";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-4xl">
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
