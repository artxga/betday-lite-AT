"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Zap } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const t = useTranslations("SignIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("invalidCredentials"));
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-lg">
      <div className="w-full max-w-[420px] bg-bg-glass backdrop-blur-[24px] border border-border-subtle rounded-xl p-2xl max-[480px]:p-lg relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-accent-primary before:via-accent-blue before:to-accent-purple">
        <div className="text-center mb-xl">
          <div className="w-[56px] h-[56px] rounded-lg bg-gradient-to-br from-accent-primary to-accent-blue flex items-center justify-center text-2xl mx-auto mb-lg">
            <Zap size={24} />
          </div>
          <h1 className="font-heading text-2xl font-extrabold mb-sm">
            {t("title").split(" ").slice(0, -1).join(" ")} <span className="bg-gradient-to-br from-accent-primary to-accent-blue bg-clip-text text-transparent">{t("title").split(" ").pop()}</span>
          </h1>
          <p className="text-sm text-text-secondary">
            {t("subtitle")}
          </p>
        </div>

        <form onSubmit={handleCredentialsLogin} className="flex flex-col gap-md">
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="email" className="text-sm font-medium text-text-secondary">
              {t("emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="px-4 py-3 bg-bg-surface border border-border-subtle rounded-md text-sm text-text-primary transition-all duration-150 outline-none focus:border-accent-primary focus:shadow-[0_0_0_3px_rgba(0,255,135,0.1)] placeholder:text-text-muted"
              required
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label htmlFor="password" className="text-sm font-medium text-text-secondary">
              {t("passwordLabel")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              className="px-4 py-3 bg-bg-surface border border-border-subtle rounded-md text-sm text-text-primary transition-all duration-150 outline-none focus:border-accent-primary focus:shadow-[0_0_0_3px_rgba(0,255,135,0.1)] placeholder:text-text-muted"
              required
            />
            <span className="text-xs text-text-muted italic">
              {t("passwordHint")}
            </span>
          </div>

          {error && <p className="text-sm text-status-lost py-sm px-md bg-status-lost-bg rounded-md border border-status-lost/20">{error}</p>}

          <button
            type="submit"
            className="p-3 bg-gradient-to-br from-accent-primary to-[#00cc6a] text-bg-primary text-sm font-bold rounded-md transition-all duration-150 flex items-center justify-center min-h-[44px] hover:not-disabled:-translate-y-[1px] hover:not-disabled:shadow-glow disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-[rgba(10,10,26,0.3)] border-t-bg-primary rounded-full animate-spin" />
            ) : (
              t("signInBtn")
            )}
          </button>
        </form>

        <div className="flex items-center gap-md my-xl before:flex-1 before:h-[1px] before:bg-border-subtle after:flex-1 after:h-[1px] after:bg-border-subtle">
          <span className="text-sm text-text-muted">{t("or")}</span>
        </div>

        <button
          className="w-full p-3 bg-bg-surface border border-border-subtle rounded-md text-sm font-semibold text-text-primary flex items-center justify-center gap-sm transition-all duration-150 hover:bg-bg-surface-hover hover:border-border-light hover:-translate-y-[1px]"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {t("googleBtn")}
        </button>
      </div>
    </div>
  );
}
