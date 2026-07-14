import { baseConfig } from "./wdio.base.conf.js"

export const config = {
    ...baseConfig,
    specs: ["../webapp/test/e2e/**/*.test.js"],
    exclude: ["../webapp/test/e2e/ui5-late.test.js"],
    services: [["selenium-standalone", { drivers: { chrome: true, chromiumedge: "latest" } }]]
}
