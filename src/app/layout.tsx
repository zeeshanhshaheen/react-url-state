import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React Zod URL State - Demo",
  description: "Schema-driven URL ↔ state sync for filters, tables & dashboards. Type-safe, SSR-friendly URL state management.",
  keywords: ["react", "url", "state", "filters", "search", "params", "typescript", "schema", "zod", "nextjs"],
  authors: [{ name: "Zeeshan Shaheen" }],
  openGraph: {
    title: "React Zod URL State - Demo",
    description: "Schema-driven URL ↔ state sync for filters, tables & dashboards. Type-safe, SSR-friendly URL state management.",
    type: "website",
    url: "https://react-url-state.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "React Zod URL State - Demo",
    description: "Schema-driven URL ↔ state sync for filters, tables & dashboards. Type-safe, SSR-friendly URL state management.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
