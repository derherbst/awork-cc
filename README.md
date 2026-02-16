# Awork Challenge

An Angular 20 application that fetches and displays 5000 users from the [randomuser.me](https://randomuser.me/) API with grouping, virtual scrolling, and responsive design.

**Live demo:** https://derherbst.github.io/awork-cc/

## Prerequisites

- [Node.js](https://nodejs.org/) v20.19+ or v22.12+ (recommended: v22)
- npm (included with Node.js)

## Setup

```bash
npm install
```

## Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The app reloads automatically on source changes.

## Build

```bash
npm run build
```

Build artifacts are stored in the `dist/` directory.

## Running Tests

```bash
# Interactive (opens Chrome)
npm test

# Headless (CI-friendly)
npx ng test --watch=false --browsers=ChromeHeadless
```

## Features

- **5000 users** rendered performantly via CDK virtual scrolling
- **Grouping by criteria** — nationality, alphabetical (last name), or age ranges
- **Web Worker** handles grouping computation off the main thread
- **Expandable details** — click a user to see extra info inline
- **Client-side search** — filter by last name prefix (no API call)
- **Load more** — paginated loading, appends next 5000 users to existing groups
- **Responsive layout** — adapts to mobile screens below 810px
- **Skeleton loader** — shimmer animation during initial data fetch

## Documentation

See [DOCUMENTATION.md](./DOCUMENTATION.md) for a detailed summary of the approach, architecture decisions, and performance trade-offs.
