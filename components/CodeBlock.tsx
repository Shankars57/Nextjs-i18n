"use client";
import { useState } from "react";

export default function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div data-testid="code-block" className="code-block">
      <pre className="code-block-pre">
        <code>{code}</code>
      </pre>
      <button data-testid="copy-code-button" onClick={copy} className="copy-code-btn">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
