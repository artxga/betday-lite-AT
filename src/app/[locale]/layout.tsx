import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Providers from "@/components/providers/Providers";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import "../globals.css";

export const metadata: Metadata = {
  title: "BetDay Lite — Daily Sports Betting",
  description:
    "Visualize daily betting events on a timeline, place simulated 1X2 bets, and track your results. Built with Next.js 15 and React 18.",
  keywords: ["betting", "sports", "1X2", "Premier League", "Next.js"],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navbar />
            <div className="app-layout">
              <Sidebar />
              <main className="main-content">{children}</main>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
