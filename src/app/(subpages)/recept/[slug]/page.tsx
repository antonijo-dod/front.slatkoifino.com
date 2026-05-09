import Image from "next/image";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, ArrowLeft, ChefHat } from "lucide-react";
import SwiperImages from "./swiper-images";
import { Ingredient } from "./ingredient";
import { IngredientGroup } from "./ingredient-group"

export async function generateStaticParams() {
  const allRecipes = [];
  let page = 1;
  let pageCount = 1;

  do {
    const res = await fetch(
      `${process.env.API_URL}/api/recipes?pagination[page]=${page}&pagination[pageSize]=100`,
      { headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` } }
    );
    const { data: recipes, meta } = await res.json();
    if (meta?.pagination) pageCount = meta.pagination.pageCount;
    if (recipes) allRecipes.push(...recipes);
    page++;
  } while (page <= pageCount);

  return allRecipes.map((recipe: { slug: string }) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
  parent: ResolvingMetadata;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetch(
    `${process.env.API_URL}/api/recipes?populate=*&filters[slug][$eq]=${slug}`,
    {
      headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      next: { revalidate: 60 },
    }
  );
  const { data } = await article.json();
  const post = data[0] || {};
  const { title, description, seo_title, seo_description } = post;
  return {
    title: `Slatko i fino - ${seo_title || title}`,
    description: `Slatko i fino - ${seo_description || description}`,
  };
}

export default async function RecipePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const article = await fetch(
    `${process.env.API_URL}/api/recipes?pLevel=3&filters[slug][$eq]=${slug}`,
    {
      headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      next: { revalidate: 60 },
    }
  );
  const { data } = await article.json();
  const post = data[0] || {};

  const {
    title,
    description,
    cover_images,
    cook_time,
    portions,
    difficulty,
    ingredients,
    ingredients_group,
    ingredients_text,
  } = post;

  // All recipes for related section
  const res = await fetch(`${process.env.API_URL}/api/recipes?pLevel=5`, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
    next: { revalidate: 60 },
  });
  const { data: allRecipes } = await res.json();
  const relatedRecipes = allRecipes
    .filter((r: { slug: string }) => r.slug !== slug)
    .slice(0, 3);

  // Instructions fetch
  const instructionsRes = await fetch(
    `${process.env.API_URL}/api/recipes?filters[slug][$eq]=${slug}&populate[instructions][populate]=*`,
    {
      headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      next: { revalidate: 60 },
    }
  );
  const { data: recipeData } = await instructionsRes.json();
  const instructions = recipeData[0]?.instructions;

  // Layout flags
  const hasIngredientsText = !!ingredients_text?.trim();
  const hasStructuredIngredients =
    (ingredients?.length > 0) || (ingredients_group?.length > 0);
  const hasIngredients = hasIngredientsText || hasStructuredIngredients;
  const hasInstructions = instructions?.length > 0;
  const hasDescription = !!description?.trim();

  // New-style recipe: has ingredients_text, no structured steps
  const isNewStyle = hasIngredientsText && !hasInstructions;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Recept nije pronaden</h1>
          <Button asChild>
            <Link href="/recepti">Nazad na recepte</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/recepti" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Nazad na recepte
          </Link>
        </Button>

        {/* Images */}
        <div className="relative rounded-lg overflow-hidden mb-6">
          <SwiperImages images={cover_images} />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-3">{title}</h1>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 text-sm mb-8">
          {cook_time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Vrijeme pečenja:</span> {cook_time}
            </div>
          )}
          {difficulty && (
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              <span className="font-medium">Težina:</span> {difficulty}
            </div>
          )}
          {portions && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">Komada:</span> {portions}
            </div>
          )}
        </div>

        {/* Old-style recipes — description as intro above the grid */}
        {!isNewStyle && hasDescription && (hasIngredients || hasInstructions) && (
          <p className="text-lg text-muted-foreground whitespace-pre-line leading-relaxed mb-8">
            {description}
          </p>
        )}

        {/* Main content grid */}
        {(hasIngredients || hasInstructions || hasDescription) && (
          <div className="grid lg:grid-cols-3 gap-8 mb-12">

            {/* Left column — Ingredients (only if exists) */}
            {hasIngredients && (
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Sastojci</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* New free-text ingredients */}
                    {hasIngredientsText && (
                      <ul className="space-y-2">
                        {ingredients_text
                          .split("\n")
                          .filter((line: string) => line.trim())
                          .map((line: string, index: number) => {
                            const trimmed = line.trim()
                            const isHeader = trimmed.endsWith(":")
                            return isHeader ? (
                              <li key={index} className="pt-2 first:pt-0">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                                  {trimmed.slice(0, -1)}
                                </p>
                              </li>
                            ) : (
                              <li key={index} className="flex items-start gap-2">
                                <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-base">{trimmed}</span>
                              </li>
                            )
                          })}
                      </ul>
                    )}

                    {/* Legacy structured ingredients */}
                    {!hasIngredientsText && hasStructuredIngredients && (
                      <>
                        {!(ingredients_group?.length > 0) && ingredients?.length > 0 && (
                          <ul className="space-y-2">
                            {ingredients.map(
                              ({ id, name, quantity, unit }: {
                                id: number; name: string;
                                quantity?: number; unit?: string;
                              }) => (
                                <li key={id} className="flex items-start gap-2">
                                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-base">
                                    <span className="font-medium">
                                      {quantity}{unit ? ` ${unit}` : ""}
                                    </span>{" "}- {name}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                        {ingredients_group?.length > 0 && (
                          <ul className="space-y-2">
                            {ingredients_group.map(
                              ({ id, group_name, ingredients }: {
                                id: number; group_name?: string;
                                ingredients: { id: number; name: string; quantity?: number; unit?: string; }[];
                              }) => (
                                <IngredientGroup key={id} groupName={group_name}>
                                  {ingredients.map(({ id, name, quantity, unit }: {
                                    id: number; name: string;
                                    quantity?: number; unit?: string;
                                  }) => (
                                    <Ingredient key={id} quantity={quantity} unit={unit} name={name} />
                                  ))}
                                </IngredientGroup>
                              )
                            )}
                          </ul>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Right column */}
            <div className={hasIngredients ? "lg:col-span-2" : "lg:col-span-3"}>

              {/* New-style: show description as preparation text */}
              {isNewStyle && hasDescription && (
                <Card>
                  <CardHeader>
                    <CardTitle>Priprema</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed whitespace-pre-line text-gray-700">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Old-style: numbered steps */}
              {hasInstructions && (
                <Card>
                  <CardHeader>
                    <CardTitle>Koraci</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4">
                      {instructions.map(
                        // @ts-expect-error need fix latter
                        ({ id, instruction_step, instruction_image }, index) => (
                          <li key={id} className="flex flex-col gap-4">
                            <div className="flex gap-4">
                              <span className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </span>
                              <p className="text-base leading-relaxed pt-1">
                                {instruction_step}
                              </p>
                            </div>
                            {instruction_image && (
                              <div className="ml-12">
                                <div className="relative w-full h-56 flex-shrink-0">
                                  <Image
                                    src={instruction_image?.url}
                                    alt={`Step ${index + 1} image`}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                              </div>
                            )}
                          </li>
                        )
                      )}
                    </ol>
                  </CardContent>
                </Card>
              )}

              {/* No ingredients and no instructions — just description */}
              {!hasIngredients && !hasInstructions && hasDescription && (
                <p className="text-lg text-muted-foreground whitespace-pre-line leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Related Recipes */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-6">Mozda će vam se svidjeti</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedRecipes.map(
              (recipe: {
                id: number; title: string; description: string;
                card_image: { url: string }; slug: string;
              }) => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={recipe.card_image?.url || "/images/placeholder.jpeg"}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{recipe.title}</h3>
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/recept/${recipe.slug}`}>Pogledaj recept</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
