import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { notFound } from "next/navigation";
import Sidebar from "../../../../../components/Sidebar";
import TOC from "../../../../../components/TOC";
import CodeBlock from "../../../../../components/CodeBlock";
import VersionSelector from "../../../../../components/VersionSelector";
import FeedbackWidget from "../../../../../components/FeedbackWidget";

export const revalidate = 60;

type Params = { locale: string; version: string; slug: string };
const SUPPORTED_LOCALES = ["en", "es", "fr", "de"] as const;
const SUPPORTED_VERSIONS = ["v1", "v2", "v3"] as const;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function loadMarkdown(locale: string, version: string, slug: string) {
  const base = path.join(process.cwd(), "_docs");
  const file = path.join(base, version, locale, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  const md = await remark().use(html).process(content);
  const htmlContent = md.toString();

  const headings = Array.from(content.matchAll(/^##\s+(.+)$/gim)).map((m) => {
    const text = m[1].trim();
    return { id: slugify(text), text };
  });

  let h2Index = 0;
  const htmlWithIds = htmlContent.replace(/<h2>(.*?)<\/h2>/g, (_match, inner) => {
    const heading = headings[h2Index++];
    if (!heading) return `<h2>${inner}</h2>`;
    return `<h2 id="${heading.id}">${inner}</h2>`;
  });

  return { data, htmlContent: htmlWithIds, headings };
}

export async function generateStaticParams() {
  const base = path.join(process.cwd(), "_docs");
  const params: Params[] = [];
  for (const v of SUPPORTED_VERSIONS) {
    for (const l of SUPPORTED_LOCALES) {
      const dir = path.join(base, v, l);
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
      for (const f of files) {
        params.push({ locale: l, version: v, slug: f.replace(/\.md$/, "") });
      }
    }
  }
  return params.map((p) => ({
    locale: p.locale,
    version: p.version,
    slug: p.slug,
  }));
}

export default async function DocPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, version, slug } = await params;
  if (
    !SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number]) ||
    !SUPPORTED_VERSIONS.includes(version as (typeof SUPPORTED_VERSIONS)[number])
  ) {
    notFound();
  }

  const md = await loadMarkdown(locale, version, slug);
  if (!md) notFound();

  const sidebarItems = [
    { slug: "introduction", title: "Introduction" },
    { slug: "getting-started", title: "Getting Started" },
  ];

  return (
    <div className="docs-layout">
      <aside className="docs-sidebar">
        <Sidebar items={sidebarItems} />
      </aside>
      <main className="docs-main">
        <VersionSelector currentVersion={version} />
        <article className="docs-article" dangerouslySetInnerHTML={{ __html: md.htmlContent }} />
        <section className="docs-code-section">
          <h3>Code samples</h3>
          <CodeBlock
            code={`console.log("Hello from ${version}/${locale}/${slug}")`}
          />
        </section>
        <div className="docs-meta-grid">
          <TOC headings={md.headings} />
          <FeedbackWidget />
        </div>
      </main>
    </div>
  );
}
