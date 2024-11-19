import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const productSans = localFont({
  src: [
    {
      path: "../assets/fonts/ProductSans-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/ProductSans-Bold.woff",
      weight: "700",
      style: "bold",
    },
    {
      path: "../assets/fonts/ProductSans-Medium.woff",
      weight: "500",
      style: "medium",
    },
  ],
});

// components
import Header from "@/components/layout/header";
import { StoreProvider } from "@/providers/store-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import Player from "@/components/beats/player";

export const metadata: Metadata = {
  title: "Cheapbeats",
  description: "Buy cheap beats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${productSans.className} antialiased`}>
        <Header />
        <QueryProvider>
          <StoreProvider>
            {children}
            <Player />
          </StoreProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
