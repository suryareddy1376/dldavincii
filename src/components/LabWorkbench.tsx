"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code,
  Copy,
  Cpu,
  Database,
  DownloadSimple,
  FlowArrow,
  Function as FunctionIcon,
  GraduationCap,
  Lightning,
  ListNumbers,
  MagnifyingGlass,
  Stack,
  Terminal,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  EXPERIMENTS,
  SETUP_COMMAND,
  type ExperimentCategory,
  type LayerKind,
} from "@/data/experiments";
import {
  buildAllPythonBundle,
  triggerTextDownload,
} from "@/lib/notebookExport";
import { useCopyClipboard } from "@/lib/useCopyClipboard";
import { CodeViewer } from "@/components/CodeViewer";
import { AlgorithmPanel } from "@/components/AlgorithmPanel";
import { VivaPanel } from "@/components/VivaPanel";
import { MathPlayground } from "@/components/MathPlayground";

export type StudioTab = "code" | "algorithm" | "viva" | "architecture" | "math";

const CATEGORIES: Array<"All" | ExperimentCategory> = [
  "All",
  "Perceptrons & MLPs",
  "CNNs & Vision",
  "Regularization & Optimizers",
  "Sequences & Forecasting",
];

const LAYER_KIND_LABELS: Record<LayerKind, string> = {
  input: "Input tensor",
  conv: "Convolution",
  pool: "Pooling",
  dense: "Dense layer",
  recurrent: "Recurrent",
  norm: "Normalization",
  aug: "Augmentation",
  output: "Output head",
};

interface LabWorkbenchProps {
  selectedId: string;
  onSelectId: (id: string) => void;
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
}

