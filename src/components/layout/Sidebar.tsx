"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Zap, Home, User, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("Navbar"); // Reusing Navbar translations for now
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.classList.remove("sidebar-expanded");
    }
  }, [isExpanded]);

  // Handle mobile closing
  useEffect(() => {
    const handleClose = () => document.body.classList.remove("sidebar-open");
    window.addEventListener("sidebar-close", handleClose);
    return () => window.removeEventListener("sidebar-close", handleClose);
  }, []);

  // Close sidebar overlay on mobile when route changes
  useEffect(() => {
    document.body.classList.remove("sidebar-open");
  }, [pathname]);

  return (
    <>
      <div
        className="hidden [.sidebar-open_&]:block fixed inset-0 bg-black/50 backdrop-blur-[4px] z-[109]"
        onClick={() => document.body.classList.remove("sidebar-open")}
      />
      <aside
        className={`fixed top-0 left-0 bottom-0 liquid-panel !border-t-0 !border-b-0 !border-l-0 !rounded-none z-[110] flex flex-col py-lg transition-all duration-250 shadow-lg overflow-visible ${isExpanded ? "w-[240px]" : "w-[72px]"} max-md:w-[280px] max-md:-translate-x-full [.sidebar-open_&]:max-md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-md mb-xl overflow-hidden">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-accent-primary to-accent-blue flex items-center justify-center text-xs font-extrabold text-bg-primary shrink-0">
              <Zap size={16} />
            </div>
            <span
              className={`font-heading text-xl font-extrabold tracking-[-0.5px] gap-xs transition-opacity duration-150 ${isExpanded ? "flex opacity-100 whitespace-nowrap" : "hidden opacity-0"} max-md:flex max-md:opacity-100`}
            >
              <span className="bg-gradient-to-br from-accent-primary to-accent-blue bg-clip-text text-transparent">
                {t("title").split(" ")[0]}
              </span>
              <span className="text-text-secondary font-medium"> {t("title").split(" ")[1]}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-sm px-md">
          <Link
            href="/"
            className={`p-sm rounded-md text-base transition-all duration-150 flex items-center gap-md overflow-hidden whitespace-nowrap ${pathname === "/" ? "bg-accent-primary-dim text-accent-primary font-semibold" : "font-medium text-text-secondary hover:bg-bg-surface hover:text-text-primary"}`}
            title={t("home")}
          >
            <span className="w-6 flex justify-center text-[1.2rem] shrink-0">
              <Home size={20} />
            </span>
            <span
              className={`transition-opacity duration-150 ${isExpanded ? "flex opacity-100 whitespace-nowrap" : "hidden opacity-0"} max-md:flex max-md:opacity-100`}
            >
              {t("home")}
            </span>
          </Link>

          <Link
            href="/profile"
            className={`p-sm rounded-md text-base transition-all duration-150 flex items-center gap-md overflow-hidden whitespace-nowrap ${pathname === "/profile" ? "bg-accent-primary-dim text-accent-primary font-semibold" : "font-medium text-text-secondary hover:bg-bg-surface hover:text-text-primary"}`}
            title={t("myBets")}
          >
            <span className="w-6 flex justify-center text-[1.2rem] shrink-0">
              <User size={20} />
            </span>
            <span
              className={`transition-opacity duration-150 ${isExpanded ? "flex opacity-100 whitespace-nowrap" : "hidden opacity-0"} max-md:flex max-md:opacity-100`}
            >
              {t("myBets")}
            </span>
          </Link>
        </div>

        <button
          className="absolute top-[72px] -right-[14px] w-7 h-7 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-secondary text-[10px] cursor-pointer z-[111] transition-all duration-150 hover:bg-accent-primary-dim hover:text-accent-primary hover:border-accent-primary max-md:hidden"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </aside>
    </>
  );
}
