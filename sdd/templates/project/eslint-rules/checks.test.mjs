import { it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findSuppressions } from "./check-suppressions.mjs";

it("reports suppressions, honors configured exclusions and refuses an unreadable root", async () => {
  const root = await mkdtemp(join(tmpdir(), "sdd-suppressions-"));
  try {
    const directive = ["eslint", "disable"].join("-");
    await writeFile(join(root, "source.ts"), `// ${directive}\nconst value = 1;\n`);
    await mkdir(join(root, "generated"));
    await writeFile(join(root, "generated/entry.ts"), `// ${directive}\n`);
    assert.deepEqual(
      await findSuppressions(root, {
        exclude: ["generated"],
      }),
      ["source.ts:1"],
    );
    await assert.rejects(findSuppressions(join(root, "missing")), {
      code: "ENOENT",
    });
  } finally {
    await rm(root, {
      recursive: true,
    });
  }
});
