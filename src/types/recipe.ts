import { Ingredient } from "./ingredient";
import { StrapiImage } from "./strapi-image";
import { Instruction } from "./instruction";

export interface Recipe {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  cook_time: string | null;
  portions: string | null;
  difficulty: "lagano" | "srednje" | "tesko";
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  card_image: StrapiImage;
  cover_images: StrapiImage[];
  instructions: Instruction[];
  ingredients: Ingredient[];
  localizations: Recipe[];
}
