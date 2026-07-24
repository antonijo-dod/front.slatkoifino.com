import Image from "next/image";

type LegacyInstruction = {
  id: number;
  instruction_step: string;
  instruction_image?: { url: string } | null;
};

type PreparationPanelProps = {
  description?: string | null;
  instructions?: LegacyInstruction[];
};

type ParsedSection = { header: string | null; body: string };

// Same header-line convention already trusted for ingredients_text, applied
// consistently here: a line ending in ":" starts a new (optional) subheading.
function parsePreparationText(text: string): ParsedSection[] {
  const lines = text.split("\n");
  const sections: ParsedSection[] = [];
  let currentHeader: string | null = null;
  let currentLines: string[] = [];

  const flush = () => {
    const body = currentLines.join("\n").trim();
    if (body || currentHeader !== null) {
      sections.push({ header: currentHeader, body });
    }
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed.endsWith(":")) {
      flush();
      currentHeader = trimmed.slice(0, -1);
      currentLines = [];
    } else {
      currentLines.push(rawLine);
    }
  }
  flush();

  return sections;
}

export function PreparationPanel({
  description,
  instructions,
}: PreparationPanelProps) {
  const hasInstructions = (instructions?.length ?? 0) > 0;
  const hasDescription = !!description?.trim();

  if (!hasInstructions && !hasDescription) return null;

  return (
    <div>
      <h2 className="font-[family-name:var(--font-fraunces)] text-2xl text-ink">
        Priprema
      </h2>
      <div className="mt-5">
        {hasInstructions ? (
          <ol className="space-y-6">
            {instructions!.map((instruction, index) => (
              <li key={instruction.id} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-terracotta font-sans text-sm font-medium text-terracotta">
                  {index + 1}
                </span>
                <div className="flex-1 pt-0.5">
                  <p className="max-w-[65ch] font-sans text-[17px] leading-[1.7] text-ink-soft">
                    {instruction.instruction_step}
                  </p>
                  {instruction.instruction_image && (
                    <div className="relative mt-4 aspect-[4/3] w-full max-w-md overflow-hidden rounded-lg">
                      <Image
                        src={instruction.instruction_image.url}
                        alt={`Korak ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="space-y-6">
            {parsePreparationText(description!).map((section, index) => (
              <div key={index}>
                {section.header && (
                  <h3 className="mb-2 font-[family-name:var(--font-fraunces)] text-lg text-ink">
                    {section.header}
                  </h3>
                )}
                {section.body && (
                  <p className="max-w-[65ch] whitespace-pre-line font-sans text-[17px] leading-[1.7] text-ink-soft">
                    {section.body}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
