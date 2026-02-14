# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 20 standalone application that fetches and displays user data from the randomuser.me API. Built with TypeScript 5.9, SCSS, and RxJS.

## Commands

- **Dev server:** `npm start` (serves at http://localhost:4200)
- **Build:** `npm run build`
- **Watch mode:** `npm run watch`
- **Run all tests:** `npm test` (Karma + Jasmine, launches Chrome)
- **Run tests headless:** `ng test --watch=false --browsers=ChromeHeadless`

No linter is configured; TypeScript strict mode is the primary code quality check.

## Architecture

**Standalone components** (no NgModules) using Angular's modern APIs: `input()` signals, `@if`/`@for` control flow syntax, and `bootstrapApplication`.

### Data Flow

`AppComponent` → injects `UsersService` → fetches users → passes to `UserListComponent` (via input signal) → renders `UserItemComponent` for each user.

### Key Locations

- `src/app/components/` — UI components (user-list, user-item)
- `src/app/services/users.service.ts` — HTTP service fetching from `https://randomuser.me/api`
- `src/app/services/users.service.stub.ts` — Test stub using mock data
- `src/app/models/` — `User` class (with `mapFromUserResult` static factory) and API response interfaces
- `src/app/mock-data.ts` — Large mock dataset for testing
- `src/styles/ease/` — EASE design system (variables, colors, typography)
- `src/app/app.config.ts` — Application bootstrap config (HttpClient, Router, Zone)
- `src/app/app.routes.ts` — Routes (currently empty)

## Code Conventions

- 2-space indentation, single quotes in TypeScript
- SCSS for component styles with EASE design system imports
- Tests use `UsersServiceStub` for service mocking with `TestBed`
