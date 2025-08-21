import { MetadataRoute } from 'next';
import { fetchRecipes, Recipe } from './(subpages)/recepti/actions';

// Cache period for the sitemap (daily)
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || 'https://slatkoifino.com';

  // 1. Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/recepti`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Add other static pages here
  ];

  // 2. All recipe pages (fetched in batches)
  let allRecipes: Recipe[] = [];
  let paginationPages: MetadataRoute.Sitemap = [];
  const pageSize = 100; // Fetch 100 recipes per request

  // Fetch the first page to get total page count
  const firstPage = await fetchRecipes(1, pageSize);
  allRecipes.push(...firstPage.recipes);
  const totalPages = firstPage.meta?.pagination.pageCount || 1;

  // If there are more pages, fetch them concurrently
  if (totalPages > 1) {
    const pagePromises = [];
    for (let i = 2; i <= totalPages; i++) {
      // Create promises for all remaining pages
      pagePromises.push(fetchRecipes(i, pageSize));
      
      // Add pagination URLs to the sitemap
      paginationPages.push({
        url: `${baseUrl}/recepti?page=${i}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      });
    }
    // Wait for all fetches to complete
    const subsequentPages = await Promise.all(pagePromises);
    subsequentPages.forEach(page => allRecipes.push(...page.recipes));
  }

  const recipePages = allRecipes.map(recipe => ({
    url: `${baseUrl}/recept/${recipe.slug}`,
    lastModified: new Date(), // Consider using a real 'updatedAt' field from your recipe data
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...recipePages, ...paginationPages];
}
