"use client";

import { Check, Copy, Cpu, Lightning } from "@phosphor-icons/react";
import { EXPERIMENTS } from "@/data/experiments";
import { useCopyClipboard } from "@/lib/useCopyClipboard";

interface CatalogTableProps {
  selectedId: string;
  onJumpToExperiment: (id: string) => void;
}

export function CatalogTable({
  selectedId,
  onJumpToExperiment,
}: CatalogTableProps) {
  const { copiedKey, errorMsg, copyText } = useCopyClipboard();

  return (
    <section
      id="catalog"
      aria-label="Complete experiment matrix"
      className="py-16 md:py-24 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-6xl flex flex-col gap-6">
        <div className="max-w-[680px]">
          <p className="caption-3 uppercase tracking-wider text-[#9B9B9B] mb-2">
            Experiment matrix
          </p>
          <h2 className="heading-3 text-[#FFFFFF] mb-2">
            Sixteen models mapped across datasets and optimizers
          </h2>
          <p className="body-3 text-[#9B9B9B]">
            Scan every lab cell in order, open its code inside the workbench, or
            copy the script straight from the index.
          </p>
        </div>

        {errorMsg && (
          <p
            role="alert"
            className="caption-2 rounded-xl bg-[#131209] border border-[#313131] px-4 py-3 text-[#FBBF24]"
          >
            {errorMsg}
          </p>
        )}

        <div className="rounded-3xl bg-[#181818] border border-[#272727] p-3">
          <div className="lab-scroll overflow-x-auto rounded-xl bg-[#1F1F1F] border border-[#272727] p-2">
            <table className="w-full min-w-[760px] text-left border-separate border-spacing-y-1">
              <thead>
                <tr>
                  <th className="caption-4 text-[#9B9B9B] px-3 py-2">Cell</th>
                  <th className="caption-4 text-[#9B9B9B] px-3 py-2">
                    Experiment
                  </th>
                  <th className="caption-4 text-[#9B9B9B] px-3 py-2">
                    Dataset
                  </th>
                  <th className="caption-4 text-[#9B9B9B] px-3 py-2">
                    Optimizer
                  </th>
                  <th className="caption-4 text-[#9B9B9B] px-3 py-2">
                    Runtime
                  </th>
                  <th className="caption-4 text-[#9B9B9B] px-3 py-2 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {EXPERIMENTS.map((exp) => {
                  const isActive = exp.id === selectedId;
                  const isCopied = copiedKey === `row-${exp.id}`;
                  return (
                    <tr
                      key={exp.id}
                      className={`transition-colors duration-300 ${
                        isActive
                          ? "bg-[#272727]"
                          : "bg-[#181818] hover:bg-[#272727]"
                      }`}
                    >
                      <td className="px-3 py-2.5 rounded-l-lg caption-3 font-mono text-[#FFFFFF] whitespace-nowrap">
                        {exp.codeLabel}
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          onClick={() => onJumpToExperiment(exp.id)}
                          className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 rounded"
                        >
                          <span className="block title-4 text-[#FFFFFF] hover:underline">
                            {exp.title}
                          </span>
                          <span className="block caption-5 text-[#9B9B9B]">
                            {exp.modelType}
                          </span>
                        </button>
                      </td>
                      <td className="px-3 py-2.5 caption-2 text-[#D4D4D4]">
                        {exp.datasetName}
                      </td>
                      <td className="px-3 py-2.5 caption-4 font-mono text-[#D4D4D4]">
                        {exp.optimizer}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span
                          className={`caption-4 inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 ${
                            exp.gpuRequired
                              ? "bg-[#131209] border-[#313131] text-[#FBBF24]"
                              : "bg-[#1F1F1F] border-[#272727] text-[#34D399]"
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
                      </td>
                      <td className="px-3 py-2.5 rounded-r-lg text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onJumpToExperiment(exp.id)}
                            className="button-xsm rounded-lg bg-[#1F1F1F] border border-[#313131] text-[#FFFFFF] px-2.5 py-1.5 hover:bg-[#313131] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
                          >
                            Open
                          </button>
                          <button
                            type="button"
                            onClick={() => copyText(exp.code, `row-${exp.id}`)}
                            className="button-xsm inline-flex items-center gap-1 rounded-lg bg-[#FFFFFF] text-[#000000] px-2.5 py-1.5 hover:bg-[#D4D4D4] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
                          >
                            {isCopied ? (
                              <Check
                                size={12}
                                weight="bold"
                                aria-hidden="true"
                              />
                            ) : (
                              <Copy
                                size={12}
                                weight="bold"
                                aria-hidden="true"
                              />
                            )}
                            <span>{isCopied ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
