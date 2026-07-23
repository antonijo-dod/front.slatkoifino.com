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
  return (
    <div
      className={`${fraunces.variable} home-theme`}
      style={
        {
          "--home-cream": "#FAF3E9",
          "--home-paper": "#F3E8D8",
          "--home-ink": "#2A2119",
          "--home-ink-soft": "#5C5044",
          "--home-terracotta": "#B4522F",
          "--home-terracotta-dark": "#9A4326",
          "--home-line": "#DCCBAE",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
