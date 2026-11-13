import { readFile, readdir } from "node:fs/promises";
import { resolve, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const extensions = new Set([".ts", ".tsx", ".mts", ".cts", ".js", ".mjs", ".cjs", ".css"]);
const ignoredDirectories = new Set(["node_modules", ".next", "storybook-static", "dist", ".git"]);
const directives = [
  ["prettier", "ignore"].join("-"),
  ["eslint", "disable"].join("-"),
  ["@ts", "ignore"].join("-"),
  ["@ts", "expect", "error"].join("-"),
  ["@ts", "nocheck"].join("-"),
];

export async function findSuppressions(root, options = {}) {
  const excluded = new Set((options.exclude ?? []).map((path) => resolve(root, path)));
  const generated = new Set(options.generatedNames ?? []);
  const hits = [];
  async function visit(directory) {
    const entries = await readdir(directory, {
      withFileTypes: true,
    });
    for (const entry of entries) {
      const path = resolve(directory, entry.name);
      if (excluded.has(path)) {
        continue;
      }
      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) {
          await visit(path);
        }
      } else if (entry.isFile() && extensions.has(extname(entry.name)) && !generated.has(entry.name)) {
        const lines = (await readFile(path, "utf8")).split("\n");
        lines.forEach((line, index) => {
          if (directives.some((directive) => line.includes(directive))) {
            hits.push(`${relative(root, path)}:${index + 1}`);
          }
        });
      }
    }
  }
  await visit(root);
  return hits;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = JSON.parse(await readFile(resolve("eslint-rules/checks.json"), "utf8"));
  const hits = await findSuppressions(process.cwd(), options);
  if (hits.length > 0) {
    process.stderr.write(`Source suppressions found:\n${hits.join("\n")}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write("Source suppression check passed.\n");
  }
}
