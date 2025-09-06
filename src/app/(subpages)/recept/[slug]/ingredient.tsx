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
    <li className="flex items-start gap-2">
      <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
      <span className="text-sm">
        <span className="font-medium">
          {quantity}
          {unit ? ` ${unit}` : ""}
        </span>{" "}
        - {name}
      </span>
    </li>
  );
}