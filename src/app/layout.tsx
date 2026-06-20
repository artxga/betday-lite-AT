import type { Metadata } from "next";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "BetDay Lite — Daily Sports Betting",
  description:
    "Visualize daily betting events on a timeline, place simulated 1X2 bets, and track your results. Built with Next.js 15 and React 18.",
  keywords: ["betting", "sports", "1X2", "Premier League", "Next.js"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main style={{ paddingTop: "80px", minHeight: "100vh" }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
