"use server";

import type { Recipe } from "@/types/recipe";

// Define the shape of the API response meta
export type PaginationMeta = {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

// The Server Action
export const fetchRecipes = async (
    page: number,
    pageSize: number = 10,
    query: string = "" // Add the new optional query parameter
  ) => {
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
      // We use '$containsi' for a case-insensitive "contains" search on the title
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
    }
  };