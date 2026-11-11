"use client";

import { useEffect, useRef, useState } from "react";

const RAW_LINES = [
  ["Sixteen", "self", "contained", "Keras", "cells."],
  ["Zero", "notebook", "archaeology", "before", "your", "first", "epoch."],
  ["Copy", "verified", "models", "and", "train", "on", "schedule."],
];

const TAGLINE_LINES = (() => {
  let cursor = 0;
  return RAW_LINES.map((words) =>
    words.map((word) => {
      const index = cursor;
      cursor += 1;
      return { word, index };
    })
  );
})();

const TOTAL_WORDS = TAGLINE_LINES.reduce((sum, line) => sum + line.length, 0);

export function TaglineReveal() {
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [activeCount, setActiveCount] = useState<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frameId = 0;

    const evaluateWords = () => {
      frameId = 0;
      const triggerY = window.innerHeight * 0.78;
      let highestActive = 0;

      for (let idx = 0; idx < TOTAL_WORDS; idx += 1) {
        const node = wordRefs.current[idx];
        if (!node) continue;
        const rect = node.getBoundingClientRect();
        const wordCenter = rect.top + rect.height * 0.5;
        if (wordCenter <= triggerY) {
          highestActive = idx + 1;
        }
      }

      setActiveCount((prev) => Math.max(prev, highestActive));
    };

    const scheduleEval = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(evaluateWords);
    };

    scheduleEval();
    window.addEventListener("scroll", scheduleEval, { passive: true });
    window.addEventListener("resize", scheduleEval, { passive: true });

    return () => {
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleEval);
      window.removeEventListener("resize", scheduleEval);
    };
  }, []);

  return (
    <section
      aria-label="Core value statement"
      className="bg-[#131209] py-12 sm:py-16 md:py-24 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#181818] border border-[#272727] p-6 sm:p-12 md:p-16">
        <p className="caption-3 uppercase tracking-wider text-[#9B9B9B] mb-6">
          Built for lab speed
        </p>
        <h2 className="heading-2 max-w-[680px] text-[#FFFFFF]">
          {TAGLINE_LINES.map((line, lineIdx) => (
            <span key={lineIdx} className="block mb-2 last:mb-0">
              {line.map(({ word, index }) => {
                const isRevealed = index < activeCount;
                return (
                  <span
                    key={index}
                    ref={(el) => {
                      wordRefs.current[index] = el;
                    }}
                    className={`inline-block mr-2 sm:mr-3 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 ${
                      isRevealed ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
