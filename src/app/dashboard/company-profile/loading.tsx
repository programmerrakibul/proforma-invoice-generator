import Container from "@/components/shared/container";
import { LoadingState } from "@/components/shared/loading-state";

const CompanyProfilePageLoading = () => {
  return (
    <section className="py-6 sm:py-10 lg:py-14">
      <Container>
        <LoadingState />
      </Container>
    </section>
  );
};

export default CompanyProfilePageLoading;
