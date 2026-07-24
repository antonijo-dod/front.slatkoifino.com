import { Metadata } from "next";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SectionHeading } from "@/components/SectionHeading";
import SearchDropdown from "@/components/recipes/SearchDropdown";
import Pagination from "./pagination";
import type { Recipe } from "@/types/recipe";

type RecipesResponse = {
  data: Recipe[];
  meta: {
    pagination: {
      page: number;
      pageCount: number;
    };
  };
};

export const metadata: Metadata = {
  title: "Slatko i fino - Recepti",
  description: "Svi recepti za kolače i torte",
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string, 10) : 1;

  const res = await fetch(
    `${process.env.API_URL}/api/recipes?pLevel=3&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=12`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    },
  );
  const recipeResponse: RecipesResponse = await res.json();

  const currentPage = recipeResponse?.meta?.pagination?.page;
  const pageCount = recipeResponse?.meta?.pagination?.pageCount;

  if (!recipeResponse || !recipeResponse.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="font-sans text-ink-soft">Nema recepata za prikaz.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Iz moje kuhinje"
          title="Svi recepti"
          description="Pretraži recepte i pronađi nešto slatko za svaku priliku."
          align="center"
        />

        <div className="mx-auto mt-8 max-w-2xl">
          <SearchDropdown size="lg" />
        </div>

        <div className="mt-16">
          {recipeResponse.data.length === 0 ? (
            <div className="border-t border-line py-16 text-center">
              <h3 className="font-[family-name:var(--font-fraunces)] text-2xl text-ink">
                Nema pronađenih recepata
              </h3>
              <p className="mt-2 font-sans text-sm text-ink-soft">
                Pokušajte ponovno kasnije.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {recipeResponse.data.map((recipe, i) => (
                <RecipeCard key={recipe.id} recipe={recipe} priority={i < 3} />
              ))}
            </div>
          )}

          <Pagination currentPage={currentPage} pageCount={pageCount} />
        </div>
      </div>
    </div>
  );
}
