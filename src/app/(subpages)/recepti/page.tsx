import { Metadata } from "next";
import { fetchRecipes } from "./actions";
import { RecipeList } from "./recipe-list";
import { SEOPagination } from "./seo-pagination";
import { generateRecipeListStructuredData, generateBreadcrumbsStructuredData } from "./structured-data";

export const metadata: Metadata = {
  title: "Slatko i fino - Recepti",
  description: "Svi recepti za kolače i torte",
  keywords: ["recepti", "kolači", "torte", "slastice", "deserti", "hrvatska"],
  openGraph: {
    title: "Slatko i fino - Svi recepti za kolače i torte",
    description: "Pregledajte sve recepte za slatkiše, kolače i torte. Pronađite inspiraciju za svoj sljedeći desert.",
    url: "/recepti",
    type: "website",
    siteName: "Slatko i fino",
    locale: "hr_HR",
    images: [
      {
        url: "/images/og-recepti.jpg", 
        width: 1200,
        height: 630,
        alt: "Slatko i fino recepti"
      }
    ],
  },
  alternates: {
    canonical: "/recepti",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// This is the safest and simplest approach for handling Next.js Server Components
export default async function RecipesPage() {
  // Always fetch the first page - this is guaranteed safe
  const pageSize = 9;
  const { recipes: initialRecipes, meta: initialMeta } = await fetchRecipes(1, pageSize);
  
  // Always use page 1 for the initial render
  // The client component can handle pagination via client-side navigation
  const currentPage = 1;
  
  // Generate structured data for recipes
  const recipeListStructuredData = generateRecipeListStructuredData(
    initialRecipes,
    `https://slatkoifino.com/recepti`
  );
  const breadcrumbsStructuredData = generateBreadcrumbsStructuredData();

  return (
    <div className="min-h-screen py-8">
      {/* Add structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeListStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsStructuredData) }}
      />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Svi recepti</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Pretraži sve recepte i pronađi inspiraciju za svoj sljedeći slatkiš.
          </p>
        </div>
        
        {/* Client component with hydrated server data */}
        <RecipeList initialRecipes={initialRecipes} initialMeta={initialMeta} currentPage={currentPage} />
        
        {/* Hidden pagination links for SEO crawlers */}
        <SEOPagination currentPage={currentPage} pageCount={initialMeta?.pagination.pageCount || 1} />
      </div>
    </div>
  );
}
