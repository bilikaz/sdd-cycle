# Base classes: plumbing as members, one constructor shape

**Rule in one line:** in a class family behind a factory, shared per-instance
plumbing lives on the abstract base as `protected` members (not module
helpers), the constructor shape is uniform — a subclass may declare a constructor only
with the family's own parameters, calling `super` first — and per-call state is wired in at construction
so methods stop threading it as parameters. A family of kinds is always modelled this way — a
base extended per kind, constructed with `new` — never as factory functions.

## Why

Module-level helpers next to a class family are members in denial: every
subclass imports them and threads the same arguments (the connection, the
abort signal, the request context) through every call. That threading is
noise, and it leaks — one forgotten `signal` parameter and cancellation
silently stops working on one path. Constructor overriding breaks factories:
the moment subclasses have different constructor shapes, the factory needs
per-class knowledge, which is a routing table by another name. A subclass's own
setup still belongs in its constructor, after `super`: in TypeScript a subclass's
field initializers run only once the base constructor has returned, so a setup hook
the base calls would run before the subclass's fields exist.

## How to apply

1. **Constructor = the family's contract.** The base takes everything an
   instance is (its config/target) and everything the interaction needs (the
   call context: inputs, signal, knobs). A subclass declares a constructor only to
   do its own setup — with exactly the base's parameters, `super(...)` first.
2. **No setup hook called from the base constructor.** A subclass's field
   initializers have not run yet when the base constructor runs (TypeScript's
   class-field order), so the setup a subclass needs is its own constructor's, after
   `super`. Most subclasses declare none.
3. **Helpers used by more than one subclass become `protected` base methods**
   reading the wired state: `this.request(path, options)` carries auth and the
   signal itself; `this.prompt()` reads the wired inputs. If only one subclass
   family needs a helper, it goes on that family's intermediate base.
4. **Intermediate bases own the shared flow, subclasses own the variation**:
   the base sequences (retry, demux, poll loop, deliver), the subclass
   provides the wire mapping as small abstract methods (`stream()`,
   `generate(prompt, p)`, `submit/poll/content`).
5. Instances are cheap and per-interaction — that's what makes wiring
   per-call state into the constructor safe. Don't cache family instances
   across calls if their context is per-call.
6. **Model kinds as classes, not factory functions.** A family of variants
   (errors, providers, services) is a base class extended once per kind,
   constructed with `new` and told apart with `instanceof` — never `throw conflict(...)`:

   ```ts
   throw new AppErrorConflict({
     code: "email_in_use",
   });
   ```


   A factory function or a discriminant string standing in for the class is the
   smell. Plain functions stay for pure transformations with no identity.

## Example

```ts
abstract class Provider {
  // fields declared, then assigned — no constructor parameter properties (a type-strip runtime refuses them)
  protected readonly target: Target;
  protected readonly context: CallContext;

  constructor(target: Target, context: CallContext) {
    this.target = target;
    this.context = context;
  }

  abstract call<T>(handler: Handler<T>): Promise<T>;

  protected async request(path: string, options: RequestOptions): Promise<Response> {
    // auth from this.target, cancellation from this.context.signal — callers pass neither
  }
}

abstract class VideoProvider extends Provider {
  protected abstract submit(prompt: string, params: Params): Promise<Job>; // no signal param
  async call<T>(handler: Handler<T>) { /* the time loop, once, here */ }
}
```
