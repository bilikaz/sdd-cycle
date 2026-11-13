# File granularity: a file holds a concern, not a constant

**Rule.** Code is split into files by what it does. A file holds one coherent concern — a service, its runtime,
its types — and the small pieces that concern needs live in it. A file is never made for one constant, one helper
or one class of a few lines; a folder of many such files reads as many concerns when it holds one.

## Rules

1. **Group by concern.** Constants, helpers, small classes and clients that serve one concern sit in that
   concern's file, beside the code that uses them — a job engine's queue wiring (its client, its event names) in
   one `runtime.ts`, its step names beside the service that uses them, not one file each.
2. **Named files keep their names.** A file another convention names keeps its own file: a base class
   (`service.ts`, `provider.ts`, [one-door.md](one-door.md) rule 4), a door (`index.ts`), `types.ts`
   ([types-placement.md](types-placement.md)), a scanned module's `index.ts`.
3. **Split when a concern is really two.** A file is split when it holds two concerns a reader would look for
   apart, or when one piece is imported from outside the folder on its own — never because a piece is small.
4. **The door rule does not ask for a file per piece.** What a door and its files share moves out of the door
   into a few grouped files, not one per helper ([one-door.md](one-door.md) rule 4).
5. **A worker is one file.** A worker's folder holds its `index.ts` alone: the worker and what only it uses. A
   worker file grown large holds what is not the worker's — data other modules also read, a client, a domain rule
   — and that moves to the module that owns it (records several workers read live in the module that owns those
   records), never into a second file beside the worker.

## Why

A file is how a reader finds a concern. Ten files of five lines make the reader open ten files to see one thing,
and hide which pieces belong together; one file per concern shows it whole. The split that looks tidy in a file
tree is paid for by every reader of the folder.

## How to apply

- Before making a new file, name the concern it holds. If the answer is "this constant" or "this helper", it goes
  into the file of the concern that uses it.
- In review, a folder with several files of a handful of lines each is a finding: fold them by concern.

```ts
// never: jobs/queue-name.ts, jobs/retry-limit.ts, jobs/queue-client.ts — one export each

// always: jobs/runtime.ts holds the queue's wiring as one concern
export const JOB_QUEUE = "jobs";
export const MAX_JOB_ATTEMPTS = 5;

export function createQueueClient(connection: QueueConnection): QueueClient {
  return new QueueClient(JOB_QUEUE, connection);
}
```
