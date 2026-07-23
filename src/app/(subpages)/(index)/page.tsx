import { Metadata } from "next";
import type { Recipe } from "@/types/recipe";
import { Hero } from "./_components/Hero";
import { RecipesSection } from "./_components/RecipesSection";

export const metadata: Metadata = {
  title: "Slatko i fino - Početna",
  description: "Najbolji recepti za kolače i torte",
};

export default async function HomePage() {
  const res = await fetch(
    `${process.env.API_URL}/api/recipes?pLevel=3&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=6`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      next: { revalidate: 60 },
    },
  );
  const { data } = await res.json();
  const allRecipes: Recipe[] = data ?? [];
  const recipes = allRecipes.slice(0, 6);

  return (
    <div className="min-h-screen bg-[var(--home-cream)]">
      <Hero />
      <RecipesSection recipes={recipes} />
    </div>
  );
}
