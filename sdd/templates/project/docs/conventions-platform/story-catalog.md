# Story catalog: one colocated story per component; namespace titles per app in a shared catalog

**Rule.** Every UI component and every screen ships a **colocated** story file next to it, the
story **title** is derived from its path and namespaced by the root it belongs to, and every story
runs as a test in the gate. A component with no story is invisible
in the catalog — reviewers can't see it, visual regressions go uncaught, and a copied
design system silently loses coverage. When one catalog globs stories from **more than one
app**, two apps that carry a same-named component (`Button`, `Card`) will emit the **same
story id** and the catalog build fails — or worse, one silently shadows the other. A per-app
title namespace is what keeps a shared catalog collision-free.

## Rules

1. **A story colocates with its component.** `Widget.stories.tsx` sits beside `Widget.tsx`;
   the folder layout is the catalog's table of contents. A new component earns its story in
   the **same change** that introduces it, the same way a new endpoint earns its test — not
   "later".
2. **Coverage is all-or-nothing per surface.** Either every component in a design system is
   storied or the gap is a deliberate, recorded exception — "most are storied, some aren't"
   reads as *missing*, not *intentional*, and no reviewer can tell which. Consistency is the
   point: a catalog you can't trust to be complete is a catalog nobody trusts.
3. **The story id is derived from `title` + export name — so `title` must be unique across
   the whole catalog.** When the catalog spans a single app, the bare path (`primitives/Button`)
   is unique already. When it spans **several** apps sharing component names, that bare path
   is no longer unique.
4. **Titles are derived from the file path, never set by hand — and namespaced per root.** The
   catalog maps each story root to a title prefix, so the sidebar *is* the folder tree and a moved
   file re-titles itself. One owner takes the bare paths — the shared design-system package when
   there is one — and every app prefixes its own (`app-a/modules/…`); keep the prefix uniform
   within a root. A hand-written `title` is a defect: it drifts from the folder the moment the
   file moves.
5. **Stories are type-checked and run, per root.** Stories are never shipped, yet a typecheck in
   the gate compiles them — the root's own, where its stories sit inside it, or a dedicated stories
   `tsconfig` where the root's runtime one leaves them out — so a broken story (wrong props after a
   component's signature changes) fails the build instead of rotting. Every story also **runs as a test**: it must render, and its accessibility check
   runs at error level, so a violation fails the gate rather than logging a warning. The static
   catalog build is a gate step too.
6. **A story renders real usage, not a prop dump.** The story shows the component as a screen
   actually composes it (a table story renders what a list renders), so the catalog doubles
   as living documentation and the visual-regression surface.
7. **Only a piece that owns a look is storied; a wrapper is not.** A piece that only configures another
   element — state, data, backend calls, app config, routing — has nothing to show: its look is the wrapped
   element's, already catalogued, and the end-to-end test proves its behaviour in the page. A screen is
   storied as its view (pure props: every state — empty, field errors, a multi-step branch, a server
   error), never as the container around it; storying both shows the same screen twice.
8. **One canvas per piece, placeholders in its parts.** A piece's first story shows every named option at once
   ("All states"), so a reviewer compares instead of clicking through; a further story exists only for what a
   static canvas cannot show (open, typing, toggling), and two stories that render the same are one too many. A
   wrapper (a layout, a composite with parts) fills each part with a labelled placeholder sized like the real
   part, so its blocks and their sizes show; one "Example" story may fill it with real contents. How pieces
   line up next to each other is shown on the layout that lines them up, never on the piece.

## Why

A component library only earns its keep if you can *see* every element in one place and trust
that place is complete. The moment coverage is partial, the catalog stops being an inventory
and becomes a lucky-dip: the components with stories get reviewed and visually regression-tested,
the ones without quietly drift, and nobody can tell by looking whether an absence is a gap or a
decision. "Every component has a story" is cheap to state and cheap to enforce, and it's the only
version of the rule that scales.

The collision failure is specific to a **shared** catalog — one Storybook (or equivalent) that
globs several apps so a whole product's design systems live under one roof. That's a good setup:
one place to browse everything. But story ids are global within a catalog and derived from the
title, so the instant two apps both define `Primitives/Button` the build either errors on the
duplicate or renders one and hides the other — a silent shadow that makes a real component
un-reviewable. The namespace prefix costs one path segment and removes the whole class of
collision; skipping it is why teams end up *deleting* the second app's stories, trading a real
gap for a fake one.

## How to apply

- Treat a missing `*.stories.tsx` like a missing test: the component isn't done. Add it in the
  same change; if a component genuinely can't be storied, record why, don't just omit it.
- Decide the title scheme **before** a second app joins the catalog. One root owns the bare
  paths; every other root prefixes its titles with its own name. Keep the prefix uniform within
  a root so the catalog groups cleanly.
- When a design system is **copied** into another app rather than shared as a package, copy its
  stories too and re-title them under the new app's namespace — the copies match the originals
  one-for-one, so the stories port with a title rewrite and nothing else.
- Put each root's stories under a typecheck the gate runs (its own, or a stories-only `tsconfig`),
  make the catalog's static build a CI gate, and run every story as a test with its accessibility check at error level, so a story
  that stops type-checking, stops rendering or loses its accessible name breaks the build loudly.
- Configure the catalog's story roots with title prefixes rather than writing `title` in any
  story file; a review that finds a hand-set title removes it.
- Prefer a **shared package** over copy-when-you-can: one component, one story, no namespace
  needed. The per-app namespace is the cost of duplicating the design system; if the duplication
  isn't justified, remove it and the collision problem disappears with it.
