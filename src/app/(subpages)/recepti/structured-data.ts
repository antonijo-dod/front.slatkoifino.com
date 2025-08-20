import { Recipe } from "./actions";

export function generateRecipeListStructuredData(recipes: Recipe[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": recipes.map((recipe, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Recipe",
        "name": recipe.title,
        "description": recipe.description,
        "image": recipe.card_image?.url || "/images/placeholder.jpeg",
        "recipeCategory": recipe.category,
        "recipeCuisine": "Croatian",
        "prepTime": recipe.prepTime,
        "recipeYield": `${recipe.servings} servings`,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": recipe.rating,
          "reviewCount": 1
        },
        "url": `https://slatkoifino.com/recept/${recipe.slug}`
      }
    })),
    "numberOfItems": recipes.length,
    "url": pageUrl
  };
}

export function generateBreadcrumbsStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Početna",
        "item": "https://slatkoifino.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Recepti",
        "item": "https://slatkoifino.com/recepti"
      }
    ]
  };
}
