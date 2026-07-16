// components/recipes/recipe-card.tsx

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, CakeSlice } from "lucide-react";
import type { Recipe } from "@/types/recipe";

type RecipeCardProps = {
  recipe: Recipe;
  priority?: boolean;
};

export function RecipeCard({ recipe, priority = false }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col pt-0">
      <div className="relative h-64">
        <Image
          src={recipe.card_image?.url || "/images/placeholder.jpeg"}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover"
        />
      </div>
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="h-full">
          <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {recipe.description}
          </p>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground mt-auto mb-4">
          <div className="flex items-center gap-1">
            <Coffee className="w-4 h-4" />
            {recipe.difficulty || "srednje"}
          </div>
          {recipe.portions ? (
            <div className="flex items-center gap-1">
              <CakeSlice className="w-4 h-4" />
              {recipe.portions}
            </div>
          ) : null}
        </div>

        <Button asChild className="w-full mt-auto">
          <Link href={`/recept/${recipe.slug}`}>Pogledaj recept</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
