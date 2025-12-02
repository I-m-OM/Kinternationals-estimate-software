import { getCustomerById } from "@/lib/actions/customers";
import { CustomerForm } from "@/components/customers/customer-form";
import { notFound } from "next/navigation";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  // Serialize dates for client component
  const serializedCustomer = {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    zipCode: customer.zipCode,
    country: customer.country,
    notes: customer.notes,
  };

  return (
    <div className="max-w-4xl">
      <CustomerForm mode="edit" customer={serializedCustomer} />
    </div>
  );
}
