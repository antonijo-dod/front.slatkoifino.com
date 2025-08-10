import { Metadata } from "next";
import { RecipeBrowser } from "./recipe-browser"

export const metadata: Metadata = {
  title: "Slatko i fino - Recepti",
  description: "Svi recepti za kolače i torte",
};

export default async function RecipesPage() {

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
       <RecipeBrowser />
      </div>
    </div>
  );
}