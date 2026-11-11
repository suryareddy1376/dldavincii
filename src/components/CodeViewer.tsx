"use client";

import { useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  DownloadSimple,
  Hash,
  WarningCircle,
} from "@phosphor-icons/react";
import {
  extractCodeSections,
  tokenizePythonLine,
  type TokenKind,
} from "@/lib/pythonHighlighter";
import {
  buildSinglePythonFile,
  triggerTextDownload,
} from "@/lib/notebookExport";
import type { ExperimentItem } from "@/data/experiments";
import { useCopyClipboard } from "@/lib/useCopyClipboard";

const TOKEN_CLASSES: Record<TokenKind, string> = {
  comment: "text-[#737373]",
  string: "text-[#A3E635]",
  keyword: "text-[#F472B6]",
  keras: "text-[#38BDF8]",
  number: "text-[#FBBF24]",
  magic: "text-[#34D399]",
  plain: "text-[#E5E5E5]",
};

interface CodeViewerProps {
  experiment: ExperimentItem;
}

export function CodeViewer({ experiment }: CodeViewerProps) {
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const codeBlockRef = useRef<HTMLPreElement | null>(null);
  const lineRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const { copiedKey, errorMsg, copyText, clearError } = useCopyClipboard();

  const lines = useMemo(
    () => experiment.code.split("\n"),
    [experiment.code]
  );

  const sections = useMemo(
    () => extractCodeSections(experiment.code),
    [experiment.code]
  );

  const isCopied = copiedKey === `cell-${experiment.id}`;

  const handleSelectAll = () => {
    const node = codeBlockRef.current;
    if (!node) return;
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const jumpToLine = (lineNumber: number) => {
    setHighlightedLine(lineNumber);
    const target = lineRefs.current[lineNumber];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Action strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#1F1F1F] border border-[#272727] p-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLineNumbers((v) => !v)}
            aria-pressed={showLineNumbers}
            className={`button-xsm inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
              showLineNumbers
                ? "bg-[#272727] border-[#313131] text-[#FFFFFF]"
                : "bg-[#181818] border-[#272727] text-[#9B9B9B] hover:text-[#FFFFFF]"
            }`}
          >
            <Hash size={14} aria-hidden="true" />
            <span>Lines</span>
          </button>

          <button
            type="button"
            onClick={handleSelectAll}
            className="button-xsm rounded-lg bg-[#181818] border border-[#272727] text-[#D4D4D4] px-2.5 py-1.5 hover:bg-[#272727] hover:text-[#FFFFFF] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
          >
            Select all
          </button>

          <span className="caption-5 font-mono text-[#9B9B9B] px-2">
            {experiment.lineCount} lines · {experiment.code.length} chars
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              triggerTextDownload(
                `${experiment.id}.py`,
                buildSinglePythonFile(experiment)
              )
            }
            className="button-xsm inline-flex items-center gap-1.5 rounded-lg bg-[#181818] border border-[#272727] text-[#D4D4D4] px-3 py-1.5 hover:bg-[#272727] hover:text-[#FFFFFF] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
          >
            <DownloadSimple size={14} aria-hidden="true" />
            <span>Download .py</span>
          </button>

          <button
            type="button"
            onClick={() => copyText(experiment.code, `cell-${experiment.id}`)}
            className="button-sm inline-flex items-center gap-1.5 rounded-lg bg-[#FFFFFF] text-[#000000] px-3 py-2 hover:bg-[#D4D4D4] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
          >
            {isCopied ? (
              <Check size={16} weight="bold" aria-hidden="true" />
            ) : (
              <Copy size={16} weight="bold" aria-hidden="true" />
            )}
            <span>
              {isCopied
                ? `Copied ${experiment.lineCount} lines`
                : "Copy Python cell"}
            </span>
          </button>
        </div>
      </div>

      {/* Inline clipboard error banner (B9) */}
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

      {/* Jump pills */}
      {sections.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="caption-4 text-[#9B9B9B]">Steps:</span>
          {sections.map((sec) => (
            <button
              key={sec.line}
              type="button"
              onClick={() => jumpToLine(sec.line)}
              className={`caption-4 rounded-lg border px-2.5 py-1 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
                highlightedLine === sec.line
                  ? "bg-[#272727] border-[#313131] text-[#FFFFFF]"
                  : "bg-[#181818] border-[#272727] text-[#9B9B9B] hover:text-[#FFFFFF]"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      )}

      {/* Verbatim syntax highlighted Python block */}
      <div className="rounded-2xl bg-[#000000] border border-[#272727] p-2">
        <pre
          ref={codeBlockRef}
          className="lab-scroll max-h-[540px] overflow-auto rounded-lg bg-[#000000] p-3 text-xs sm:text-sm leading-6 font-mono"
        >
          <code>
            {lines.map((line, idx) => {
              const lineNumber = idx + 1;
              const isHighlighted = highlightedLine === lineNumber;
              const tokens = tokenizePythonLine(line);
              return (
                <div
                  key={lineNumber}
                  ref={(el) => {
                    lineRefs.current[lineNumber] = el;
                  }}
                  className={`flex gap-3 rounded px-1.5 ${
                    isHighlighted ? "bg-[#272727]" : "hover:bg-[#181818]"
                  }`}
                >
                  {showLineNumbers && (
                    <span
                      aria-hidden="true"
                      className="select-none w-8 shrink-0 text-right text-[#737373]"
                    >
                      {lineNumber}
                    </span>
                  )}
                  <span className="whitespace-pre">
                    {tokens.length === 0
                      ? " "
                      : tokens.map((tok, tIdx) => (
                          <span key={tIdx} className={TOKEN_CLASSES[tok.kind]}>
                            {tok.text}
                          </span>
                        ))}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
