import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sweet Creations - Delicious Cake Recipes",
  description:
    "Discover amazing cake recipes made with love. From classic chocolate to creative flavors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold relative text-xl"
            >
              <Image
                src="/images/slatkoifinologo.png"
                alt="Sweet Creations Logo"
                width={180}
                height={40}
              />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium hover:text-pink-600 transition-colors"
              >
                Pocetna
              </Link>
              <Link
                href="/recepti"
                className="text-sm font-medium hover:text-pink-600 transition-colors"
              >
                Svi recepti
              </Link>
              {/* <Link
                href="/about"
                className="text-sm font-medium hover:text-pink-600 transition-colors"
              >
                About
              </Link> */}
              {/* <Link
                href="/kontakt"
                className="text-sm font-medium hover:text-pink-600 transition-colors"
              >
                Kontakt
              </Link> */}
            </div>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="bg-muted/30 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-xl mb-4"
              >
                <Image
                  src="/images/slatkoifinologo.png"
                  alt="Sweet Creations Logo"
                  width={180}
                  height={40}
                />
              </Link>
              <p className="text-muted-foreground mb-4">
                Donosi slast u vasu kuhinju s pazljivo osmisljenim receptima
                kolaca napravljenim s ljubavlju.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Brzi linkovi</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pocetna
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recepti"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Svi recepti
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kontakt"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Kontakt
                  </Link>
                </li> */}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Kategorije</h3>
              {/* <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/recept?category=chocolate"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Chocolate
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recept?category=vanilla"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Vanilla
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recept?category=fruit"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Fruit
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recept?category=cupcakes"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cupcakes
                  </Link>
                </li>
              </ul> */}
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2025 Slatko i fino. Napravljeno sa ❤️ za ljubitelje kuhanja
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
