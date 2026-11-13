import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import local from "./index.mjs";
import { platformCommentOptions } from "./presets.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const reasoning =
  "The reasoning runs long enough to say what the code cannot: the special case, why it exists, what breaks without it, and which\nother part of the system relies on it staying exactly as written here.";
const whyBlock = `/* @why\n-----------\nA special case the code cannot show\n-----------\n${reasoning}\n*/\nconst value = 1;`;

new RuleTester().run("comment-form", local.rules["comment-form"], {
  valid: [
    whyBlock,
    whyBlock.replace("A special case", "A queue round trip using the 2026-01-15 input"),
    whyBlock.replace("A special case", "The taskCount and qaResult contract fields"),
    "// @union the type demands a label exactly when there is no visible text\nconst value = 1;",
    {
      code: "// @biglock #db.email_templates the owner column has no index; held to the commit\nconst value = 1;",
      options: [platformCommentOptions],
    },
    "#!/usr/bin/env node\nconst value = 1;",
    "const value = 1;",
  ],
  invalid: [
    ...[
      "2026-01-15-M2-login-flow",
      "docs/tasks/custom-work/grill.md",
      "plan-review/round1/review.md",
      "qa/round2/conventions.md",
      "review\\round3\\persistence.md",
      "plan-review/assignments.md",
      "review/guides/security.md",
      "grill.md",
      "evolution.md",
      "open-questions.md",
      "Q-1",
      "ADR-003",
      "report 2",
      "finding #3",
    ].map((reference) => ({
      code: whyBlock.replace("A special case", `The constraint recorded in ${reference}`),
      errors: [
        {
          messageId: "citation",
        },
      ],
    })),
    {
      code: "// @biglock #db.example held briefly\nconst value = 1;",
      errors: [
        {
          messageId: "line",
        },
      ],
    },
    {
      code: "// @biglock the table is not named\nconst value = 1;",
      errors: [
        {
          messageId: "line",
        },
      ],
    },
    {
      code: "// @biglock #db.email_templates\nconst value = 1;",
      errors: [
        {
          messageId: "line",
        },
      ],
    },
    {
      code: "// @nested the queue door's own row must survive the action's rollback\nconst value = 1;",
      errors: [
        {
          messageId: "line",
        },
      ],
    },
    {
      code: "// what the next line does\nconst value = 1;",
      errors: [
        {
          messageId: "line",
        },
      ],
    },
    {
      code: "const value = 1; // trailing",
      errors: [
        {
          messageId: "line",
        },
      ],
    },
    {
      code: "/** A doc block. */\nconst value = 1;",
      errors: [
        {
          messageId: "block",
        },
      ],
    },
    {
      code: "/* @why\n---\nToo short\n---\nshort.\n*/\nconst value = 1;",
      errors: [
        {
          messageId: "short",
        },
      ],
    },
    {
      code: whyBlock.replace("A special case", "task13 a special case"),
      errors: [
        {
          messageId: "citation",
        },
      ],
    },
  ],
});
