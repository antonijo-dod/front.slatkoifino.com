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
  const hasDescription = (recipe.description?.trim().length ?? 0) >= 20;
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
        className={`flex flex-1 flex-col justify-center gap-3 p-6 ${
          featured ? "lg:p-9" : ""
        }`}
      >
        <h3
          className={`font-[family-name:var(--font-fraunces)] text-ink transition-colors group-hover:text-terracotta-dark ${
            featured ? "text-2xl lg:text-3xl" : "text-xl"
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

        <span className="mt-1 inline-flex items-center gap-2 font-sans text-sm font-medium text-ink group-hover:text-terracotta-dark">
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
