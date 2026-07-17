import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

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
  title: "Slatko i fino",
  description: "Slatko i fino - najbolji recepti za kolače i torte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      {process.env.NODE_ENV === "production" && (
        <>
          <Script
            strategy="afterInteractive"
            data-domain="slatkoifino.com"
            src="https://metrics.slatkoifino.com/js/script.js"
          />
          <Script
            strategy="afterInteractive"
            type="module"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "0beb3cc56b984ddcb2a4b2e8ec46a1e5"}'
          />
        </>
      )}
    </html>
  );
}
