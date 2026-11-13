<!-- COMMENTS
Replace placeholders and remove COMMENTS blocks from the generated file.
Describe the target before the work: what will exist, where and containing what. Cover every task
decision and done-when. Link existing facts. Keep sections in order; omit inapplicable sections and empty groups.
END COMMENTS -->

# <Task title> — implementation

## Overview

### <Repository or app root>

| Piece | What it is |
|---|---|
| <Relative piece> | <Target behavior> |

<!-- COMMENTS
Use one table per repository/app root, with that root in the heading and relative rows.
Each piece states what it is when the work is done.
Example: ./export | Private export endpoint that checks membership before starting work.
END COMMENTS -->

## Flows

<Relevant Mermaid diagram>

<!-- COMMENTS
Use Mermaid for relevant runtime behavior under [format.md](../../documentation/format.md).
END COMMENTS -->

## Contracts

<!-- COMMENTS
Separate contracts by boundary. Include only new or changed contracts and omit unused groups.
Add other boundary kinds when needed, such as events, RPC or CLI commands. Mark deferred items inline with ×.
State inputs, observable behavior and failure outcomes. Link payload definitions in Data shapes or their
existing canonical home; do not repeat their fields here. Link shared policies rather than copying them per entry.
END COMMENTS -->

### HTTP

| Method | Route | Access | Request | Response | Errors |
|---|---|---|---|---|---|
| <Method> | <Path> | <Access rule / reference> | <Shape reference> | <Status / shape reference> | <Failure outcomes> |

<!-- COMMENTS
Name the endpoint and its caller-visible contract: access, accepted input, response/status and errors.
Reference existing authentication, validation and pagination policies when shared; name task-specific differences.
END COMMENTS -->

### Workers/jobs

| Queue / job | Trigger | Input / result | Processing and failure behavior |
|---|---|---|---|
| <Boundary name> | <What submits or schedules it> | <Shape references> | <Completion / retry / failure contract> |

<!-- COMMENTS
Name the queue/job and how it is triggered. Link input, result and durable-state shapes.
Describe relevant completion, retry, idempotency, ordering or concurrency guarantees; link shared policies.
END COMMENTS -->

### Configuration

| Key | Source | Type | Required | Default | Consumer / validation |
|---|---|---|---|---|---|
| <Configuration key> | <Environment / file / service> | <Value type> | <Yes/no> | <Value or —> | <Use and constraints> |

<!-- COMMENTS
Include runtime configuration inputs introduced or changed by the task, not every internal code constant.
Name the exact key, source, type, required/default behavior and consumer. Describe invalid/missing-value
behavior and when changes take effect if relevant. For secrets, name the configuration reference.
END COMMENTS -->

### WebSocket

#### <Connection endpoint / namespace>

| Event / channel | Direction | Access | Payload | Reply / failure |
|---|---|---|---|---|
| <Message or subscription> | <Client → server / server → client> | <Rule / reference> | <Shape reference> | <Outcome> |

<!-- COMMENTS
Name the connection boundary, message/event names and direction. Link payload shapes.
Describe relevant access/subscription rules, acknowledgements, errors and disconnect/reconnect behavior.
END COMMENTS -->

## Data shapes

<!-- COMMENTS
Group shapes by where they are exchanged or stored. Omit unused groups; add other locations, such as local files, when needed.
Identify each shape's actual boundary/store and name, marking it (new) or (changed).
Show the full target shape with one field per row, using that location's native names and types.
Below each changed shape, list what changed per field: before → after, including additions and removals.
Include relevant status transitions and persisted-message compatibility. Link unchanged definitions.
Do not repeat flows or add producer/consumer inventories above field tables.
Example change: attempts — default 3 → 5.
END COMMENTS -->

### DTOs

#### <DTO name / request or response boundary> (new or changed)

| Field | Wire type | Required | Default | Meaning |
|---|---|---|---|---|
| <Payload field> | <Transmitted type> | <Yes/no> | <Value or —> | <Purpose> |

<!-- COMMENTS
Describe the fields exposed at this boundary, including nested shapes. Use actual payload names and wire types.
Link reused DTO definitions instead of copying them. Separate request and response shapes when they differ.
END COMMENTS -->

### Database entities

#### <Database / schema / table> (new or changed)

| Column | Database type | Nullable | Default | Notes |
|---|---|---|---|---|
| <Database column> | <DDL type> | <Yes/no> | <SQL default or —> | <Purpose / constraints> |

