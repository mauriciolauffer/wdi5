import { readdirSync, renameSync, statSync } from "node:fs"
import { join } from "node:path"

const targetDir = "./examples/reusable-test-scripts/dist/cjs"

async function renameJsToCjs(dir) {
    for (const entry of readdirSync(dir)) {
        const fullPath = join(dir, entry)
        if (statSync(fullPath).isDirectory()) {
            renameJsToCjs(fullPath)
        } else if (entry.endsWith(".test.js")) {
            const newPath = join(dir, entry.slice(0, -3) + ".cjs")
            renameSync(fullPath, newPath)
        }
    }
}

await renameJsToCjs(targetDir)
