"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Code,
  Cpu,
  DownloadSimple,
  FlowArrow,
  Lightning,
} from "@phosphor-icons/react";
import { HeroPreview } from "@/components/HeroPreview";
import { LabWorkbench } from "@/components/LabWorkbench";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { TaglineReveal } from "@/components/TaglineReveal";
import { CatalogTable } from "@/components/CatalogTable";
import { FaqSection } from "@/components/FaqSection";

const BENEFITS = [
  {
    icon: Code,
    title: "Verbatim Keras 3 scripts",
    detail:
      "Every import, random seed, callback, and matplotlib plot matches the source notebook without hidden edits.",
  },
  {
    icon: Lightning,
    title: "Clear GPU workload flags",
    detail:
      "Ex 06, Ex 07, Ex 12b, and Ex 14 carry GPU runtime badges so you switch Colab hardware before hitting run.",
  },
  {
    icon: FlowArrow,
    title: "Readable layer pipelines",
    detail:
      "Inspect input tensor shapes, pooling strides, dropout rates, and stacked recurrent units before copying a cell.",
  },
  {
    icon: DownloadSimple,
    title: "Single click cell or bundle export",
    detail:
      "Copy any individual cell, grab the Colab pip setup command, or download the complete .ipynb notebook file.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Select an experiment cell",
    detail:
      "Filter by Perceptrons, CNNs, Regularization, or Sequences, or press slash to search by dataset and optimizer.",
  },
  {
    step: "02",
    title: "Check data and runtime",
    detail:
      "Confirm whether the cell runs on CPU or GPU and note any Kaggle folder paths or CSV upload fallbacks.",
  },
  {
    step: "03",
    title: "Copy and run immediately",
    detail:
      "Copy the self contained Python block, paste into Google Colab or Jupyter, and execute cleanly.",
  },
];

export function StudioClientShell() {
  const [selectedId, setSelectedId] = useState<string>("ex-01");

  const jumpToWorkbench = (id: string) => {
    setSelectedId(id);
    document.getElementById("workbench")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main id="main-content" className="flex-1 bg-[#000000]">
      {/* Hero section (B5) */}
      <section
        id="hero"
        aria-label="Hero overview"
        className="pt-28 md:pt-32 pb-12 md:pb-16 px-4 sm:px-6"
      >
        <div className="mx-auto max-w-6xl flex flex-col gap-10">
          <div className="flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#181818] border border-[#272727] px-3 py-1.5">
              <Cpu
                size={14}
                className="text-[#34D399]"
                aria-hidden="true"
              />
              <span className="caption-4 text-[#D4D4D4]">
                Keras 3 · TensorFlow · 16 lab cells
              </span>
            </div>

            <h1 className="heading-1 max-w-[680px] bg-gradient-to-r from-[#FFFFFF] to-[#9B9B9B] bg-clip-text text-transparent">
              Sixteen Keras models.
              <br />
              Ready to copy and run.
            </h1>

            <p className="body-3 max-w-[680px] text-[#9B9B9B]">
              Every TensorFlow and Keras 3 deep learning experiment from single
              perceptrons to stacked GRU forecasting, organized into one fast
              workbench built for instant copy paste.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href="#workbench"
                className="button-md inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFFFFF] text-[#000000] px-3 py-2 hover:bg-[#D4D4D4] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
              >
                <span>Browse lab experiments</span>
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </a>

              <p className="caption-1 flex items-center gap-2 text-[#9B9B9B]">
                <Check
                  size={16}
                  weight="bold"
                  className="text-[#34D399]"
                  aria-hidden="true"
                />
                <span>16 standalone cells · 12 CPU · 4 GPU workloads</span>
              </p>
            </div>
          </div>

          <HeroPreview onSelectExperiment={jumpToWorkbench} />
        </div>
      </section>

      {/* Core Workbench */}
      <RevealOnScroll>
        <LabWorkbench selectedId={selectedId} onSelectId={setSelectedId} />
      </RevealOnScroll>

      {/* Benefits Section */}
      <section
        id="benefits"
        aria-label="Key studio benefits"
        className="py-16 md:py-24 px-4 sm:px-6"
      >
        <div className="mx-auto max-w-6xl flex flex-col gap-8">
          <RevealOnScroll>
            <div className="max-w-[680px]">
              <p className="caption-3 uppercase tracking-wider text-[#9B9B9B] mb-2">
                Why this workbench exists
              </p>
              <h2 className="heading-3 text-[#FFFFFF] mb-2">
                Everything verified before you paste into Colab
              </h2>
              <p className="body-3 text-[#9B9B9B]">
                Inspect model layers, datasets, and math behavior upfront instead
                of scrolling blindly through raw JSON cells.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BENEFITS.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-2xl bg-[#181818] border border-[#272727] p-3 flex flex-col gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#272727] border border-[#313131] text-[#FFFFFF]">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <h3 className="title-3 text-[#FFFFFF]">{item.title}</h3>
                    <p className="body-6 text-[#9B9B9B]">{item.detail}</p>
                  </article>
                );
              })}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Mandatory Tagline Reveal Section (B11) */}
      <TaglineReveal />

      {/* How It Works */}
      <section
        aria-label="How the workbench works"
        className="py-16 md:py-24 px-4 sm:px-6"
      >
        <div className="mx-auto max-w-6xl flex flex-col gap-8">
          <RevealOnScroll>
            <div className="max-w-[680px]">
              <p className="caption-3 uppercase tracking-wider text-[#9B9B9B] mb-2">
                Workflow
              </p>
              <h2 className="heading-3 text-[#FFFFFF] mb-2">
                Three steps from notebook cell to trained model
              </h2>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STEPS.map((step) => (
                <article
                  key={step.step}
                  className="rounded-2xl bg-[#181818] border border-[#272727] p-6 flex flex-col gap-3"
                >
                  <span className="caption-3 font-mono text-[#9B9B9B]">
                    Step {step.step}
                  </span>
                  <h3 className="title-2 text-[#FFFFFF]">{step.title}</h3>
                  <p className="body-6 text-[#9B9B9B]">{step.detail}</p>
                </article>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Complete Experiment Matrix */}
      <RevealOnScroll>
        <CatalogTable
          selectedId={selectedId}
          onJumpToExperiment={jumpToWorkbench}
        />
      </RevealOnScroll>

      {/* FAQ */}
      <RevealOnScroll>
        <FaqSection />
      </RevealOnScroll>

      {/* Final CTA (A2) */}
      <section
        aria-label="Final call to action"
        className="py-12 md:py-16 px-4 sm:px-6"
      >
        <RevealOnScroll>
          <div className="mx-auto max-w-6xl rounded-3xl bg-[#181818] border border-[#272727] p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-[680px]">
              <div className="inline-flex items-center gap-2 caption-3 text-[#D4D4D4] mb-3">
                <BookOpen size={16} aria-hidden="true" />
                <span>DL_Lab_All_Experiments_Keras.ipynb</span>
              </div>
              <h2 className="heading-4 text-[#FFFFFF] mb-2">
                Pick any experiment and start training
              </h2>
              <p className="body-3 text-[#9B9B9B]">
                Every cell runs on its own with explicit seeds, clean splits,
                and ready plots.
              </p>
            </div>

            <Link
              href="#workbench"
              className="button-md shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFFFFF] text-[#000000] px-3 py-2 hover:bg-[#D4D4D4] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
            >
              <span>Browse lab experiments</span>
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </RevealOnScroll>
      </section>
    </main>
  );
}
