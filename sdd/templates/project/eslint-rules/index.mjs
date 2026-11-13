import { existsSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import typescript from "typescript";
import { commentForm } from "./comment-form.mjs";
import { transactionEntry } from "./transaction-boundary.mjs";

const VERBS = new Set(["get", "post", "put", "patch", "delete", "form"]);

const REPO_METHOD =
  /^(create|createMany|createCopyOf|update|delete|query|allQuery|mapQuery|pageQuery|count|transaction|[a-z][A-Za-z]*Query)$/;

const DTO_NAME = /^[a-z][A-Za-z]*(Create|Update|Delete|Query|PageQuery|[A-Z][a-z]+)Dto$/;
const DTO_VERB = /(Get|Post|Put|Patch)Dto$/;

function superName(classNode) {
  const superClass = classNode.superClass;
  return superClass && superClass.type === "Identifier" ? superClass.name : null;
}

function keyName(member) {
  if (member.key.type === "PrivateIdentifier") {
    return null;
  }
  return member.key.type === "Identifier" ? member.key.name : null;
}

const repoMethods = {
  meta: {
    type: "problem",
    docs: {
      description: "A Repo subclass exposes only the repo words (docs/conventions/repositories.md rules 3, 9).",
    },
    schema: [],
    messages: {
      verb: "Repo method '{{name}}' is not a repo word: create · createMany · createCopyOf · update · delete · query · allQuery · mapQuery · pageQuery · count · transaction · a report's <x>Query (repositories.md rules 3, 9) — a helper is private or protected.",
    },
  },
  create(context) {
    function check(classNode) {
      if (superName(classNode) !== "Repo") {
        return;
      }
      for (const member of classNode.body.body) {
        const isMethod = member.type === "MethodDefinition" && member.kind === "method";
        const isArrow =
          member.type === "PropertyDefinition" &&
          member.value &&
          (member.value.type === "ArrowFunctionExpression" || member.value.type === "FunctionExpression");
        if (!isMethod && !isArrow) {
          continue;
        }
        if (member.accessibility === "private" || member.accessibility === "protected") {
          continue;
        }
        const name = keyName(member);
        if (name === null || REPO_METHOD.test(name)) {
          continue;
        }
        context.report({
          node: member.key,
          messageId: "verb",
          data: { name },
        });
      }
    }
    return {
      ClassDeclaration: check,
      ClassExpression: check,
    };
  },
};

const dtoNames = {
  meta: {
    type: "problem",
    docs: {
      description: "A DTO schema is named object + action + Dto (docs/conventions/dtos.md rules 2–3).",
    },
    schema: [],
    messages: {
      name: "DTO '{{name}}' is not object + action + Dto, camelCase (dtos.md rules 2–4).",
      verb: "DTO '{{name}}' is named after its HTTP verb — name it after its action: Create · Update · Delete · Query · PageQuery or the intent its URL says (dtos.md rule 3).",
      exported:
        "'{{name}}' is exported from a dto.ts but is no DTO — a dto.ts exports its DTO schemas and their types; a shared field schema is a local constant (dtos.md).",
    },
  },
  create(context) {
    const isDtoFile = /(^|[\\/])dto\.ts$/.test(context.filename);
    function checkName(id) {
      if (!DTO_NAME.test(id.name)) {
        context.report({
          node: id,
          messageId: "name",
          data: {
            name: id.name,
          },
        });
      } else if (DTO_VERB.test(id.name)) {
        context.report({
          node: id,
          messageId: "verb",
          data: {
            name: id.name,
          },
        });
      }
    }
    return {
      "Program > VariableDeclaration > VariableDeclarator, Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator"(
        node,
      ) {
        if (node.id.type !== "Identifier") {
          return;
        }
        const exported = node.parent.parent.type === "ExportNamedDeclaration";
        if (/Dto$/i.test(node.id.name)) {
          checkName(node.id);
        } else if (isDtoFile && exported) {
          context.report({
            node: node.id,
            messageId: "exported",
            data: {
              name: node.id.name,
            },
          });
        }
      },
    };
  },
};

function enclosingRouterClass(node) {
  for (let current = node.parent; current; current = current.parent) {
    if (current.type === "ClassDeclaration" || current.type === "ClassExpression") {
      const name = superName(current);
      return name && /Router$/.test(name) ? current : null;
    }
  }
  return null;
}

function isThis(node) {
  return node.type === "ThisExpression";
}

const routeLayout = {
  meta: {
    type: "layout",
    docs: {
      description:
        "A feature router registers each route as one this.<verb>( call laid out one part per line (docs/conventions/routes.md rules 1, 2).",
    },
    schema: [],
    messages: {
      path: "The path goes on the line of `this.{{verb}}(` (routes.md rule 2).",
      part: "One part per line: the path, the DTO, the answer, the handler and the options each start on their own line (routes.md rule 2).",
      close: "The closing `);` of a route goes on its own line (routes.md rule 2).",
      handler:
        "A route handler is an inline arrow function whose body is one expression — the one service operation (routes.md rule 1).",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      CallExpression(node) {
        const callee = node.callee;
        if (callee.type !== "MemberExpression" || callee.computed || callee.property.type !== "Identifier") {
          return;
        }
        const verb = callee.property.name;
        if (!VERBS.has(verb) || !enclosingRouterClass(node)) {
          return;
        }
        if (
          callee.object.type === "MemberExpression" &&
          isThis(callee.object.object) &&
          callee.object.property.type === "Identifier" &&
          callee.object.property.name === "hono"
        ) {
          return;
        }
        if (!isThis(callee.object)) {
          return;
        }
        const [path, ...rest] = node.arguments;
        if (!path) {
          return;
        }
        if (path.loc.start.line !== callee.loc.end.line) {
          context.report({
            node: path,
            messageId: "path",
            data: { verb },
          });
        }
        let previous = path;
        for (const part of rest) {
          if (part.loc.start.line <= previous.loc.end.line) {
            context.report({
              node: part,
              messageId: "part",
            });
          }
          previous = part;
        }
        const handler = rest.find(
          (part) => part.type === "ArrowFunctionExpression" || part.type === "FunctionExpression",
        );
        if (!handler || handler.type !== "ArrowFunctionExpression" || handler.body.type === "BlockStatement") {
          context.report({
            node,
            messageId: "handler",
          });
        }
        const closing = sourceCode.getLastToken(node);
        if (closing.loc.start.line <= previous.loc.end.line) {
          context.report({
            node: closing,
            messageId: "close",
          });
        }
      },
    };
  },
};

function moduleOf(modulesDirectory, path) {
  const inside = relative(modulesDirectory, path);
  if (!inside || inside.startsWith("..") || isAbsolute(inside)) {
    return null;
  }
  return inside.split(sep)[0];
}

const moduleBoundary = {
  meta: {
    type: "problem",
    docs: {
      description:
        "A console module imports no other module but the shared ones (docs/conventions/screens.md rule 7), by alias or by a relative path.",
    },
    schema: [
      {
        type: "object",
        properties: {
          modulesDirectory: {
            type: "string",
          },
          alias: {
            type: "string",
          },
          shared: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["modulesDirectory", "alias", "shared"],
        additionalProperties: false,
      },
    ],
    messages: {
      foreign:
        "Module '{{own}}' imports module '{{other}}' — a module imports no other module but {{shared}} (screens.md rule 7).",
    },
  },
  create(context) {
    const { modulesDirectory, alias, shared } = context.options[0];
    const own = moduleOf(modulesDirectory, context.filename);
    if (own === null) {
      return {};
    }
    function check(node) {
      if (!node.source || typeof node.source.value !== "string") {
        return;
      }
      const source = node.source.value;
      let other = null;
      if (source.startsWith(`${alias}/`)) {
        other = source.slice(alias.length + 1).split("/")[0];
      } else if (source.startsWith(".")) {
        other = moduleOf(modulesDirectory, resolve(dirname(context.filename), source));
      }
      if (other !== null && other !== own && !shared.includes(other)) {
        context.report({
          node: node.source,
          messageId: "foreign",
          data: {
            own,
            other,
            shared: shared.join(", "),
          },
        });
      }
    }
    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
      ImportExpression: check,
    };
  },
};

const DOOR = /^index\.(ts|tsx|mts|cts|mjs|js)$/;

function within(directory, folder) {
  const inside = relative(folder, directory);
  return inside === "" || (!inside.startsWith("..") && !isAbsolute(inside));
}

function doorBehind(directory, importer) {
  let at = directory;
  while (!existsSync(join(at, "package.json"))) {
    const door = ["index.ts", "index.tsx"].find((file) => existsSync(join(at, file)));
    if (door && !within(importer, at)) {
      return relative(importer, join(at, door)) || door;
    }
    const parent = dirname(at);
    if (parent === at) {
      return null;
    }
    at = parent;
  }
  return null;
}

const oneDoor = {
  meta: {
    type: "problem",
    docs: {
      description:
        "A folder's index is its door to the outside: the outside enters by it, its own files never import it, nor their package by name (docs/conventions/one-door.md rules 1–3).",
    },
    schema: [
      {
        type: "object",
        properties: {
          packages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                directory: {
                  type: "string",
                },
              },
              required: ["name", "directory"],
              additionalProperties: false,
            },
          },
        },
        required: ["packages"],
        additionalProperties: false,
      },
    ],
    messages: {
      ownDoor:
        "'{{source}}' is the door of a folder this file lives in — import the sibling file itself; a file entering its own door is an import cycle (one-door.md rule 2).",
      outsideDoor:
        "'{{source}}' is a file behind {{door}} — from outside its folder, enter by the door (one-door.md rule 1).",
      ownName:
        "'{{source}}' names this file's own package — inside a package, import the file itself (one-door.md rule 3).",
    },
  },
  create(context) {
    const { packages } = context.options[0];
    const here = dirname(context.filename);
    const own = packages.find((workspacePackage) => within(here, workspacePackage.directory));
    function check(node) {
      if (!node.source || typeof node.source.value !== "string") {
        return;
      }
      const source = node.source.value;
      if (own && (source === own.name || source.startsWith(`${own.name}/`))) {
        context.report({
          node: node.source,
          messageId: "ownName",
          data: { source },
        });
        return;
      }
      if (!source.startsWith(".")) {
        return;
      }
      const target = resolve(here, source);
      const name = target.split(sep).at(-1) ?? "";
      const isTest = /\.test\.tsx?$/.test(context.filename) || context.filename.split(sep).includes("test");
      if (!isTest && !DOOR.test(name) && /\.[a-z]+$/.test(name)) {
        const door = doorBehind(dirname(target), here);
        if (door) {
          context.report({
            node: node.source,
            messageId: "outsideDoor",
            data: { source, door },
          });
          return;
        }
      }
      const folder = DOOR.test(name) ? dirname(target) : target;
      if (
        (DOOR.test(name) || !/\.[a-z]+$/.test(name)) &&
        within(here, folder) &&
        resolve(context.filename) !== target
      ) {
        context.report({
          node: node.source,
          messageId: "ownDoor",
          data: { source },
        });
      }
    }
    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
      ImportExpression: check,
    };
  },
};

