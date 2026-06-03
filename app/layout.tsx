import type { Metadata } from "next";
import { Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoiceMed AI",
  description: "Clinical AI consultation and medical reporting built for modern care workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className={`${sourceSans.variable} ${ibmMono.variable} h-full antialiased`}>
        <body className="min-h-full font-sans bg-slate-50 text-slate-950">
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
