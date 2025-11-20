import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { PillNavbar, Footer, ScrollToTop } from "@/components/layout";
import { LiquidEther } from "@/components/ui";
import { AuthProvider } from "@/contexts/AuthContext";
import siteConfig from "@/data/siteConfig.json";
import { SiteConfig } from "@/types/site";

const site = siteConfig as SiteConfig;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
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
      <body className={`${inter.variable} ${bricolageGrotesque.variable} font-sans antialiased`}>
        <AuthProvider>
          <ScrollToTop />
          
          {/* Global LiquidEther Background */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <LiquidEther
              colors={['#6443EA', '#98BEFB', '#A58BF8']}
              mouseForce={20}
              cursorSize={100}
              isViscous={false}
              viscous={30}
              iterationsViscous={32}
              iterationsPoisson={32}
              resolution={0.5}
              isBounce={false}
              autoDemo={true}
              autoSpeed={0.5}
              autoIntensity={2.2}
              takeoverDuration={0.25}
              autoResumeDelay={3000}
              autoRampDuration={0.6}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          
          <PillNavbar />
          <div className="relative z-10">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
