import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Star, ArrowLeft, Heart, Share2 } from "lucide-react";

// Mock recipe data - in a real app, this would come from a database
const getRecipe = (slug: string) => {
  const recipes = {
    "1": {
      id: 1,
      slug: "first",
      title: "Classic Chocolate Cake",
      description:
        "Rich, moist chocolate cake with silky chocolate ganache that melts in your mouth",
      image: "/placeholder.svg?height=500&width=800",
      prepTime: "45 min",
      cookTime: "35 min",
      totalTime: "1h 20min",
      servings: 8,
      rating: 4.9,
      difficulty: "Medium",
      ingredients: [
        "2 cups all-purpose flour",
        "2 cups granulated sugar",
        "3/4 cup unsweetened cocoa powder",
        "2 teaspoons baking soda",
        "1 teaspoon baking powder",
        "1 teaspoon salt",
        "2 large eggs",
        "1 cup buttermilk",
        "1 cup strong black coffee, cooled",
        "1/2 cup vegetable oil",
        "1 teaspoon vanilla extract",
      ],
      instructions: [
        "Preheat your oven to 350°F (175°C). Grease and flour two 9-inch round cake pans.",
        "In a large bowl, whisk together flour, sugar, cocoa powder, baking soda, baking powder, and salt.",
        "In another bowl, beat eggs, then add buttermilk, coffee, oil, and vanilla extract.",
        "Gradually add the wet ingredients to the dry ingredients, mixing until just combined.",
        "Divide batter evenly between prepared pans.",
        "Bake for 30-35 minutes, or until a toothpick inserted in center comes out clean.",
        "Cool in pans for 10 minutes, then turn out onto wire racks to cool completely.",
        "Frost with your favorite chocolate frosting and serve.",
      ],
    },
  };

  return recipes[slug as keyof typeof recipes] || null;
};

export default function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = getRecipe(params.slug);

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
          <Button asChild>
            <Link href="/recipes">Back to Recipes</Link>
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
          <Link href="/recipes" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Recipes
          </Link>
        </Button>

        {/* Recipe Header */}
        <div className="mb-8">
          <div className="relative h-96 rounded-lg overflow-hidden mb-6">
            <Image
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
              <p className="text-lg text-muted-foreground">
                {recipe.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Recipe Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Prep:</span> {recipe.prepTime}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Cook:</span> {recipe.cookTime}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">Serves:</span> {recipe.servings}
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{recipe.rating}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-relaxed pt-1">
                        {instruction}
                      </p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Recipes */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[2, 3, 4].map((id) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
