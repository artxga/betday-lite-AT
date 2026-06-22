"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Zap, Home, User, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Sidebar.module.css";

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
        className={styles.overlay} 
        onClick={() => document.body.classList.remove("sidebar-open")}
      />
      <aside className={`${styles.sidebar} ${isExpanded ? styles.expanded : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Zap size={16} />
            </div>
            <span className={styles.logoTextWrapper}>
              <span className={styles.logoText}>{t("title").split(" ")[0]}</span>
              <span className={styles.logoTextDim}> {t("title").split(" ")[1]}</span>
            </span>
          </div>
        </div>

        <div className={styles.navLinks}>
          <Link
            href="/"
            className={`${styles.navLink} ${pathname === "/" ? styles.navLinkActive : ""}`}
            title={t("home")}
          >
            <span className={styles.navIcon}>
              <Home size={20} />
            </span>
            <span className={styles.navText}>{t("home")}</span>
          </Link>
          
          <Link
            href="/profile"
            className={`${styles.navLink} ${pathname === "/profile" ? styles.navLinkActive : ""}`}
            title={t("myBets")}
          >
            <span className={styles.navIcon}>
              <User size={20} />
            </span>
            <span className={styles.navText}>{t("myBets")}</span>
          </Link>
        </div>

        <button 
          className={styles.expandBtn} 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </aside>
    </>
  );
}
