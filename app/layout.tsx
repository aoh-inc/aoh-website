import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aioutsourcehub.com"),
  title: {
    default: "AI Outsource Hub - AI Services for Local Businesses",
    template: "%s - AI Outsource Hub",
  },
  description:
    "A hub of AI services for local businesses - review automation, AI voice agents, AI visibility, and more. You run your business, we run the AI. Starting at $1/day.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI Outsource Hub",
    description:
      "Review automation, AI voice agents, and AI visibility for local businesses. Starting at $1/day, no contract.",
    url: "https://aioutsourcehub.com",
    siteName: "AI Outsource Hub",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/AOH-logo-light-bg.svg",
        width: 1200,
        height: 630,
        alt: "AI Outsource Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Outsource Hub",
    description:
      "Get your business found on Google, Maps, ChatGPT, and Perplexity. Starting at $1/day.",
    images: ["/AOH-logo-light-bg.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AI Outsource Hub",
  url: "https://aioutsourcehub.com",
  description:
    "AI Outsource Hub operates AI on behalf of local businesses - review automation, AI voice agents, AI visibility, lead generation, and custom AI agents. You run your business. We run the AI.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "support",
    email: "support@aioutsourcehub.com",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AI Outsource Hub",
  url: "https://aioutsourcehub.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-accent-text)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)]"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
