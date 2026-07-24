import type React from "react";
import { Fraunces } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={fraunces.variable}>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