const objectLayout = {
  meta: {
    type: "layout",
    fixable: "whitespace",
    docs: {
      description:
        "An object literal with a `key: value` is written one property per line (docs/conventions/code-layout.md rule 3).",
    },
    schema: [],
    messages: {
      oneLine:
        "An object with a `key: value` is data — one property per line (code-layout.md rule 3); only names (`{ a, b }`) stay on one line.",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      ObjectExpression(node) {
        const mapsAKey = node.properties.some((property) => property.type === "Property" && !property.shorthand);
        if (!mapsAKey) {
          return;
        }
        const open = sourceCode.getFirstToken(node);
        const first = sourceCode.getTokenAfter(open);
        if (first && first.loc.start.line === open.loc.end.line && first.value !== "}") {
          context.report({
            node,
            messageId: "oneLine",
            fix: (fixer) => fixer.insertTextAfter(open, "\n"),
          });
          return;
        }
        node.properties.slice(1).forEach((property, index) => {
          const previous = node.properties[index];
          if (property.loc.start.line === previous.loc.end.line) {
            const comma = sourceCode.getTokenAfter(previous);
            context.report({
              node: property,
              messageId: "oneLine",
              fix: (fixer) => fixer.insertTextAfter(comma, "\n"),
            });
          }
        });
      },
    };
  },
};

