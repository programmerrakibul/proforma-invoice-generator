import Container from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { companyProfile } from "@/data/company";
import { FileText, LayoutDashboard, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Dashboard overview",
    description:
      "Track all your proforma invoices in one place with status filters, search, and sorting.",
  },
  {
    icon: FileText,
    title: "Live invoice preview",
    description:
      "See your invoice render in real time as you fill out the form, with A4 print-safe layout.",
  },
  {
    icon: Send,
    title: "Draft saving",
    description:
      "Save invoices as drafts and come back to finish them later. Nothing is lost.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "Every invoice is tied to the authenticated user. Ownership is enforced on every mutation.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Enter buyer details",
    description:
      "Fill in the buyer name, address, and destination country for your shipment.",
  },
  {
    step: "2",
    title: "Add line items",
    description:
      "Add products with description, style, color, quantity, unit price, and unit.",
  },
  {
    step: "3",
    title: "Save and preview",
    description:
      "Save as a draft or export a print-ready A4 proforma invoice PDF.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-background">
      <main className="flex-1 relative overflow-hidden bg-background">
        {/* Hero section */}
        <section className="relative py-24 lg:py-32">
          <Container className="flex flex-col items-center justify-center text-center lg:max-w-6xl">
            <Badge variant="outline" className="mb-6 text-xs">
              Proforma invoice generator
            </Badge>
            <h1 className="font-bold text-ink text-3xl sm:text-4xl lg:text-6xl tracking-tight leading-tight mb-6">
              Create professional proforma invoices
              <br />
              for {companyProfile.companyName}
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mb-10 leading-relaxed">
              Generate, preview, and export A4 proforma invoices with line-item
              calculations, buyer and seller details, and secure draft
              persistence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/dashboard/invoices/new">
                <Button size="lg">Create your first invoice</Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  See how it works
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Features section */}
        <section id="features" className="py-24 lg:py-32 bg-muted/30">
          <Container>
            <div className="text-center mb-16">
              <h2 className=" font-bold text-ink text-3xl lg:text-4xl tracking-tight mb-4">
                Everything you need to invoice
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From buyer details to line-item calculations, every part of your
                proforma invoice is covered.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <Card key={feature.title} className="overflow-hidden">
                  <CardHeader>
                    <feature.icon className="size-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <CardTitle className=" font-semibold text-ink text-sm">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 lg:py-32">
          <Container>
            <div className="text-center mb-16">
              <h2 className=" font-bold text-ink text-3xl lg:text-4xl tracking-tight mb-4">
                How it works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Create your first proforma invoice in three simple steps.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <Card key={step.step} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary mb-4 font-bold text-sm">
                      {step.step}
                    </div>
                    <CardTitle className="font-semibold text-ink text-sm">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA banner */}
        <section className="py-20 lg:py-24">
          <Container>
            <Card className="bg-primary text-primary-foreground overflow-hidden">
              <div className="p-8 lg:p-12 text-center">
                <h2 className=" font-bold text-white text-3xl lg:text-4xl tracking-tight mb-4">
                  Ready to create your first invoice?
                </h2>
                <p className="text-primary-foreground/80 text-lg mb-8 max-w-md mx-auto">
                  Join M.M FABRICS and start generating professional proforma
                  invoices today.
                </p>
                <Link href="/dashboard/invoices/new">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-primary bg-white"
                  >
                    Create invoice
                  </Button>
                </Link>
              </div>
            </Card>
          </Container>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 py-12">
          <Container>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <Link
                href="/"
                className=" font-bold text-ink text-sm tracking-tight"
              >
                <span className="text-primary">M.M</span> FABRICS
              </Link>
              <div className="flex gap-6 text-xs text-muted-foreground">
                <Link
                  href="/auth/login"
                  className="hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="hover:text-foreground transition-colors"
                >
                  Create account
                </Link>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms
                </a>
              </div>
            </div>
            <Separator className="my-8" />
            <p className="text-center text-xs text-muted-foreground">
              {companyProfile.address}
            </p>
          </Container>
        </footer>
      </main>
    </div>
  );
}
