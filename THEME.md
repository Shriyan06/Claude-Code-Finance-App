# Tally: theme and logo

Direction: **petrol-green ledger cloth, chalk-white figures, one rubric-orange signal.**
The logo is a tally mark: four counted strokes, one struck across.

> **Heads-up:** this repo was empty when I started, so I could not restyle your running app.
> Everything here is a drop-in kit plus a faithful recreation of your Transactions screen.
> Push the app source (or paste it into a session) and the kit can be applied for real.
> "Tally" is a working name I chose for the logo. Rename it in `brand/` if you prefer.

## Look at it

Open in a browser (no build step):

- `preview/transactions.html`: your Transactions screen, same layout and data, new theme
- `preview/brand.html`: logo, palette, type, components

## What's in the kit

| Path | Purpose |
|---|---|
| `theme/tokens.css` | All colour, type, radius and shadow tokens as CSS variables, plus base styles |
| `preview/app.css` | Component patterns (sidebar, filters, ledger rows, inline entry, menu, footer) |
| `brand/*.svg` | Logo lockups, mark (dark, light, on-orange), app icon, favicon, wordmark (outlined, no font needed) |
| `brand/png/` | `icon-512`, `icon-192`, `apple-touch-icon` (180, full-bleed), `favicon-32`, `favicon-16` |
| `preview/fonts/` | Latin woff2 files used by the previews |

## Palette

| Role | Token | Hex |
|---|---|---|
| Page | `--slate-950` | `#06191C` |
| Sidebar, footer | `--slate-900` | `#0B2023` |
| Cards, entry row | `--slate-850` | `#112629` |
| Row hover | `--slate-800` | `#152B2E` |
| Menus | `--slate-750` | `#193033` |
| Hairlines | `--slate-700` | `#253B3E` |
| Strong borders | `--slate-600` | `#3C5558` |
| Text | `--chalk-100` | `#EEEBE1` (15.1:1) |
| Secondary text | `--chalk-300` | `#AFBAB6` (9.0:1) |
| Labels, hints | `--chalk-500` | `#8B9898` (6.1:1) |
| **Brand, primary action, focus** | `--minium` | `#F5723A` |
| Money in, cleared | `--verdigris` | `#63CEAF` |
| Nearing a limit | `--saffron` | `#EAC25A` |
| Over budget, destructive | `--madder` | `#ED647C` |

Nine category colours (`--cat-*`) share one lightness band so no category outshouts another.
Contrast ratios are measured against `--slate-950`; every text pair clears 4.5:1 on all surfaces.

### Rules that make it feel designed rather than themed

1. **Orange means brand or primary action.** Don't use it for decoration or for "bad".
2. **Spending is not an alarm.** Outgoing amounts stay chalk. Colour is for money in (`--verdigris`) and for limits crossed (`--madder`).
3. **The tally stroke is the one recurring device.** It marks the active nav item, the highlighted suggestion, and a cleared transaction.
4. Money is always tabular (`.num`), uses a true minus (U+2212), and dims the cents.

## Type

- **Bricolage Grotesque** (600-700): page titles, wordmark, headline figures
- **Instrument Sans** (400-700): everything else; 13px in the ledger

Both have tabular figures (verified in the font tables).

## Applying it to the Next.js app

1. **Tokens.** Copy `theme/tokens.css` into the app and import it in `app/layout.tsx` before your own CSS.
2. **Fonts.** Use `next/font` and point the tokens at the generated variables:
   ```tsx
   import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
   const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-bricolage" });
   const ui = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });
   // <html className={`${display.variable} ${ui.variable}`}>
   ```
   Then in your CSS: `:root { --font-display: var(--font-bricolage), ui-sans-serif, sans-serif; --font-ui: var(--font-instrument), ui-sans-serif, sans-serif; }`
3. **Colours.** Replace hard-coded colours with the semantic tokens (`--bg`, `--surface`, `--text`, `--brand`, ...).
   With Tailwind v4, expose them in `@theme`, e.g. `--color-surface: var(--surface);`.
4. **Logo and icons.**
   - `brand/tally-logo.svg` in the sidebar header (36px tall)
   - `brand/favicon.svg` → `app/icon.svg`
   - `brand/png/apple-touch-icon.png` → `app/apple-icon.png`
   - `brand/png/icon-192.png` and `icon-512.png` for a web manifest
5. **Cleared column.** Swap the status circle for the tally stroke (`.tick`) when cleared and the open ring (`.ring`) when not. See `preview/app.css`.
