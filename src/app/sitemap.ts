import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ROUTES } from "@/routes";

// Regenerate at most hourly so newly published recipes show up without a
// redeploy.
export const revalidate = 3600;

type SitemapRecipe = { slug: string; updatedAt?: string | null };

// Same Strapi collection the /recept/[slug] pages read from, fetching only
// the fields the sitemap needs.
async function fetchAllRecipes(): Promise<SitemapRecipe[]> {
  const recipes: SitemapRecipe[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    const res = await fetch(
      `${process.env.API_URL}/api/recipes?fields[0]=slug&fields[1]=updatedAt&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=100`,
      {
        headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
        next: { revalidate },
      },
    );
    // Throw rather than return a partial list: on revalidation Next keeps
    // serving the last good sitemap instead of caching a truncated one.
    if (!res.ok) throw new Error(`Sitemap: recipes fetch failed (${res.status})`);
    const { data, meta } = await res.json();
    if (Array.isArray(data)) recipes.push(...data);
    pageCount = meta?.pagination?.pageCount ?? 1;
    page++;
  } while (page <= pageCount);

  return recipes.filter((r) => !!r.slug);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await fetchAllRecipes();

  const toDate = (value?: string | null) => (value ? new Date(value) : undefined);
  // Home and listing change whenever any recipe does.
  const latest = recipes
    .map((r) => toDate(r.updatedAt))
    .filter((d): d is Date => !!d)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return [
    { url: `${SITE_URL}${ROUTES.home}`, lastModified: latest },
    { url: `${SITE_URL}${ROUTES.recipes}`, lastModified: latest },
    ...recipes.map((recipe) => ({
      url: `${SITE_URL}${ROUTES.recipe(recipe.slug)}`,
      lastModified: toDate(recipe.updatedAt),
    })),
  ];
}
