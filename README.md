# Documentation Portal

Production-ready multi-language documentation portal built with Next.js App Router, TypeScript, and TailwindCSS.

## Project overview

This project delivers:

- ISR docs pages with `revalidate = 60`
- i18n sub-path routing (`/en`, `/es`, `/fr`, `/de`)
- Versioned docs (`v1`, `v2`, `v3`)
- Client-side full-text search with `flexsearch`
- Swagger UI API reference (`/api-reference`)
- Docker multi-stage build and `docker-compose` healthcheck
- Theme toggle with persistent preference
- Sidebar navigation
- TOC with scroll spy
- Code copy-to-clipboard
- Feedback widget (client-only)

## Architecture

- `app/` contains App Router routes and layouts.
- `app/[locale]/docs/[version]/[slug]/page.tsx` statically renders markdown docs.
- `_docs/` stores source markdown by version and locale.
- `components/` contains reusable UI widgets.
- `public/search-index.json` powers client-side search.
- `public/openapi.json` is loaded by Swagger UI.

## How ISR works

Documentation pages export:

```ts
export const revalidate = 60;
```

Pages are statically generated via `generateStaticParams` and revalidated every 60 seconds.

Cache headers are set in `next.config.ts`:

`Cache-Control: s-maxage=60, stale-while-revalidate`

## How i18n works

Routing uses locale sub-paths:

- `/en/docs/v1/introduction`
- `/es/docs/v2/getting-started`

`LanguageSwitcher` preserves current version and slug while changing locale.

## Docker

Run:

```bash
docker-compose up --build -d
```

Service:

- name: `app`
- port: `3000`
- healthcheck: `http://localhost:3000`

## Folder structure

```text
.
├── _docs/
│   ├── v1/{en,es,fr,de}/
│   ├── v2/{en,es,fr,de}/
│   └── v3/{en,es,fr,de}/
├── app/
├── components/
├── public/
│   ├── locales/{en,es,fr,de}/common.json
│   ├── openapi.json
│   └── search-index.json
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Feature mapping

- Sidebar: `data-testid="sidebar"` and `sidebar-nav-link-{slug}`
- Version selector: `data-testid="version-selector"` and `version-option-v1|v2|v3`
- Theme toggle: `data-testid="theme-toggle"` and `<html>` `dark` class persistence
- Search: `search-input`, `search-results`, `search-no-results`
- TOC: `table-of-contents`, `toc-link-{heading-slug}`, active `data-active="true"`
- Feedback: `feedback-input`, `feedback-submit`, `feedback-success-message`
- Code block: `code-block`, `copy-code-button`

## Local run

```bash
npm run dev
```

## Build

```bash
npm run build
```
