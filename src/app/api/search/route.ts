import { NextRequest, NextResponse } from "next/server";

import { fetchRecipes } from "../../(subpages)/recepti/actions";

export async function GET(req: NextRequest) {
  const limitPageSize = 100; // Set a limit for pageSize to prevent excessive data fetching

  const query = req.nextUrl.searchParams.get("query") || "";
  const parsePage = parseInt(req.nextUrl.searchParams.get("page") || "");
  const page = isNaN(parsePage) ? 1 : parsePage;
  const parsePageSize = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "",
  );
  const pageSize = isNaN(parsePageSize) ? limitPageSize : parsePageSize;

  try {
    const { recipes, meta } = await fetchRecipes(query, page, pageSize);

    return NextResponse.json({ recipes, meta });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { message: "Failed to fetch recipes" },
      { status: 500 },
    );
  }
}
