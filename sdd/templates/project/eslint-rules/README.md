# Convention enforcement

Shared ESLint rules, presets and regression tests for the default TypeScript pack and the optional
platform stack. Agents manually adopt the applicable rules, presets and their tests into the consuming project.

## Consumers

The consuming project supplies ESLint 9, typescript-eslint 8 and TypeScript, using its own dependency
versions. Register `index.mjs` as the plugin; `presets.mjs` exports shared
layout options, directive policy and platform comment options. The rule modules contain no project paths.
Configure package roots, shared-contract imports, transaction builder files and explicitly named
transaction participants in the consuming ESLint configuration.

The comment rule accepts `additionalLinePatterns`; the platform preset enables its table-lock tag.
The transaction rule accepts `builderFiles` and `participants`. Each participant names a file,
class, method and allowed caller; it is not a general permission for nested transactions.

## Checks

Run `node --test --test-concurrency=1 eslint-rules/*.test.mjs` from the consuming project. Its own
integration tests may exercise local generated-file exceptions separately.

`checks.json` configures source exclusions and generated filenames for the suppression scanner.
Filesystem failures refuse the check.
