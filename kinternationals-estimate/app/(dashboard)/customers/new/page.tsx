import { CustomerForm } from "@/components/customers/customer-form";

export default function NewCustomerPage() {
  return (
    <div className="max-w-4xl">
      <CustomerForm mode="create" />
    </div>
  );
}
