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
      <span className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-terracotta">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl text-ink">
        {title}
      </h2>
      <div
        className={`mt-4 flex items-center gap-2 ${isCenter ? "justify-center" : ""}`}
        aria-hidden
      >
        <span className="h-px w-12 bg-terracotta" />
        <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
      </div>
      {description && (
        <p
          className={`mt-4 font-sans text-base leading-relaxed text-ink-soft ${
            isCenter ? "mx-auto max-w-2xl" : "max-w-xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
