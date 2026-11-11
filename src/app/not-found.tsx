import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000]">
      <FloatingNav />
      <main
        id="main-content"
        className="flex-1 flex items-center justify-center px-4 sm:px-6 pt-28 pb-16"
      >
        <div className="w-full max-w-xl rounded-3xl bg-[#181818] border border-[#272727] p-8 sm:p-12 text-center flex flex-col items-center gap-4">
          <span className="caption-3 font-mono rounded-lg bg-[#272727] border border-[#313131] px-3 py-1 text-[#D4D4D4]">
            Error 404
          </span>
          <h1 className="heading-3 text-[#FFFFFF]">Page not found</h1>
          <p className="body-3 text-[#9B9B9B] max-w-md">
            That route does not exist in DL Davincii. Return to the main lab
            workbench to browse and copy all sixteen Keras experiments.
          </p>
          <Link
            href="/"
            className="button-md mt-2 inline-flex items-center gap-2 rounded-lg bg-[#FFFFFF] text-[#000000] px-3 py-2 hover:bg-[#D4D4D4] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
          >
            <ArrowLeft size={16} weight="bold" aria-hidden="true" />
            <span>Back to workbench</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
