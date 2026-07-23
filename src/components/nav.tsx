"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DonateButton } from "@/components/donate-button";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Početna" },
  { href: "/recepti", label: "Svi recepti" },
];

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`text-sm font-medium transition-colors hover:text-terracotta ${
        active ? "text-terracotta" : "text-ink"
      }`}
    >
      {label}
      {active && (
        <span className="mt-1 block h-px w-full bg-terracotta" aria-hidden />
      )}
    </Link>
  );
}

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold relative text-xl"
          >
            <Image
              src="/images/slatkoIfino-logo.png"
              alt="Slatko i Fino logo"
              width={100}
              height={30}
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                active={pathname === link.href}
              />
            ))}
            <DonateButton
              url={process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK || ""}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-ink hover:bg-paper hover:text-terracotta"
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
            className="md:hidden flex flex-col gap-4 py-4 border-t border-line"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                active={pathname === link.href}
                onClick={() => setIsMenuOpen(false)}
              />
            ))}
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
