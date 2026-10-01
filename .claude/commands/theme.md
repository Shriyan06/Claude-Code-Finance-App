---
description: Change the app's theme (colours, brightness, mood) from a plain-English request
argument-hint: <what you want, e.g. "warmer and a bit darker" or "forest green with a gold accent">
---

The user wants to change the app's look: **$ARGUMENTS**

Follow the theming rules in `CLAUDE.md`. In short:

1. Read `theme/tokens.css` and decide the smallest set of token edits that delivers the request. Keep the palette's structure (even slate ramp, one brand colour, categories in one lightness band). Edit only `theme/tokens.css`.
2. Run `node scripts/sync-brand.mjs`. If it marks any text pair with `!`, fix the lightness and run it again until it passes.
3. If the app is runnable, start it and look at the Transactions page; otherwise open `preview/transactions.html` and `preview/brand.html` in a browser and screenshot them. Judge by eye: is anything harsh, muddy, or hard to tell apart (category dots, cleared vs not cleared)? Adjust once if so.
4. Reply with: what you changed in one or two sentences, the new key colours (page, text, brand), and anything you chose that the user might want to reverse. Do not paste the whole file.

If the request is vague ("make it nicer"), pick a concrete direction, say what it is, and apply it. The user can ask for another pass.
If it needs something the tokens can't express (new fonts, layout changes), say so and ask before making component edits.
