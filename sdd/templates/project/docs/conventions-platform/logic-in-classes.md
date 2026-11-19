# Logic in classes: a unit of logic is a class, and a domain's rules are members of its one service

**Rule in one line:** logic with dependencies or state is a class that receives what it uses — a registered
core service when it uses the app, a feature service inside a feature — a domain's rules are members of that
domain's class even when they are pure, and a module of exported functions is only for utilities that name
no domain.

## Rules

1. **A unit of logic is a class.** Code that reads the database, the configuration, another service, the
   file system, a child process or the network belongs to a class. Its helpers are the class's members,
   reading what the class was built with; they are never functions exported beside it
   ([base-classes](base-classes.md) rules 3 and 6).
2. **A class that uses the app is a registered service.** Logic that needs the app's stores, configuration or
   other services, and that a worker, a root or more than one feature calls, is a core service: a class on
   the core's service base in a services folder, registered in the manifest under a path and taken from the
   app by that path and its class. Its home follows who uses it: the core's `src/services/<name>/index.ts`
   when more than one app takes it, `<app>/src/services/<name>/index.ts` when only that app does. Nothing builds it by hand, and no function hands
   it out.
3. **A feature's own logic is its feature service.** Logic only one feature's routes call stays that
   feature's `service.ts` ([services](services.md)); it takes a registered service as a dependency when it
   needs one.
4. **Entry points stay thin.** A worker, like a route, parses what it was handed and calls one method of a
   service. A flow several workers share is their abstract base ([base-classes](base-classes.md) rule 4),
   never a function they all import.
5. **A function module is for utilities that name no domain.** A function that answers from its arguments
   alone — no dependency, no state, no outside call — may stand in a module of exported functions only when
   it serves no single domain: bytes, dates, slugs, paging, a file's extension
   ([file-granularity](file-granularity.md)). The test is its name and its comment: if either needs a term of
   the project's glossary, it is a domain rule and rule 7 decides its home. The moment a utility needs a
   dependency passed in, it is a method of the class that holds that dependency.
6. **One concern, one folder.** A service's class, its types and its runtime sit in its own folder; the
   concern is not spread over sibling files of an app's `src`.

7. **A domain's rules are members of the domain's class, pure or not.** What a thing of the domain is or
   does — its statuses and what follows each, its keys, its limits, its counts — is a member of the class
   that owns that domain, never a function exported beside it or in a shared folder. The owner follows who
   calls it: the domain's registered service when a worker or more than one feature does (rule 2), the feature
   service when one feature's routes do (rule 3), the workers' abstract base when only those workers do
   (rule 4). A rule that reads none of the class's dependencies is a `static` member, called through the class.
8. **A domain has one home for its logic.** Each domain has at most one registered service, in
   `services/<domain>/`, and its rules are gathered there. Before a domain rule is written anywhere else, the
   plan names why the domain's service cannot hold it. Kinds that have one home for every domain stay there:
   entities, DTOs, repositories, migrations, workers and console pages.
9. **The shared folder holds contracts and utilities, and one browser file per domain.** The core's
   browser-safe shared folder is what the browser may import: entities, DTOs and the utilities of rule 5. A
   domain rule that the console needs as well as a server cannot be a service member, because the browser
   takes no service. It stands as a static member of the domain's one class in the shared folder's
   `<domain>.ts`, and the domain's service uses that class and never copies it. Nothing else of a domain
   lives in the shared folder.

## Why

A set of files exporting functions has no owner: each caller threads the connection, the configuration and
the logger through every call, nothing registers it, and a test can only replace it by mocking a module. The
same logic as one registered class is found by its path, built once by the app with everything it uses, and
replaced in a test as a whole. The loose form also grows plumbing of its own — an object carrying the shared
state, a callback to hand it to the callers — which is a service written by hand.

A pure rule has the same problem without the plumbing. A function that needs no dependency compiles anywhere,
so it is put wherever its first caller is, or in the shared folder because two apps need it. Each one is
harmless alone; together they spread one domain's rules over files nobody finds from the domain's service,
and the next rule is written beside them because that is where the last one was.

## How to apply

- Before making a new file, name the class it belongs to. "None, it exports functions" is an answer only for
  a utility under rule 5; when the functions take a database, a configuration, a logger or a service, or
  state a domain rule, they are members of a class.
- Planned logic that a worker or a root calls is drawn as a service from the first draft, with its
  registration path named beside it.
- An existing function that takes a dependency or states a domain rule moves into its class when the code
  around it is next changed. A task that changes a domain's logic lists that domain's remaining loose modules
  in its plan and either moves them or records them in the roadmap.
