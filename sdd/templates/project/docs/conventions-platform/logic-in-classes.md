# Logic in classes: a unit of logic belongs to its owning class

**Rule in one line:** logic with dependencies or state belongs to a class that receives what it uses.
Application capabilities use registered services; owned objects may be ordinary classes. Domain rules stay
with their owning class, and function modules hold utilities that name no domain.

## Rules

1. **A unit of logic is a class.** Code that reads the database, the configuration, another service, the
   file system, a child process or the network belongs to a class. Its helpers are the class's members,
   reading what the class was built with; they are never functions exported beside it
   ([base-classes](base-classes.md) rules 3 and 6).
2. **Register application capabilities; ordinary classes remain valid owners.** A class offered through
   the app's or plugin's service registry uses its registered service form. An object constructed and owned
   by a service or composition root may be an ordinary class: its dependencies are passed explicitly and
   its owner controls its lifetime. Holding state, performing I/O or receiving a service dependency does
   not by itself require registration. Choose the form by how callers obtain it and who owns its lifetime.
   Registered core services extend the core's service base, are declared in the manifest and are taken
   from the app by path and class. Their home is the core's `src/services/<name>/index.ts` when several
   apps use them, or `<app>/src/services/<name>/index.ts` when one app does. Callers obtain registered
   services through that registration; no factory hands them out.
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

7. **A domain's rules are members of their owning class, pure or not.** What a domain object is or does
   belongs to the class owning that concern, never a function exported beside it or in a shared folder.
   Choose its registered-service or ordinary-class form under rule 2. Feature operations enter through
   their service (rule 3); a service can delegate state and object behavior to the classes it owns.
   A rule that reads none of its owning class's instance state or dependencies is a `static` member.
8. **A domain has one home for its logic.** Each domain has at most one registered domain service, in
   `services/<domain>/`. Its concern stays together, with each rule in one owning class. An ordinary class
   under rule 2 lives with the concern it implements; the plan names its caller, dependencies and lifetime
   owner. Entities, DTOs, repositories, migrations, workers and console pages keep their designated homes.
9. **The shared folder holds contracts and utilities, and one browser file per domain.** The core's
   browser-safe shared folder is what the browser may import: entities, DTOs and the utilities of rule 5. A
   domain rule that the console needs as well as a server cannot be a service member, because the browser
   takes no service. It stands as a static member of the domain's one class in the shared folder's
   `<domain>.ts`, and the domain's service uses that class and never copies it. Nothing else of a domain
   lives in the shared folder.

## Why

A set of files exporting functions has no owner: each caller threads the connection, configuration and
logger through every call. A class gathers those dependencies and its state in one place, with behavior
that can be exercised through its real caller. Service registration supplies application discovery and
lifetime where those are needed; an explicitly owned object already has a caller that constructs and
manages it.

A pure rule has the same problem without the plumbing. A function that needs no dependency compiles anywhere,
so it is put wherever its first caller is, or in the shared folder because two apps need it. Each one is
harmless alone; together they spread one domain's rules over files nobody finds from the domain's service,
and the next rule is written beside them because that is where the last one was.

## How to apply

- Before making a new file, name the class it belongs to. "None, it exports functions" is an answer only for
  a utility under rule 5; when the functions take a database, a configuration, a logger or a service, or
  state a domain rule, they are members of a class.
- Draw the chosen form from the first draft: a service names its registration path; an ordinary class
  names its constructor caller, explicit dependencies and lifetime owner under rule 2.
- An existing function that takes a dependency or states a domain rule moves into its class when the code
  around it is next changed. A task that changes a domain's logic lists that domain's remaining loose modules
  in its plan and either moves them or records them in the roadmap.
