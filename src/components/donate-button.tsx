// Donate button for stripe donations
import { HeartIcon } from "lucide-react";

type DonateButtonProps = {
  url?: string;
  label?: string;
};

export function DonateButton({
  url = "",
  label = "Počasti me kolačićem!",
}: DonateButtonProps) {
  return (
    <a
      href={url}
      target="_blank" rel="noopener noreferrer"
      className="
            inline-flex items-center gap-2
            rounded-full
            cursor-pointer
            bg-terracotta px-5 py-2.5
            text-sm font-medium text-cream
            shadow-sm
            transition
            hover:bg-terracotta-dark
            focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2
        "
    >
      <HeartIcon className="h-4 w-4" />
      {label}
    </a>
  );
}
