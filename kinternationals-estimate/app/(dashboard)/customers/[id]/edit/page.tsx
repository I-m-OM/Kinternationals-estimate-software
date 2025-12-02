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

  return (
    <div className="max-w-4xl">
      <CustomerForm mode="edit" customer={customer} />
    </div>
  );
}
