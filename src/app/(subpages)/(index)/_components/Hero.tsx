import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";
import { HeroSearchTrigger } from "./HeroSearchTrigger";
import { HeroTrustRow } from "./HeroTrustRow";

export function Hero() {
  return (
    <section className="relative bg-cream">
      <div className="relative h-[56vh] min-h-[380px] w-full overflow-hidden md:h-[96vh] md:min-h-[720px] lg:min-h-[780px]">
        <Image
          src="/images/hero-kitchen.webp"
          alt="Domaći kolač u pleh posudi na kuhinjskom stolu, okružen brašnom, jajima i rukom pisanom bilježnicom recepata"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="px-6 py-10 md:absolute md:inset-0 md:flex md:items-center md:px-0 md:py-0">
        <div className="mx-auto w-full max-w-7xl md:px-6">
          <div className="md:max-w-lg lg:max-w-xl xl:max-w-2xl">
            <h1 className="font-[family-name:var(--font-fraunces)] text-6xl leading-[1.03] text-ink md:text-7xl lg:text-8xl">
              Slatko i Fino
            </h1>

            <div className="mt-6 flex items-center gap-2" aria-hidden>
              <span className="h-px w-14 bg-terracotta" />
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
            </div>

            <p className="mt-6 font-[family-name:var(--font-fraunces)] text-2xl leading-snug text-ink md:text-3xl">
              Dom je ondje gdje se nešto slatko uvijek peče.
            </p>

            <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-ink-soft">
              Dobro došli u moju kuhinju! Ovdje dijelim provjerene recepte za
              kolače, torte i slastice koje već godinama pripremam za svoju
              obitelj i prijatelje.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button
                asChild
                className="rounded-full bg-terracotta px-8 font-sans text-cream hover:bg-terracotta-dark"
              >
                <Link href={ROUTES.recipes}>Pogledaj recepte</Link>
              </Button>

              <HeroSearchTrigger />
            </div>

            <div className="md:mt-9">
              <HeroTrustRow />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
