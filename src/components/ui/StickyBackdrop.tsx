import type { ReactNode } from "react";

/**
 * Viewport-sized background that stays put while its section scrolls past
 * (Figma keeps these backgrounds static between frames). Takes no layout space;
 * siblings after it need `relative` to paint above it.
 */
export function StickyBackdrop({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden className="pointer-events-none sticky top-0 -mb-[100vh] h-screen overflow-hidden">
      {children}
    </div>
  );
}
