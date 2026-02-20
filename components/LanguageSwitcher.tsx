"use client";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locales = ["en", "es", "fr", "de"];
  const hasLocalePrefix = /^\/(en|es|fr|de)(\/|$)/.test(pathname);

  function go(locale: string) {
    if (!hasLocalePrefix) return router.push(`/${locale}/docs/v1/introduction`);
    const parts = pathname.split("/");
    parts[1] = locale;
    router.push(parts.join("/"));
  }

  return (
    <div data-testid="language-switcher" className="lang-switcher">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => go(l)}
          className="lang-switcher-btn"
          aria-label={`Switch language to ${l}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
