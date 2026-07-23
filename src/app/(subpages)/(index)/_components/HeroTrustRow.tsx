import { BadgeCheck, ChefHat, Heart } from "lucide-react";

const ITEMS = [
  { icon: BadgeCheck, label: "provjereno" },
  { icon: Heart, label: "s ljubavlju" },
  { icon: ChefHat, label: "iz moje kuhinje" },
];

export function HeroTrustRow() {
  return (
    <div className="hidden md:flex items-center gap-4 lg:gap-5">
      {ITEMS.map(({ icon: Icon, label }, index) => (
        <div key={label} className="flex items-center gap-4 lg:gap-5">
          {index > 0 && <span className="h-8 w-px bg-line" aria-hidden />}
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-terracotta" strokeWidth={1.5} />
            <span className="font-sans text-xs text-ink-soft">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
