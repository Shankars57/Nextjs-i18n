"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(
  async () =>
    (await import("swagger-ui-react")).default as ComponentType<{ url: string }>,
  { ssr: false },
);

export default function ApiReference() {
  return (
    <div>
      <div className="swagger-wrap">
        <div className="swagger-ui">
          <SwaggerUI url="/openapi.json" />
        </div>
      </div>
    </div>
  );
}
