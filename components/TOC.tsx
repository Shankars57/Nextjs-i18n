"use client";
import { useEffect, useState } from "react";

export default function TOC({
  headings,
}: {
  headings: { id: string; text: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.1, 0.5] },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav data-testid="table-of-contents" aria-label="Table of contents" className="toc">
      <h3 className="toc-title">On this page</h3>
      <ul className="toc-list">
        {headings.map((h) => (
          <li key={h.id} className="toc-item">
            <a
              data-testid={`toc-link-${h.id}`}
              data-active={active === h.id ? "true" : "false"}
              href={`#${h.id}`}
              className="toc-link"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
