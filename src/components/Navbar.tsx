"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
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

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <span>
            <span className={styles.logoText}>BetDay</span>
            <span className={styles.logoTextDim}> Lite</span>
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
                👤 My Bets
              </Link>
            )}
          </div>

          <div className={styles.navActions}>
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
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className={styles.signInBtn}
                onClick={() => setMenuOpen(false)}
              >
                Sign In
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
