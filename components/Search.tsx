"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Hit = {
  id: string;
  locale: string;
  version: string;
  slug: string;
  title: string;
  content: string;
};

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Hit[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [data, setData] = useState<Hit[]>([]);

  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((json: Hit[]) => setData(json))
      .catch(() => setData([]));
  }, []);

  async function doSearch(q: string) {
    if (!q) {
      setResults([]);
      setNoResults(false);
      return;
    }

    try {
      const FlexSearch = await import("flexsearch");
      const idx = new FlexSearch.Index({ tokenize: "forward", cache: true });
      data.forEach((d, i) => idx.add(i, `${d.title} ${d.content}`));
      const ids = idx.search(q) as number[];
      const found = ids.map((i) => data[i]);
      setResults(found);
      setNoResults(found.length === 0);
    } catch {
      const found = data.filter((d) =>
        (d.title + " " + d.content).toLowerCase().includes(q.toLowerCase()),
      );
      setResults(found);
      setNoResults(found.length === 0);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => doSearch(q), 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="search-box">
      <input
        data-testid="search-input"
        aria-label="Search documentation"
        placeholder="Search docs..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="search-input"
      />
      <div data-testid="search-results" className="search-results">
        {results.map((r) => (
          <div key={r.id} className="search-result-item">
            <Link href={`/${r.locale}/docs/${r.version}/${r.slug}`} className="search-result-title">
              {r.title}
            </Link>
            <p className="search-result-snippet">{r.content.slice(0, 120)}</p>
          </div>
        ))}
      </div>
      {noResults && <div data-testid="search-no-results" className="search-no-results">No results</div>}
    </div>
  );
}
