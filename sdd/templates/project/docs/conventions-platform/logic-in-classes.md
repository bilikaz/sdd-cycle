# Logic in classes: a unit of logic is a class, and a class that uses the app is a registered service

**Rule in one line:** logic with dependencies or state is a class that receives what it uses — a registered
core service when it uses the app, a feature service inside a feature — and a module of exported functions is
only for pure transformations.

## Rules

1. **A unit of logic is a class.** Code that reads the database, the configuration, another service, the
   file system, a child process or the network belongs to a class. Its helpers are the class's members,
   reading what the class was built with; they are never functions exported beside it
   ([base-classes](base-classes.md) rules 3 and 6).
2. **A class that uses the app is a registered service.** Logic that needs the app's stores, configuration or
   other services, and that a worker, a root or more than one feature calls, is a core service: a class on
   the core's service base in the core's services folder, registered in the manifest under a path and taken
   from the app by that path and its class. Nothing builds it by hand, and no function hands
   it out.
3. **A feature's own logic is its feature service.** Logic only one feature's routes call stays that
   feature's `service.ts` ([services](services.md)); it takes a registered service as a dependency when it
   needs one.
4. **Entry points stay thin.** A worker, like a route, parses what it was handed and calls one method of a
   service. A flow several workers share is their abstract base ([base-classes](base-classes.md) rule 4),
   never a function they all import.
5. **A function module is for pure transformations.** A function that answers from its arguments alone —
   no dependency, no state, no outside call — may stand in a module with others of its concern
   ([file-granularity](file-granularity.md)). The moment it needs a dependency passed in, it is a method of
   the class that holds that dependency.
6. **One concern, one folder.** A service's class, its types and its runtime sit in its own folder; the
   concern is not spread over sibling files of an app's `src`.

## Why

A set of files exporting functions has no owner: each caller threads the connection, the configuration and
the logger through every call, nothing registers it, and a test can only replace it by mocking a module. The
same logic as one registered class is found by its path, built once by the app with everything it uses, and
replaced in a test as a whole. The loose form also grows plumbing of its own — an object carrying the shared
state, a callback to hand it to the callers — which is a service written by hand.

## How to apply

- Before making a new file, name the class it belongs to. If the answer is "none, it exports functions",
  check rule 5; when the functions take a database, a configuration, a logger or a service, they are methods.
- Planned logic that a worker or a root calls is drawn as a service from the first draft, with its
  registration path named beside it.
- An existing function that takes a dependency moves into the class that holds it when the code around it
  is next changed.