const noShapeSniffing = {
  meta: {
    type: "problem",
    docs: {
      description:
        'No `"key" in value` on a union of object shapes — the shape-sniff of a missing canonical shape (docs/conventions/canonical-shapes.md).',
    },
    schema: [],
    messages: {
      sniff:
        "`{{key}} in …` tells apart a union of shapes — a refusal throws its App error (services.md rule 5), an answer has one shape (canonical-shapes.md).",
    },
  },
  create(context) {
    const services = context.sourceCode.parserServices;
    if (!services || !services.program || !services.esTreeNodeToTSNodeMap) {
      return {};
    }
    const checker = services.program.getTypeChecker();
    const NULLISH = typescript.TypeFlags.Null | typescript.TypeFlags.Undefined;
    return {
      BinaryExpression(node) {
        if (node.operator !== "in" || node.left.type !== "Literal" || typeof node.left.value !== "string") {
          return;
        }
        const type = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node.right));
        const shapes = (type.isUnion() ? type.types : [type]).filter((part) => (part.flags & NULLISH) === 0);
        if (shapes.length >= 2 && shapes.every((part) => (part.flags & typescript.TypeFlags.Object) !== 0)) {
          context.report({
            node,
            messageId: "sniff",
            data: {
              key: JSON.stringify(node.left.value),
            },
          });
        }
      },
    };
  },
};