<!-- COMMENTS
Describe the persisted database columns with their actual names, DDL types, nullability and defaults.
Do not substitute ORM property names or TypeScript representations. Include relevant primary/foreign keys,
uniqueness, checks and indexes in database terms. Name schema/migration changes alongside field changes.
END COMMENTS -->

### Job/worker data

#### <Queue / job / worker> — <input, result or stored state> (new or changed)

| Field | Message or stored type | Required | Default | Meaning |
|---|---|---|---|---|
| <Job field> | <Native representation> | <Yes/no> | <Value or —> | <Purpose> |

<!-- COMMENTS
Separate job input, result and durable state where their shapes differ. Name the queue, job or worker boundary;
for persisted state, identify its store. Describe message/stored fields rather than the worker's private runtime object.
END COMMENTS -->

### Redis

#### <Redis store / key pattern> (new or changed)

**Redis type.** <String, hash, set or other native type> · **TTL.** <Expiry or persistent>

| Field / member | Value format | Meaning |
|---|---|---|
| <Stored element> | <Encoding or shape> | <Purpose> |

<!-- COMMENTS
Name the key pattern, Redis data type, value encoding/fields and expiration policy.
Show the actual stored representation, including nested fields when a value contains serialized data.
END COMMENTS -->

### OpenSearch

#### <Index / document> (new or changed)

| Field | Mapping type | Mapping options | Meaning |
|---|---|---|---|
| <Stored field> | <OpenSearch type> | <Relevant options or —> | <Purpose> |

<!-- COMMENTS
Name the index/document location and use actual stored field names and mapping types.
Include relevant mapping options and link unchanged mappings. Other OpenSearch resources use their own
native configuration fields rather than document-mapping columns.
END COMMENTS -->

### Third-party platform data

#### <Platform / resource or event> (new or changed)

| Field | Platform type / format | Required | Default | Meaning |
|---|---|---|---|---|
| <Platform field> | <Native representation> | <Yes/no> | <Value or —> | <Purpose> |

<!-- COMMENTS
Identify the platform and resource/event, where the data lives, and whether it is sent, received or synchronized.
Use that platform's actual field names and representations. Reference local DTO/storage shapes where mapped;
do not replace the platform's schema with the local model.
END COMMENTS -->

## Files

### <Repository root>

| path | files | what |
|---|---|---|
| <Relative folder> | <Filenames> | <Change> |

<!-- COMMENTS
Use one table per root. Follow [format.md](../../documentation/format.md) for path bases and file inventories.
END COMMENTS -->

## Key logic

### <What this logic does>

`<Repository root>/<Relative destination file>`

<Nontrivial logic in language-tagged code fences>

<Optional explanation — maximum 100 words>

<!-- COMMENTS
Order each example: descriptive title, destination file, code, then optional explanation of at most 100 words.
Every code block must name its exact destination file on the next line after the title,
before the block or as its first comment. Use paths relative to the repository root;
identify the root when several repositories participate.
Split code destined for different files into separate blocks.
Show syntactically valid code in the project's language for nontrivial logic: inputs, outputs, calculations,
branches and failures. Define helpers or link existing ones. Omit routine wiring.
Prose, pseudocode, TODOs and placeholders do not substitute for required logic.
Add prose only for non-obvious reasoning the code does not show. Omit repeated explanations and unrelated unchanged behavior.
END COMMENTS -->

## Verification

<Ordered checks mapped to done-whens>

<!-- COMMENTS
Name the ordered checks proving the done-whens, including configured gates and meaningful regression cases.
END COMMENTS -->

## Proposals

<Valid outstanding choices and tradeoffs>

<!-- COMMENTS
Optional: omit when empty. Include only unresolved choices between valid options that affect behavior,
cost, scope or future work. State the option carried by the body, alternatives and their tradeoffs.
Choices already settled by a ruling, convention or established pattern belong in the body.
Review Proposals and Alternatives with the rest of the plan. Present outstanding choices when the plan is
presented for confirmation. Record rulings in grill.md, remove resolved
entries and do not raise rejected options again.
END COMMENTS -->

## Alternatives

<Competing valid options and the option carried by the body>

<!-- COMMENTS
Optional: omit when empty. Compare valid remedies when a disposition would reverse an earlier one or
reviews disagree. Keep one consistent option in the body and show the choices and trades.
Correct or escalate known defects; moving one here does not make it optional.
Resolve these choices under the Proposals guidance above.
END COMMENTS -->
