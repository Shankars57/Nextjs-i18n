"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({
  items,
}: {
  items: { slug: string; title: string }[];
}) {
  const pathname = usePathname();
  // derive locale & version from pathname
  const parts = pathname?.split("/") || [
    "",
    "en",
    "docs",
    "v1",
    "introduction",
  ];
  const locale = parts[1] || "en";
  const version = parts[3] || "v1";

  return (
    <nav data-testid="sidebar" aria-label="Documentation sidebar" className="sidebar">
      <div className="sidebar-title">Navigation</div>
      <ul className="sidebar-list">
        {items.map((i) => (
          <li key={i.slug} className="sidebar-item">
            <Link
              href={`/${locale}/docs/${version}/${i.slug}`}
              data-testid={`sidebar-nav-link-${i.slug}`}
              className="sidebar-link"
            >
              {i.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
