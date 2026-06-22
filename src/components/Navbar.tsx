"use client";

import { useSession, signOut } from "next-auth/react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navbar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClose = () => setMenuOpen(false);
    window.addEventListener("sidebar-close", handleClose);
    return () => window.removeEventListener("sidebar-close", handleClose);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "es" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <div className={styles.mobileLogo}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>⚡</div>
            <span>
              <span className={styles.logoText}>{t("title").split(" ")[0]}</span>
              <span className={styles.logoTextDim}> {t("title").split(" ")[1]}</span>
            </span>
          </Link>
        </div>

        <div className={styles.navActions}>
          <button className={styles.langBtn} onClick={toggleLocale} aria-label="Toggle language">
            {locale.toUpperCase()}
          </button>
          
          {session?.user ? (
            <div className={styles.userDropdownContainer}>
              <button 
                className={styles.avatarBtn} 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "Avatar"} />
                ) : (
                  getInitials(session.user.name)
                )}
              </button>
              
              {dropdownOpen && (
                <>
                  <div className={styles.dropdownOverlay} onClick={() => setDropdownOpen(false)} />
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <span className={styles.userName}>{session.user.name}</span>
                      <span className={styles.userEmail}>{session.user.email}</span>
                    </div>
                    <button className={styles.signOutBtn} onClick={() => signOut()}>
                      {t("logout")}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/auth/signin" className={styles.signInBtn}>
              {t("login")}
            </Link>
          )}

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
