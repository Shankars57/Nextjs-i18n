import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "../components/ThemeToggle";
import Search from "../components/Search";
import LanguageSwitcher from "../components/LanguageSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Documentation Portal",
  description: "Multi-language, versioned docs with ISR and search",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} root-body`}>
        <header className="site-header">
          <div className="site-header-left">
            <Link href="/en/docs/v1/introduction" className="site-brand">
              <Image src="/next.svg" alt="Docs logo" width={64} height={14} priority />
              <span>Docs Portal</span>
            </Link>
          </div>
          <div className="site-header-controls">
            <LanguageSwitcher />
            <Search />
            <ThemeToggle />
          </div>
        </header>
        <main className="site-main">{children}</main>
      </body>
    </html>
  );
}
