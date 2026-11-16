"use client";

import { useEffect } from "react";

/**
 * Adds `.is-in` to every `.reveal` element as it scrolls into view (once).
 * Under prefers-reduced-motion everything is shown at once. Without JS the
 * `.reveal` styles never apply (they need html.js), so nothing stays hidden.
 */
export function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((el) => {
      // Anything already above the fold (e.g. after an anchor jump) shows immediately.
      if (el.getBoundingClientRect().bottom < 0) el.classList.add("is-in");
      else io.observe(el);
    });
    // Keyboard users must see what they Tab to: reveal its block at once.
    const onFocus = (e: FocusEvent) => {
      const block = (e.target as Element | null)?.closest?.(".reveal:not(.is-in)") as HTMLElement | null;
      if (!block) return;
      block.style.transition = "none";
      block.classList.add("is-in");
      io.unobserve(block);
    };
    document.addEventListener("focusin", onFocus);
    return () => {
      io.disconnect();
      document.removeEventListener("focusin", onFocus);
    };
  }, []);
  return null;
}
