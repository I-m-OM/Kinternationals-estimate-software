import { EstimateForm } from "@/components/estimates/estimate-form";
import { getEstimateById } from "@/lib/actions/estimates";
import { getCustomers } from "@/lib/actions/customers";
import { getProducts } from "@/lib/actions/products";
import { notFound } from "next/navigation";

export default async function EditEstimatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [estimate, customers, allProducts] = await Promise.all([
    getEstimateById(id),
    getCustomers(),
    getProducts(),
  ]);

  if (!estimate) {
    notFound();
  }

  // Serialize products
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

  // Serialize estimate data
  const serializedEstimate = {
    id: estimate.id,
    customerId: estimate.customerId,
    title: estimate.title,
    description: estimate.description,
    shutterMaterialId: estimate.shutterMaterialId,
    discountPercent: estimate.discountPercent.toString(),
    notes: estimate.notes,
    items: estimate.items.map((item) => ({
      productId: item.productId,
      description: item.description,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      taxRate: item.taxRate.toString(),
      height: item.height?.toString(),
      width: item.width?.toString(),
      depth: item.depth?.toString(),
      area: item.area?.toString(),
    })),
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Estimate</h1>
        <p className="text-gray-500 mt-1">{estimate.estimateNumber}</p>
      </div>

      <EstimateForm
        customers={customers}
        products={products}
        shutterMaterials={shutterMaterials}
        mode="edit"
        estimate={serializedEstimate}
      />
    </div>
  );
}
