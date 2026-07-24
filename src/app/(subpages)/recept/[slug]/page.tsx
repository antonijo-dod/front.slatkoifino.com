import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import type { Recipe } from "@/types/recipe";
import { Gallery } from "./_components/Gallery";
import { RecipeHeader } from "./_components/RecipeHeader";
import { IngredientsPanel } from "./_components/IngredientsPanel";
import { PreparationPanel } from "./_components/PreparationPanel";
import { AdSlot } from "@/components/AdSlot";

export async function generateStaticParams() {
  const allRecipes = [];
  let page = 1;
  let pageCount = 1;

  do {
    const res = await fetch(
      `${process.env.API_URL}/api/recipes?pagination[page]=${page}&pagination[pageSize]=100`,
      { headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` } },
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
    },
  );
  const { data } = await article.json();
  const post = data[0] || {};
  const { title, seo_title, seo_description } = post;

  // `description` holds preparation instructions, not a marketing/SEO
  // summary — never fall back to it here. Without a real seo_description,
  // fall back to a deterministic, non-AI sentence built from the title.
  const metaDescription = seo_description
    ? `Slatko i fino - ${seo_description}`
    : `${title} — recept, sastojci i priprema na Slatko i fino.`;

  return {
    title: `Slatko i fino - ${seo_title || title}`,
    description: metaDescription,
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
    },
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
  const relatedRecipes: Recipe[] = allRecipes
    .filter((r: { slug: string }) => r.slug !== slug)
    .slice(0, 3);

  // Instructions fetch
  const instructionsRes = await fetch(
    `${process.env.API_URL}/api/recipes?filters[slug][$eq]=${slug}&populate[instructions][populate]=*`,
    {
      headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      next: { revalidate: 60 },
    },
  );
  const { data: recipeData } = await instructionsRes.json();
  const instructions = recipeData[0]?.instructions;

  // Layout flags
  const hasIngredientsText = !!ingredients_text?.trim();
  const hasStructuredIngredients =
    ingredients?.length > 0 || ingredients_group?.length > 0;
  const hasIngredients = hasIngredientsText || hasStructuredIngredients;
  const hasInstructions = instructions?.length > 0;
  const hasDescription = !!description?.trim();
  const hasPreparation = hasInstructions || hasDescription;

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-fraunces)] text-2xl text-ink">
            Recept nije pronađen
          </h1>
          <Button
            asChild
            className="mt-6 rounded-full bg-terracotta font-sans text-cream hover:bg-terracotta-dark"
          >
            <Link href="/recepti">Nazad na recepte</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-6">
        {/* Back link */}
        <Link
          href="/recepti"
          className="inline-flex items-center gap-2 rounded-sm font-sans text-sm text-ink-soft transition-colors hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <ArrowLeft className="h-4 w-4" />
          Svi recepti
        </Link>

        {/* Gallery */}
        <div className="mt-6">
          <Gallery images={cover_images ?? []} title={title ?? ""} />
        </div>

        {/* Editorial header */}
        <RecipeHeader
          recipe={{ title, slug, cook_time, portions, difficulty }}
        />

        {/* Ingredients + preparation */}
        {(hasIngredients || hasPreparation) && (
          <div
            className={`mt-12 grid gap-10 lg:gap-16 ${
              hasIngredients ? "lg:grid-cols-[2fr_3fr]" : ""
            }`}
          >
            {hasIngredients && (
              <div className="lg:sticky lg:top-28 lg:self-start">
                <IngredientsPanel
                  ingredientsText={ingredients_text}
                  ingredients={ingredients}
                  ingredientsGroup={ingredients_group}
                />
              </div>
            )}
            <div>
              <PreparationPanel
                description={description}
                instructions={instructions}
              />
            </div>
          </div>
        )}

        {/* Reserved, empty by default — future ad slot */}
        <AdSlot />

        {/* Related recipes */}
        {relatedRecipes.length > 0 && (
          <div className="mt-16 border-t border-line pt-16">
            <SectionHeading
              eyebrow="Nastavite istraživati"
              title="Možda će vam se svidjeti"
            />
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedRecipes.map((recipe) => (
                <RecipeCard recipe={recipe} key={recipe.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
