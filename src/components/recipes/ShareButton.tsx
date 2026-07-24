"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, Facebook, MessageCircle, Link2, Check } from "lucide-react";
import { ROUTES } from "@/routes";

type ShareButtonProps = {
  title: string;
  slug: string;
};

export function ShareButton({ title, slug }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const getUrl = () =>
    typeof window !== "undefined"
      ? `${window.location.origin}${ROUTES.recipe(slug)}`
      : "";

  const handleTriggerClick = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: getUrl() });
      } catch {
        // user cancelled the native share sheet — not an error
      }
      return;
    }
    setOpen((value) => !value);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — link stays visible in the address bar as fallback
    }
  };

  const url = getUrl();
  const shareText = encodeURIComponent(`${title} ${url}`);

  const menuItems = [
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${shareText}`,
    },
    {
      label: "Viber",
      icon: MessageCircle,
      href: `viber://forward?text=${shareText}`,
    },
  ];

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={handleTriggerClick}
        className="-mx-1 inline-flex min-h-11 items-center gap-2 rounded-sm px-1 font-sans text-sm font-medium text-ink-soft underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-terracotta-dark hover:decoration-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Share2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
        Podijeli recept
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 z-30 mt-2 w-56 rounded-lg border border-line bg-cream p-1.5 shadow-lg"
        >
          {menuItems.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className="flex min-h-11 items-center gap-3 rounded-md px-3 font-sans text-sm text-ink transition-colors hover:bg-paper hover:text-terracotta-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            >
              <Icon className="h-4 w-4 text-terracotta" strokeWidth={1.75} />
              {label}
            </a>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={handleCopyLink}
            className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 font-sans text-sm text-ink transition-colors hover:bg-paper hover:text-terracotta-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            {copied ? (
              <Check className="h-4 w-4 text-terracotta" strokeWidth={1.75} />
            ) : (
              <Link2 className="h-4 w-4 text-terracotta" strokeWidth={1.75} />
            )}
            <span aria-live="polite">
              {copied ? "Poveznica je kopirana!" : "Kopiraj poveznicu"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
