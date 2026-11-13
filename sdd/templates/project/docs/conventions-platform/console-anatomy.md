# Console anatomy

The rules that keep an admin console's screens interchangeable. They exist because UI repetition is
inherent: the same list/edit/confirm shapes recur on every screen, so the shapes are **provided once and
reuse is enforced** — a hundred near-identical variants is the failure mode.

1. **Lists** own the row actions (Edit / Delete / the row's verbs), row-click opens the row's screen,
   **New lives in the page header**, and every list pages with the one pager. Row **selection** (checkbox
   column, page-toggle header, per-row disable) belongs to the one Table wherever a bulk verb exists — wired
   there when such a verb lands, never on a screen; the Table carries none today. Read-only history gets none,
   because there is nothing to bulk-do.
2. **The filter bar sits between the header and the table** — never in the header corner. Search is
   **commit-on-Enter** (one SearchInput with the ↵ affordance); an enum filter is a **select** whose first option
   is "Any ‹field›" (`Any role`, `Any status`) — never a control that cycles on click; a date window is one
   `PeriodRange` (a period preset filling From and To, two cells), opening on Last 7 days. All filter fields share
   one width (~1/6 of the row), and the bar holds the fields only. Under it, at the right: while any filter is set,
   a red **Reset** button (`destructive`) that clears them all, on its own line; under it the pager, the result
   count part of it ("6 entries · ‹ Prev 1 / 1 Next ›") — never a button beside loose text.
3. **Edit/new screens are two columns: the EDIT card left, informational card(s) right.** The head carries
   a back-link eyebrow and the title only — Save/Delete never live in a page header. Cancel/Save sit at
   the form's foot. Identity fields (a slug, a language) stay visible but disabled once immutable.
4. **Deletion is a list-row action with a confirm modal.** An editor may remove draft sub-records through
   their own controls; the shared Save commits those removals together with the other edits. When no
   sub-records remain for an existing item, the shared Save becomes Delete and invokes a delete operation.
5. **Modals**: one Modal owns the body rhythm and an **error area** — an action's failure renders inside
   the modal that launched it, in the server's own words; page-level alerts are for load failures only.
6. **Action rows** (support/settings cards): label + one quieter description line, hairline between rows,
   and a controls column whose buttons share a minimum width and exactly the input height beside them.
7. **A form field must map to a served endpoint field** — a control with nothing behind it is a defect,
   not a placeholder. The reverse also binds: if the api serves it, some screen offers it.
8. **Composition over per-form props for cross-cutting blocks**: socials are ONE component composed after a form
   (`Form + AuthDivider + SocialButtons`), never a per-form prop — edit once, appears everywhere.
9. **Buttons: every button is bordered, and a surface has exactly one primary.** One primary, the only filled
   button, for the surface's single main action (Save · Create · Confirm); a neutral default for secondary
   actions (Cancel · Back · pagination · row-remove · Edit); and bordered tones that mirror the status badges —
   destructive for destructive actions (Delete · Revoke · Retire · Sign-out), success, warning and highlight for
   an action tied to that status. A borderless, text-like affordance is a **link**, never a button; icon-only
   controls are still buttons and still bordered. The one exception is a select-in-place control that acts where
   it stands and goes nowhere — the input's show/hide toggle, a code block's copy: borderless, still a button,
   since a link that does not navigate is the wrong element.
10. **Console forms are small.** Edit forms, detail cards, modal forms, filter bars, table-row actions and
    pagination use the small control size — inputs, selects, switches and their buttons alike, never mixed with
    another size inside one form. A page head's actions are small too: in the console every control is the
    small size, and the default and large sizes belong to the auth screens. An edit form stacks each label above
    its field and puts Save at its foot.
11. **Every edit form is one shape.** A card with its title, then one column of fields, each label above its
    field and every control the small size (rule 10); Save sits at the form's foot, at its end, disabled until
    the form is dirty and showing a saving state; a refused save surfaces in the form's error area (rule 5).
    - **A field's description**, where the user asked for one (rule 14), sits under its control — never in the
      card's description, which a form does not carry.
    - **A value the user may not change** is still a field: shown disabled (an identity fixed at creation),
      with no reason under it unless the user asked for its words (rule 14). When the whole form is refused
      (your own account, the owner), every field is disabled and Save carries the reason as its
      `disabledReason`, shown beside it.
    - **The control follows the value:** a value from a registry or a fixed set is a **select**, never free
      text; an on/off value is a **switch** with its field label above and the state as its text (`Status` ·
      `Active` / `Disabled`); many-of is a multi-select, or a checkbox group for a short fixed set, long text a
      textarea, a list of sub-rows repeatable rows, each set off by a rule with its add control in its own block.
    - **An editor spanning several cards shares one Save at its top.** A sub-card's draft Add/Delete
      controls sit in its header; Copy/Paste controls sit at its foot.
    - **No per-field action buttons:** one Save commits every changed field; a separate button beside a
      field (Disable, Change role) is not an edit form's shape.
    - **A card is a quarter of the row by default.** An edit card or a detail card takes one quarter at full
      width (`Grid columns={4}`, or the side column of `main-aside`); a screen with fewer cards leaves the rest
      of the row empty rather than stretching them. A table card spans more (a list's rows, the main
      three quarters), and a screen whose own settlement rules another layout keeps it (the account page's
      three columns).
12. **A comparison reads left to right, newer to older.** The value you are on stands at the left (a draft, an
    entry's state after the action), the one it is compared with at the right (the active config, the state
    before): a line only on the left is green (added), a line only on the right red (removed). The comparing view
    carries its own Compare toggle in its corner — never a button in the page head.
13. **A date reads one way everywhere.** A day is `YYYY-MM-DD` and a moment `YYYY-MM-DD HH:mm` (24-hour, in the
    viewer's local time) — never the browser's locale form, never a US date. Every screen formats through the one
    formatter the design system provides, and a date column fits its content on one line (`width: 'fit'`).
14. **No explanatory copy nobody asked for.** Labels serve: a modal, a card, a form and a page head carry their
    title and their labelled controls — never a paragraph, a hint or a helper line explaining how the screen works;
    where a label alone is unclear, a better label is chosen, never a line added. A description — under a modal's
    title, under a field, a page head's subtitle, an action row's — appears only where the user asked for its words
    in the task's settled documents; rules 6 and 11 say where one sits, not that one is written. A confirm's
    sentence naming what is lost (destructive-actions.md) is the action itself, not explanation.
