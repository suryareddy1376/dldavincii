"use client";

import { useEffect, useRef } from "react";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
}

export function RevealOnScroll({
  children,
  className = "",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.visible = "true";
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-visible="false" className={`reveal-block ${className}`}>
      {children}
    </div>
  );
}
