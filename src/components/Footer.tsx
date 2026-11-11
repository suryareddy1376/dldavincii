import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  return (
    <footer className="bg-[#000000] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#181818] border border-[#272727] p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <svg
              width="28"
              height="28"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect width="64" height="64" rx="16" fill="#272727" />
              <circle cx="20" cy="20" r="4.5" fill="#FFFFFF" />
              <circle cx="20" cy="32" r="4.5" fill="#9B9B9B" />
              <circle cx="20" cy="44" r="4.5" fill="#FFFFFF" />
              <circle cx="44" cy="26" r="5" fill="#FFFFFF" />
              <circle cx="44" cy="38" r="5" fill="#9B9B9B" />
              <path
                d="M24.5 20L39 26M24.5 32L39 26M24.5 32L39 38M24.5 44L39 38"
                stroke="#FFFFFF"
                strokeOpacity="0.7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <p className="title-3 text-[#FFFFFF]">DL Davincii</p>
              <p className="caption-2 text-[#9B9B9B]">
                Keras 3 Deep Learning Lab notebook workbench
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/#workbench"
              className="button-sm inline-flex items-center gap-1.5 rounded-lg bg-[#FFFFFF] text-[#000000] px-3 py-2 hover:bg-[#D4D4D4] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
            >
              <span>Browse lab experiments</span>
              <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-[#1F1F1F] border border-[#272727] px-4 py-3">
          <p className="caption-2 text-[#9B9B9B]">
            Source cells extracted verbatim from DL_Lab_All_Experiments_Keras.ipynb
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="caption-1 text-[#D4D4D4] hover:text-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 rounded"
            >
              Privacy policy
            </Link>
            <Link
              href="/terms"
              className="caption-1 text-[#D4D4D4] hover:text-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 rounded"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
