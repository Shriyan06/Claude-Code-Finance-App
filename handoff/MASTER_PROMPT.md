You're restyling my existing personal-finance app with a finished design system, and renaming it **Kept**. This is a visual and branding change only. Do not change features, data handling, routes or business logic.

## 1. Get the design kit

The kit is on branch `claude/finance-app-theme-logo-wl1hnz` of `github.com/Shriyan06/Claude-Code-Finance-App`. Clone it outside the app repo:

    git clone --depth 1 --branch claude/finance-app-theme-logo-wl1hnz https://github.com/Shriyan06/Claude-Code-Finance-App /tmp/kept-kit

If you can't access it, stop and tell me; don't improvise a design.

Read these first, in order: `/tmp/kept-kit/CLAUDE.md`, `THEME.md`, `theme/tokens.css`, `preview/app.css`, `preview/transactions.html`. Then look at the three reference images in `/tmp/kept-kit/handoff/`:

1. `1-transactions-reference.png`: my Transactions screen in the new design. This is the target layout and look.
2. `2-logo-and-brand.png`: logo, lockups, icon, the brand idea.
3. `3-palette-and-type.png`: palette, category colours, type.

`preview/transactions.html` and `preview/brand.html` are live versions of those; open them in a browser if you can (`brand.html` also has a Components section: chips, budget bars, cleared marks).

## 2. Understand my app before touching it

Work out the framework (I believe Next.js), the styling approach (Tailwind, CSS modules, styled-components, inline styles), and where the sidebar, tables, forms, dialogs, charts and money formatting live. Write a short summary and plan, then create a branch `theme/kept` and start.

## 3. Install the kit

Keep these at the repo root, exactly as in the kit, so the relative paths in the scripts and docs keep working: `theme/`, `brand/`, `scripts/`, `preview/`. Also copy `.claude/commands/theme.md`.

- `theme/tokens.css` is the single source of truth for colour, type, radius and shadow. Import it first from the root layout or global CSS. Colours may be defined nowhere else.
- Append the theming sections of the kit's `CLAUDE.md` to my app's `CLAUDE.md` (create it if missing). Don't overwrite my existing instructions.
- Fonts: **Bricolage Grotesque** (titles, wordmark, big numbers) and **Instrument Sans** (all UI), loaded the framework's normal way (for Next.js, `next/font/google`, wired to `--font-display` and `--font-ui` as described in `THEME.md`). Remove the old font setup.
- If lint or type checks pick up `scripts/` or `preview/`, exclude them rather than editing them.

## 4. Convert every colour to tokens

- Find every hard-coded colour: hex, rgb/hsl, Tailwind palette classes (`bg-zinc-900`, `text-amber-400`, ...), inline styles, chart configs, SVG fills. Replace each with a token-backed style. If I'm using Tailwind, expose the tokens in the Tailwind config or `@theme` (for example `surface: var(--surface)`), then swap the classes. Leave no old palette classes behind.
- Role mapping: page background `--bg`; sidebar and footer `--bg-sidebar`; cards, inputs and the inline entry row `--surface`; row hover `--surface-hover`; menus and popovers `--surface-raised`; borders `--line` and `--line-strong`; text `--text`, `--text-2`, `--text-3`; primary button `--brand` with `--brand-ink` text and `--brand-hover`; focus ring `--focus-ring`; money in `--positive`; warnings `--caution`; over-budget and destructive actions `--danger`; categories and account dots `--cat-*`.
- Charts (Dashboard, Reports): use the tokens too. Pass `var(--cat-…)` where the chart library accepts CSS variables, otherwise read them once with `getComputedStyle` in a single helper. Don't copy hex values into code.
- The app is dark only for now. Don't add a light mode.

## 5. Design rules to preserve

1. The accent (`--brand`) means brand or primary action. Not decoration, not "bad".
2. Spending is not an alarm: outgoing amounts are plain `--text`. Colour is only for money in (`--positive`) and limits crossed (`--danger`). Do not render ordinary expenses in red.
3. The "tally stroke" is the one recurring device: a 3-4px rounded vertical bar in `--brand` marks the active nav item (see `.nav a[aria-current]` in `preview/app.css`) and the highlighted autocomplete suggestion; a `--positive` stroke marks a cleared transaction, an empty ring an uncleared one (see `.tick` and `.ring`).
4. Money is always tabular (`font-variant-numeric: tabular-nums`, class `.num`), uses a true minus (U+2212) and dims the cents (`.cents`). Apply this in the app's one money-formatting component or helper, not on each page.
5. Page titles and headline figures use `--font-display`. Everything else uses `--font-ui`. Table headers are 11px, uppercase and letter-spaced, as in the reference.
6. Match the structure, spacing and density of image 1 on the Transactions page, and adapt the same patterns to the other pages (Dashboard, Accounts, Cards, Budgets, Goals, Reports, Import, Settings). Adapt my components to the look; don't paste the preview's HTML over them.

## 6. Brand

- The product is now **Kept**. Update the page title, metadata, sidebar logo, empty states and any other visible mention of the old name.
- Sidebar header: `brand/logo.svg`, about 36px tall. When the sidebar is collapsed, use `brand/mark.svg`.
- Icons: `brand/favicon.svg` becomes the app's `icon.svg` (for Next.js, `app/icon.svg`); `brand/png/apple-touch-icon.png` becomes `apple-icon.png`; `brand/png/icon-192.png` and `icon-512.png` go in a web manifest. Set `theme-color` to the `--ground-950` value from `tokens.css`. Remove the old favicon and logo files.
- Don't edit `brand/*.svg` by hand; they're generated (see the kit's `CLAUDE.md`).

## 7. Verify before you call it done

- Run the app. Screenshot every main page at 1440x900 and compare the Transactions page against image 1. Fix anything that looks off: spacing, contrast, a stray old colour, a control that lost its focus ring.
- Run the project's lint, type-check, tests and a production build. Report any failures you can't fix; don't hide them.
- Run `node scripts/sync-brand.mjs`. It must report "All text pairs pass AA".
- Search the app code (excluding `theme/tokens.css`, `brand/` and `preview/`) for leftover colour literals and old palette classes. There should be none.
- Check keyboard focus is visible on buttons, inputs and the nav, and that nothing relies on colour alone (cleared vs uncleared, income vs expense).

## 8. Finish

Make logical commits on `theme/kept`. Do not push to main, merge, or open a PR unless I ask. Finish with a report covering what changed, any place where you departed from the reference and why, anything you couldn't convert, and the paths of your screenshots.

For future colour changes I'll use `/theme <what I want>`, so confirm that command works in this repo.
