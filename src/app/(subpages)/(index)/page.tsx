import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Slatko i fino - Pocetna",
  description: "Najbolji recepti za kolače i torte",
};

export default async function HomePage() {
  // Get featured recipes from API

  const res = await fetch(`${process.env.API_URL}/api/recipes?populate=*`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
  });
  const { data: allRecipes } = await res.json();

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
            Otkrij ukusne recepte kolaca i torti napravljene s ljubavlju
          </p>
          <Button
            asChild
            size="lg"
            className="bg-pink-600 hover:bg-pink-700 text-lg px-8 py-3"
          >
            <Link href="/recepti">Otkrij recepte</Link>
          </Button>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Posljednji recepti</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nasi najbolji recepti kolaca, savrseni za svaku priliku
          </p>
        </div>

        {allRecipes.length === 0 && (
          <div className="text-center">
            <h3>Trenutno nema dodanih recepata</h3>
            <p>Provjerite ponovno za nekoliko trenutaka</p>
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allRecipes
            .slice(0, 5)
            .map(
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
                      src={recipe.card_image.url || "/placeholder.svg"}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {recipe.title}
                    </h3>
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
                        {recipe.servings} servings
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {recipe.rating}
                      </div>
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/recept/${recipe.slug}`}>
                        Pogledaj recept
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">O meni</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Dobrodosli u moju slatku kuhinju! Ovdje cete pronaci pazljivo
            osmisljene recepte kolaca koji donose radost svakoj proslavi. Od
            klasicnih favorita do kreativnih novih okusa, svaki recept je
            testiran s ljubavlju i osmišljen da stvori lijepe uspomene oko vasih
            stolova.
          </p>
        </div>
      </section>
    </div>
  );
}
