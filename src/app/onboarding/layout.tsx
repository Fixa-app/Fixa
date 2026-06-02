import type { Metadata } from "next";
import { Geist_Mono, Manrope, Sora } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { headers } from "next/headers";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fixa",
  description: "Field-service management, reimagined.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Hide marketing header on app routes
  const hideHeader = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/quotes") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/settings");

  return (
    <html
      lang="nl"
      className={`${manrope.variable} ${geistMono.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {!hideHeader && <SiteHeader />}
        {children}
      </body>
    </html>
  );
}