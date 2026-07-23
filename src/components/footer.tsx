import Link from "next/link";
import Image from "next/image";
import { Facebook } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-cream border-t border-line">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl mb-4"
            >
              <Image
                src="/images/slatkoIfino-logo.png"
                alt="Slatko i Fino logo"
                width={180}
                height={40}
              />
            </Link>
            <p className="text-ink-soft font-sans mb-4 max-w-sm">
              Donosi slast u vašu kuhinju s pažljivo osmišljenim receptima
              kolača napravljenih s ljubavlju.
            </p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-fraunces)] text-lg text-ink mb-4">
              Brzi linkovi
            </h3>
            <ul className="space-y-2 text-sm font-sans">
              <li>
                <Link href="/" className="text-ink-soft hover:text-terracotta">
                  Početna
                </Link>
              </li>
              <li>
                <Link
                  href="/recepti"
                  className="text-ink-soft hover:text-terracotta"
                >
                  Svi recepti
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-fraunces)] text-lg text-ink mb-4">
              Društvene mreže
            </h3>
            <a
              href="https://www.facebook.com/groups/743893966260475"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center text-cream hover:bg-terracotta-dark transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="border-t border-line mt-10 pt-8 text-center text-sm font-sans text-ink-soft">
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
