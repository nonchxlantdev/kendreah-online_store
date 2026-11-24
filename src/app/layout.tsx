import type { Metadata } from "next";
import {
  Barlow_Condensed,
  DM_Sans,
  Great_Vibes,
  Montserrat,
} from "next/font/google";
import { Providers } from "@/components/providers";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["500", "600", "700", "800"],
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["500", "600", "700"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  title: {
    default: "Ken' Dreah Online Store | Shop • Save • Enjoy",
    template: "%s | Ken' Dreah Online Store",
  },
  description:
    "Ken' Dreah Online Store — trendy fashion, footwear and household appliances. Shipping to Belize and the United States. Shop in USD.",
  keywords: [
    "Ken' Dreah",
    "online store",
    "fashion",
    "footwear",
    "appliances",
    "Belize",
    "United States",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Ken' Dreah Online Store",
    description:
      "Your style. Your rules. Shipping to Belize & the United States.",
    type: "website",
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
        className={`${dmSans.variable} ${montserrat.variable} ${barlow.variable} ${greatVibes.variable} antialiased`}
      >
        <Providers>
          <StorefrontShell>{children}</StorefrontShell>
        </Providers>
      </body>
    </html>
  );
}
