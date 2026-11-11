"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Cpu,
  FlowArrow,
  Lightning,
} from "@phosphor-icons/react";
import { EXPERIMENTS } from "@/data/experiments";
import { useCopyClipboard } from "@/lib/useCopyClipboard";

import type { StudioTab } from "@/components/LabWorkbench";

const FEATURED_IDS = ["ex-01", "ex-12a", "ex-14"];

interface HeroPreviewProps {
  onSelectExperiment: (id: string, tab?: StudioTab) => void;
}

export function HeroPreview({ onSelectExperiment }: HeroPreviewProps) {
  const featured = EXPERIMENTS.filter((e) => FEATURED_IDS.includes(e.id));
  const [activeId, setActiveId] = useState<string>(featured[0]?.id ?? "ex-01");
  const { copiedKey, errorMsg, copyText } = useCopyClipboard();

  const current =
    featured.find((item) => item.id === activeId) ?? EXPERIMENTS[0];
  const isCopied = copiedKey === `hero-${current.id}`;
  const snippet = current.code.split("\n").slice(0, 12).join("\n");

  return (
    <div className="rounded-3xl bg-[#181818] border border-[#272727] p-3">
      <div className="rounded-xl bg-[#1F1F1F] border border-[#313131] p-3 sm:p-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {featured.map((exp) => {
              const selected = exp.id === current.id;
              return (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setActiveId(exp.id)}
                  className={`button-xsm rounded-lg border px-3 py-1.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
                    selected
                      ? "bg-[#313131] border-[#313131] text-[#FFFFFF]"
                      : "bg-[#181818] border-[#272727] text-[#9B9B9B] hover:text-[#FFFFFF]"
                  }`}
                >
                  <span className="font-mono">{exp.codeLabel}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="caption-4 inline-flex items-center gap-1.5 rounded-lg bg-[#181818] border border-[#272727] px-2.5 py-1 text-[#D4D4D4]">
              {current.gpuRequired ? (
                <Lightning
                  size={14}
                  weight="fill"
                  className="text-[#FBBF24]"
                  aria-hidden="true"
                />
              ) : (
                <Cpu
                  size={14}
                  className="text-[#34D399]"
                  aria-hidden="true"
                />
              )}
              <span>{current.runtime}</span>
            </span>

            <button
              type="button"
              onClick={() => copyText(current.code, `hero-${current.id}`)}
              className="button-xsm inline-flex items-center gap-1.5 rounded-lg bg-[#FFFFFF] text-[#000000] px-3 py-1.5 hover:bg-[#D4D4D4] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
            >
              {isCopied ? (
                <Check size={14} weight="bold" aria-hidden="true" />
              ) : (
                <Copy size={14} weight="bold" aria-hidden="true" />
              )}
              <span>{isCopied ? "Copied cell" : "Copy cell"}</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <p
            role="alert"
            className="caption-2 mb-4 rounded-lg bg-[#131209] border border-[#313131] px-3 py-2 text-[#FBBF24]"
          >
            {errorMsg}
          </p>
        )}

        {/* Title & Architecture pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-5 min-w-0 flex flex-col justify-between gap-4 rounded-lg bg-[#181818] border border-[#272727] p-3 sm:p-4">
            <div>
              <p className="caption-4 font-mono text-[#9B9B9B] mb-1">
                {current.category}
              </p>
              <h2 className="title-2 text-[#FFFFFF] mb-2">{current.title}</h2>
              <p className="body-6 text-[#9B9B9B]">{current.aim}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 caption-3 text-[#D4D4D4] mb-2">
                <FlowArrow size={14} aria-hidden="true" />
                <span>Layer topology</span>
              </div>
              <div className="flex flex-col gap-2">
                {current.layers.slice(0, 4).map((layer, index) => (
                  <div
                    key={`${layer.name}-${index}`}
                    className="flex items-center justify-between gap-2 rounded bg-[#1F1F1F] border border-[#272727] px-3 py-2"
                  >
                    <span className="caption-3 font-mono text-[#FFFFFF]">
                      {layer.name}
                    </span>
                    <span className="caption-5 font-mono text-[#9B9B9B] truncate">
                      {layer.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSelectExperiment(current.id, "code")}
                className="button-xsm w-full rounded-lg bg-[#272727] border border-[#313131] text-[#FFFFFF] py-2 px-3 hover:bg-[#313131] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
              >
                Full {current.lineCount} line cell
              </button>
              <button
                type="button"
                onClick={() => onSelectExperiment(current.id, "viva")}
                className="button-xsm w-full rounded-lg bg-[#1F1F1F] border border-[#272727] text-[#D4D4D4] py-2 px-3 hover:bg-[#272727] hover:text-[#FFFFFF] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
              >
                {current.algorithm.length} steps · {current.vivaQuestions.length} viva Qs
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 min-w-0 rounded-lg bg-[#000000] border border-[#272727] p-3 sm:p-4 overflow-hidden flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="caption-4 font-mono text-[#9B9B9B] truncate">
                keras_cell_{current.id.replace("-", "_")}.py
              </span>
              <span className="caption-5 font-mono text-[#9B9B9B]">
                {current.optimizer} · {current.epochs} epochs
              </span>
            </div>
            <pre className="lab-scroll overflow-x-auto text-xs leading-5 text-[#D4D4D4] font-mono">
              <code>{snippet}</code>
            </pre>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded bg-[#181818] border border-[#272727] px-3 py-2">
              <span className="caption-5 text-[#9B9B9B]">
                Dataset: {current.datasetName}
              </span>
              <span className="caption-5 font-mono text-[#D4D4D4]">
                Seed {current.seed} · Batch {current.batchSize}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
