"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { fetchRecipes, Recipe, PaginationMeta } from "./actions";
import { RecipeCard } from "./recipe-card";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

type RecipeListProps = {
  initialRecipes: Recipe[];
  initialMeta: PaginationMeta | null;
  currentPage: number;
};

export function RecipeList({ initialRecipes, initialMeta, currentPage }: RecipeListProps) {
  // For infinite scroll mode (search + initial load)
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [meta, setMeta] = useState<PaginationMeta | null>(initialMeta);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);
  
  // In-memory cache for prefetched pages
  const [pageCache, setPageCache] = useState<Map<number, Recipe[]>>(
    new Map([[currentPage, initialRecipes]])
  );

  const { ref, inView } = useInView();

  const hasMorePages = meta ? meta.pagination.page < meta.pagination.pageCount : false;

  // Prefetch next page in background
  const prefetchNextPage = useCallback(async (pageNum: number) => {
    if (pageCache.has(pageNum) || isPrefetching || isSearchMode) return;
    
    setIsPrefetching(true);
    try {
      const { recipes: nextRecipes } = await fetchRecipes(pageNum, 9);
      if (nextRecipes.length > 0) {
        setPageCache(prev => new Map(prev).set(pageNum, nextRecipes));
      }
    } catch (error) {
      console.error('Prefetch failed:', error);
    }
    setIsPrefetching(false);
  }, [pageCache, isPrefetching, isSearchMode]);

  // Track loaded pages to prevent duplicate loading
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([currentPage]));

  // Use a ref to track active requests and prevent duplicate calls
  const activeRequestRef = useRef<boolean>(false);
  const lastScrollPositionRef = useRef<number>(0);

  // Load more recipes (from cache or fetch)
  const loadMoreRecipes = useCallback(async () => {
    // Multiple protection layers against repeated calls
    if (isLoadingMore || !meta || isSearchMode || activeRequestRef.current) return;
    
    // Get next page from current meta state
    const nextPage = meta.pagination.page + 1;
    
    // Prevent loading the same page twice
    if (loadedPages.has(nextPage)) {
      return;
    }
    
    // Record current scroll position to detect rapid scrolling
    lastScrollPositionRef.current = window.scrollY;
    
    // Set active request flag to prevent data races
    activeRequestRef.current = true;
    console.log(`Loading page ${nextPage}, current loaded pages: ${[...loadedPages].join(', ')}`);
    setIsLoadingMore(true);
    
    try {
      let newRecipes: Recipe[];
      let newMeta = meta;
      
      // Check cache first
      if (pageCache.has(nextPage)) {
        newRecipes = pageCache.get(nextPage)!;
      } else {
        const result = await fetchRecipes(nextPage, 9);
        newRecipes = result.recipes;
        if (result.meta) newMeta = result.meta;
        
        // Store in cache
        setPageCache(prev => new Map(prev).set(nextPage, newRecipes));
      }
      
      if (newRecipes.length > 0) {
        // Add recipes and update meta with current page in meta
        setRecipes(prev => [...prev, ...newRecipes]);
        
        // Explicitly update the page in meta to match what we just loaded
        if (newMeta && newMeta.pagination) {
          // Ensure meta.pagination.page is set to the page we just loaded
          const updatedMeta = {
            ...newMeta,
            pagination: {
              ...newMeta.pagination,
              page: nextPage
            }
          };
          setMeta(updatedMeta);
        }
        
        // Mark this page as loaded
        setLoadedPages(prev => new Set([...prev, nextPage]));
        console.log(`Added page ${nextPage} to loaded pages, now: ${[...Array.from(loadedPages), nextPage].join(', ')}`);
        
        // Prefetch next page if available
        if (nextPage < (newMeta?.pagination.pageCount || 0)) {
          setTimeout(() => prefetchNextPage(nextPage + 1), 100);
        }
      }
    } catch (error) {
      console.error('Load more failed:', error);
    } finally {
      // Always reset flags when done, regardless of success/failure
      setIsLoadingMore(false);
      activeRequestRef.current = false;
    }
  }, [isLoadingMore, meta, isSearchMode, pageCache, loadedPages, prefetchNextPage]);

  // Search function
  const searchForRecipes = async (query: string) => {
    setIsLoading(true);
    setIsSearchMode(!!query.trim());
    
    try {
      const { recipes: newRecipes, meta: newMeta } = await fetchRecipes(1, 9, query);
      setRecipes(newRecipes);
      setMeta(newMeta);
      // Reset loaded pages for new search
      setLoadedPages(new Set([1]));
      // Clear cache for clean search results
      setPageCache(new Map());
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
      setLoadedPages(new Set([currentPage])); // Reset loaded pages tracking
      return;
    }
    searchForRecipes(debouncedSearchQuery);
  }, [debouncedSearchQuery, initialRecipes, initialMeta, currentPage]);

  // Track when the inView status changes
  const prevInViewRef = useRef(false);
  
  // Improved infinite scroll trigger with more aggressive protection
  useEffect(() => {
    // Only run when inView transitions from false to true (entered viewport)
    const isNewlyInView = inView && !prevInViewRef.current;
    prevInViewRef.current = inView;
    
    // Only trigger when element newly enters view and we have more pages to load
    if (isNewlyInView && hasMorePages && !isLoading && !isLoadingMore && !activeRequestRef.current) {
      // Use debounce to prevent multiple rapid triggers
      const timer = setTimeout(() => {
        // Double-check we're still not loading anything
        if (!activeRequestRef.current) {
          console.log('Triggering load more from scroll effect');
          loadMoreRecipes();
        }
      }, 500); // Longer debounce time
      
      return () => clearTimeout(timer);
    }
  }, [inView, hasMorePages, isLoading, isLoadingMore, loadMoreRecipes]);

  // Initial prefetch of page 2
  useEffect(() => {
    if (!isSearchMode && currentPage === 1 && (initialMeta?.pagination.pageCount ?? 0) > 1) {
      setTimeout(() => prefetchNextPage(2), 1000);
    }
  }, [currentPage, initialMeta, isSearchMode, prefetchNextPage]);
  
  // Reset when current page changes (e.g., direct navigation to /recepti?page=2)
  useEffect(() => {
    setLoadedPages(new Set([currentPage]));
  }, [currentPage]);

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
                  <span className="text-xs text-muted-foreground">Pripremam sljedeće recepte...</span>
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