export function LabWorkbench({
  selectedId,
  onSelectId,
  activeTab,
  onTabChange,
}: LabWorkbenchProps) {
  const [category, setCategory] = useState<"All" | ExperimentCategory>("All");
  const [gpuOnly, setGpuOnly] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);

  const { copiedKey, errorMsg, copyText, clearError } = useCopyClipboard();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXPERIMENTS.filter((exp) => {
      if (category !== "All" && exp.category !== category) return false;
      if (gpuOnly && !exp.gpuRequired) return false;
      if (!q) return true;
      const haystack = [
        exp.codeLabel,
        exp.title,
        exp.aim,
        exp.datasetName,
        exp.modelType,
        exp.optimizer,
        exp.loss,
        exp.algorithm.join(" "),
        exp.vivaQuestions.map((v) => `${v.question} ${v.answer}`).join(" "),
        exp.code,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [category, gpuOnly, query]);

  const activeExperiment = useMemo(() => {
    return (
      filtered.find((e) => e.id === selectedId) ??
      EXPERIMENTS.find((e) => e.id === selectedId) ??
      filtered[0] ??
      EXPERIMENTS[0]
    );
  }, [filtered, selectedId]);

  const activeFilteredIndex = filtered.findIndex(
    (e) => e.id === activeExperiment.id
  );

  // Keyboard shortcuts: '/' searches, 'j'/'k' navigates experiments
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (e.key === "/" && !isInput) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (isInput || filtered.length === 0) return;

      if (e.key === "j" || e.key === "J") {
        const nextIdx =
          activeFilteredIndex >= 0
            ? (activeFilteredIndex + 1) % filtered.length
            : 0;
        onSelectId(filtered[nextIdx].id);
      } else if (e.key === "k" || e.key === "K") {
        const prevIdx =
          activeFilteredIndex >= 0
            ? (activeFilteredIndex - 1 + filtered.length) % filtered.length
            : 0;
        onSelectId(filtered[prevIdx].id);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeFilteredIndex, filtered, onSelectId]);

  const resetFilters = () => {
    setCategory("All");
    setGpuOnly(false);
    setQuery("");
  };

  const stepExperiment = (direction: -1 | 1) => {
    if (filtered.length === 0) return;
    const base = activeFilteredIndex >= 0 ? activeFilteredIndex : 0;
    const next = (base + direction + filtered.length) % filtered.length;
    onSelectId(filtered[next].id);
  };

  const allPythonText = useMemo(
    () => buildAllPythonBundle(SETUP_COMMAND, EXPERIMENTS),
    []
  );

  return (
    <section
      id="workbench"
      aria-label="Interactive Deep Learning Lab Workbench"
      className="py-12 md:py-16 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-6xl flex flex-col gap-6">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-[680px]">
            <p className="caption-3 uppercase tracking-wider text-[#9B9B9B] mb-2">
              Interactive code studio
            </p>
            <h2 className="heading-3 text-[#FFFFFF] mb-2">
              All sixteen Keras 3 cells in one place
            </h2>
            <p className="body-3 text-[#9B9B9B]">
              Pick an experiment, verify dataset and GPU requirements, then copy
              the exact runnable Python script straight into Colab or Jupyter.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full md:w-auto">
            <a
              href="/DL_Lab_All_Experiments_Keras.ipynb"
              download="DL_Lab_All_Experiments_Keras.ipynb"
              className="button-sm inline-flex items-center justify-center gap-2 rounded-lg bg-[#1F1F1F] border border-[#313131] text-[#FFFFFF] px-3 py-2 hover:bg-[#272727] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
            >
              <DownloadSimple size={16} aria-hidden="true" />
              <span>Download .ipynb</span>
            </a>

            <button
              type="button"
              onClick={() =>
                triggerTextDownload(
                  "dl_lab_all_experiments.py",
                  allPythonText
                )
              }
              className="button-sm inline-flex items-center justify-center gap-2 rounded-lg bg-[#1F1F1F] border border-[#313131] text-[#FFFFFF] px-3 py-2 hover:bg-[#272727] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
            >
              <DownloadSimple size={16} aria-hidden="true" />
              <span>Export all .py</span>
            </button>

            <button
              type="button"
              onClick={() => copyText(allPythonText, "all-cells")}
              className="button-sm col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#272727] border border-[#313131] text-[#FFFFFF] px-3 py-2 hover:bg-[#313131] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
            >
              {copiedKey === "all-cells" ? (
                <Check size={16} weight="bold" aria-hidden="true" />
              ) : (
                <Copy size={16} aria-hidden="true" />
              )}
              <span>
                {copiedKey === "all-cells" ? "Copied all" : "Copy all 16"}
              </span>
            </button>
          </div>
        </div>

        {/* Setup pip bar */}
        <div className="rounded-2xl bg-[#181818] border border-[#272727] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#272727] border border-[#313131] text-[#34D399]">
              <Terminal size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="caption-4 text-[#9B9B9B]">
                Colab setup cell (needed for Ex 11 and Ex 14)
              </p>
              <code className="lab-scroll block overflow-x-auto whitespace-nowrap text-xs sm:text-sm font-mono text-[#FFFFFF] pb-1 sm:pb-0">
                {SETUP_COMMAND}
              </code>
            </div>
          </div>

          <button
            type="button"
            onClick={() => copyText(SETUP_COMMAND, "setup-cmd")}
            className="button-sm w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#272727] border border-[#313131] text-[#FFFFFF] px-3 py-2 hover:bg-[#313131] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
          >
            {copiedKey === "setup-cmd" ? (
              <Check size={16} weight="bold" aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            <span>
              {copiedKey === "setup-cmd" ? "Copied setup" : "Copy setup"}
            </span>
          </button>
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

        {/* Outer workbench shell */}
        <div className="rounded-3xl bg-[#181818] border border-[#272727] p-3 sm:p-4 flex flex-col gap-4">
          {/* Search and filters */}
          <div className="flex flex-col gap-3 rounded-xl bg-[#1F1F1F] border border-[#272727] p-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MagnifyingGlass
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]"
                />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search datasets, layers, optimizers, or code (press /)"
                  aria-label="Search experiments"
                  className="body-6 w-full rounded-lg bg-[#181818] border border-[#272727] pl-9 pr-9 py-2 text-[#FFFFFF] placeholder:text-[#737373] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#9B9B9B] hover:text-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setGpuOnly((v) => !v)}
                aria-pressed={gpuOnly}
                className={`button-sm shrink-0 inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
                  gpuOnly
                    ? "bg-[#313131] border-[#313131] text-[#FBBF24]"
                    : "bg-[#181818] border-[#272727] text-[#D4D4D4] hover:text-[#FFFFFF]"
                }`}
              >
                <Lightning
                  size={16}
                  weight={gpuOnly ? "fill" : "regular"}
                  aria-hidden="true"
                />
                <span>GPU workloads (4)</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => {
                const selected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`button-xsm rounded-lg border px-3 py-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
                      selected
                        ? "bg-[#FFFFFF] border-[#FFFFFF] text-[#000000]"
                        : "bg-[#181818] border-[#272727] text-[#9B9B9B] hover:text-[#FFFFFF]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Empty state vs Studio split */}
          {filtered.length === 0 ? (
            <div className="rounded-xl bg-[#1F1F1F] border border-[#272727] p-8 sm:p-12 text-center flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#272727] border border-[#313131] text-[#9B9B9B]">
                <MagnifyingGlass size={24} aria-hidden="true" />
              </div>
              <h3 className="heading-6 text-[#FFFFFF]">
                No experiments match those filters
              </h3>
              <p className="body-6 text-[#9B9B9B] max-w-md">
                Clear the search keyword or switch back to all categories to
                view all 16 Keras 3 cells.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="button-sm mt-2 rounded-lg bg-[#FFFFFF] text-[#000000] px-3 py-2 hover:bg-[#D4D4D4] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Left rail */}
              <aside
                aria-label="Experiment index"
                className="lg:col-span-4 min-w-0 rounded-xl bg-[#1F1F1F] border border-[#272727] p-2"
              >
                <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                  <span className="caption-3 text-[#D4D4D4]">
                    {filtered.length} of {EXPERIMENTS.length} experiments
                  </span>
                  <span className="hidden lg:inline caption-5 font-mono text-[#9B9B9B]">
                    J / K to step
                  </span>
                  <span className="lg:hidden caption-5 font-mono text-[#9B9B9B]">
                    Quick jump
                  </span>
                </div>

                {/* Mobile quick jump selector */}
                <div className="lg:hidden mb-2">
                  <label htmlFor="mobile-experiment-select" className="sr-only">
                    Jump to experiment
                  </label>
                  <select
                    id="mobile-experiment-select"
                    value={activeExperiment.id}
                    onChange={(e) => onSelectId(e.target.value)}
                    className="body-6 w-full rounded-lg bg-[#181818] border border-[#272727] px-3 py-2 text-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
                  >
                    {filtered.map((exp) => (
                      <option key={exp.id} value={exp.id}>
                        {exp.codeLabel} · {exp.title}
                      </option>
                    ))}
                  </select>
                </div>

                <ul className="lab-scroll flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:max-h-[720px] lg:overflow-y-auto pb-1 lg:pb-0">
                  {filtered.map((exp) => {
                    const isSelected = exp.id === activeExperiment.id;
                    return (
                      <li
                        key={exp.id}
                        className="shrink-0 w-56 sm:w-64 lg:w-full"
                      >
                        <button
                          type="button"
                          onClick={() => onSelectId(exp.id)}
                          aria-current={isSelected ? "true" : undefined}
                          className={`w-full text-left rounded-lg border p-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
                            isSelected
                              ? "bg-[#272727] border-[#313131] text-[#FFFFFF]"
                              : "bg-[#181818] border-[#272727] text-[#D4D4D4] hover:bg-[#272727]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="caption-3 font-mono text-[#FFFFFF]">
                              {exp.codeLabel}
                            </span>
                            <span
                              className={`caption-5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 border ${
                                exp.gpuRequired
                                  ? "bg-[#131209] border-[#313131] text-[#FBBF24]"
                                  : "bg-[#1F1F1F] border-[#272727] text-[#9B9B9B]"
                              }`}
                            >
                              {exp.gpuRequired ? (
                                <Lightning
                                  size={12}
                                  weight="fill"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Cpu size={12} aria-hidden="true" />
                              )}
                              <span>{exp.gpuRequired ? "GPU" : "CPU"}</span>
                            </span>
                          </div>
                          <p className="title-4 text-[#FFFFFF] line-clamp-1 mb-1">
                            {exp.title}
                          </p>
                          <p className="caption-5 text-[#9B9B9B] line-clamp-1">
                            {exp.datasetName} · {exp.lineCount} lines
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              {/* Right active studio */}
              <div className="lg:col-span-8 rounded-xl bg-[#1F1F1F] border border-[#272727] p-3 sm:p-6 flex flex-col gap-4 min-w-0">
                {/* Active header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="caption-3 font-mono rounded bg-[#272727] border border-[#313131] px-2 py-0.5 text-[#FFFFFF]">
                        {activeExperiment.codeLabel}
                      </span>
                      <span className="caption-4 rounded bg-[#181818] border border-[#272727] px-2 py-0.5 text-[#D4D4D4]">
                        {activeExperiment.category}
                      </span>
                      <span
                        className={`caption-4 inline-flex items-center gap-1 rounded border px-2 py-0.5 ${
                          activeExperiment.gpuRequired
                            ? "bg-[#131209] border-[#313131] text-[#FBBF24]"
                            : "bg-[#181818] border-[#272727] text-[#34D399]"
                        }`}
                      >
                        {activeExperiment.gpuRequired ? (
                          <Lightning
                            size={12}
                            weight="fill"
                            aria-hidden="true"
                          />
                        ) : (
                          <Cpu size={12} aria-hidden="true" />
                        )}
                        <span>{activeExperiment.runtime}</span>
                      </span>
                    </div>

                    <h3 className="heading-5 text-[#FFFFFF] mb-1">
                      {activeExperiment.title}
                    </h3>
                    <p className="body-6 text-[#9B9B9B]">
                      {activeExperiment.aim}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => stepExperiment(-1)}
                      aria-label="Previous experiment"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#181818] border border-[#272727] px-3 py-2 text-[#D4D4D4] hover:bg-[#272727] hover:text-[#FFFFFF] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
                    >
                      <ArrowLeft size={16} aria-hidden="true" />
                      <span className="button-xsm sm:sr-only">Prev</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => stepExperiment(1)}
                      aria-label="Next experiment"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#181818] border border-[#272727] px-3 py-2 text-[#D4D4D4] hover:bg-[#272727] hover:text-[#FFFFFF] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
                    >
                      <span className="button-xsm sm:sr-only">Next</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Spec grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <div className="rounded-lg bg-[#181818] border border-[#272727] p-3 min-w-0">
                    <p className="caption-5 text-[#9B9B9B] mb-1">Dataset</p>
                    <p className="caption-3 text-[#FFFFFF] line-clamp-1">
                      {activeExperiment.datasetName}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#181818] border border-[#272727] p-3 min-w-0">
                    <p className="caption-5 text-[#9B9B9B] mb-1">Optimizer</p>
                    <p className="caption-3 font-mono text-[#FFFFFF] line-clamp-1">
                      {activeExperiment.optimizer}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#181818] border border-[#272727] p-3 min-w-0">
                    <p className="caption-5 text-[#9B9B9B] mb-1">Loss</p>
                    <p className="caption-3 font-mono text-[#FFFFFF] line-clamp-1">
                      {activeExperiment.loss}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#181818] border border-[#272727] p-3 min-w-0">
                    <p className="caption-5 text-[#9B9B9B] mb-1">
                      Epochs &amp; Batch
                    </p>
                    <p className="caption-3 font-mono text-[#FFFFFF] line-clamp-1">
                      {activeExperiment.epochs} · b={activeExperiment.batchSize}
                    </p>
                  </div>
                </div>

                {/* Mode tabs */}
                <div
                  role="tablist"
                  aria-label="Experiment studio views"
                  className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 rounded-xl bg-[#181818] border border-[#272727] p-1"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "code"}
                    onClick={() => onTabChange("code")}
                    className={`button-sm inline-flex items-center justify-center sm:justify-start gap-2 rounded-lg px-3 py-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
                      activeTab === "code"
                        ? "bg-[#272727] text-[#FFFFFF]"
                        : "text-[#9B9B9B] hover:text-[#FFFFFF]"
                    }`}
                  >
                    <Code size={16} aria-hidden="true" />
                    <span>Python code</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "algorithm"}
                    onClick={() => onTabChange("algorithm")}
                    className={`button-sm inline-flex items-center justify-center sm:justify-start gap-2 rounded-lg px-3 py-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
                      activeTab === "algorithm"
                        ? "bg-[#272727] text-[#FFFFFF]"
                        : "text-[#9B9B9B] hover:text-[#FFFFFF]"
                    }`}
                  >
                    <ListNumbers size={16} aria-hidden="true" />
                    <span>Algorithm</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "viva"}
                    onClick={() => onTabChange("viva")}
                    className={`button-sm inline-flex items-center justify-center sm:justify-start gap-2 rounded-lg px-3 py-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
                      activeTab === "viva"
                        ? "bg-[#272727] text-[#FFFFFF]"
                        : "text-[#9B9B9B] hover:text-[#FFFFFF]"
                    }`}
                  >
                    <GraduationCap size={16} aria-hidden="true" />
                    <span>
                      Viva Q&amp;A ({activeExperiment.vivaQuestions.length})
                    </span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "architecture"}
                    onClick={() => onTabChange("architecture")}
                    className={`button-sm inline-flex items-center justify-center sm:justify-start gap-2 rounded-lg px-3 py-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
                      activeTab === "architecture"
                        ? "bg-[#272727] text-[#FFFFFF]"
                        : "text-[#9B9B9B] hover:text-[#FFFFFF]"
                    }`}
                  >
                    <FlowArrow size={16} aria-hidden="true" />
                    <span>Layers &amp; data</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "math"}
                    onClick={() => onTabChange("math")}
                    className={`button-sm col-span-2 sm:col-span-1 inline-flex items-center justify-center sm:justify-start gap-2 rounded-lg px-3 py-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
                      activeTab === "math"
                        ? "bg-[#272727] text-[#FFFFFF]"
                        : "text-[#9B9B9B] hover:text-[#FFFFFF]"
                    }`}
                  >
                    <FunctionIcon size={16} aria-hidden="true" />
                    <span>Math lab</span>
                  </button>
                </div>

                {/* Tab Panels */}
                {activeTab === "code" && (
                  <CodeViewer experiment={activeExperiment} />
                )}

                {activeTab === "algorithm" && (
                  <AlgorithmPanel experiment={activeExperiment} />
                )}

                {activeTab === "viva" && (
                  <VivaPanel experiment={activeExperiment} />
                )}

                {activeTab === "architecture" && (
                  <div className="flex flex-col gap-4 min-w-0">
                    <div className="rounded-2xl bg-[#181818] border border-[#272727] p-3 sm:p-4 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Stack
                            size={18}
                            className="text-[#FFFFFF] shrink-0"
                            aria-hidden="true"
                          />
                          <h4 className="title-3 text-[#FFFFFF] break-words">
                            Model topology: {activeExperiment.modelType}
                          </h4>
                        </div>
                        <span className="caption-4 font-mono text-[#9B9B9B]">
                          Seed {activeExperiment.seed}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {activeExperiment.layers.map((layer, index) => (
                          <div
                            key={`${layer.name}-${index}`}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#1F1F1F] border border-[#272727] px-3 py-2"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="caption-5 font-mono w-6 shrink-0 text-center rounded bg-[#272727] py-0.5 text-[#D4D4D4]">
                                {index + 1}
                              </span>
                              <span className="title-4 font-mono text-[#FFFFFF] break-all">
                                {layer.name}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 min-w-0">
                              <span className="caption-5 text-[#9B9B9B]">
                                {LAYER_KIND_LABELS[layer.kind]}
                              </span>
                              <span className="caption-4 font-mono rounded bg-[#181818] border border-[#272727] px-2 py-0.5 text-[#38BDF8] break-words">
                                {layer.detail}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#181818] border border-[#272727] p-4 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Database
                            size={16}
                            className="text-[#34D399] shrink-0"
                            aria-hidden="true"
                          />
                          <h4 className="title-4 text-[#FFFFFF]">
                            Dataset provisioning ({activeExperiment.datasetSetup})
                          </h4>
                        </div>
                        <p className="body-6 text-[#9B9B9B] break-words">
                          {activeExperiment.datasetNotes}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#181818] border border-[#272727] p-4 min-w-0">
                        <h4 className="title-4 text-[#FFFFFF] mb-2">
                          Implementation highlights
                        </h4>
                        <ul className="flex flex-col gap-2">
                          {activeExperiment.highlights.map((note, idx) => (
                            <li
                              key={idx}
                              className="body-6 text-[#9B9B9B] flex items-start gap-2"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4D4D4]"
                              />
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "math" && <MathPlayground />}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
