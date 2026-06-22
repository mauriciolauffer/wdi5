import { baseConfig, reusableTestScriptsPath } from "./wdio.base.conf.cjs"

export const config = {
    ...baseConfig,
    wdi5: {
        url: "#"
    },
    specs: [`${reusableTestScriptsPath}/**/hash-nav.test.cjs`],
    exclude: [`${reusableTestScriptsPath}/ui5-late.test.cjs`, `${reusableTestScriptsPath}/multiremote.test.cjs`]
}
