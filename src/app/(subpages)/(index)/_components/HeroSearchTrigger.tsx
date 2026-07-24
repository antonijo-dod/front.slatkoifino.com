"use client";

import { useEffect, useRef, useState } from "react";
import SearchDropdown from "@/components/recipes/SearchDropdown";

export function HeroSearchTrigger() {
  const [open, setOpen] = useState(false);
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

  return (
    <div ref={containerRef} className="w-full max-w-[240px]">
      {open ? (
        <SearchDropdown autoFocus onClose={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-sm font-sans text-base text-ink underline decoration-terracotta decoration-2 underline-offset-4 transition-colors hover:text-terracotta-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          Pretraži kolače
        </button>
      )}
    </div>
  );
}
