import Container from "@/components/shared/container";
import { Spinner } from "@/components/ui/spinner";

const NewInvoiceLoading = () => {
  return (
    <section>
      <Container>
        <div className="flex items-center justify-center gap-1.5">
          <Spinner />
          <span>Loading</span>
        </div>
      </Container>
    </section>
  );
};

export default NewInvoiceLoading;
