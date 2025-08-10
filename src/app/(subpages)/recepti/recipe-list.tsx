"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { fetchRecipes, Recipe, PaginationMeta } from "./actions";
import { RecipeCard } from "./recipe-card";
import { Loader2 } from "lucide-react";

type RecipeListProps = {
  initialRecipes: Recipe[];
  initialMeta: PaginationMeta;
};

export function RecipeList({ initialRecipes, initialMeta }: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView();

  const hasMorePages = meta.pagination.page < meta.pagination.pageCount;

  const loadMoreRecipes = useCallback(async () => {
    if (isLoading) return; // Prevent multiple simultaneous loads
    setIsLoading(true);

    const nextPage = meta.pagination.page + 1;
    const { recipes: newRecipes, meta: newMeta } = await fetchRecipes(
      nextPage,
      meta.pagination.pageSize
    );

    if (newRecipes.length > 0 && newMeta) {
      setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);
      setMeta(newMeta);
    }
    setIsLoading(false);
  }, [isLoading, meta.pagination.page, meta.pagination.pageSize]);

  useEffect(() => {
    // Trigger fetch when the observer element is in view and there are more pages
    if (inView && hasMorePages) {
      loadMoreRecipes();
    }
  }, [inView, hasMorePages, loadMoreRecipes]);

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Observer Element */}
      {hasMorePages && (
        <div
          ref={ref}
          className="flex justify-center items-center p-4 col-span-full"
        >
          {isLoading && <Loader2 className="w-8 h-8 animate-spin" />}
        </div>
      )}

      {!hasMorePages && recipes.length > 0 && (
         <p className="text-center text-muted-foreground mt-8 col-span-full">
            Stigli ste do kraja. Nema više recepata.
         </p>
      )}
    </>
  );
}