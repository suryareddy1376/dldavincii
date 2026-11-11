import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DL Davincii | Keras 3 Deep Learning Lab Code Studio",
  description:
    "Browse, inspect, and copy all sixteen self contained TensorFlow and Keras 3 deep learning lab experiments with stepwise algorithms and important viva Q&As.",
  openGraph: {
    title: "DL Davincii | Keras 3 Deep Learning Lab Code Studio",
    description:
      "Sixteen verbatim Keras 3 deep learning lab scripts with layer diagrams, runtime badges, and instant copy paste.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DL Davincii | Keras 3 Deep Learning Lab Code Studio",
    description:
      "Sixteen verbatim Keras 3 deep learning lab scripts ready to copy into Colab or Jupyter.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#000000] text-[#FFFFFF] flex flex-col selection:bg-[#313131] selection:text-[#FFFFFF]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[#272727] focus:px-3 focus:py-2 focus:text-[#FFFFFF] focus:border focus:border-[#313131] button-sm"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
