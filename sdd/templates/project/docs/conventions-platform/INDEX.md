# Platform conventions

Optional conventions for the reusable core, API, console and design-system stack. Install with the
default pack; links resolve in the combined convention folder.

## Platform stack

| Topic | Rule in one line |
|---|---|
| [app-routes.md](app-routes.md) | Pages own screens, neighbouring cards and modals; handlers re-export their server operations. |
| [base-classes.md](base-classes.md) | Class families share constructors and protected plumbing; subclasses own their setup. |
| [bff.md](bff.md) | Forward through the BFF; preserve origin checks, caller identity and API responses. |
| [clients.md](clients.md) | One typed browser client mirrors each service and its shared contracts. |
| [console-anatomy.md](console-anatomy.md) | Consistent lists, filters, editors, modal rhythm and action placement. |
| [dtos.md](dtos.md) | One browser-safe request and response contract per operation. |
| [feature-layers.md](feature-layers.md) | Registration, routing and service logic have separate responsibilities. |
| [jobs.md](jobs.md) | The Job engine owns attempts, worker dispatch and captured outcomes. |
| [react.md](react.md) | Named functions, hook-based state, stable keys and scoped subscriptions. |
| [repositories.md](repositories.md) | One thin table owner; the base handles standard reads and writes. |
| [routes.md](routes.md) | Guarded, validated registrations call one service operation and declare their answer. |
| [screens.md](screens.md) | Route-owned state composes typed clients, cards and modals. |
| [services.md](services.md) | Framework-free operations own atomic changes, mandatory Ledger records and transaction boundaries. |
| [story-catalog.md](story-catalog.md) | Colocated stories cover the components that own a look. |
| [ui-components.md](ui-components.md) | Consumers compose the shared design system through sealed component contracts. |
