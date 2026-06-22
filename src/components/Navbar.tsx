"use client";

import { useSession, signOut } from "next-auth/react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navbar");
  const [menuOpen, setMenuOpen] = useState(false);

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "es" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <span>
            <span className={styles.logoText}>{t("title").split(" ")[0]}</span>
            <span className={styles.logoTextDim}> {t("title").split(" ")[1]}</span>
          </span>
        </Link>

        <div
          className={`${styles.navContent} ${menuOpen ? styles.navContentOpen : ""}`}
        >
          <div className={styles.navLinks}>
            {session && (
              <Link
                href="/profile"
                className={`${styles.navLink} ${pathname === "/profile" ? styles.navLinkActive : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                👤 {t("myBets")}
              </Link>
            )}
          </div>

          <div className={styles.navActions}>
            <button className={styles.langBtn} onClick={toggleLocale} aria-label="Toggle language" style={{ background: 'transparent', border: '1px solid #ddd', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', color: 'inherit' }}>
              {locale.toUpperCase()}
            </button>
            {session?.user ? (
              <>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "Avatar"}
                      />
                    ) : (
                      getInitials(session.user.name)
                    )}
                  </div>
                  <span className={styles.userName}>{session.user.name}</span>
                </div>
                <button
                  className={styles.signOutBtn}
                  onClick={() => signOut()}
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className={styles.signInBtn}
                onClick={() => setMenuOpen(false)}
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>

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
    </nav>
  );
}
