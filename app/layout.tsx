import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tradeify Plan Advisor",
  description:
    "Find the right funded account for your trading style. Compare plans, calculate ROI, and get an AI-powered recommendation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
