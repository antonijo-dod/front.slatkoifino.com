import { MetadataRoute } from 'next';
import { fetchRecipes } from './(subpages)/recepti/actions';

// Cache period for the sitemap (daily)
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get the base URL from environment or use a default
  const baseUrl = process.env.SITE_URL || 'https://slatkoifino.com';

  // Start with static pages
  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/recepti`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    // Add other static pages here
  ];

  // Get all recipes for dynamic paths
  const { recipes, meta } = await fetchRecipes(1, 100); // Adjust the page size as needed
  
  // Create recipe page URLs
  const recipePages = recipes.map(recipe => ({
    url: `${baseUrl}/recept/${recipe.slug}`,
    lastModified: new Date(), // Consider storing and using actual update dates if available
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // If there are more pages of recipes, handle pagination
  const totalPages = meta?.pagination.pageCount || 1;
  const paginationPages = [];

  if (totalPages > 1) {
    // Add pages for pagination
    for (let i = 2; i <= totalPages; i++) {
      paginationPages.push({
        url: `${baseUrl}/recepti?page=${i}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      });
    }
  }

  return [...staticPages, ...recipePages, ...paginationPages];
}
