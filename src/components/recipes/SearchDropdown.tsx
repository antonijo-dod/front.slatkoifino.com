"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { ROUTES } from "@/routes";

type Recipe = {
  id: number;
  title: string;
  slug: string;
};

// Helper to escape special characters in a string for use in a RegExp
const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Function to highlight matching text
const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text;

  const escapedQuery = escapeRegExp(query);
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <mark
          key={index}
          className="bg-paper font-semibold text-terracotta-dark"
        >
          {part}
        </mark>
      );
    }
    return part;
  });
};

type SearchDropdownProps = {
  autoFocus?: boolean;
  onClose?: () => void;
};

export default function SearchDropdown({
  autoFocus = false,
  onClose,
}: SearchDropdownProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const getRecipes = async (query: string) => {
    // Implement API call to fetch recipes based on query
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);

    if (!res.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await res.json();
    return data;
  };

  // Trigger search when debounced value changes
  useEffect(() => {
    const fetchRecipes = async () => {
      if (debouncedSearch.length < 3) {
        setRecipes([]);
        setIsSearching(false);
      } else {
        setIsSearching(true);

        try {
          const data = await getRecipes(debouncedSearch);
          setRecipes(data.recipes || []);
        } catch (error) {
          console.error("Error fetching recipes:", error);
          setRecipes([]);
        } finally {
          setIsSearching(false);
        }
      }
    };

    fetchRecipes();
  }, [debouncedSearch]);

  const handleSearchBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleClear = () => {
    setSearchQuery("");
    setRecipes([]);
  };

  const handleTrailingAction = () => {
    if (searchQuery) {
      handleClear();
    } else {
      onClose?.();
    }
  };

  return (
    <div className="relative text-left font-sans">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          placeholder="Pretraži recepte…"
          onChange={handleSearchBox}
          className="relative w-full border-0 border-b border-line bg-transparent px-0 py-2.5 pr-8 text-sm text-ink placeholder:text-ink-soft focus:border-terracotta focus:outline-none"
        />
        <button
          type="button"
          onClick={handleTrailingAction}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-sm text-ink-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          aria-label={searchQuery ? "Obriši pretragu" : "Zatvori pretragu"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {debouncedSearch.length >= 3 && (
        <div className="absolute z-30 mt-2 max-h-96 w-full overflow-auto border border-line bg-cream shadow-lg">
          {isSearching ? (
            <div className="px-5 py-3 text-sm text-ink-soft">
              Pretraživanje…
            </div>
          ) : recipes.length > 0 ? (
            <ul>
              {recipes.map((recipe) => (
                <li key={recipe.id}>
                  <Link
                    className="block cursor-pointer px-5 py-3 text-sm text-ink hover:bg-paper"
                    href={ROUTES.recipe(recipe.slug)}
                  >
                    {highlightText(recipe.title, debouncedSearch)}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-3 text-sm text-ink-soft">
              Nema rezultata
            </div>
          )}
        </div>
      )}
    </div>
  );
}
