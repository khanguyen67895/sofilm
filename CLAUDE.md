@AGENTS.md

# SoFilm — Movie/Series/Shorts Streaming Web App

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript (strict)
- **TailwindCSS 4** (CSS-first config via `@theme inline` in `globals.css`, no `tailwind.config.ts`)
- **@tanstack/react-query 5** — server state / data fetching, devtools included
- **Axios** — HTTP client (`src/lib/axios.ts`), interceptors handle auth token + silent refresh
- **Socket.io Client** — realtime (`src/lib/socket.ts` + `src/providers/socket-provider.tsx`), connects only when authenticated
- **Framer Motion** — micro-interactions (hero banner, movie card hover)
- **next-themes** — dark/light theme, default `dark`, class-based (`attribute="class"`)
- **React Virtuoso** — virtualized lists: `VirtuosoGrid` for movie grids/search, `Virtuoso` for the vertical shorts feed
- **Zustand** — client state (`src/store/`): `auth.store.ts` (persisted), `ui.store.ts`, `player.store.ts`
- **lucide-react**, **clsx** + **tailwind-merge** (`cn()` helper)

## Directory Structure

```
src/
├── app/                    # Routes only — thin, delegate to features/*
│   ├── layout.tsx          # Root layout: fonts, AppProviders, Header/Footer/MobileNav
│   ├── page.tsx            # "/" → features/home
│   ├── movie/[slug]/       # → features/movie (detail + player)
│   ├── category/           # → features/movie (infinite catalog grid, "View All" target)
│   ├── search/             # → features/search
│   ├── shorts/             # → features/shorts
│   ├── subscription/       # → features/subscription
│   ├── profile/            # → features/profile
│   └── auth/login|register/ # → features/auth
│
├── components/             # Shared, dumb/presentational — no feature-specific data fetching
│   ├── ui/                 # button (pill/brand), input, skeleton, badge, spinner
│   ├── common/              # logo (SVG mark + SOFILM wordmark), theme-toggle, social-icons
│   ├── movie/                # movie-card, movie-row (carousel + View All + scroll arrow), movie-grid (Virtuoso)
│   ├── player/                # video-player (native <video>, controlled by player.store)
│   └── layout/                # header, footer, mobile-nav
│
├── features/                # One folder per domain: components/ + hooks/ + index.ts barrel
│   ├── auth/                  # login-form, register-form, use-login, use-register
│   ├── home/                   # hero-banner (slider), trending-row, all-movies-section, home-view
│   ├── movie/                    # movie-detail-view, movie-catalog-view (/category), episode-list
│   ├── search/                    # search-view (debounced), use-search-movies
│   ├── shorts/                     # shorts-feed (Virtuoso), short-item, use-shorts-feed
│   ├── subscription/                # subscription-view, plan-card, use-plans, use-checkout
│   └── profile/                      # profile-view, use-favorites
│
├── services/                # Axios calls, grouped by domain — NOT React-aware
│   ├── api/                   # apiClient + ENDPOINTS re-export (single import point)
│   ├── auth/                    # auth.service.ts — login/register/logout/me
│   ├── movie/                     # movie.service.ts — home rows/detail/search/shorts/favorites
│   └── payment/                     # payment.service.ts — plans/checkout/history
│
├── hooks/                    # Cross-feature hooks: use-debounce, use-media-query, use-socket-event
├── lib/                      # Framework wiring: axios.ts, socket.ts, query-client.ts, mock-data.ts
├── store/                    # Zustand stores (+ index barrel)
├── providers/                # QueryProvider, ThemeProvider, SocketProvider, AppProviders (composes all 3)
├── types/                    # movie.ts, user.ts, shorts.ts, subscription.ts, api.ts
├── constants/                 # config.ts (site/API), routes.ts, endpoints.ts, query-keys.ts
├── utils/                     # cn.ts, format.ts
└── styles/                    # (reserved — globals.css currently lives in app/)
```

## Conventions

- **`app/*/page.tsx` stays thin**: import a view component from `features/<name>` and render it. All logic/data-fetching lives in `features/`.
- **`services/*` are plain async functions**, never call React hooks. `features/*/hooks` wrap them with `useQuery`/`useMutation`.
- **Query keys** are centralized in `constants/query-keys.ts` — always reuse/extend them instead of inlining array literals.
- **Routes** are centralized in `constants/routes.ts` (typed helpers like `ROUTES.movie(slug)`) — never hardcode hrefs.
- **API endpoints** are centralized in `constants/endpoints.ts`.
- Components that need `useState`/hooks/browser APIs are marked `"use client"`; route files and simple presentational wrappers stay server components where possible.
- Barrel `index.ts` files exist in every `components/*`, `features/*`, and `store/` folder — import from the folder, not the file, when consuming from outside that folder.

## Design system