const noUnionOfShapes = {
  meta: {
    type: "problem",
    docs: {
      description:
        "A union of object shapes needs an `@union <why>` tag on its declaration (docs/conventions/canonical-shapes.md rule 3).",
    },
    schema: [],
    messages: {
      union:
        "A union of object shapes — one shape with a field, or a thrown refusal, says it instead (canonical-shapes.md rule 1); a union that must stay carries `@union <why>` on its declaration (rule 3).",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const services = sourceCode.parserServices;
    const typed = Boolean(services && services.program && services.esTreeNodeToTSNodeMap);
    const checker = typed ? services.program.getTypeChecker() : null;
    const NULLISH = typescript.TypeFlags.Null | typescript.TypeFlags.Undefined | typescript.TypeFlags.Void;

    function isShape(type) {
      if ((type.flags & typescript.TypeFlags.Object) === 0 || checker.isArrayType(type) || checker.isTupleType(type)) {
        return false;
      }
      if (type.getCallSignatures().length > 0 || type.getConstructSignatures().length > 0) {
        return false;
      }
      const symbol = type.getSymbol();
      if (symbol && (symbol.flags & typescript.SymbolFlags.Class) !== 0) {
        return false;
      }
      const declarations = symbol ? (symbol.getDeclarations() ?? []) : [];
      if (
        declarations.length > 0 &&
        declarations.every((declaration) => declaration.getSourceFile().fileName.includes("/node_modules/"))
      ) {
        return false;
      }
      const name = symbol ? symbol.getName() : "";
      return !["Promise", "Date", "Map", "Set", "Response", "NextResponse", "Request", "Error", "RegExp"].includes(
        name,
      );
    }

    function shapesOf(type) {
      const parts = type.isUnion() ? type.types : [type];
      return parts.filter((part) => (part.flags & NULLISH) === 0 && isShape(part));
    }

    function tagged(node) {
      let at = node;
      while (
        at.parent &&
        ![
          "Program",
          "BlockStatement",
          "ClassBody",
          "TSInterfaceBody",
          "TSTypeLiteral",
          "ObjectExpression",
          "ExportNamedDeclaration",
        ].includes(at.parent.type)
      ) {
        at = at.parent;
      }
      const statement = at.parent && at.parent.type === "ExportNamedDeclaration" ? at.parent : at;
      return sourceCode.getCommentsBefore(statement).some((comment) => /@union\s+\S/.test(comment.value));
    }

    function report(node) {
      if (!tagged(node)) {
        context.report({
          node,
          messageId: "union",
        });
      }
    }

    function isObjectMember(member) {
      if (member.type === "TSTypeLiteral") {
        return true;
      }
      if (!checker || member.type !== "TSTypeReference") {
        return false;
      }
      return shapesOf(checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(member))).length > 0;
    }

    function zodObjectCall(node) {
      return (
        node &&
        node.type === "CallExpression" &&
        node.callee.type === "MemberExpression" &&
        node.callee.property.type === "Identifier" &&
        ["object", "strictObject", "looseObject"].includes(node.callee.property.name)
      );
    }

    return {
      TSUnionType(node) {
        if (node.parent && node.parent.type === "TSUnionType") {
          return;
        }
        if (node.types.filter(isObjectMember).length >= 2) {
          report(node);
        }
      },
      CallExpression(node) {
        const callee = node.callee;
        if (
          callee.type !== "MemberExpression" ||
          callee.property.type !== "Identifier" ||
          !["union", "discriminatedUnion"].includes(callee.property.name)
        ) {
          return;
        }
        const options = node.arguments.find((argument) => argument.type === "ArrayExpression");
        if (options && options.elements.filter(zodObjectCall).length >= 2) {
          report(node);
        }
      },
      ":function"(node) {
        if (!checker || node.returnType) {
          return;
        }
        /* @why
        -----------
        A function typed by its context is judged where that type is declared
        -----------
        A library's callback or a method of an interface it implements answers the shape declared there, so that
        declaration is where a union is judged, not this function. A generic callback's answer (`map`'s) is a type
        parameter, its own, so the function is judged here like one without context.
        */
        const typescriptNode = services.esTreeNodeToTSNodeMap.get(node);
        const contextual =
          typescript.isFunctionLike(typescriptNode) && "parent" in typescriptNode
            ? checker.getContextualType(typescriptNode)
            : undefined;
        const declared = contextual ? contextual.getCallSignatures()[0] : undefined;
        if (declared && (checker.getReturnTypeOfSignature(declared).flags & typescript.TypeFlags.TypeParameter) === 0) {
          return;
        }
        const signature = checker.getSignatureFromDeclaration(typescriptNode);
        if (!signature) {
          return;
        }
        let answer = checker.getReturnTypeOfSignature(signature);
        const awaited = checker.getAwaitedType(answer);
        answer = awaited ?? answer;
        if (shapesOf(answer).length >= 2) {
          report(node);
        }
      },
    };
  },
};

