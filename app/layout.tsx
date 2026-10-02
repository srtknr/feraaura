import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "feraaura",
  description: "El emeğinin izini taşıyan parçalar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${fraunces.variable} ${outfit.variable} min-h-screen bg-ink font-sans text-cream antialiased`}>
        {children}
      </body>
    </html>
  );
}
