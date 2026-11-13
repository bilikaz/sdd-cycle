# UI components: compose components, never raw markup

**Rule.** Every visual element is a component of the design system; a page or screen **composes**
those components and never hand-rolls markup. When a visual need has no component yet, the component
is built in the design system first, then used.

## Rules

1. **No raw markup in pages.** Headings, paragraphs, lists, cards, grids, buttons, chips, quotes, code
   blocks, media blocks, nav, footers — each is a component. A raw element tag in a page module is a
   defect.
2. **A page contributes state and data wiring, not markup.** An interactive composite (a hero with an
   input, a variant toggle) may live in a page module, but its internals are built from the
   design-system components.
3. **A visual defect is fixed in the owning component, never at the call site.** No one-off utility
   class, no inline `style`, no per-page patch — one fix corrects every page at once. A genuinely
   data-driven value (a brand colour that comes from data) is a prop of the component that renders it.
4. **Presentational components are props-in and dependency-free.** They use relative imports, read no
   configuration, and fetch no data, so they stay portable and testable in isolation.
5. **A page module imports no stylesheet.** The component owns its classes; a page that needs a new
   look gets a component change or a new component.

## Enforcement

A rule a reviewer must remember is a rule an agent breaks; each of these makes a breach fail the build.

6. **Sealed public props.** The design system's public components omit `className` and `style` from their
   props — compound parts too — so a call-site patch is a type error, not a review comment. Internally the
   design system composes its raw pieces freely.
7. **One import door.** Consumers import the design system from its one named package entry and its theme
   entry points only; the tiers hold no doors and no package entry (a package's entries are its `exports`
   keys, [one-door](one-door.md)) resolves to their files — the tiers are named only at the one door — so the
   raw, unsealed source cannot be reached.
8. **The composition check.** A lint rule over every consumer source file — stories included, no exempt
   folder — fails on any intrinsic HTML element, `className` or `style`. The only place markup may exist is
   the design system itself; even the document root is one of its layouts. An app that is not a design-system
   consumer — framework-free, importing `@template/core` only — may hand-write its few pages, coloured with the
   design system's token values.
9. **The tier check.** The design-system tiers (primitives, components, the raw generated source) exist in
   exactly one place. A consumer holding its own design-system folder, or a feature module holding one of
   those tiers, fails the build. A feature module's `ui/` holds only feature-only composites and
   feature-only layouts.
10. **Promotion, never a copy.** A module composite or layout that a second feature needs as-is moves into the
    design system; features never import each other, and a second copy is never made. One the second feature
    would need changed is not promoted: each composes its own (rule 15).


## Shape

11. **A primitive is one element with named options.** Its whole look is its props (`<Input label error size
    startIcon>`): a form control carries its own label, description, error message, icons and size; no second
    piece dresses it. How it lines up beside its neighbours is a layout's job, never a primitive's option.
12. **The design system holds what the screens use.** A piece arrives with the first screen that needs it, not
    ahead of it; an unused piece is removed. A smaller set is one an agent can learn whole.
13. **Extend before adding.** A need that looks like an existing piece becomes a named option on that piece.
    A new piece is added only when its **shape** differs (its layout, not its content), and the change that
    adds it names the existing piece it was checked against. Content is never a piece: a list of sessions is
    an `ActionRowList` fed session data, not a `SessionList`.
14. **A form is a piece only when it is shared** — used by two or more screens, or by the same screen in two
    or more apps (the auth faces). A one-screen, one-app form is composed inline in its view from `Form` and
    the primitives; it gets no file, no export and no story of its own. It becomes a piece the moment a
    second screen or app needs it (rule 13).
15. **Shared means identical, not similar.** The shared package holds a form, a view or a composite only when
    every layer and screen that uses it takes it as-is. When it is likely to drift between layers or screens
    (other labels, other explanations, other blocks), each screen composes its own from the package's pieces
    in the app, and it never enters the design system.

## Why

UI repetition is inherent — the same button, card and field recur on every screen. When pages hand-roll
markup, each occurrence drifts a little, a fix has to be applied N times, and the design system stops
being the source of truth for what the product looks like. Composing one set of components keeps the
looks single-sourced: a defect is fixed once, and the fix reaches every page.
