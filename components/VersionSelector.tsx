"use client";
import { usePathname, useRouter } from "next/navigation";

export default function VersionSelector({
  currentVersion,
}: {
  currentVersion: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function go(version: string) {
    // pathname example: /en/docs/v1/introduction
    const parts = pathname.split("/");
    // parts: ["", locale, "docs", "v1", slug]
    if (parts.length >= 5) {
      parts[3] = version;
      router.push(parts.join("/"));
    }
  }

  return (
    <div data-testid="version-selector" className="version-selector">
      <button
        data-testid="version-option-v1"
        onClick={() => go("v1")}
        aria-pressed={currentVersion === "v1"}
        className="version-option-btn"
      >
        v1
      </button>
      <button
        data-testid="version-option-v2"
        onClick={() => go("v2")}
        aria-pressed={currentVersion === "v2"}
        className="version-option-btn"
      >
        v2
      </button>
      <button
        data-testid="version-option-v3"
        onClick={() => go("v3")}
        aria-pressed={currentVersion === "v3"}
        className="version-option-btn"
      >
        v3
      </button>
    </div>
  );
}
