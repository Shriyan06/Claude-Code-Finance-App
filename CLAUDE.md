# Tally: working notes for Claude Code

## Theming: how to change how the app looks

The whole look is driven from **one file: `theme/tokens.css`**. To restyle the app, edit that file and nothing else.
The user will usually ask in plain words ("make it warmer", "less contrast", "try a forest green", "add a light mode").
Translate that into token edits; don't touch component files for a colour change.

### Rules

1. **Colours live only in `theme/tokens.css`.** Never write a hex, `rgb()` or Tailwind colour literal in a component, page or stylesheet. Use the semantic aliases (`--bg`, `--surface`, `--text`, `--text-2`, `--brand`, `--positive`, `--danger`, `--cat-*`).
2. **If a component needs a colour that has no token,** add a token to `tokens.css` (raw colour in the palette block, alias in the semantic block) and use that. Soft tints use `color-mix(in srgb, var(--x) 14%, transparent)`, so they follow the palette automatically.
3. **Keep the palette structure when you change its values:**
   - the `--slate-*` ramp steps up evenly in lightness (950 page → 600 borders) and keeps one hue
   - `--chalk-100/300/500` are the text tiers
   - `--minium` is the single brand/primary-action colour; `--minium-ink` is the text on it; `--minium-deep` is the brand colour on light backgrounds
   - `--verdigris` money in, `--saffron` caution, `--madder` danger
   - `--cat-*` share one lightness band so no category shouts
4. **Brightness is controlled by lightness and chroma.** To make it "less bright": lower chroma on the signals and categories, lower lightness on chalk. To make it "bolder": raise chroma. Work in OKLCH when reasoning, write hex in the file.
5. **Spending is not an alarm.** Outgoing amounts stay `--text`; colour is for money in and limits crossed. Don't change that unless asked.
6. Type and shape also live in `tokens.css` (`--font-*`, `--text-*`, `--radius-*`, `--shadow-pop`). Changing fonts means updating the `next/font` imports as well (see `THEME.md`).
7. **Light mode / alternate themes:** add a `:root[data-theme="light"] { ... }` block to `tokens.css` that overrides the same variable names. Don't fork components.

### After every theme change

```bash
node scripts/sync-brand.mjs
```

This regenerates the logo set (`brand/*.svg`, plus PNGs if Playwright is installed) from the new tokens and prints a contrast table.
Fix anything marked `!` (text below 4.5:1) by adjusting lightness in `tokens.css`, then run it again.
Then look at the result: open `preview/transactions.html` and `preview/brand.html` (or the running app) and check it by eye. Contrast numbers don't catch ugly.

### Logo

`brand/*.svg` are generated. Don't edit them by hand; edit `scripts/sync-brand.mjs` (geometry) or `theme/tokens.css` (colour) and re-run. The wordmark outline is stored in `brand/src/wordmark.json`.
To rename the product, replace the outline: set the text in Bricolage Grotesque 700 and convert it to a path, then update `wordmark.json` (`d`, `width`).

### Copy on the brand board

`preview/brand.html` reads every colour from the tokens, but its headline and descriptions ("petrol, chalk, and one orange") describe the default palette. If a theme change makes them untrue, update the wording.
