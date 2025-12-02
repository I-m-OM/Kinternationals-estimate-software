import { EstimateForm } from "@/components/estimates/estimate-form";
import { getCustomers } from "@/lib/actions/customers";
import { getProducts } from "@/lib/actions/products";

export default async function NewEstimatePage() {
  const [customers, allProducts] = await Promise.all([
    getCustomers(),
    getProducts(),
  ]);

  // Separate shutter materials from other products
  const shutterMaterials = allProducts
    .filter((p) => p.category.slug === "shutters")
    .map((p) => ({
      ...p,
      basePrice: p.basePrice.toString(),
      costPrice: p.costPrice?.toString() || null,
      taxRate: p.taxRate.toString(),
    }));

  const products = allProducts
    .filter((p) => p.category.slug !== "shutters")
    .map((p) => ({
      ...p,
      basePrice: p.basePrice.toString(),
      costPrice: p.costPrice?.toString() || null,
      taxRate: p.taxRate.toString(),
    }));

  return (
    <div className="max-w-6xl">
      <EstimateForm
        customers={customers}
        products={products}
        shutterMaterials={shutterMaterials}
      />
    </div>
  );
}
