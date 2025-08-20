"use server";

export type Recipe = {
  id: number;
  title: string;
  description: string;
  card_image: { url: string };
  cover_image: { url: string };
  prepTime: string;
  servings: number;
  rating: number;
  category: string;
  slug: string;
};

// Define the shape of the API response meta
export type PaginationMeta = {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

// Cache to avoid duplicate requests for the same data
const requestCache = new Map<string, Promise<{
  recipes: Recipe[];
  meta: PaginationMeta | null;
}>>();

// The Server Action
export const fetchRecipes = async (
    page: number,
    pageSize: number = 9,
    query: string = ""
  ) => {
    // Create a cache key based on the request parameters
    const cacheKey = `${page}_${pageSize}_${query}`;
    
    // If we already have a request in progress for these parameters, return that promise
    if (requestCache.has(cacheKey)) {
      return requestCache.get(cacheKey)!;
    }
    
    // Create a new promise for this request
    const requestPromise = (async () => {
      try {
        // Base URL
        const baseUrl = `${process.env.API_URL}/api/recipes`;
        
        // URL Parameters
        const params = new URLSearchParams({
          populate: '*',
          'pagination[page]': page.toString(),
          'pagination[pageSize]': pageSize.toString(),
        });
    
        // If a search query is provided, add the filter parameter
        if (query) {
          params.append('filters[title][$containsi]', query);
        }
        const res = await fetch(`${baseUrl}?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          },
          // Using 'no-store' during search ensures we always get fresh results for the query
          cache: query ? 'no-store' : 'default', 
          next: query ? { revalidate: 0 } : { revalidate: 60 },
        });
    
        if (!res.ok) {
          throw new Error("Failed to fetch recipes");
        }
    
        const { data, meta }: { data: Recipe[]; meta: PaginationMeta } =
          await res.json();
    
        return {
          recipes: data,
          meta: meta,
        };
      } catch (error) {
        console.error("Error fetching recipes:", error);
        return {
          recipes: [],
          meta: null,
        };
      } finally {
        // Remove from cache after a delay to prevent immediate duplicate requests
        // but allow future requests to be made
        setTimeout(() => {
          requestCache.delete(cacheKey);
        }, 5000);
      }
    })();
    
    // Store the promise in the cache
    requestCache.set(cacheKey, requestPromise);
    
    // Return the promise
    return requestPromise;
  };