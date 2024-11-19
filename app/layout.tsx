import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
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