const KINDS = [
  {
    file: /[\\/]shared[\\/]entities[\\/][^\\/]+\.ts$/,
    suffix: "Entity",
    grammar: /^[a-z][A-Za-z]*Entity$/,
  },
  {
    file: /[\\/]dtos[\\/][^\\/]+[\\/]dto\.ts$/,
    suffix: "Dto",
    grammar: DTO_NAME,
  },
];

const capitalized = (name) => name[0].toUpperCase() + name.slice(1);

const contractNames = {
  meta: {
    type: "problem",
    docs: {
      description:
        "A shared contract file exports only its kind — …Entity or …Dto schemas and their types (docs/conventions/dtos.md rules 6–8).",
    },
    schema: [],
    messages: {
      value:
        "'{{name}}' does not belong in this {{kind}} file: it exports only {{grammar}} schemas (dtos.md rules 6–8).",
      type: "Type '{{name}}' is not a derived type of this file's schemas: '<Schema>' or '<Schema>Json' (dtos.md rule 8).",
      all: "No `export *` in this {{kind}} file: every export is named, so its name can be checked (dtos.md rules 6–8).",
      default:
        "No default export in this {{kind}} file: it exports only named …{{kind}} schemas and their types (dtos.md rules 6–8).",
    },
  },
  create(context) {
    const kind = KINDS.find((candidate) => candidate.file.test(context.filename));
    if (!kind) {
      return {};
    }
    const values = new Set();
    const types = [];
    const localTypes = new Set();
    function checkValue(id, name) {
      values.add(name);
      if (!kind.grammar.test(name)) {
        context.report({
          node: id,
          messageId: "value",
          data: {
            name,
            kind: kind.suffix,
            grammar: `…${kind.suffix}`,
          },
        });
      }
    }
    return {
      Program(program) {
        for (const statement of program.body) {
          const declaration = statement.type === "ExportNamedDeclaration" ? statement.declaration : statement;
          if (
            declaration &&
            (declaration.type === "TSTypeAliasDeclaration" || declaration.type === "TSInterfaceDeclaration")
          ) {
            localTypes.add(declaration.id.name);
          }
        }
      },
      "Program > ExportAllDeclaration"(node) {
        context.report({
          node,
          messageId: "all",
          data: {
            kind: kind.suffix,
          },
        });
      },
      "Program > ExportDefaultDeclaration"(node) {
        context.report({
          node,
          messageId: "default",
          data: {
            kind: kind.suffix,
          },
        });
      },
      "Program > ExportNamedDeclaration"(node) {
        const declaration = node.declaration;
        if (!declaration) {
          for (const specifier of node.specifiers) {
            const exported = specifier.exported;
            const name = exported.type === "Identifier" ? exported.name : String(exported.value);
            const local = specifier.local.type === "Identifier" ? specifier.local.name : String(specifier.local.value);
            const isType =
              node.exportKind === "type" || specifier.exportKind === "type" || (!node.source && localTypes.has(local));
            if (isType) {
              types.push({
                node: exported,
                name,
              });
            } else {
              checkValue(exported, name);
            }
          }
          return;
        }
        if (declaration.type === "VariableDeclaration") {
          for (const declarator of declaration.declarations) {
            if (declarator.id.type !== "Identifier") {
              continue;
            }
            checkValue(declarator.id, declarator.id.name);
          }
        } else if (declaration.type === "TSTypeAliasDeclaration" || declaration.type === "TSInterfaceDeclaration") {
          types.push({
            node: declaration.id,
            name: declaration.id.name,
          });
        } else if (declaration.id) {
          context.report({
            node: declaration.id,
            messageId: "value",
            data: {
              name: declaration.id.name,
              kind: kind.suffix,
              grammar: `…${kind.suffix}`,
            },
          });
        }
      },
      "Program:exit"() {
        const allowed = new Set([...values].flatMap((value) => [capitalized(value), `${capitalized(value)}Json`]));
        for (const { node, name } of types) {
          if (!allowed.has(name)) {
            context.report({
              node,
              messageId: "type",
              data: { name },
            });
          }
        }
      },
    };
  },
};

