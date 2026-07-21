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
  query: string = "", // Add the new optional query parameter
  page: number = 1,
  pageSize: number = 10,
) => {
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/recipes?filters[title][$containsi]=${encodeURIComponent(query)}&pagination[page]=${encodeURIComponent(page)}&pagination[pageSize]=${encodeURIComponent(pageSize)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        // Using 'no-store' during search ensures we always get fresh results for the query
        cache: query ? "no-store" : "default",
        next: query ? { revalidate: 0 } : { revalidate: 60 },
      },
    );

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
