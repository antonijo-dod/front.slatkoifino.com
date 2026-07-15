"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DonateButton } from "@/components/donate-button";
import { useState } from "react";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold relative text-xl"
          >
            <Image
              src="/images/slatkoIfino-logo.png"
              alt="Sweet Creations Logo"
              width={100}
              height={30}
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-pink-600 transition-colors"
            >
              Početna
            </Link>
            <Link
              href="/recepti"
              className="text-sm font-medium hover:text-pink-600 transition-colors"
            >
              Svi recepti
            </Link>
            <DonateButton
              url={process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK || ""}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden flex flex-col gap-4 py-4 border-t"
          >
            <Link
              href="/"
              className="text-sm font-medium hover:text-pink-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Početna
            </Link>
            <Link
              href="/recepti"
              className="text-sm font-medium hover:text-pink-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Svi recepti
            </Link>
            <DonateButton
              url={process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK || ""}
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export { Nav };
