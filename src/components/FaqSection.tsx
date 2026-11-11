"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

const FAQ_ITEMS = [
  {
    q: "Which experiments need a GPU runtime in Google Colab?",
    a: "Use a GPU runtime for Ex 06 (VGG16 vehicle recognition), Ex 07 (diabetic retinopathy CNN), Ex 12b (AlexNet on 227x227 CIFAR 10), and Ex 14 (stacked GRU and LSTM stock forecasting). The remaining twelve cells run comfortably on a standard CPU runtime.",
  },
  {
    q: "Which datasets require manual upload from Kaggle?",
    a: "Ex 06 expects your vehicle image subfolders at DATASET_PATH (/content/Dataset), and Ex 07 expects retina JPEG files at IMG_DIR plus trainLabels.csv at LABELS_CSV. All other experiments fetch or build datasets automatically.",
  },
  {
    q: "What happens if UCI or Yahoo Finance blocks a download?",
    a: "Ex 09 and Ex 10 fall back to google.colab files.upload() so you can upload hour.csv directly. Ex 14 catches yfinance download errors and prompts you to upload IBM.csv with Date, Open, High, Low, Close, and Volume columns.",
  },
  {
    q: "Which packages must I install before running Ex 11 or Ex 14?",
    a: "Run the top setup command (%pip -q install tensorflow-datasets yfinance) once at the start of your notebook session. Every other library comes preinstalled in standard Google Colab runtimes.",
  },
  {
    q: "Are all sixteen cells compatible with TensorFlow and Keras 3?",
    a: "Yes. Every script imports keras and keras.layers directly, calls keras.utils.set_random_seed for reproducibility, and uses .keras model checkpoint formats where saving is required.",
  },
  {
    q: "Can I run a single cell without executing earlier experiments?",
    a: "Yes. Each experiment contains its own imports, seed setup, data preprocessing, model compile block, training loop, and matplotlib visualization so you can paste and run any cell independently.",
  },
  {
    q: "How can I deploy this frontend project on Vercel?",
    a: "Push the DL Davincii repository to GitHub or run the Vercel CLI from the project root. The entire site compiles as a static Next.js App Router build with zero external API keys or backend databases required.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="py-16 md:py-24 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-4xl flex flex-col gap-8">
        <div className="max-w-[680px]">
          <p className="caption-3 uppercase tracking-wider text-[#9B9B9B] mb-2">
            Frequently asked questions
          </p>
          <h2 className="heading-3 text-[#FFFFFF] mb-2">
            Runtime, dataset, and Colab answers
          </h2>
          <p className="body-3 text-[#9B9B9B]">
            Details taken straight from the notebook header and error handlers so
            nothing stalls during lab evaluation.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl bg-[#181818] border border-[#272727] p-2"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 rounded-lg bg-[#1F1F1F] px-4 py-3 text-left hover:bg-[#272727] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
                >
                  <span className="title-3 text-[#FFFFFF]">{item.q}</span>
                  <CaretDown
                    size={18}
                    aria-hidden="true"
                    className={`shrink-0 text-[#9B9B9B] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? "rotate-180 text-[#FFFFFF]" : "rotate-0"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-4 pt-3 pb-2 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  >
                    <p className="body-6 text-[#9B9B9B]">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
