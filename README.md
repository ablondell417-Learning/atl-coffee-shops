# ATL Coffee ☕

A personal coffee enthusiast web app for discovering and tracking coffee shops around Atlanta. Built with React, TypeScript, Vite, and Tailwind CSS. All favorites and notes persist in your browser via localStorage — no backend required.

---

## Features

- Browse 10 real Atlanta coffee shops across multiple neighborhoods
- Filter shops by neighborhood using a persistent left sidebar
- Click any card to open a full detail modal
- Save favorites with the heart button (persists after refresh)
- Write personal notes per shop (autosaved to localStorage)
- Log In and Sign Up via a tabbed auth modal (mock UI, ready for backend integration)

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Vite + React + TypeScript | App framework and build tooling |
| Tailwind CSS | Utility-first styling |
| localStorage | Persisting favorites and notes client-side |

---

## Project Structure

```
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx               # App entry point
    ├── App.tsx                # Root component — state wiring, filter logic, modal control
    ├── index.css              # Tailwind directives
    ├── types/
    │   └── index.ts           # CoffeeShop and UserData interfaces
    ├── data/
    │   └── shops.ts           # Static mock data for 10 Atlanta coffee shops
    ├── hooks/
    │   ├── useLocalStorage.ts # Generic hook: useLocalStorage<T>(key, defaultValue)
    │   ├── useFavorites.ts    # favorites: string[], toggleFavorite(id)
    │   └── useNotes.ts        # notes: Record<string, string>, setNote(id, text)
    └── components/
        ├── FilterBar.tsx       # Vertical sidebar: neighborhood list with per-neighborhood counts
        ├── ShopCard.tsx        # Card: image, name, neighborhood, rating, favorite button
        ├── ShopGrid.tsx        # Responsive grid of ShopCards with empty state
        ├── ShopDetailModal.tsx # Modal: full details, website link, notes textarea
        └── AuthModal.tsx       # Tabbed Log In / Sign Up modal (mock, ready for real auth)
```

---

## localStorage Keys

| Key | Type | Contents |
|---|---|---|
| `atl-coffee-favorites` | `string[]` | Array of favorited shop IDs |
| `atl-coffee-notes` | `Record<string, string>` | Map of shop ID → personal note text |

---

## Setup Steps (What Was Done)

These are the exact steps taken to build this project from scratch.

### 1. Install Node.js