function rootOf(roots, path) {
  return roots.find((root) => {
    const inside = relative(root, path);
    return inside === "" || (!inside.startsWith("..") && !isAbsolute(inside));
  });
}

const sharedBoundary = {
  meta: {
    type: "problem",
    docs: {
      description:
        "A shared folder is browser-safe: it imports only the allowed packages and its own files (docs/conventions/dtos.md rule 6).",
    },
    schema: [
      {
        type: "object",
        properties: {
          roots: {
            type: "array",
            items: {
              type: "string",
            },
          },
          allow: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["roots", "allow"],
        additionalProperties: false,
      },
    ],
    messages: {
      outside:
        "'{{source}}' is outside this shared folder — a shared file imports only {{allow}} and the folder's own files, so a browser may import it (dtos.md rule 6).",
      dynamic:
        "A dynamic import() in a shared folder takes a string literal — a computed source cannot be checked as browser-safe (dtos.md rule 6).",
    },
  },
  create(context) {
    const { roots, allow } = context.options[0];
    const own = rootOf(roots, context.filename);
    if (!own) {
      return {};
    }
    function check(node) {
      if (
        node.type === "ImportExpression" &&
        !(node.source.type === "Literal" && typeof node.source.value === "string")
      ) {
        context.report({
          node: node.source,
          messageId: "dynamic",
        });
        return;
      }
      if (!node.source || typeof node.source.value !== "string") {
        return;
      }
      const source = node.source.value;
      const inside = source.startsWith(".")
        ? rootOf([own], resolve(dirname(context.filename), source))
        : allow.includes(source);
      if (!inside) {
        context.report({
          node: node.source,
          messageId: "outside",
          data: {
            source,
            allow: allow.join(" · "),
          },
        });
      }
    }
    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
      ImportExpression: check,
    };
  },
};

function leftMost(name) {
  let current = name;
  while (current.type === "TSQualifiedName") {
    current = current.left;
  }
  return current.type === "Identifier" ? current : null;
}

function typeParts(
  node,
  out = {
    names: [],
    literals: [],
    inline: [],
  },
) {
  if (!node || typeof node !== "object") {
    return out;
  }
  if (node.type === "TSTypeLiteral") {
    out.inline.push(node);
  } else if (node.type === "TSLiteralType" || node.type === "TSTemplateLiteralType") {
    out.literals.push(node);
    return out;
  } else if (node.type === "TSTypeReference") {
    const id = leftMost(node.typeName);
    if (id) {
      out.names.push(id);
    }
  } else if (node.type === "TSTypeQuery") {
    const id = node.exprName.type === "TSImportType" ? null : leftMost(node.exprName);
    if (id) {
      out.names.push(id);
    }
  } else if (node.type === "TSImportType") {
    out.inline.push(node);
    return out;
  }
  for (const key of Object.keys(node)) {
    if (key === "parent" || key === "loc" || key === "range" || key === "typeName" || key === "exprName") {
      continue;
    }
    const child = node[key];
    if (Array.isArray(child)) {
      child.forEach((part) => typeParts(part, out));
    } else if (child && typeof child.type === "string") {
      typeParts(child, out);
    }
  }
  return out;
}

