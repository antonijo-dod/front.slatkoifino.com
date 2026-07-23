import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";
import SearchDropdown from "../SearchDropdown";
import { HeroTrustRow } from "./HeroTrustRow";

export function Hero() {
  return (
    <section className="relative bg-cream">
      <div className="relative h-[52vh] min-h-[340px] w-full overflow-hidden md:h-[90vh] md:min-h-[640px]">
        <Image
          src="/images/hero-kitchen.webp"
          alt="Domaći kolač u pleh posudi na kuhinjskom stolu, okružen brašnom, jajima i rukom pisanom bilježnicom recepata"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="px-6 py-10 md:absolute md:inset-0 md:flex md:items-start md:px-0 md:py-0">
        <div className="md:mt-[10%] md:max-w-md md:pl-[6%] lg:max-w-lg lg:pl-[8%]">
          <h1 className="font-[family-name:var(--font-fraunces)] text-5xl leading-[1.05] text-ink md:text-6xl lg:text-7xl">
            Slatko i Fino
          </h1>

          <div className="mt-5 flex items-center gap-2" aria-hidden>
            <span className="h-px w-12 bg-terracotta" />
            <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
          </div>

          <p className="mt-5 font-[family-name:var(--font-fraunces)] text-xl leading-snug text-ink md:text-2xl">
            Dom je ondje gdje se nešto slatko uvijek peče.
          </p>

          <p className="mt-4 font-sans text-base leading-relaxed text-ink-soft">
            Dobro došli u moju kuhinju! Ovdje dijelim provjerene recepte za
            kolače, torte i slastice koje već godinama pripremam za svoju
            obitelj i prijatelje.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button
              asChild
              className="rounded-full bg-terracotta px-8 font-sans text-cream hover:bg-terracotta-dark"
            >
              <Link href={ROUTES.recipes}>Pogledaj recepte</Link>
            </Button>

            <div className="w-full max-w-[220px] sm:w-auto">
              <span className="mb-1 block font-sans text-sm text-ink underline decoration-terracotta decoration-2 underline-offset-4">
                Pretraži kolače
              </span>
              <SearchDropdown />
            </div>
          </div>

          <div className="mt-8">
            <HeroTrustRow />
          </div>
        </div>
      </div>
    </section>
  );
}
