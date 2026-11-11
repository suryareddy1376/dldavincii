"use client";

import {
  Check,
  Copy,
  DownloadSimple,
  ListNumbers,
  WarningCircle,
} from "@phosphor-icons/react";
import type { ExperimentItem } from "@/data/experiments";
import {
  buildAlgorithmText,
  buildLabRecordMarkdown,
  triggerTextDownload,
} from "@/lib/notebookExport";
import { useCopyClipboard } from "@/lib/useCopyClipboard";

interface AlgorithmPanelProps {
  experiment: ExperimentItem;
}

export function AlgorithmPanel({ experiment }: AlgorithmPanelProps) {
  const { copiedKey, errorMsg, copyText, clearError } = useCopyClipboard();

  const algoText = buildAlgorithmText(experiment);
  const isCopied = copiedKey === `algo-${experiment.id}`;

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Top control strip */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2 rounded-xl bg-[#181818] border border-[#272727] p-2">
        <div className="flex items-center gap-2 px-2">
          <ListNumbers
            size={18}
            className="text-[#38BDF8] shrink-0"
            aria-hidden="true"
          />
          <span className="title-4 text-[#FFFFFF]">
            Stepwise algorithm ({experiment.algorithm.length} steps)
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() =>
              triggerTextDownload(
                `${experiment.id}_lab_sheet.md`,
                buildLabRecordMarkdown(experiment),
                "text/markdown;charset=utf-8"
              )
            }
            className="button-xsm flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1F1F1F] border border-[#272727] text-[#D4D4D4] px-3 py-2 hover:bg-[#272727] hover:text-[#FFFFFF] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
          >
            <DownloadSimple size={14} aria-hidden="true" />
            <span>Study sheet .md</span>
          </button>

          <button
            type="button"
            onClick={() => copyText(algoText, `algo-${experiment.id}`)}
            className="button-sm flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#FFFFFF] text-[#000000] px-3 py-2 hover:bg-[#D4D4D4] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
          >
            {isCopied ? (
              <Check size={16} weight="bold" aria-hidden="true" />
            ) : (
              <Copy size={16} weight="bold" aria-hidden="true" />
            )}
            <span>{isCopied ? "Copied algorithm" : "Copy algorithm"}</span>
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

      {/* Aim summary */}
      <div className="rounded-xl bg-[#181818] border border-[#272727] p-4">
        <p className="caption-4 uppercase tracking-wider text-[#9B9B9B] mb-1">
          Objective
        </p>
        <p className="body-5 text-[#FFFFFF]">{experiment.aim}</p>
      </div>

      {/* Numbered algorithm steps */}
      <div className="rounded-2xl bg-[#181818] border border-[#272727] p-3">
        <ol className="flex flex-col gap-2">
          {experiment.algorithm.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-lg bg-[#1F1F1F] border border-[#272727] p-3"
            >
              <span className="caption-3 font-mono shrink-0 rounded bg-[#272727] border border-[#313131] px-2 py-0.5 text-[#38BDF8]">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="body-6 text-[#D4D4D4] min-w-0 break-words">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
