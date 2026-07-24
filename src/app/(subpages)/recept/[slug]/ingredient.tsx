import React from "react";

export function Ingredient({
  quantity,
  unit,
  name,
}: {
  quantity: number | undefined;
  unit: string | undefined;
  name: string | undefined;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
      <span className="font-sans text-sm text-ink">
        <span className="font-medium">
          {quantity}
          {unit ? ` ${unit}` : ""}
        </span>{" "}
        <span className="text-ink-soft">- {name}</span>
      </span>
    </li>
  );
}