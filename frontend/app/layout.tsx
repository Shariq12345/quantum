import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import SyncUserConvex from "@/components/sync-user";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quantum - Intelligent Stock Trading",
  description: "Trade stocks with the power of artificial intelligence.",
  applicationName: "Quantum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ConvexClientProvider>
          <ClerkProvider>
            <SyncUserConvex />
            <Toaster />
            <Navbar />
            {children}
          </ClerkProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
