"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "@phosphor-icons/react";

const NAV_ITEMS = [
  { id: "workbench", label: "Workbench", href: "/#workbench" },
  { id: "benefits", label: "Benefits", href: "/#benefits" },
  { id: "catalog", label: "Catalog", href: "/#catalog" },
  { id: "faq", label: "FAQ", href: "/#faq" },
];

export function FloatingNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("workbench");

  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = ["hero", "workbench", "benefits", "catalog", "faq"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0.05 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          aria-label="Primary navigation"
          className="pointer-events-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-4 w-full sm:w-auto rounded-2xl bg-[#181818]/85 backdrop-blur-md border border-[#272727] p-2 shadow-lg max-w-full"
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[#FFFFFF] hover:bg-[#272727] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
          >
            <svg
              width="20"
              height="20"
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
            <span className="title-4 text-[#FFFFFF] whitespace-nowrap">
              DL Davincii
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === "/" && activeSection === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`title-4 block rounded-lg px-3 py-1.5 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
                      isActive
                        ? "bg-[#272727] text-[#FFFFFF]"
                        : "text-[#9B9B9B] hover:text-[#FFFFFF] hover:bg-[#1F1F1F]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/#workbench"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#FFFFFF] text-[#000000] px-3 py-1.5 button-sm hover:bg-[#D4D4D4] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 whitespace-nowrap"
            >
              <span>Copy cells</span>
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="md:hidden relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F1F1F] border border-[#272727] text-[#FFFFFF] hover:bg-[#272727] active:scale-[0.98] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40"
            >
              <span className="sr-only">
                {menuOpen ? "Close menu" : "Open menu"}
              </span>
              <span
                aria-hidden="true"
                className={`absolute h-0.5 w-4 rounded-full bg-[#FFFFFF] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menuOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-0.5 w-4 rounded-full bg-[#FFFFFF] transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-0.5 w-4 rounded-full bg-[#FFFFFF] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menuOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-height mobile overlay panel (B7) */}
      <div
        id="mobile-nav-panel"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-40 md:hidden bg-[#000000]/95 backdrop-blur-xl transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col justify-between px-4 sm:px-6 pt-24 pb-8 overflow-y-auto">
          <ul className="flex flex-col gap-3">
            {NAV_ITEMS.map((item, idx) => {
              const delayMs = Math.min(idx * 60, 400);
              const isActive =
                pathname === "/" && activeSection === item.id;
              return (
                <li
                  key={item.id}
                  style={{ transitionDelay: menuOpen ? `${delayMs}ms` : "0ms" }}
                  className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    menuOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }`}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`heading-4 flex items-center justify-between rounded-2xl border p-4 transition-colors duration-300 ${
                      isActive
                        ? "bg-[#272727] border-[#313131] text-[#FFFFFF]"
                        : "bg-[#181818] border-[#272727] text-[#D4D4D4] hover:text-[#FFFFFF]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div
            style={{ transitionDelay: menuOpen ? "240ms" : "0ms" }}
            className={`flex flex-col gap-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              menuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              href="/#workbench"
              onClick={() => setMenuOpen(false)}
              className="button-md flex items-center justify-center gap-2 rounded-xl bg-[#FFFFFF] text-[#000000] py-3 px-4"
            >
              <span>Browse 16 experiments</span>
              <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
            </Link>
            <div className="flex items-center justify-center gap-6 pt-2">
              <Link
                href="/privacy"
                onClick={() => setMenuOpen(false)}
                className="caption-1 text-[#9B9B9B] hover:text-[#FFFFFF]"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                onClick={() => setMenuOpen(false)}
                className="caption-1 text-[#9B9B9B] hover:text-[#FFFFFF]"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
