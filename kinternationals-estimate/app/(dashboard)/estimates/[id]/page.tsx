import { getEstimateById, deleteEstimate } from "@/lib/actions/estimates";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusSelector } from "@/components/estimates/status-selector";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/services/pricing-service";

export default async function EstimateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const estimate = await getEstimateById(id);

  if (!estimate) {
    notFound();
  }

  async function handleDelete() {
    "use server";
    return await deleteEstimate(id);
  }

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    SENT: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    EXPIRED: "bg-orange-100 text-orange-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{estimate.title}</h1>
          <p className="text-gray-500 mt-1">
            {estimate.estimateNumber} • Created{" "}
            {new Date(estimate.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/estimates/${estimate.id}/edit`}>
            <Button>Edit Estimate</Button>
          </Link>
          <DeleteButton
            onDelete={handleDelete}
            itemName={estimate.estimateNumber}
            redirectTo="/estimates"
          />
          <Link href="/estimates">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{estimate.customer.name}</p>
            </div>
            {estimate.customer.email && (
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{estimate.customer.email}</p>
              </div>
            )}
            {estimate.customer.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{estimate.customer.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status - NOW USING CLIENT COMPONENT */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusSelector
              estimateId={estimate.id}
              currentStatus={estimate.status}
            />
          </CardContent>
        </Card>

        {/* Created By */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Created By</p>
              <p className="font-medium">{estimate.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Items</p>
              <p className="font-medium">{estimate.items.length}</p>
            </div>
            {estimate.validUntil && (
              <div>
                <p className="text-sm text-gray-500">Valid Until</p>
                <p className="font-medium">
                  {new Date(estimate.validUntil).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {estimate.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">
              {estimate.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Details
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Tax
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estimate.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {item.description}
                      </div>
                      {item.product && (
                        <div className="text-xs text-gray-500">
                          {item.product.sku}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {item.height && item.width && item.depth && (
                        <div>
                          Dimensions: {Number(item.height)}×{Number(item.width)}
                          ×{Number(item.depth)}mm
                        </div>
                      )}
                      {item.area && <div>Area: {Number(item.area)} sqft</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {Number(item.quantity)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {formatCurrency(Number(item.unitPrice))}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right">
                      {Number(item.taxRate)}%
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(Number(item.lineTotal))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                {formatCurrency(Number(estimate.subtotal))}
              </span>
            </div>
            {Number(estimate.discountPercent) > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount ({Number(estimate.discountPercent)}%)</span>
                <span>-{formatCurrency(Number(estimate.discountAmount))}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">
                {formatCurrency(Number(estimate.taxAmount))}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(Number(estimate.total))}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {estimate.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Internal Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">
              {estimate.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
