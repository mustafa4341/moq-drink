import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

// PERF-2: Explicit font-display:swap + preload for above-the-fold weights
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "MOQ Drink | More Than A Drink",
  description:
    "Enter the MOQ universe. Every sip is a new feeling. Discover your mood, explore handcrafted flavors, and experience a world designed for you.",
  keywords: ["MOQ", "drink", "mood", "premium", "flavors", "experience"],
  openGraph: {
    title: "MOQ Drink | More Than A Drink",
    description: "Enter the MOQ universe. Every sip is a new feeling.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} antialiased`}
    >
      <body className="bg-[#F7FAFF] text-[#1B1F28] font-sans">
        {children}
      </body>
    </html>
  );
}
