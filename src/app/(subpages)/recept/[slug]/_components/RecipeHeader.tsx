import { RecipeMeta } from "@/components/recipes/RecipeMeta";
import { ShareButton } from "@/components/recipes/ShareButton";
import type { Recipe } from "@/types/recipe";

type RecipeHeaderProps = {
  recipe: Pick<
    Recipe,
    "title" | "slug" | "cook_time" | "portions" | "difficulty"
  >;
};

export function RecipeHeader({ recipe }: RecipeHeaderProps) {
  return (
    <div className="mt-8">
      <span className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-terracotta">
        Iz moje kuhinje
      </span>
      <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-4xl leading-tight text-ink md:text-5xl">
        {recipe.title}
      </h1>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <RecipeMeta recipe={recipe} />
        <ShareButton title={recipe.title} slug={recipe.slug} />
      </div>
    </div>
  );
}
