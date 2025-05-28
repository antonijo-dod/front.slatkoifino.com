import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Star } from "lucide-react";

const featuredRecipes = [
  {
    id: 1,
    title: "Classic Chocolate Cake",
    description: "Rich, moist chocolate cake with silky chocolate ganache",
    image: "/placeholder.svg?height=300&width=400",
    prepTime: "45 min",
    servings: 8,
    rating: 4.9,
  },
  {
    id: 2,
    title: "Vanilla Cupcakes",
    description: "Light and fluffy vanilla cupcakes with buttercream frosting",
    image: "/placeholder.svg?height=300&width=400",
    prepTime: "30 min",
    servings: 12,
    rating: 4.8,
  },
  {
    id: 3,
    title: "Red Velvet Cake",
    description: "Classic red velvet with cream cheese frosting",
    image: "/placeholder.svg?height=300&width=400",
    prepTime: "60 min",
    servings: 10,
    rating: 4.9,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50">
        <div className="absolute inset-0 bg-black/20" />
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="Beautiful baking scene"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Sweet Creations
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover delicious cake recipes made with love
          </p>
          <Button
            asChild
            size="lg"
            className="bg-pink-600 hover:bg-pink-700 text-lg px-8 py-3"
          >
            <Link href="/recipes">Explore Recipes</Link>
          </Button>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Recipes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our most loved cake recipes, perfect for any occasion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                <p className="text-muted-foreground mb-4">
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
                  <Link href={`/recipe/${recipe.id}`}>View Recipe</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">About Our Kitchen</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Welcome to our sweet corner of the internet! Here you'll find
            carefully crafted cake recipes that bring joy to every celebration.
            From classic favorites to creative new flavors, each recipe is
            tested with love and designed to create beautiful memories around
            your table.
          </p>
        </div>
      </section>
    </div>
  );
}