- **Brand color**: a single accent token, not Tailwind's default red/blue — defined in `globals.css` under `@theme inline` as `--color-brand` (#ff6a3d), `--color-brand-dark`, `--color-brand-light`. Generates `bg-brand`, `text-brand`, `hover:bg-brand-dark`, etc. Always use these tokens instead of hardcoding `orange-*`/`red-*` so the whole site re-themes from one place.
- **`Button`** (`components/ui/button.tsx`) is pill-shaped (`rounded-full`), uppercase, set in the `Unbounded` display font (`font-heading` utility → `--font-heading` token → `next/font/google` `Unbounded`, loaded in `app/layout.tsx`). Variants: `primary`/`secondary` use the frosted-glass treatment (`.btn-glass` + `.btn-glass-primary`/`-secondary` in `globals.css` — a stacked inset-shadow bevel + `backdrop-filter: blur` + a radial-gradient fill, ported from a Figma glassmorphism spec); `outline`/`ghost` stay flat/bordered for use on solid backgrounds where the glass effect would be too subtle to read (e.g. `AllMoviesSection`'s "View All", profile login/logout). Prefer `primary`/`secondary` for CTAs sitting over imagery (hero, cards) and `outline`/`ghost` for flat-background contexts.
- **`Badge`** is used as the "Premium" ribbon on `MovieCard` posters (`components/ui/badge.tsx` — brand-filled, uppercase, small).
- **Homepage layout** (`features/home`), top to bottom: `HeroBanner` (backdrop slider — click a thumbnail or the chevrons to switch the featured movie; progress bar + counter reflect the active index) → `MovieRow`s ("Continue Watching", "New Releases", each with a "View All" link to `/category` and a hover scroll-arrow button) → `TrendingRow` (large outlined rank number overlaid bottom-left on the poster) → `AllMoviesSection` (static grid + "View All" button to `/category`).
- **`/category`** is the infinite-scroll catalog (`features/movie/movie-catalog-view.tsx`, `useMovieCatalog` via `useInfiniteQuery` + `MovieGrid`'s `onEndReached`) — the landing spot for every "View All" link on the homepage.
- Header search (`components/layout/header.tsx`) submits to `/search?q=...`; `SearchView` reads that initial value via `useSearchParams` (page is wrapped in `<Suspense>` per Next.js's requirement for that hook).
- Social icons in the footer (Messenger/YouTube/TikTok/Facebook) are hand-drawn inline SVGs in `components/common/social-icons.tsx` — lucide-react does not ship brand/social glyphs.

## Motion conventions (Framer Motion)

Motion is applied site-wide, not just on the homepage. **Any file that imports `motion`/`AnimatePresence` from `framer-motion` must have `"use client"` as its first line** — even if it's only ever rendered from other Client Components. Framer Motion has no server-safe fallback, so a Server Component (a file with no `"use client"` and no hooks) that renders a motion-using child module directly will crash at prerender with `createMotionComponent() from the server`. This bit us once already: `Button` and `Footer` both used `motion.*` without the directive and broke the production build the moment a Server Component (`AllMoviesSection`) rendered them — always add `"use client"` the same commit you add a `motion` import, don't rely on a parent's directive.

- **`PageTransition`** (`components/layout/page-transition.tsx`) wraps `{children}` in `app/layout.tsx` — every route change fades/slides via `AnimatePresence`, keyed on `usePathname()`.
- **`Reveal`** (`components/common/reveal.tsx`) is the shared scroll-in wrapper (`whileInView`, fires once) — used to stagger-reveal homepage sections, the footer, and the subscription plan grid. Don't add per-item `whileInView` inside `MovieGrid`'s Virtuoso `itemContent` — Virtuoso recycles DOM nodes while scrolling, so a mount-triggered animation re-fires on every recycle and looks janky; `MovieCard`'s hover-only `whileHover` is safe there since it's interaction-triggered, not mount-triggered.
- **`Button`** is a `motion.button` (hover/tap scale) — see Design system above for the glass variants.
- Small interaction-only touches: `ThemeToggle` swaps icons via `AnimatePresence`, `MobileNav`'s active tab dot uses `layoutId` for a sliding indicator, `ShortItem`'s like button pops on toggle, `PlanCard` lifts on hover, footer social icons scale on hover.

## Data layer status (important for next session)

`movie.service.ts` and `payment.service.ts` currently return **mock data** (`src/lib/mock-data.ts`) with a simulated delay, so the whole app runs and looks real with zero backend. The real `apiClient` call is left commented directly above each mock implementation — swap the body when the backend is ready, the function signature/return type won't need to change. `auth.service.ts` already calls the real API (`apiClient`) since login/register need a real backend regardless.

Backend base URLs come from env vars (create `.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
```

## Commands

- `npm run dev` — Turbopack dev server
- `npm run build` — production build (also runs the TypeScript check)
- `npm run lint` — ESLint

## Known follow-ups

- No test setup yet (Vitest/Playwright not installed).
- `next/image` remote patterns currently allow `picsum.photos` (mock posters) and `image.tmdb.org` — add your real CDN domain in `next.config.ts` when wiring a real backend.
- Auth guard/middleware for `/profile` and premium content is not implemented — `profile-view.tsx` only checks `useAuthStore` client-side.
