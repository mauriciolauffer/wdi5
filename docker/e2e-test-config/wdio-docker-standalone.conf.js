import { join } from "node:path"
import { baseConfig } from "./wdio.base.conf.js"

export const config = {
    ...baseConfig,
    wdi5: {
        screenshotPath: join("report", "screenshots")
    },
    specs: ["./**/e2e/**/*.test.js"]
}
