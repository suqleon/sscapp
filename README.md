# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 1 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Read `project/Shark Swimming Club App.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `Shark Swimming Club app` project files (HTML prototypes, assets, components)
- `PRD.md` — product requirements document for building this design as a real native app for Android and iOS (roles, scope, security requirements, proposed architecture, open questions)
- `PRD.html` — the same PRD, laid out for reading/sharing — published version: https://claude.ai/code/artifact/1c11fd1e-65cd-40ab-ae02-eef2333f86de

## Code

- **Root (`src/`, `index.html`, `vite.config.js`)** — interactive React web version of the design, deployed to Vercel as a shareable demo.
- **`mobile/`** — the real Android/iOS app (Expo / React Native). See `mobile/README.md`.
- **`supabase/schema.sql`** — the shared backend schema (Postgres + Row Level Security) used by both.

## Status

The visual design (9 screens + brand editor) is done. The PRD above turns it into a real build plan, but development hasn't started — see `PRD.md` section 11 ("Preguntas abiertas") for the decisions still needed from the business owner before implementation begins.
