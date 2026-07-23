import Link from "next/link";
import type { Recipe } from "@/types/recipe";
import { ROUTES } from "@/routes";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";
import { RecipeCard } from "./RecipeCard";

export function RecipesSection({ recipes }: { recipes: Recipe[] }) {
  return (
    <section className="bg-[var(--home-cream)] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Svježe iz kuhinje"
          title="Posljednji recepti"
          description="Naši najbolji recepti kolača, savršeni za svaku priliku."
        />

        {recipes.length === 0 ? (
          <div className="mt-14 border-t border-[var(--home-line)] py-16 text-center">
            <h3 className="font-[family-name:var(--font-fraunces)] text-2xl text-[var(--home-ink)]">
              Trenutno nema dodanih recepata
            </h3>
            <p className="mt-2 font-sans text-sm text-[var(--home-ink-soft)]">
              Provjerite ponovno za nekoliko trenutaka.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe, index) => (
                <RecipeCard
                  recipe={recipe}
                  featured={index === 0}
                  priority={index === 0}
                  key={recipe.id}
                />
              ))}
            </div>

            <div className="mt-14 flex justify-center">
              <Button
                asChild
                variant="outline"
                className="rounded-none border-[var(--home-ink)] bg-transparent px-8 font-sans text-[var(--home-ink)] hover:bg-[var(--home-ink)] hover:text-[var(--home-cream)]"
              >
                <Link href={ROUTES.recipes}>Svi recepti</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
