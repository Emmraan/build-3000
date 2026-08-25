import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildWebSiteJsonLd, getSiteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl() ? new URL(getSiteUrl()) : undefined,
  title: {
    default:
      "build-3000 — The essential concepts for building software with AI coding agents",
    template: "%s · build-3000",
  },
  description:
    "An open-source curriculum that takes complete beginners from zero to shipping secure, production-ready software with AI coding agents. Inspired by the Oxford 3000.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: "build-3000",
    locale: "en_US",
    type: "website",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} flex min-h-screen flex-col antialiased`}
      >
        {/* Marks JS availability before first paint so CSS-gated reveals only
            hide content when they can also reveal it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Link
            href="#main"
            className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-2 focus:outline-offset-2 focus:outline-ring"
          >
            Skip to content
          </Link>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildWebSiteJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
