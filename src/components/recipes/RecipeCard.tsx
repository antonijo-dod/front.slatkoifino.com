import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/types/recipe";
import { ROUTES } from "@/routes";
import { RecipeMeta } from "./RecipeMeta";

type RecipeCardProps = {
  recipe: Recipe;
  featured?: boolean;
  priority?: boolean;
};

export function RecipeCard({
  recipe,
  featured = false,
  priority = false,
}: RecipeCardProps) {
  // `description` is where recipes store their preparation text, not a
  // marketing excerpt — a short value plausibly is a genuine teaser, a long
  // one is instructions. Only show it in the short case, so the card never
  // displays a truncated fragment of someone's recipe steps.
  const descriptionLength = recipe.description?.trim().length ?? 0;
  const hasDescription = descriptionLength >= 20 && descriptionLength <= 220;
  const imageUrl = recipe.card_image?.url || "/images/placeholder.jpeg";

  return (
    <Link
      href={ROUTES.recipe(recipe.slug)}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper/60 transition-colors hover:border-terracotta ${
        featured ? "lg:col-span-2 lg:flex-row" : ""
      }`}
    >
      <div
        className={`relative w-full overflow-hidden ${
          featured ? "aspect-[16/9] lg:aspect-auto lg:w-1/2" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={imageUrl}
          alt={recipe.card_image?.alternativeText || recipe.title}
          fill
          priority={priority}
          sizes={
            featured
              ? "(max-width: 1024px) 100vw, 60vw"
              : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div
        className={`flex flex-1 flex-col gap-3 p-6 ${featured ? "lg:p-9" : ""}`}
      >
        <h3
          className={`font-[family-name:var(--font-fraunces)] text-ink transition-colors group-hover:text-terracotta-dark ${
            featured ? "text-2xl lg:text-3xl line-clamp-3" : "text-xl line-clamp-2"
          }`}
        >
          {recipe.title}
        </h3>

        {hasDescription && (
          <p
            className={`font-sans text-sm leading-relaxed text-ink-soft ${
              featured ? "line-clamp-3" : "line-clamp-2"
            }`}
          >
            {recipe.description}
          </p>
        )}

        <RecipeMeta recipe={recipe} />

        <span className="mt-auto inline-flex items-center gap-2 pt-1 font-sans text-sm font-medium text-ink group-hover:text-terracotta-dark">
          Pogledaj recept
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
