import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Slatko i fino - Recepti",
  description: "Svi recepti za kolače i torte",
};

export default async function RecipesPage() {
  const res = await fetch(`${process.env.API_URL}/api/recipes?populate=*`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
    next: { revalidate: 60 },
  });
  const { data } = await res.json();

  const allRecipes = data || [];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Svi recepti</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Pretrazi sve recepte i pronadji inspiraciju za svoj sljedeci
            slatkis.
          </p>

          {/* TODO: Search Bar */}
          {/* <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search recipes..." className="pl-10" />
          </div> */}
        </div>

        {allRecipes.length === 0 && (
          <div className="text-center">
            <h3>Trenutno nema objavljenih recepata</h3>
            <p>Provjerite ponovno za nekoliko trenutaka</p>
          </div>
        )}
        {/* Recipe Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* @ts-expected-ignore */}
          {allRecipes.map(
            (recipe: {
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
            }) => (
              <Card
                key={recipe.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={recipe.cover_image?.url || "/images/placeholder.jpeg"}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-xs font-medium px-2 py-1 rounded-full">
                      {recipe.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {recipe.prepTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {recipe.servings}
                    </div>
                    {/* TODO: See later what to do with this */}
                    {/* <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {recipe.rating}
                    </div> */}
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/recept/${recipe.slug}`}>Pogledaj recept</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
