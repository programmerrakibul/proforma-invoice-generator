import Container from "@/components/shared/container";

const InvoiceNotFoundPage = () => {
  return (
    <section className="min-h-screen bg-muted/25">
      <Container>
        <div className="flex h-full flex-col items-center justify-center py-6 lg:py-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Invoice Not Found
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            The invoice you are trying to access does not exist or has been
            deleted. Please check the invoice ID and try again.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default InvoiceNotFoundPage;
