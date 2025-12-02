import { getProductById } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { ProductForm } from "@/components/products/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  // Serialize for client component
  const serializedProduct = {
    ...product,
    basePrice: product.basePrice.toString(),
    costPrice: product.costPrice?.toString() || null,
    taxRate: product.taxRate.toString(),
  };

  return (
    <div className="max-w-4xl">
      <ProductForm
        mode="edit"
        product={serializedProduct}
        categories={categories}
      />
    </div>
  );
}
