import { getCustomerById } from "@/lib/actions/customers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
        <div className="flex gap-3">
          <Link href={`/customers/${customer.id}/edit`}>
            <Button>Edit Customer</Button>
          </Link>
          <Link href="/customers">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{customer.email || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{customer.phone || "-"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Street Address</p>
              <p className="font-medium">{customer.address || "-"}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-medium">{customer.city || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">State</p>
                <p className="font-medium">{customer.state || "-"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">ZIP Code</p>
                <p className="font-medium">{customer.zipCode || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium">{customer.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {customer.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">
              {customer.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Estimates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Estimates</CardTitle>
        </CardHeader>
        <CardContent>
          {customer.estimates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No estimates yet</p>
          ) : (
            <div className="space-y-2">
              {customer.estimates.map((estimate) => (
                <div
                  key={estimate.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{estimate.estimateNumber}</p>
                    <p className="text-sm text-gray-500">{estimate.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{estimate.total.toString()}</p>
                    <p className="text-sm text-gray-500">{estimate.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
