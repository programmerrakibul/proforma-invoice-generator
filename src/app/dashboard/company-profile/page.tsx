import Container from "@/components/shared/container";
import { getCompanyProfileAction } from "@/features/company/actions/get-company";
import CompanyForm from "@/features/company/components/company-form";

const CompanyProfilePage = async () => {
  const profileData = await getCompanyProfileAction();

  return (
    <section className="min-w-0 py-6 sm:py-10 lg:py-14">
      <Container className="max-w-4xl">
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            PROFILE STUDIO
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Update company profile
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Keep your company information accurate across invoices and
            commercial documents.
          </p>
        </div>

        <CompanyForm profileData={profileData} />
      </Container>
    </section>
  );
};

export default CompanyProfilePage;
