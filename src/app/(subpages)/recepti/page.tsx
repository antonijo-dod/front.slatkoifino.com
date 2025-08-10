import { Metadata } from "next";
import { fetchRecipes } from "./actions";
import { RecipeList } from "./recipe-list";

export const metadata: Metadata = {
  title: "Slatko i fino - Recepti",
  description: "Svi recepti za kolače i torte",
};

export default async function RecipesPage() {
  // Fetch the initial page of data on the server
  const { recipes: initialRecipes, meta: initialMeta } = await fetchRecipes(1); // Fetch page 1

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Svi recepti</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Pretraži sve recepte i pronadi inspiraciju za svoj sljedeći slatkiš.
          </p>
          {/* <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search recipes..." className="pl-10" />
        </div> */}
        </div>

        {initialRecipes.length === 0 && (
          <div className="text-center">
            <h3>Trenutno nema objavljenih recepata</h3>
            <p>Provjerite ponovno za nekoliko trenutaka</p>
          </div>
        )}

        {/* Recipe Grid - now handled by the client component */}
        {initialRecipes.length > 0 && initialMeta && (
          <RecipeList
            initialRecipes={initialRecipes}
            initialMeta={initialMeta}
          />
        )}
      </div>
    </div>
  );
}