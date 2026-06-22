"use client";

import { useSession, signOut } from "next-auth/react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Zap, Menu } from "lucide-react";

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
    <nav className="fixed top-0 left-0 right-0 z-[100] liquid-panel !border-t-0 !border-l-0 !border-r-0 !rounded-none">
      <div className="max-w-[1200px] mx-auto px-md flex items-center justify-end h-[64px] max-md:justify-end">
        <div className="hidden max-md:flex mr-auto">
          <Link href="/" className="font-heading text-xl font-extrabold tracking-[-0.5px] flex items-center gap-sm">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-accent-primary to-accent-blue flex items-center justify-center text-sm font-extrabold text-bg-primary">
              <Zap size={16} />
            </div>
            <span>
              <span className="bg-gradient-to-br from-accent-primary to-accent-blue bg-clip-text text-transparent">{t("title").split(" ")[0]}</span>
              <span className="text-text-secondary font-medium"> {t("title").split(" ")[1]}</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-md">
          <button 
            className="liquid-button px-sm py-xs rounded-sm text-xs font-semibold text-text-secondary flex items-center justify-center min-w-[40px] h-8 hover:text-accent-primary" 
            onClick={toggleLocale} 
            aria-label="Toggle language"
          >
            {locale.toUpperCase()}
          </button>
          
          {session?.user ? (
            <div className="relative">
              <button 
                className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-xs font-bold text-white overflow-hidden border-2 border-border-subtle transition-colors duration-150 hover:border-accent-primary" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "Avatar"} className="w-full h-full object-cover" />
                ) : (
                  getInitials(session.user.name)
                )}
              </button>
              
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute top-[calc(100%+var(--spacing-sm))] right-0 w-[220px] bg-bg-secondary border border-border-subtle rounded-md shadow-lg p-sm z-[11] flex flex-col gap-sm">
                    <div className="flex flex-col p-sm border-b border-border-subtle">
                      <span className="text-sm font-semibold text-text-primary truncate">{session.user.name}</span>
                      <span className="text-xs text-text-muted truncate">{session.user.email}</span>
                    </div>
                    <button className="p-sm rounded-sm text-sm font-medium text-status-lost bg-transparent transition-all duration-150 text-left w-full hover:bg-status-lost-bg" onClick={() => signOut()}>
                      {t("logout")}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/auth/signin" className="liquid-button-primary px-md py-xs rounded-sm text-sm font-semibold flex items-center justify-center">
              {t("login")}
            </Link>
          )}

          <button
            className="hidden max-md:flex p-xs cursor-pointer text-text-secondary bg-transparent border-none items-center justify-center transition-colors duration-150 hover:text-text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
