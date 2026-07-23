type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "text-center" : "text-left"}>
      <span className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-[var(--home-terracotta)]">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl text-[var(--home-ink)]">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 font-sans text-base leading-relaxed text-[var(--home-ink-soft)] ${
            isCenter ? "mx-auto max-w-2xl" : "max-w-xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
