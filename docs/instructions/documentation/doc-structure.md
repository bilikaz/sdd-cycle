# Doc structure — one heading per logical cut

Every workspace document keeps the same heading anatomy, so any reader scans any document the same way. The
structure **states the split** — a reader sees the boundaries before reading a word. A document in another
repository follows that repository's own standard ([workspace.md](../workspace.md), sdd.workspace.4).

1. **H1 — the main title**, once, followed by the intro paragraph.
2. **H2 — the logical cuts.** The document splits by logical meaning; a fixed anatomy (`task.md`,
   `implementation.md`, a QA file) names its own H2s.
3. **H3, H4 — the members** of a cut, never skipping a level.

**A description rides directly behind its thing.** After a diagram, its note; after a table's heading, the
table, then its prose. No description floats ahead of or between the things it covers.

**A doc speaks only of its subject.** What the subject **is**, why it **exists**, how it **behaves**.
Neighbours are not mentioned — no comparisons ("unlike X", "same as Y"), no negations of other designs, no
history or opinion about anything the doc is not responsible for; each of those lives in the one doc whose
subject it is ([single-source.md](./single-source.md)).
