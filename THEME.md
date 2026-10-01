# Tally: theme and logo

Direction: **warm graphite, soft chalk figures, one dusty-rose accent.**
The logo is a tally mark: four counted strokes, one struck across.

> **Heads-up:** this repo had no app code when I built this, so the kit is a drop-in plus a faithful
> recreation of the Transactions screen. Once the app source is in the repo, apply it with the steps below.
> "Tally" is a working name. See `CLAUDE.md` for how to rename.

## Change the theme by asking Claude Code

The whole look comes from **one file, `theme/tokens.css`**. `CLAUDE.md` teaches Claude Code the rules, so you can just ask:

```
/theme warmer, and a little less contrast
/theme forest green with a brass accent
/theme add a light mode
```

or in plain chat: "make the category colours quieter", "the rose is too pink".
Claude Code edits the tokens, runs `node scripts/sync-brand.mjs` (regenerates the logo set and checks contrast), and checks the result by eye.
Because components only read tokens, nothing else needs to change.

## Look at it

Open in a browser, no build step: `preview/transactions.html` (your screen, new theme) and `preview/brand.html` (logo, palette, type, components; reads live from the tokens).

## What's in the kit

| Path | Purpose |
|---|---|
| `theme/tokens.css` | **The single source of truth:** colour, type, radius, shadow tokens as CSS variables |
| `CLAUDE.md`, `.claude/commands/theme.md` | Instructions and the `/theme` command for Claude Code |
| `scripts/sync-brand.mjs` | Regenerates `brand/` from the tokens; prints a contrast table (`--strict` fails on <4.5:1) |
| `brand/*.svg`, `brand/png/` | Generated logo lockups, mark variants, app icon, favicon, PNGs |
| `preview/` | Reference screen, brand board, component styles, fonts |

## Palette (current)

| Role | Tokens |
|---|---|
| Surfaces | `--ground-950` page `#161311`, then 900, 850, 800, 750, 700, 600 (borders) |
| Text | `--chalk-100` `#DEDAD3`, `--chalk-300` `#B1ADA7`, `--chalk-500` `#918D86` |
| Brand and primary action | `--accent` `#CA889E` (dusty rose), plus `-bright`, `-deep`, `-ink` |
| Money in, cleared | `--positive` sage `#8DBF9A` |
| Nearing a limit | `--caution` straw `#D6BB79` |
| Over budget, destructive | `--danger` red `#ED6E63` |
| Categories | nine `--cat-*` colours in one lightness band |

Tokens are named by role, not hue, so a retheme never leaves a misleading name behind. `preview/brand.html` always shows the live values and contrast.

Rules that keep it feeling designed:

1. **The accent means brand or primary action.** Not decoration, not "bad".
2. **Spending is not an alarm.** Outgoing amounts stay chalk; colour is for money in and limits crossed.
3. **The tally stroke is the one recurring device:** active nav item, highlighted suggestion, cleared transaction.
4. Money is tabular (`.num`), uses a true minus (U+2212), and dims the cents.

## Type

**Bricolage Grotesque** (600-700) for titles, wordmark and headline figures; **Instrument Sans** (400-700) for everything else. Both have tabular figures.

## Applying it to the Next.js app

1. **Tokens.** Import `theme/tokens.css` in `app/layout.tsx` before your own CSS.
2. **Fonts.** With `next/font`:
   ```tsx
   import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
   const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-bricolage" });
   const ui = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });
   // <html className={`${display.variable} ${ui.variable}`}>
   ```
   and in your CSS: `:root { --font-display: var(--font-bricolage), ui-sans-serif, sans-serif; --font-ui: var(--font-instrument), ui-sans-serif, sans-serif; }`
3. **Colours.** Replace hard-coded colours with the semantic tokens. A good first prompt for Claude Code:
   *"Replace every hard-coded colour in the app with the tokens in theme/tokens.css, following CLAUDE.md."*
   With Tailwind v4, expose them in `@theme`, e.g. `--color-surface: var(--surface);`.
4. **Logo and icons.** `brand/tally-logo.svg` in the sidebar header (36px tall); `brand/favicon.svg` → `app/icon.svg`; `brand/png/apple-touch-icon.png` → `app/apple-icon.png`; `icon-192.png` / `icon-512.png` for a manifest.
5. **Cleared column.** Tally stroke (`.tick`) when cleared, open ring (`.ring`) when not. See `preview/app.css`.
