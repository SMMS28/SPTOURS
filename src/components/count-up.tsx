"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts from 0 to `to` once the element scrolls into view.
 *
 * Renders the final value on the server and for anyone who prefers reduced
 * motion, so the number is never missing — the animation is decoration on top of
 * text that is already correct.
 */
export function CountUp({
  to,
  duration = 1600,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let start: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        setValue(0);

        const step = (now: number) => {
          start ??= now;
          const t = Math.min((now - start) / duration, 1);
          // Ease-out cubic: fast off the mark, settles on the final figure.
          setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
