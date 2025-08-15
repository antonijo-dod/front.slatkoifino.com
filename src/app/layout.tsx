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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > <Script
          strategy="afterInteractive"
          defer
          data-domain="slatkoifino.com"
          src="https://analytics.slatkoifino.com/js/script.js"
        />
        {children}
      </body>
    </html>
  );
}
