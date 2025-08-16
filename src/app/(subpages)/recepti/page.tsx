import { Metadata } from "next";
import { fetchRecipes } from "./actions";
import { RecipeBrowser } from "./recipe-browser";
import  SEOPagination  from "./seo-pagination";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Slatko i fino - Recepti",
  description: "Svi recepti za kolače i torte",
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams?.page || "1"));
  const pageSize = 9;

  // Always fetch the requested page for SEO
  const { recipes, meta } = await fetchRecipes(page, pageSize);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Svi recepti</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Pretraži sve recepte i pronađi inspiraciju za svoj sljedeći slatkiš.
          </p>
        </div>

        {/* Infinite scroll for users, pagination for bots */}
        <RecipeBrowser 
          initialRecipes={recipes} 
          initialMeta={meta}
          currentPage={page}
        />

        {/* Hidden pagination links for SEO crawlers */}
        <SEOPagination 
          currentPage={page} 
          pageCount={meta?.pagination.pageCount || 1} 
        />
      </div>
    </div>
  );
}