import Link from "next/link";
import Image from "next/image";
import { Facebook } from "lucide-react";

function Footer() {
  return (
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
              Donosi slast u vašu kuhinju s pažljivo osmišljenim receptima
              kolača napravljenih s ljubavlju.
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
                  Početna
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
            </ul>
          </div>

          <div>
            {/* Set facebook links */}
            <div>
              <h3 className="font-semibold mb-4">Društvene mreže</h3>
              <div className="mt-4">
                <a
                  href="https://www.facebook.com/groups/743893966260475"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; 2025 - {new Date().getFullYear()} Slatko i fino. Napravljeno
            sa ❤️ za ljubitelje kuhanja
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
