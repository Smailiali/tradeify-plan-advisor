import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tradeify-plan-advisor.vercel.app"),
  title: {
    default: "Tradeify Plan Advisor",
    template: "%s | Tradeify Plan Advisor",
  },
  description:
    "Compare Tradeify funded account plans side by side, calculate ROI and breakeven, visualize trailing drawdowns, and get an AI-powered plan recommendation tailored to your trading style.",
  keywords: [
    "Tradeify",
    "prop trading",
    "funded account",
    "futures trading",
    "plan comparison",
    "ROI calculator",
    "drawdown visualizer",
    "AI recommendation",
    "Growth plan",
    "Select plan",
    "Lightning plan",
  ],
  authors: [{ name: "Ali Smaili", url: "https://linkedin.com/in/smailiali" }],
  creator: "Ali Smaili",
  openGraph: {
    type: "website",
    title: "Tradeify Plan Advisor",
    description:
      "Find the right funded futures account for your trading style. Compare Growth, Select, and Lightning plans with AI-powered recommendations.",
    siteName: "Tradeify Plan Advisor",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tradeify Plan Advisor",
    description:
      "Compare Tradeify plans, calculate ROI, and get an AI recommendation powered by Claude.",
    creator: "@smailiali",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-text-primary font-sans antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
