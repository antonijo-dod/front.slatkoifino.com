// components/recipes/recipe-card.tsx

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { Recipe } from "./actions";

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const cardImageUrl = recipe.card_image?.url?.replace(
    "/upload/",
    "/upload/h_256/"
  );

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative h-64">
        <Image
          src={cardImageUrl || "/images/placeholder.jpeg"}
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
      <CardContent className="p-6 flex flex-col flex-grow">
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
        </div>

        <Button asChild className="w-full mt-auto">
          <Link href={`/recept/${recipe.slug}`}>Pogledaj recept</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
