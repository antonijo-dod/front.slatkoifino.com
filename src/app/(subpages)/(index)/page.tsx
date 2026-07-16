import Image from "next/image";
import { Metadata } from "next";
import SearchDropdown from "./SearchDropdown";
import { RecipeCard } from "../recepti/recipe-card";
import type { Recipe } from "@/types/recipe";

export const metadata: Metadata = {
  title: "Slatko i fino - Početna",
  description: "Najbolji recepti za kolače i torte",
};

export default async function HomePage() {
  // Get featured recipes from API

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50">
        <div className="absolute inset-0 bg-black/20 z-20" />
        <Image
          src="/images/hero.jpg"
          alt="Beautiful baking scene"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Slatko I Fino</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Otkrij ukusne recepte kolača i torti napravljene s ljubavlju
          </p>
          <SearchDropdown />
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Posljednji recepti</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Naši najbolji recepti kolača, savršeni za svaku priliku
          </p>
        </div>

        {allRecipes.length === 0 && (
          <div className="text-center">
            <h3>Trenutno nema dodanih recepata</h3>
            <p>Provjerite ponovno za nekoliko trenutaka</p>
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allRecipes.map((recipe: Recipe) => {
            return <RecipeCard recipe={recipe} key={recipe.id} />;
          })}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">O meni</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Dobrodošli u moju slatku kuhinju! Ovdje ćete pronači pažljivo
            osmišljene recepte kolača koji donose radost svakoj proslavi. Od
            klasičnih favorita do kreativnih novih okusa, svaki recept je
            testiran s ljubavlju i osmišljen da stvori lijepe uspomene oko vaših
            stolova.
          </p>
        </div>
      </section>
    </div>
  );
}
