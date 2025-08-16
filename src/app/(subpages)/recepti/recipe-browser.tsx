"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { fetchRecipes, Recipe, PaginationMeta } from "./actions";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { RecipeCard } from "./recipe-card";

type Props = {
  initialRecipes: Recipe[];
  initialMeta: PaginationMeta | null;
  currentPage: number;
};

export function RecipeBrowser({ initialRecipes, initialMeta, currentPage }: Props) {
  
  // For infinite scroll mode (search + initial load)
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [meta, setMeta] = useState<PaginationMeta | null>(initialMeta);
  const [loadedPages, setLoadedPages] = useState(new Set([currentPage]));
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);

  const { ref, inView } = useInView();

  const hasMorePages = meta ? meta.pagination.page < meta.pagination.pageCount : false;

  // Prefetch next page in background
  const prefetchNextPage = useCallback(async (pageNum: number) => {
    if (loadedPages.has(pageNum) || isPrefetching || isSearchMode) return;
    
    setIsPrefetching(true);
    try {
      const { recipes: nextRecipes } = await fetchRecipes(pageNum, 9);
      if (nextRecipes.length > 0) {
        setLoadedPages(prev => new Set([...prev, pageNum]));
        // Store in memory for instant loading
        sessionStorage.setItem(`recipes_page_${pageNum}`, JSON.stringify(nextRecipes));
      }
    } catch (error) {
      console.error('Prefetch failed:', error);
    }
    setIsPrefetching(false);
  }, [loadedPages, isPrefetching, isSearchMode]);

  // Load more recipes (from cache or fetch)
  const loadMoreRecipes = useCallback(async () => {
    if (isLoadingMore || !meta || isSearchMode) return;
    
    setIsLoadingMore(true);
    const nextPage = meta.pagination.page + 1;
    
    try {
      // Try to load from cache first
      const cached = sessionStorage.getItem(`recipes_page_${nextPage}`);
      let newRecipes: Recipe[];
      
      if (cached && loadedPages.has(nextPage)) {
        newRecipes = JSON.parse(cached);
      } else {
        const result = await fetchRecipes(nextPage, 9);
        newRecipes = result.recipes;
        setMeta(result.meta);
      }
      
      if (newRecipes.length > 0) {
        setRecipes(prev => [...prev, ...newRecipes]);
        setLoadedPages(prev => new Set([...prev, nextPage]));
        
        // Prefetch next page
        if (nextPage < (meta?.pagination.pageCount || 0)) {
          setTimeout(() => prefetchNextPage(nextPage + 1), 100);
        }
      }
    } catch (error) {
      console.error('Load more failed:', error);
    }
    
    setIsLoadingMore(false);
  }, [isLoadingMore, meta, isSearchMode, loadedPages, prefetchNextPage]);

  // Search function
  const searchForRecipes = async (query: string) => {
    setIsLoading(true);
    setIsSearchMode(!!query.trim());
    
    try {
      const { recipes: newRecipes, meta: newMeta } = await fetchRecipes(1, 9, query);
      setRecipes(newRecipes);
      setMeta(newMeta);
      setLoadedPages(new Set([1]));
    } catch (error) {
      console.error('Search failed:', error);
    }
    
    setIsLoading(false);
  };

  // Handle search
  useEffect(() => {
    if (debouncedSearchQuery.trim() === "") {
      // Reset to initial state
      setRecipes(initialRecipes);
      setMeta(initialMeta);
      setIsSearchMode(false);
      setLoadedPages(new Set([currentPage]));
      return;
    }
    searchForRecipes(debouncedSearchQuery);
  }, [debouncedSearchQuery, initialRecipes, initialMeta, currentPage]);

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasMorePages && !isLoading && !isLoadingMore) {
      loadMoreRecipes();
    }
  }, [inView, hasMorePages, isLoading, isLoadingMore, loadMoreRecipes]);

  // Initial prefetch of page 2
  useEffect(() => {
    if (
      !isSearchMode &&
      currentPage === 1 &&
      (initialMeta?.pagination.pageCount ?? 0) > 1
    ) {
      setTimeout(() => prefetchNextPage(2), 1000);
    }
  }, [currentPage, initialMeta, isSearchMode, prefetchNextPage]);

  // Handle browser back/forward for pagination URLs
  useEffect(() => {
    const handlePopState = () => {
      window.location.reload(); // Simple approach for pagination URLs
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <>
      {/* Search */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Pretraži recepte po imenu..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Results */}
      <div className="mt-12">
        {isLoading ? (
          <div className="flex justify-center mt-16">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        ) : recipes.length > 0 ? (
          <>
            {/* Recipe Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe, index) => (
                <RecipeCard 
                  key={`${recipe.id}-${index}`} 
                  recipe={recipe} 
                />
              ))}
            </div>

            {/* Load More Trigger */}
            {hasMorePages && (
              <div ref={ref} className="flex justify-center items-center p-4 mt-8">
                {isLoadingMore && <Loader2 className="w-8 h-8 animate-spin" />}
                {isPrefetching && !isLoadingMore && (
                  <span className="text-xs text-muted-foreground">Preparing next recipes...</span>
                )}
              </div>
            )}

            {/* End Message */}
            {!hasMorePages && (
              <p className="text-center text-muted-foreground mt-8">
                {isSearchMode ? "Nema više rezultata." : "Stigli ste do kraja."}
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