import { InvoiceGenerator } from "@/features/invoices/components/invoice-generator";
import Container from "@/components/shared/container";

export const dynamic = "force-dynamic";

export default function NewInvoicePage() {
  const companyProfile = {
    companyName: "M.M FABRICS",
    address: "Sobhan Super Market, South Birampur, Madhabdi, Narsingdi",
    corporateOffice: "Uttara, Dhaka",
    contactNumber: "",
    email: "",
  };

  return (
    <Container className="flex flex-col h-full">
      <InvoiceGenerator
        initialValues={{ piNumber: "" }}
        companyProfile={companyProfile}
      />
    </Container>
  );
}
