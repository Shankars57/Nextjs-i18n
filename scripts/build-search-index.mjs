import fs from "fs";
import path from "path";

const docsRoot = path.join(process.cwd(), "_docs");
const outFile = path.join(process.cwd(), "public", "search-index.json");
const items = [];

function extractTitle(raw, fallback) {
  const match = raw.match(/title:\s*"([^"]+)"/) ?? raw.match(/title:\s*(.+)/);
  return match?.[1]?.trim() || fallback;
}

for (const version of fs.readdirSync(docsRoot)) {
  const versionDir = path.join(docsRoot, version);
  if (!fs.statSync(versionDir).isDirectory()) continue;

  for (const locale of fs.readdirSync(versionDir)) {
    const localeDir = path.join(versionDir, locale);
    if (!fs.statSync(localeDir).isDirectory()) continue;

    for (const file of fs.readdirSync(localeDir)) {
      if (!file.endsWith(".md")) continue;

      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(localeDir, file), "utf8");
      const title = extractTitle(raw, slug);
      const content = raw
        .replace(/^\uFEFF?---[\s\S]*?---\s*/, "")
        .replace(/^#+\s*/gm, "")
        .replace(/\r?\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      items.push({
        id: `${version}-${locale}-${slug}`,
        locale,
        version,
        slug,
        title,
        content,
      });
    }
  }
}

fs.writeFileSync(outFile, JSON.stringify(items, null, 2));