Node.js was not pre-installed. Downloaded the LTS installer from [nodejs.org](https://nodejs.org) and ran it. This placed `node.exe` and `npm` at `C:\Program Files\nodejs\`.

> **Note:** After installation, you may need to open a new terminal for `node` and `npm` to be available on your PATH.

### 2. Create the project directory

```
C:\Users\ALEXBLONDELL\Documents\Personal\Claude Decatur Coffee Project\
```

All project files were written manually (since `npm create vite` requires Node.js to already be on PATH in the terminal session — a fresh terminal after install resolves this for future projects).

### 3. Write config files

The following config files were created to replicate what `npm create vite@latest . -- --template react-ts` would generate:

- `package.json` — dependencies: react, react-dom; devDependencies: vite, typescript, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer, eslint packages
- `vite.config.ts` — Vite config using `@vitejs/plugin-react`
- `tsconfig.json` + `tsconfig.node.json` — TypeScript config in bundler mode
- `index.html` — HTML entry point pointing to `src/main.tsx`
- `.eslintrc.cjs` — ESLint with TypeScript and React hooks rules
- `.gitignore` — standard Node/Vite ignores

### 4. Configure Tailwind CSS

- `tailwind.config.js` — content paths set to `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`
- `postcss.config.js` — plugins: tailwindcss, autoprefixer
- `src/index.css` — Tailwind directives (`@tailwind base/components/utilities`)

### 5. Define the data model

`src/types/index.ts`:
```typescript
interface CoffeeShop {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  googleRating: number;
  googleReviewCount: number;
  imageUrl: string;
  website?: string;
  description?: string;
}
```

### 6. Add mock data

`src/data/shops.ts` — 10 Atlanta coffee shops with real names, addresses, neighborhoods, plausible ratings, and Unsplash images:

| Shop | Neighborhood |
|---|---|
| Jittery Joe's | Decatur |
| Land of a Thousand Hills | Decatur |
| Batdorf & Bronson | Decatur |
| Condesa Coffee | Inman Park |
| Hodgepodge Coffeehouse | Old Fourth Ward |
| West End Blend | West End |
| Taproom Coffee | Kirkwood |
| Café Intermezzo | Midtown |
| Spiller Park Coffee | Ponce City Market |
| Chattahoochee Coffee Company | Buckhead |

### 7. Build custom hooks

- `useLocalStorage<T>` — reads initial value from localStorage, writes on every update
- `useFavorites` — wraps useLocalStorage with a `toggleFavorite(id)` helper
- `useNotes` — wraps useLocalStorage with a `setNote(id, text)` helper

### 8. Build components

- `FilterBar` — derives unique neighborhoods from the shop list; renders "All" + one pill per neighborhood; highlights the active filter; shows filtered shop count
- `ShopCard` — image (aspect-video), name, neighborhood badge, star rating, review count, address; heart button in top-right that stops click propagation; hover scale on image
- `ShopGrid` — responsive CSS grid (1 → 2 → 3 → 4 columns); empty state with ☕ icon
- `ShopDetailModal` — full-screen backdrop (click to close), Escape key to close, body scroll locked while open; larger image, all shop details, website link, notes textarea with autosave

### 9. Wire up App.tsx

- State: `selectedNeighborhood` (filter), `activeShopId` (modal)
- Derives `filteredShops` from full list on every render
- Passes hooks (favorites, notes) down as props
- Renders: header → FilterBar → ShopGrid → ShopDetailModal (conditional)

### 10. Rework layout with vertical sidebar and auth UI

**Layout change (`App.tsx`, `FilterBar.tsx`)**

- Switched from a centered single-column layout to a full-height two-column layout: fixed-width left sidebar + scrollable main content area
- `App.tsx` uses `h-screen flex flex-col` — header is fixed height, body below fills remaining space with `flex flex-1 overflow-hidden`
- Main content area uses `overflow-y-auto` so it scrolls independently of the sidebar
- Active neighborhood name and shop count displayed as a heading above the grid

`FilterBar.tsx` was converted from horizontal pill buttons into a full-height vertical sidebar:
- `w-56` fixed width, `sticky top-0` within the aside so the list stays in view as content scrolls
- Each row shows neighborhood name on the left and shop count on the right
- "All shops" entry at the top; active item highlighted in amber

**Auth modal (`AuthModal.tsx` — new file)**

- **Log In** (ghost style) and **Sign Up** (white filled) buttons added to the header top-right
- `authModal: 'login' | 'signup' | null` state in `App.tsx` controls which modal is open
- `AuthModal` renders a two-tab modal — tabs switch between Log In and Sign Up without closing
- Log In form: email, password, "Forgot password?" link, submit
- Sign Up form: name, email, password, confirm password, submit
- Both forms have mock `handleSubmit` handlers (closes modal) — ready to wire to a real auth backend
- Cross-links between forms ("Don't have an account? Sign up" / "Already have an account? Log in")
- Closes via X button, backdrop click, or Escape key

### 11. Security hardening

A full security audit was performed and the following vulnerabilities were identified and fixed:

**`index.html` — 3 security headers added**
- `Content-Security-Policy` — restricts what resources the browser can load; blocks XSS, inline script injection, and unauthorized external connections. Allows `img-src https:` for Unsplash images and `connect-src ws: wss:` for Vite HMR.
- `X-Frame-Options: DENY` — prevents the app from being embedded in an iframe (clickjacking protection)
- `Referrer-Policy: strict-origin-when-cross-origin` — prevents leaking the full app URL to external sites when users click shop website links

**`src/components/ShopDetailModal.tsx` — external URL validation**
- Added `isValidHttpUrl()` helper using the native `URL` constructor to validate that `shop.website` is a legitimate `http:` or `https:` URL before rendering it as a link
- Replaced the regex-based hostname display with `new URL(shop.website).hostname` for safe, accurate extraction
- Prevents `javascript:`, `data:`, or other protocol injection if data ever comes from an external source

**`src/components/AuthModal.tsx` — auth form hardening**
- Added `autoComplete="email"` on all email fields
- Added `autoComplete="current-password"` on the login password field
- Added `autoComplete="new-password"` on both signup password fields
- Added password confirmation validation in `SignupForm.handleSubmit` — blocks submission and shows an inline error if the two passwords don't match
- Confirm password field highlights red when there's a mismatch

### 12. Install dependencies and run

```bash
npm install
npm run dev
```

App runs at **http://localhost:5173**.

---

## Dev Commands

```bash
npm run dev      # Start dev server at localhost:5173
npm run build    # Type-check + production build → dist/
npm run preview  # Serve the production build locally
npm run lint     # Run ESLint
```

---

## Future: Google Places API Integration

The data model is ready for live data. To upgrade:

1. Add `googlePlaceId: string` to the `CoffeeShop` interface
2. Create a backend proxy (or Vite proxy config) to call the Places Details API — avoids exposing your API key client-side
3. Replace the static `googleRating`, `googleReviewCount`, and `imageUrl` fields with live API responses
4. Cache responses to stay within API quota
