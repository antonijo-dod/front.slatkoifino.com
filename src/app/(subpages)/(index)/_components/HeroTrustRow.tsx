import { BadgeCheck, ChefHat, Heart } from "lucide-react";

const ITEMS = [
  { icon: BadgeCheck, label: "provjereno" },
  { icon: Heart, label: "s ljubavlju" },
  { icon: ChefHat, label: "iz moje kuhinje" },
];

export function HeroTrustRow() {
  return (
    <div className="hidden md:flex items-center gap-5 lg:gap-6">
      {ITEMS.map(({ icon: Icon, label }, index) => (
        <div key={label} className="flex items-center gap-5 lg:gap-6">
          {index > 0 && <span className="h-9 w-px bg-line" aria-hidden />}
          <div className="flex items-center gap-2.5">
            <Icon className="h-5 w-5 text-terracotta" strokeWidth={1.5} />
            <span className="font-sans text-sm text-ink-soft">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
