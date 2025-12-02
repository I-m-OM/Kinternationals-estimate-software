import { getProductById, deleteProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Convert Decimal to number for calculations
  const basePrice = Number(product.basePrice);
  const costPrice = product.costPrice ? Number(product.costPrice) : null;

  const margin = costPrice
    ? (((basePrice - costPrice) / basePrice) * 100).toFixed(2)
    : null;

  async function handleDelete() {
    "use server";
    return await deleteProduct(id);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-500 mt-1">SKU: {product.sku}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/products/${product.id}/edit`}>
            <Button>Edit Product</Button>
          </Link>
          <DeleteButton
            onDelete={handleDelete}
            itemName={product.name}
            redirectTo="/products"
          />
          <Link href="/products">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{product.category.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Unit</p>
              <p className="font-medium">{product.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{product.description || "-"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Base Price</p>
              <p className="font-medium text-lg">
                ₹{basePrice.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cost Price</p>
              <p className="font-medium">
                {costPrice ? `₹${costPrice.toLocaleString("en-IN")}` : "-"}
              </p>
            </div>
            {margin && (
              <div>
                <p className="text-sm text-gray-500">Margin</p>
                <p className="font-medium text-green-600">{margin}%</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Tax Rate</p>
              <p className="font-medium">
                {Number(product.taxRate).toFixed(2)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm text-gray-500">Stock Quantity</p>
            <p className="font-medium text-2xl">
              {product.stockQuantity ?? "Not tracked"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
