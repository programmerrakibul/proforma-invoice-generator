import { InvoiceGenerator } from "@/features/invoices/components/invoice-generator";

export const dynamic = "force-dynamic";

export default function NewInvoicePage() {
  const companyProfile = {
    companyName: "M.M FABRICS",
    address: "",
    corporateOffice: "",
    contactNumber: "",
    email: "",
  };

  return (
    <div className="flex flex-col h-full">
      <InvoiceGenerator
        initialValues={{}}
        companyProfile={companyProfile}
      />
    </div>
  );
}
