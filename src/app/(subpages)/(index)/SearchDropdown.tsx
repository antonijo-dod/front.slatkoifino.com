"use client";
import React, { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { ROUTES } from "@/routes"

export default function SearchDropdown() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 300);

    const getRecipes = async (query: string) => {
        // Implement API call to fetch recipes based on query
        const res = await fetch(`${process.env.API_URL}/api/recipes?filters[title][$containsi]=${query}&pagination[page]=1&pagination[pageSize]=100`, {
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
            },
        });
        const data = await res.json();
        return data;
    }

    // Trigger search when debounced value changes
    useEffect(() => {
        const fetchRecipes = async () => {
            if (debouncedSearch.length < 3) {
                setRecipes([]);
                setIsSearching(false);
            } else {
                setIsSearching(true);
                const data = await getRecipes(debouncedSearch);
                setRecipes(data.data);
                setIsSearching(false);
            }
        };

        fetchRecipes();
    }, [debouncedSearch]);

    const handleSearchBox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
    }

    const handleClear = () => {
        setSearchQuery("");
        setRecipes([]);
    }

    return (
        <div className=" text-gray-900 relative text-left">
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    placeholder="Pretraži recepte..."
                    onChange={handleSearchBox}
                    className="relative px-6 py-4 focus:border-white bg-white rounded-md w-full pr-12"
                />
                {searchQuery && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
            {debouncedSearch.length >= 3 && (
                <div className="bg-white absolute z-30 w-full max-h-96 overflow-auto shadow-lg border border-gray-200 rounded-md mt-1">
                    {isSearching ? (
                        <div className="px-6 py-4 text-gray-500">Pretraživanje...</div>
                    ) : recipes.length > 0 ? (
                        <ul>
                            {recipes.map((recipe) => (
                                <li key={recipe.id}><Link className="px-6 py-4 hover:bg-gray-100 cursor-pointer block" href={ROUTES.recipe(recipe.slug)}>{recipe.title}</Link></li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-6 py-4 text-gray-500">Nema rezultata</div>
                    )}
                </div>
            )}
        </div>
    )
}  