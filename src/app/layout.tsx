import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar, Footer, ScrollToTop } from "@/components/layout";
import siteConfig from "@/data/siteConfig.json";
import { SiteConfig } from "@/types/site";

const site = siteConfig as SiteConfig;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${site.abbreviation} | ${site.name}`,
  description: site.meta.description,
  keywords: site.meta.keywords,
  authors: [{ name: "UACS Executive Team" }],
  openGraph: {
    title: site.name,
    description: site.meta.description,
    url: "https://uacs.vercel.app",
    siteName: site.abbreviation,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.meta.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ScrollToTop />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
