# Job engine

The reusable platform Job engine owns attempt state and invokes workers under the
[durable execution](durable-execution.md) rules.

## Attempts and workers

One region is wrapped whole: a job a worker runs from its row. The job engine — the core service `job` —
runs each attempt as one step around one transaction, the **attempt transaction**: it claims the job's row
`FOR UPDATE SKIP LOCKED` while it is `queued` or `failed`, holds it while the worker's work runs, and lands
one outcome before it commits: `finished` with the result, or `failed` with the error's message and its
details. The work runs outside that transaction (`outsideTransaction`): its own rows, entries and locks
are the work's, committed as the work makes them. So the attempt locks the minimum — the job's own row and
nothing else — a concurrent attempt on another row runs past it, and no request caller waits on those
locks; the outside call the job was queued for is awaited while the row is held, by design — that call is
the job's work. The third-party bar of [services](services.md) rule 9 is the **entry transaction**'s law,
never an attempt's. Every attempt outcome, including
`failed`, writes `finishedAt`. A retry takes a `failed` row based on status, regardless of that timestamp,
and overwrites its status, result/error and timestamp, so the row holds the latest attempt's outcome.
`finishedAt` is not an exhaustion marker. The queue's final-failure callback publishes its notification
after retries exhaust but does not write the Job row; the work never infers how many retries remain.
Only `finished` and `canceled` rows are terminal. A second delivery of a held row or a terminal row ends.
A run that dies rolls the job's attempt transaction back; work committed by the worker's own transaction
follows the declared transaction semantics. A
worker is a class the service finds in its folder and registers: its settings static, its dependencies
taken at construction, and a `tasks` map from each task name to the method that handles it. The service
looks the job's task up in the map — the map may answer `"*"` for any task, a task neither named nor
covered by `"*"` fails the job `no such task`, params that are not a JSON object fail it too — and calls
the method with one argument, the job as its event carries it (`{ jobId, worker, task, params }`); the
method answers a result or throws, and claims, locks or marks nothing of its own. Since an outside call
can land while the commit fails, every call a method makes is safe to repeat, and a repeat that shows (a
mail sent twice) is the accepted case.
