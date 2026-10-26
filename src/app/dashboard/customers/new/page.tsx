import { CustomerForm } from "@/features/customers/components/customer-form";

export default function NewCustomerPage() {
  return (
    <section className="p-6 lg:p-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        Customers
      </p>
      <h1 className="mb-6 mt-2 text-3xl font-semibold">Add customer</h1>
      <CustomerForm />
    </section>
  );
}
