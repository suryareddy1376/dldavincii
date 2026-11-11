import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of use | DL Davincii",
  description: "Usage terms for the DL Davincii Keras lab code workbench.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000]">
      <FloatingNav />
      <main
        id="main-content"
        className="flex-1 px-4 sm:px-6 pt-28 pb-16"
      >
        <div className="mx-auto max-w-3xl rounded-3xl bg-[#181818] border border-[#272727] p-6 sm:p-10 flex flex-col gap-6">
          <Link
            href="/"
            className="button-sm w-fit inline-flex items-center gap-2 rounded-lg bg-[#1F1F1F] border border-[#272727] text-[#D4D4D4] px-3 py-2 hover:bg-[#272727] hover:text-[#FFFFFF] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to workbench</span>
          </Link>

          <h1 className="heading-3 text-[#FFFFFF]">Terms of use</h1>

          <div className="flex flex-col gap-4 body-3 text-[#D4D4D4]">
            <p>
              All sixteen Python scripts inside DL Davincii are provided for
              educational Deep Learning laboratory coursework and reproducible
              Keras 3 experimentation.
            </p>
            <p>
              Third party datasets referenced in the notebook, including UCI
              datasets, scikit learn datasets, TensorFlow Datasets, Yahoo
              Finance market data, and Kaggle datasets, remain governed by their
              original dataset terms and licenses.
            </p>
            <p>
              Verify dataset paths and hardware runtimes in your Colab or local
              environment before launching long training jobs.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
