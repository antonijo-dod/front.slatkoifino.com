import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, ArrowLeft } from "lucide-react";
import SwiperImages from "./swiper-images";

export default async function RecipePreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const article = await fetch(
    `${process.env.API_URL}/api/recipes?populate=*&status=draft&filters[slug][$eq]=${slug}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN_PREVIEW}`,
      },
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
  } = post;

  // Get all recipes
  const res = await fetch(`${process.env.API_URL}/api/recipes?populate=*`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
  });
  const { data: allRecipes } = await res.json();

  // // Get all recipes except the current one
  const filteredRecipes = allRecipes.filter(
    (recipe: { slug: string }) => recipe.slug !== slug
  );

  // Get the last 3 recipes, except the current one
  const relatedRecipes = filteredRecipes.slice(0, 3);

  // // GET recipe instructions

  const instructionsUrl = await fetch(
    `${process.env.API_URL}/api/recipes?filters[slug][$eq]=${slug}&populate[instructions][populate]=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
    }
  );
  const { data: recipe } = await instructionsUrl.json();
  const instructions = recipe[0]?.instructions;

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

        {/* Recipe Header */}
        <div className="mb-8">
          <div className="relative rounded-lg overflow-hidden mb-6">
            <SwiperImages images={cover_images} />
            {/* <img
              src={cover_image?.url || "/images/placeholder.jpeg"}
              alt={title}
              className="object-cover w-full mx-auto h-full aspect-video"
            /> */}
          </div>

          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{title}</h1>
              <p className="text-lg text-muted-foreground">{description}</p>
            </div>
            {/* TODO: Add later if needed */}
            {/* <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div> */}
          </div>

          {/* Recipe Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Vrijeme pečenja:</span> {cook_time}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Težina:</span> {difficulty}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">Komada:</span> {portions}
            </div>
            {/* <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">5</span>
            </div> */}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Sastojci</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {ingredients.map(
                    ({
                      id,
                      name,
                      quantity,
                      unit,
                    }: {
                      id: number;
                      name: string;
                      quantity?: number;
                      unit?: string;
                    }) => (
                      <li key={id} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">
                          <span className="font-medium">
                            {quantity}
                            {unit ? ` ${unit}` : ""}
                          </span>{" "}
                          - {name}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
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
                          <p className="text-sm leading-relaxed pt-1">
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
          </div>
        </div>

        {/* Related Recipes */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Mozda će vam se svidjeti</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* {[2, 3, 4].map((id) => (
              <Card
                key={id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Related recipe"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Related Recipe {id}</h3>
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/recipe/${id}`}>View Recipe</Link>
                  </Button>
                </CardContent>
              </Card>
            ))} */}
            {relatedRecipes.map(
              (recipe: {
                id: number;
                title: string;
                description: string;
                cover_image: { url: string };
                slug: string;
              }) => (
                <Card
                  key={recipe.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={
                        recipe.cover_image?.url || "/images/placeholder.jpeg"
                      }
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{recipe.title}</h3>
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/recept/${recipe.slug}`}>
                        Pogledaj recept
                      </Link>
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
