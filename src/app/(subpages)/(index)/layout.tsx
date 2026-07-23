import type React from "react";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={fraunces.variable}>{children}</div>;
}
