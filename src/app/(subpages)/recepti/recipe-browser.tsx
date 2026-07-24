"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { fetchRecipes, type PaginationMeta } from "./actions";
import type { Recipe } from "@/types/recipe";
import { useDebounce } from "@/hooks/use-debounce";

import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { RecipeCard } from "@/components/recipes/RecipeCard";

export function RecipeBrowser() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  
  // State for the search input
  const [searchQuery, setSearchQuery] = useState("");
  // Debounced value that will trigger the API call
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [isLoading, setIsLoading] = useState(true); // For initial load and new searches
  const [isLoadingMore, setIsLoadingMore] = useState(false); // For infinite scroll

  const { ref, inView } = useInView();

  const hasMorePages = meta ? meta.pagination.page < meta.pagination.pageCount : false;

  // Function to load the first page (for initial load and new searches)
  const searchForRecipes = async (query: string) => {
    setIsLoading(true);
    const { recipes: newRecipes, meta: newMeta } = await fetchRecipes(1, 9, query);
    setRecipes(newRecipes);
    setMeta(newMeta);
    setIsLoading(false);
  };

  // Function to load subsequent pages for infinite scroll
  const loadMoreRecipes = useCallback(async () => {
    if (isLoadingMore || !meta) return;
    setIsLoadingMore(true);

    const nextPage = meta.pagination.page + 1;
    const { recipes: newRecipes, meta: newMeta } = await fetchRecipes(
      nextPage,
      9,
      debouncedSearchQuery // Pass the current query
    );

    if (newRecipes.length > 0 && newMeta) {
      setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);
      setMeta(newMeta);
    }
    setIsLoadingMore(false);
  }, [isLoadingMore, meta, debouncedSearchQuery]);

  // Effect for handling debounced search
  useEffect(() => {
    // The `isLoading` check prevents this from running on initial mount
    // if you fetch initial data in another effect.
    searchForRecipes(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  // Effect for infinite scroll
  useEffect(() => {
    if (inView && hasMorePages && !isLoading) {
      loadMoreRecipes();
    }
  }, [inView, hasMorePages, isLoading, loadMoreRecipes]);

  return (
    <>
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Pretraži recepte po imenu..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mt-12">
        {isLoading ? (
          <div className="flex justify-center mt-16">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {/* Observer Element for infinite scroll */}
            {hasMorePages && (
              <div ref={ref} className="flex justify-center items-center p-4 col-span-full mt-8">
                {isLoadingMore && <Loader2 className="w-8 h-8 animate-spin" />}
              </div>
            )}
             {!hasMorePages && (
                <p className="text-center text-muted-foreground mt-8 col-span-full">
                    Stigli ste do kraja.
                </p>
             )}
          </>
        ) : (
          <div className="text-center mt-16">
            <h3 className="text-xl font-semibold">Nema rezultata</h3>
            <p className="text-muted-foreground">
              Pokušajte s drugim pojmom za pretragu.
            </p>
          </div>
        )}
      </div>
    </>
  );
}