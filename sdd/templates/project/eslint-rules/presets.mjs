export const codeLayout = {
  curly: ["error", "all"],
  "brace-style": [
    "error",
    "1tbs",
    {
      allowSingleLine: false,
    },
  ],
  "local/object-layout": "error",
};

export const linterOptions = {
  noInlineConfig: true,
  reportUnusedDisableDirectives: "error",
};

export const privateMember = [
  {
    selector: "PrivateIdentifier",
    message: "A private member is `private name`, never `#name` (naming.md rule 16).",
  },
];

export const platformCommentOptions = {
  additionalLinePatterns: ["^\\s*@biglock\\s+#db\\.[a-z][a-z0-9_]*\\s+\\S"],
};
