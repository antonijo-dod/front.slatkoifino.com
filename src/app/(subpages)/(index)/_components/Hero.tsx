import Image from "next/image";
import SearchDropdown from "../SearchDropdown";

export function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[68vh] min-h-[420px] md:h-[88vh] md:min-h-[620px] w-full overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Svježe pečeni kolač spreman za posluživanje"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative mx-4 -mt-14 md:absolute md:inset-x-auto md:top-1/2 md:left-[8%] lg:left-[11%] md:mx-0 md:mt-0 md:-translate-y-1/2 md:max-w-md lg:max-w-lg">
        <div className="bg-[var(--home-paper)] border border-[var(--home-line)] px-8 py-10 md:px-12 md:py-14 shadow-[0_28px_70px_-30px_rgba(42,33,25,0.5)]">
          <span className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-[var(--home-terracotta)]">
            Recepti za kolače i torte
          </span>
          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] italic text-5xl md:text-6xl leading-[1.05] text-[var(--home-ink)]">
            Slatko i Fino
          </h1>
          <p className="mt-5 font-sans text-base leading-relaxed text-[var(--home-ink-soft)]">
            Otkrij ukusne recepte kolača i torti napravljene s ljubavlju.
          </p>
          <div className="mt-7">
            <SearchDropdown />
          </div>
        </div>
      </div>
    </section>
  );
}
