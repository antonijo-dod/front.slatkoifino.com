import type React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

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
                  src="/images/slatkoIfino-logo.png"
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
