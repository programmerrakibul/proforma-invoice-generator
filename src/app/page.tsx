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
import { FileText, LayoutDashboard, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
];

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
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-serif font-bold text-ink text-lg tracking-tight"
            aria-label="M.M FABRICS home"
          >
            <span className="text-primary">M.M</span> FABRICS
          </Link>
          <div className="flex items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link href="/dashboard/invoices/new" className="Button__root">
              <Button size="sm">Create invoice</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 relative overflow-hidden bg-background">
        {/* Hero section */}
        <section className="relative px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center lg:text-left lg:max-w-3xl">
              <Badge variant="outline" className="mb-6 text-xs">
                Proforma invoice generator
              </Badge>
              <h1 className="font-serif font-bold text-ink text-4xl lg:text-6xl tracking-tight leading-tight mb-6">
                Create professional proforma
                <br />
                invoices for M.M FABRICS
              </h1>
              <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mb-10 leading-relaxed">
                Generate, preview, and export A4 proforma invoices with
                line-item calculations, buyer and seller details, and secure
                draft persistence.
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
            </div>

            {/* Hero preview card */}
            <div className="mt-16 lg:mt-0 lg:absolute lg:right-0 lg:top-24 lg:w-95">
              <Card className="overflow-hidden shadow-xl ring-1 ring-border/50">
                <CardHeader className="bg-muted p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-primary" />
                    <div className="size-3 rounded-full bg-secondary" />
                    <div className="size-3 rounded-full bg-muted" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 font-sans text-xs">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Invoice no.</span>
                      <span className="font-medium">PI-20261017-001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issue date</span>
                      <span className="font-medium">17 Oct 2026</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="space-y-2">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Cotton Fabric</span>
                        <span>USD 200.00</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Polyester Fabric</span>
                        <span>USD 150.00</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border flex justify-between font-serif font-semibold">
                      <span>Total</span>
                      <span>USD 350.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section
          id="features"
          className="px-6 py-24 lg:px-8 lg:py-32 bg-muted/30"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-ink text-3xl lg:text-4xl tracking-tight mb-4">
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
                  <CardHeader className="p-5">
                    <feature.icon className="size-5 text-primary" />
                  </CardHeader>
                  <CardContent className="p-5">
                    <CardTitle className="font-serif font-semibold text-ink text-sm mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-ink text-3xl lg:text-4xl tracking-tight mb-4">
                How it works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Create your first proforma invoice in three simple steps.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <Card key={step.step} className="overflow-hidden">
                  <CardHeader className="p-5">
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary mb-4 font-serif font-bold text-sm">
                      {step.step}
                    </div>
                    <CardTitle className="font-serif font-semibold text-ink text-sm">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Card className="bg-primary text-primary-foreground overflow-hidden">
              <div className="p-8 lg:p-12 text-center">
                <h2 className="font-serif font-bold text-white text-3xl lg:text-4xl tracking-tight mb-4">
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
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <Link
                href="/"
                className="font-serif font-bold text-ink text-sm tracking-tight"
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
              M.M FABRICS &mdash; Sobhan Super Market, South Birampur, Madhabdi,
              Narsingdi. Corporate Office: Uttara, Dhaka.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
