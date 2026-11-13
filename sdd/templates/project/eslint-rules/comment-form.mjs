/* @why
-----------
The one comment form the source allows, checked
-----------
A comment exists only where the code cannot show what it says. The only forms are a `@why` block: a dashed line,
a title naming the special case, a dashed line, then the reasoning, at least 200 characters from its opening to its
closing; the one-line `// @union <why>` on a union of object shapes. Stack-specific forms are supplied through configuration; the shared implementation
checks them with the same ownership and length rules. No comment names a task or review round.
*/

const MINIMUM_LENGTH = 200;
const WHY_BLOCK = /^\s*@why\s*\n\s*-{3,}\s*\n[^\n]*\S[^\n]*\n\s*-{3,}\s*\n[\s\S]*\S/;
const UNION_LINE = /^\s*@union\s+\S/;
const CITATIONS = [
  /\btask\d+\b/i,
  /\b\d{4}-\d{2}-\d{2}-[a-z][a-z0-9.]*-[a-z0-9]+(?:-[a-z0-9]+)*\b/i,
  /\bdocs[\\/]tasks[\\/]/i,
  /\b(?:plan-review|qa|review)[\\/](?:round\d+\b|assignments\.md\b|guides[\\/])/i,
  /\b(?:grill|task|progress|implementation|evolution|changes|open-questions|report)\.md\b/i,
  /\b(?:[EGQ]-\d+|ADR[- ]\d+)\b/i,
  /\b(?:report|finding)\s+#?\d+\b/i,
];

export const commentForm = {
  meta: {
    type: "problem",
    docs: {
      description:
        "A comment is a `@why` block of 200+ characters, a `// @union <why>` or configured stack tag (source-comments.md).",
    },
    schema: [
      {
        type: "object",
        properties: {
          additionalLinePatterns: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      line: "A `//` comment is only `// @union <why>` or a configured shared-stack tag; anything the code cannot show is a `/* @why` block (source-comments.md).",
      block:
        "A block comment is a `/* @why` block: a dashed line, a title, a dashed line, the reasoning (source-comments.md).",
      short: "A `@why` block is at least 200 characters from `/*` to `*/` (source-comments.md).",
      citation: "A comment names no task, review round or ledger row (source-comments.md).",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const additional = (context.options[0]?.additionalLinePatterns ?? []).map((pattern) => new RegExp(pattern));
    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          if (comment.type === "Shebang") {
            continue;
          }
          if (CITATIONS.some((pattern) => pattern.test(comment.value))) {
            context.report({
              loc: comment.loc,
              messageId: "citation",
            });
            continue;
          }
          if (comment.type === "Line") {
            if (!UNION_LINE.test(comment.value) && !additional.some((pattern) => pattern.test(comment.value))) {
              context.report({
                loc: comment.loc,
                messageId: "line",
              });
            }
            continue;
          }
          if (!WHY_BLOCK.test(comment.value)) {
            context.report({
              loc: comment.loc,
              messageId: "block",
            });
            continue;
          }
          if (comment.value.length + 4 < MINIMUM_LENGTH) {
            context.report({
              loc: comment.loc,
              messageId: "short",
            });
          }
        }
      },
    };
  },
};
