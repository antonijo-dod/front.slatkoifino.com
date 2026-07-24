import { Ingredient } from "../ingredient";
import { IngredientGroup } from "../ingredient-group";

type LegacyIngredient = {
  id: number;
  name: string;
  quantity?: number;
  unit?: string;
};

type LegacyIngredientGroup = {
  id: number;
  group_name?: string;
  ingredients: LegacyIngredient[];
};

type IngredientsPanelProps = {
  ingredientsText?: string | null;
  ingredients?: LegacyIngredient[];
  ingredientsGroup?: LegacyIngredientGroup[];
};

type ParsedGroup = { header: string | null; items: string[] };

// Same convention already trusted for this field today: a line ending in
// ":" on its own starts a new group (e.g. "TIJESTO:"); everything else is
// an ingredient line belonging to the current group.
function parseIngredientsText(text: string): ParsedGroup[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const groups: ParsedGroup[] = [];
  let current: ParsedGroup = { header: null, items: [] };

  for (const line of lines) {
    if (line.endsWith(":")) {
      if (current.header !== null || current.items.length > 0) {
        groups.push(current);
      }
      current = { header: line.slice(0, -1), items: [] };
    } else {
      current.items.push(line);
    }
  }
  if (current.header !== null || current.items.length > 0) {
    groups.push(current);
  }

  return groups;
}

export function IngredientsPanel({
  ingredientsText,
  ingredients,
  ingredientsGroup,
}: IngredientsPanelProps) {
  const hasText = !!ingredientsText?.trim();
  const hasLegacyGroups = (ingredientsGroup?.length ?? 0) > 0;
  const hasLegacyFlat = (ingredients?.length ?? 0) > 0;

  if (!hasText && !hasLegacyGroups && !hasLegacyFlat) return null;

  return (
    <div>
      <h2 className="font-[family-name:var(--font-fraunces)] text-2xl text-ink">
        Sastojci
      </h2>
      <ul className="mt-5">
        {hasText &&
          parseIngredientsText(ingredientsText!).map((group, index) => (
            <IngredientGroup key={index} groupName={group.header ?? undefined}>
              {group.items.map((line, lineIndex) => (
                <li key={lineIndex} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                  <span className="font-sans text-sm text-ink-soft">
                    {line}
                  </span>
                </li>
              ))}
            </IngredientGroup>
          ))}

        {!hasText &&
          hasLegacyGroups &&
          ingredientsGroup!.map((group) => (
            <IngredientGroup key={group.id} groupName={group.group_name}>
              {group.ingredients.map((ing) => (
                <Ingredient
                  key={ing.id}
                  quantity={ing.quantity}
                  unit={ing.unit}
                  name={ing.name}
                />
              ))}
            </IngredientGroup>
          ))}

        {!hasText &&
          !hasLegacyGroups &&
          hasLegacyFlat &&
          ingredients!.map((ing) => (
            <Ingredient
              key={ing.id}
              quantity={ing.quantity}
              unit={ing.unit}
              name={ing.name}
            />
          ))}
      </ul>
    </div>
  );
}
