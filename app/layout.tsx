import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RecapAI — Turn meetings into action",
  description: "RecapAI turns any meeting transcript into a structured summary and an assigned task list, automatically.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F8FC] font-[family-name:var(--font-body)]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}