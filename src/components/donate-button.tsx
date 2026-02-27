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
            bg-pink-600 px-5 py-2.5
            text-sm font-medium text-white
            shadow-sm
            transition
            hover:bg-pink-700
            focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2
        "
    >
      <HeartIcon className="h-4 w-4" />
      {label}
    </a>
  );
}
