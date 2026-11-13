import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import local from "./index.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

new RuleTester().run("object-layout", local.rules["object-layout"], {
  valid: [
    "const value = {\n  first: 1,\n  second: 2,\n};",
    "const value = { first, second };",
    "const value = { ...change };",
    "const value = {};",
  ],
  invalid: [
    {
      code: "const value = { first: 1 };",
      output: "const value = {\n first: 1 };",
      errors: [
        {
          messageId: "oneLine",
        },
      ],
    },
    {
      code: "const value = {\n  first: 1, second: 2 };",
      output: "const value = {\n  first: 1,\n second: 2 };",
      errors: [
        {
          messageId: "oneLine",
        },
      ],
    },
    {
      code: "const value = {\n  first: 1,\n  second: 2, third };",
      output: "const value = {\n  first: 1,\n  second: 2,\n third };",
      errors: [
        {
          messageId: "oneLine",
        },
      ],
    },
  ],
});
