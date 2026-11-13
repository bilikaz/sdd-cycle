import { basename } from "node:path";

/* @why
-----------
A transaction opens only at an entry, never inside another, and the name says so
-----------
`transaction-entry` holds the transaction law at the opener (services rule 9): a `transaction(` call earns its place
only inside a method whose name ends in `InTransaction` — the naming marker is what makes the boundary visible at
every call site and mechanical to check; a test file answers freely. A transaction never opens inside another
(the shared connection): a `transaction(` written inline inside an open run's callback is refused here (an `outsideTransaction(`
callback stands outside the run), and so is an `…InTransaction(` entry called inside an entry method or an open
run's callback — the suffix exists so this is caught at the call, not when the path runs. One reached any other way
— a run passed by name, an entry reached through a method of no suffix — throws `RepoNestedTransactionError` at
runtime when a transaction is then open.
*/

function entryName(node) {
  if (node.type === "FunctionDeclaration") {
    return node.id?.name;
  }
  if (node.type === "MethodDefinition" || node.type === "Property") {
    return node.key.type === "Identifier" ? node.key.name : undefined;
  }
  return undefined;
}

function participantOf(node, file, participants) {
  return participants.find(
    (participant) =>
      file.replaceAll("\\", "/").endsWith(`/${participant.file}`) &&
      node.type === "MethodDefinition" &&
      entryName(node) === participant.method &&
      node.parent?.parent?.id?.name === participant.className,
  );
}

function isEntry(node, file, participants) {
  return entryName(node)?.endsWith("InTransaction") === true && !participantOf(node, file, participants);
}

function runCallee(node) {
  if (
    (node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression") &&
    node.parent?.type === "CallExpression" &&
    node.parent.arguments[0] === node
  ) {
    const { callee } = node.parent;
    if (callee.type === "Identifier" && callee.name === "outsideTransaction") {
      return "outside";
    }
    if (callee.type === "MemberExpression" && callee.property.name === "transaction") {
      return "run";
    }
  }
  return undefined;
}

function insideEntry(node, file, participants) {
  for (let current = node.parent; current; current = current.parent) {
    if (isEntry(current, file, participants)) {
      return true;
    }
  }
  return false;
}

function insideRun(node) {
  for (let current = node.parent; current; current = current.parent) {
    const callee = runCallee(current);
    if (callee === "outside") {
      return false;
    }
    if (callee === "run") {
      return true;
    }
  }
  return false;
}

function insideOpenRun(node, file, participants) {
  for (let current = node.parent; current; current = current.parent) {
    const callee = runCallee(current);
    if (callee === "outside") {
      return false;
    }
    if (callee === "run" || isEntry(current, file, participants)) {
      return true;
    }
  }
  return false;
}

export const transactionEntry = {
  meta: {
    messages: {
      notEntry:
        "A transaction opens only inside a method named with the `InTransaction` suffix (services rule 9) — hoist the `transaction(run)` to the entry method, in whose open transaction every step it calls runs, or name the method that opens it an entry.",
      nested:
        "A transaction never opens inside an open one (the shared connection) — the steps already run in the open transaction; call them without a `transaction(run)` of their own.",
      nestedEntry:
        "An `InTransaction` entry is never called inside another entry or an open run (the shared connection) — run its steps in the one entry's transaction, or call it from the boundary (the route or handler) instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          builderFiles: {
            type: "array",
            items: {
              type: "string",
            },
          },
          participants: {
            type: "array",
            items: {
              type: "object",
              properties: {
                file: {
                  type: "string",
                },
                className: {
                  type: "string",
                },
                method: {
                  type: "string",
                },
                caller: {
                  type: "string",
                },
              },
              required: ["file", "className", "method", "caller"],
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const file = (context.filename ?? context.getFilename()).replaceAll("\\", "/");
    const { participants = [], builderFiles = [] } = context.options[0] ?? {};
    /* @why
    -----------
    A test file stands where a boundary stands, so it opens and calls its transactions freely
    -----------
    A test drives a service from outside, the way a route does, and a test of the bundler and its transaction
    plumbing opens transactions directly to exercise them — the refusal of a nested one among them — standing no
    business operation whose name could carry the suffix.
    */
    const testFile = basename(file).endsWith(".test.ts");
    return {
      'CallExpression[callee.property.name="transaction"]'(node) {
        /* @why
        -----------
        A transaction with no runner is the builder, not an opening — and only in the bundler's own file
        -----------
        `store.transaction().execute(...)` is Kysely's own builder chain — the base repo's mechanism for opening
        the one real transaction every `transaction(run)` call rides. It names no work and holds no step of its own,
        so an opening has nothing to answer for; only a `transaction(run)` with a runner is a boundary.
        The pass is the bundler's home alone: a zero-arg `transaction()` anywhere else is judged by the name
        like any other call, so a business file cannot pass a builder chain off as the mechanism's chain.
        */
        if (node.arguments.length === 0 && builderFiles.some((path) => file.endsWith(`/${path}`))) {
          return;
        }
        if (testFile) {
          return;
        }
        if (insideRun(node)) {
          context.report({
            node,
            messageId: "nested",
          });
          return;
        }
        if (insideEntry(node, file, participants)) {
          return;
        }
        context.report({
          node,
          messageId: "notEntry",
        });
      },
      "CallExpression[callee.property.name=/InTransaction$/]"(node) {
        for (let current = node.parent; current; current = current.parent) {
          if (participantOf(current, file, participants)) {
            context.report({
              node,
              messageId: "nestedEntry",
            });
            return;
          }
        }
        if (testFile || !insideOpenRun(node, file, participants)) {
          return;
        }
        const participant = participants.find(
          (entry) => file.endsWith(`/${entry.file}`) && node.callee.property.name === entry.method,
        );
        if (participant && node.callee.object.type === "ThisExpression" && insideRun(node)) {
          for (let current = node.parent; current; current = current.parent) {
            if (current.type === "MethodDefinition") {
              if (
                entryName(current) === participant.caller &&
                current.parent?.parent?.id?.name === participant.className
              ) {
                return;
              }
              break;
            }
          }
        }
        context.report({
          node,
          messageId: "nestedEntry",
        });
      },
    };
  },
};
