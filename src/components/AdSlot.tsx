import type React from "react";

/**
 * Wrapper for an optional advertisement block.
 * Renders nothing unless explicitly given content — no placeholder,
 * no tracking, no third-party script.
 */
export function AdSlot({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <div className="my-12">{children}</div>;
}
