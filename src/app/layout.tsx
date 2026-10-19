import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import { StoreProvider } from "@/store/provider";
import { SiteHeader } from "@/components/layout/site-header";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M.M FABRICS — Proforma Invoice Generator",
  description: "Create and manage proforma invoices.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        "scroll-smooth",
        "selection:text-primary-foreground selection:bg-primary/80",
      )}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <StoreProvider>
            <SiteHeader user={user} />
            {children}
          </StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
