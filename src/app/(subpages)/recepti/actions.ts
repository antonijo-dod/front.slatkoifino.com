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

// The Server Action
export const fetchRecipes = async (page: number, pageSize: number = 9) => {
  try {
    const res = await fetch(
      // Use Strapi's pagination format in the URL
      `${process.env.API_URL}/api/recipes?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        next: { revalidate: 60 }, // Or adjust your caching strategy
      }
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