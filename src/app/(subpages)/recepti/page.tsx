import { Metadata } from "next";
import { RecipeCard } from "./recipe-card";
import Pagination from "./pagination";

export const metadata: Metadata = {
  title: "Slatko i fino - Recepti",
  description: "Svi recepti za kolače i torte",
};

export default async function RecipesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {

  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string, 10) : 1;

  const res = await fetch(`${process.env.API_URL}/api/recipes?pLevel=3&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=12`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  const recipeResponse = await res.json();

  const currentPage = recipeResponse.meta.pagination.page;
  const pageCount = recipeResponse.meta.pagination.pageCount;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Svi recepti</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Pretraži sve recepte i pronadi inspiraciju za svoj sljedeći slatkiš.
          </p>
        </div>

        {/* Recipes */}
        <div className="mt-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* @ts-expect-error Replace any with appropriate type */}
            {recipeResponse.data.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <Pagination currentPage={currentPage} pageCount={pageCount} />
        </div>
      </div>
    </div>
  );
}
