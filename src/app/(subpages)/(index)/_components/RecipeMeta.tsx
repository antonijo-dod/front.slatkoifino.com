import type { Recipe } from "@/types/recipe";

type RecipeMetaProps = {
  recipe: Pick<Recipe, "cook_time" | "portions" | "difficulty">;
  className?: string;
};

const DIFFICULTY_LABEL: Record<string, string> = {
  lagano: "Lagano",
  srednje: "Srednje",
  tesko: "Zahtjevno",
};

export function RecipeMeta({ recipe, className = "" }: RecipeMetaProps) {
  const items = [
    recipe.difficulty ? DIFFICULTY_LABEL[recipe.difficulty] : null,
    recipe.cook_time || null,
    recipe.portions ? `${recipe.portions} porcija` : null,
  ].filter(Boolean) as string[];

  if (items.length === 0) return null;

  return (
    <p
      className={`font-sans text-xs tracking-[0.08em] uppercase text-[var(--home-ink-soft)] ${className}`}
    >
      {items.join("  ·  ")}
    </p>
  );
}
