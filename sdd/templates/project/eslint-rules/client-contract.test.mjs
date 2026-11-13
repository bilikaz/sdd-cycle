import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";
import local from "./index.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const prefix = 'import type { JobQueryDtoJson, JobQueryResponseDto } from "@template/core/shared";';
const options = [
  {
    from: ["@template/core/shared"],
  },
];
const method = (parameters, answer = "Promise<JobQueryResponseDto>") =>
  `${prefix} class Api { jobQuery(${parameters}): ${answer} { throw new Error(); } }`;

new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
  },
}).run("client-contract", local.rules["client-contract"], {
  valid: [
    {
      code: method("dto: JobQueryDtoJson"),
      options,
    },
    {
      code: method("dto: JobQueryDtoJson, abortSignal?: AbortSignal"),
      options,
    },
  ],
  invalid: [
    {
      code: `interface LocalJobQueryDtoJson {
  jobId: string;
}
${method("dto: LocalJobQueryDtoJson, abortSignal?: AbortSignal")}`,
      options,
      errors: [
        {
          messageId: "foreign",
          data: {
            name: "LocalJobQueryDtoJson",
            from: "@template/core/shared",
          },
        },
      ],
    },
    {
      code: `interface LocalJobQueryResponseDto {
  jobId: string;
}
${method("dto: JobQueryDtoJson, abortSignal?: AbortSignal", "Promise<LocalJobQueryResponseDto>")}`,
      options,
      errors: [
        {
          messageId: "foreign",
          data: {
            name: "LocalJobQueryResponseDto",
            from: "@template/core/shared",
          },
        },
      ],
    },
    {
      code: method("dto: JobQueryDtoJson, abortSignal: AbortSignal"),
      options,
      errors: [
        {
          messageId: "foreign",
        },
      ],
    },
    {
      code: method("abortSignal?: AbortSignal, dto?: JobQueryDtoJson"),
      options,
      errors: [
        {
          messageId: "foreign",
        },
      ],
    },
    {
      code: method("dto: JobQueryDtoJson, signal?: AbortSignal"),
      options,
      errors: [
        {
          messageId: "foreign",
        },
      ],
    },
    {
      code: method("dto: JobQueryDtoJson", "Promise<AbortSignal>"),
      options,
      errors: [
        {
          messageId: "foreign",
        },
      ],
    },
    {
      code: method("dto: JobQueryDtoJson, transport?: { abortSignal: AbortSignal }"),
      options,
      errors: [
        {
          messageId: "inline",
        },
        {
          messageId: "foreign",
        },
      ],
    },
    {
      code: `type Signal = AbortSignal; ${method("dto: JobQueryDtoJson, abortSignal?: Signal")}`,
      options,
      errors: [
        {
          messageId: "foreign",
        },
      ],
    },
  ],
});