const FUNCTION = new Set(["ArrowFunctionExpression", "FunctionExpression"]);

function isCancellationParameter(member, parameter, index, total) {
  const annotation = parameter.typeAnnotation?.typeAnnotation;
  return (
    member.type === "MethodDefinition" &&
    member.kind === "method" &&
    index === total - 1 &&
    parameter.type === "Identifier" &&
    parameter.name === "abortSignal" &&
    parameter.optional === true &&
    annotation?.type === "TSTypeReference" &&
    annotation.typeName.type === "Identifier" &&
    annotation.typeName.name === "AbortSignal" &&
    annotation.typeArguments === undefined
  );
}

const clientContract = {
  meta: {
    type: "problem",
    docs: {
      description:
        "A console client class types its methods only with the shared contract's types — never a hand copy (docs/conventions/clients.md rule 3).",
    },
    schema: [
      {
        type: "object",
        properties: {
          from: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["from"],
        additionalProperties: false,
      },
    ],
    messages: {
      foreign:
        "'{{name}}' is not imported from {{from}} — a client method's parameter and answer types come from the shared contract, never a local copy (clients.md rule 3).",
      inline:
        "An inline or imported-in-place type in a client method's signature is a hand copy — name the shared entity, DTO or response DTO instead (clients.md rule 3).",
      literal:
        "A literal type in a client method's signature is a hand copy of the contract's values — name the shared entity, DTO or response DTO instead (clients.md rule 3).",
      returns:
        "Client method '{{name}}' declares no return type — its answer would hide in the call's inferred type; annotate it with the shared type (clients.md rule 3).",
    },
  },
  create(context) {
    const { from } = context.options[0];
    const shared = new Set(["Promise"]);
    function checkAnnotation(annotation) {
      const { names, literals, inline } = typeParts(annotation);
      for (const node of inline) {
        context.report({
          node,
          messageId: "inline",
        });
      }
      for (const node of literals) {
        context.report({
          node,
          messageId: "literal",
        });
      }
      for (const id of names) {
        if (!shared.has(id.name)) {
          context.report({
            node: id,
            messageId: "foreign",
            data: {
              name: id.name,
              from: from.join(" · "),
            },
          });
        }
      }
    }
    function checkFunction(member, functionNode, typed) {
      for (const [index, parameter] of functionNode.params.entries()) {
        if (isCancellationParameter(member, parameter, index, functionNode.params.length)) {
          continue;
        }
        const target = parameter.type === "AssignmentPattern" ? parameter.left : parameter;
        if (target.typeAnnotation) {
          checkAnnotation(target.typeAnnotation);
        }
      }
      if (functionNode.returnType) {
        checkAnnotation(functionNode.returnType);
      } else if (!typed && member.kind !== "constructor" && member.kind !== "set") {
        const name = member.key.type === "Identifier" ? member.key.name : context.sourceCode.getText(member.key);
        context.report({
          node: member.key,
          messageId: "returns",
          data: { name },
        });
      }
    }
    return {
      ImportDeclaration(node) {
        if (from.includes(node.source.value)) {
          for (const specifier of node.specifiers) {
            shared.add(specifier.local.name);
          }
        }
      },
      "ClassBody > MethodDefinition"(node) {
        checkFunction(node, node.value, false);
      },
      "ClassBody > PropertyDefinition"(node) {
        if (node.typeAnnotation) {
          checkAnnotation(node.typeAnnotation);
        }
        if (node.value && FUNCTION.has(node.value.type)) {
          checkFunction(node, node.value, Boolean(node.typeAnnotation));
        }
      },
    };
  },
};

export default {
  meta: {
    name: "local",
  },
  rules: {
    "repo-methods": repoMethods,
    "dto-names": dtoNames,
    "route-layout": routeLayout,
    "module-boundary": moduleBoundary,
    "contract-names": contractNames,
    "shared-boundary": sharedBoundary,
    "client-contract": clientContract,
    "one-door": oneDoor,
    "object-layout": objectLayout,
    "no-shape-sniffing": noShapeSniffing,
    "no-union-of-shapes": noUnionOfShapes,
    "comment-form": commentForm,
    "transaction-entry": transactionEntry,
  },
};
