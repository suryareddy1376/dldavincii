"use client";

import { useState } from "react";
import {
  CaretDown,
  Check,
  Copy,
  Eye,
  EyeSlash,
  GraduationCap,
  WarningCircle,
} from "@phosphor-icons/react";
import type { ExperimentItem } from "@/data/experiments";
import { buildVivaText } from "@/lib/notebookExport";
import { useCopyClipboard } from "@/lib/useCopyClipboard";

interface VivaPanelProps {
  experiment: ExperimentItem;
}

export function VivaPanel({ experiment }: VivaPanelProps) {
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const { copiedKey, errorMsg, copyText, clearError } = useCopyClipboard();

  const vivaText = buildVivaText(experiment);
  const isCopied = copiedKey === `viva-${experiment.id}`;

  const getKey = (idx: number) => `${experiment.id}-q-${idx}`;

  const allRevealed = experiment.vivaQuestions.every((_, idx) =>
    Boolean(revealedKeys[getKey(idx)])
  );

  const toggleAll = () => {
    const nextState = !allRevealed;
    const updates: Record<string, boolean> = {};
    experiment.vivaQuestions.forEach((_, idx) => {
      updates[getKey(idx)] = nextState;
    });
    setRevealedKeys((prev) => ({ ...prev, ...updates }));
  };

  const toggleOne = (idx: number) => {
    const key = getKey(idx);
    setRevealedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Top toolbar */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2 rounded-xl bg-[#181818] border border-[#272727] p-2">
        <div className="flex items-center gap-2 px-2">
          <GraduationCap
            size={18}
            className="text-[#FBBF24] shrink-0"
            aria-hidden="true"
          />
          <span className="title-4 text-[#FFFFFF]">
            Most important viva questions ({experiment.vivaQuestions.length})
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={toggleAll}
            className="button-xsm flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1F1F1F] border border-[#272727] text-[#D4D4D4] px-3 py-2 hover:bg-[#272727] hover:text-[#FFFFFF] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
          >
            {allRevealed ? (
              <EyeSlash size={14} aria-hidden="true" />
            ) : (
              <Eye size={14} aria-hidden="true" />
            )}
            <span>{allRevealed ? "Hide all answers" : "Show all answers"}</span>
          </button>

          <button
            type="button"
            onClick={() => copyText(vivaText, `viva-${experiment.id}`)}
            className="button-sm flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#FFFFFF] text-[#000000] px-3 py-2 hover:bg-[#D4D4D4] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
          >
            {isCopied ? (
              <Check size={16} weight="bold" aria-hidden="true" />
            ) : (
              <Copy size={16} weight="bold" aria-hidden="true" />
            )}
            <span>{isCopied ? "Copied viva Q&A" : "Copy viva Q&A"}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#131209] border border-[#313131] p-3"
        >
          <div className="flex items-center gap-2 text-[#FBBF24]">
            <WarningCircle size={18} aria-hidden="true" />
            <span className="body-6">{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={clearError}
            className="button-xsm rounded-lg bg-[#272727] border border-[#313131] text-[#FFFFFF] px-2.5 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Self quiz prompt */}
      <p className="caption-2 text-[#9B9B9B] px-1">
        Click any question to reveal its answer for self testing, or reveal all
        answers before copying.
      </p>

      {/* Questions list */}
      <div className="flex flex-col gap-2">
        {experiment.vivaQuestions.map((item, idx) => {
          const isOpen = Boolean(revealedKeys[getKey(idx)]);
          return (
            <div
              key={`${experiment.id}-${idx}`}
              className="rounded-2xl bg-[#181818] border border-[#272727] p-2"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleOne(idx)}
                className="w-full flex items-start justify-between gap-3 rounded-lg bg-[#1F1F1F] px-3 py-3 sm:px-4 text-left hover:bg-[#272727] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="caption-3 font-mono shrink-0 mt-0.5 rounded bg-[#272727] border border-[#313131] px-2 py-0.5 text-[#FBBF24]">
                    Q{idx + 1}
                  </span>
                  <span className="title-4 text-[#FFFFFF] min-w-0 break-words">
                    {item.question}
                  </span>
                </div>
                <CaretDown
                  size={16}
                  aria-hidden="true"
                  className={`shrink-0 mt-1 text-[#9B9B9B] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "rotate-180 text-[#FFFFFF]" : "rotate-0"
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-3 pt-3 pb-2 sm:px-4 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  <p className="body-6 text-[#D4D4D4] break-words">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
