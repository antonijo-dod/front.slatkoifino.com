import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ROUTES } from "@/routes";
import { parseIngredientsText } from "./_components/IngredientsPanel";
import { parsePreparationText } from "./_components/PreparationPanel";

// Loose shape of the Strapi recipe payload as this page receives it
// (pLevel=3 populate). Every field is optional: a missing field is
// omitted from the JSON-LD, never filled with a made-up value.
type RecipeSource = {
  title?: string;
  slug?: string;
  description?: string | null;
  seo_description?: string | null;
  cook_time?: string | null;
  portions?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  card_image?: { url?: string } | null;
  cover_images?: { url?: string }[] | null;
  ingredients_text?: string | null;
  ingredients?: { quantity?: number; unit?: string; name?: string }[] | null;
  ingredients_group?:
    | { ingredients?: { quantity?: number; unit?: string; name?: string }[] }[]
    | null;
  instructions?: { instruction_step?: string }[] | null;
};

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

// cook_time is free text written by the author, e.g. "45 min", "1h 30min" —
// but also "Sušenje biskvita: 1h na 130°C. Hlađenje …: 1h. Kuhanje kreme:
// 10min.". Only convert when the WHOLE string is a plain duration; anything
// else is ambiguous, so we leave cookTime out rather than guess.
const DURATION_RE =
  /^\s*(?:(\d+)\s*(?:h|sat|sata|sati)\.?)?\s*(?:(\d+)\s*(?:min|minuta|minute|m)\.?)?\s*$/i;

export function toIsoDuration(text: string | null | undefined): string | undefined {
  if (!text) return undefined;
  const match = text.match(DURATION_RE);
  if (!match || (!match[1] && !match[2])) return undefined;
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  if (hours === 0 && minutes === 0) return undefined;
  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}`;
}

const formatIngredient = (ing: { quantity?: number; unit?: string; name?: string }) =>
  [ing.quantity, ing.unit, ing.name]
    .filter((part) => part !== undefined && part !== null && part !== "")
    .join(" ")
    .trim();

function buildIngredients(recipe: RecipeSource): string[] {
  // Same precedence the IngredientsPanel uses when rendering.
  if (recipe.ingredients_text?.trim()) {
    return parseIngredientsText(recipe.ingredients_text).flatMap((g) => g.items);
  }
  if (recipe.ingredients_group?.length) {
    return recipe.ingredients_group
      .flatMap((g) => g.ingredients ?? [])
      .map(formatIngredient)
      .filter(Boolean);
  }
  return (recipe.ingredients ?? []).map(formatIngredient).filter(Boolean);
}

function buildInstructions(recipe: RecipeSource) {
  // Same precedence the PreparationPanel uses when rendering.
  const structured = (recipe.instructions ?? [])
    .map((step) => step.instruction_step?.trim())
    .filter((text): text is string => !!text);
  if (structured.length > 0) {
    return structured.map((text) => ({ "@type": "HowToStep", text }));
  }
  if (recipe.description?.trim()) {
    return parsePreparationText(recipe.description)
      .filter((section) => section.body)
      .map((section) => ({
        "@type": "HowToStep",
        ...(section.header ? { name: section.header } : {}),
        text: section.body,
      }));
  }
  return [];
}

// `description` normally holds the preparation text (see RecipeCard), so it
// only doubles as a summary when it's short enough to plausibly be a teaser.
function buildDescription(recipe: RecipeSource): string | undefined {
  if (recipe.seo_description?.trim()) return recipe.seo_description.trim();
  const text = recipe.description?.trim();
  if (text && text.length >= 20 && text.length <= 220) return text;
  return undefined;
}

export function buildRecipeJsonLd(recipe: RecipeSource) {
  const images = Array.from(
    new Set(
      [...(recipe.cover_images ?? []), recipe.card_image]
        .map((img) => img?.url)
        .filter((url): url is string => !!url && isAbsoluteUrl(url)),
    ),
  );
  const ingredients = buildIngredients(recipe);
  const instructions = buildInstructions(recipe);
  const description = buildDescription(recipe);
  const cookTime = toIsoDuration(recipe.cook_time);
  const recipeYield = recipe.portions?.trim();

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    ...(recipe.slug ? { url: `${SITE_URL}${ROUTES.recipe(recipe.slug)}` } : {}),
    ...(images.length ? { image: images } : {}),
    ...(description ? { description } : {}),
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    ...(recipe.publishedAt ? { datePublished: recipe.publishedAt } : {}),
    ...(recipe.updatedAt ? { dateModified: recipe.updatedAt } : {}),
    ...(cookTime ? { cookTime } : {}),
    ...(recipeYield ? { recipeYield } : {}),
    ...(ingredients.length ? { recipeIngredient: ingredients } : {}),
    ...(instructions.length ? { recipeInstructions: instructions } : {}),
  };
}

// JSON.stringify doesn't escape "<", so a recipe containing "</script>"
// could otherwise break out of the script tag.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
