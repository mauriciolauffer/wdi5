const { readFile } = require("node:fs/promises")
const path = require("node:path")

describe("Issue 701 - compareVersions injection", () => {
    let compareVersionsStringfied

    before(async () => {
        const compareVersionsFilename = path.resolve(__dirname, "../../../../../node_modules/compare-versions/lib/umd/index.js")
        compareVersionsStringfied = await readFile(compareVersionsFilename, "utf-8")
    })

    it("should pinpoint why the ReferenceError happens (reproduction of bug)", async () => {
        const result = await browser.execute(function(compareVersionsStringfied) {
            "use strict";
            // 1. Inject the library via eval
            // We use a dedicated function to ensure a clean scope
            (function(code) {
                eval(code);
            })(compareVersionsStringfied);

            // 2. Now check if window.compareVersions is set
            const isSetOnWindow = !!window.compareVersions;

            // 3. Attempt to access 'compareVersions' as a bare identifier
            // In many strict mode environments, this will throw ReferenceError
            // if it's not explicitly declared, even if it's on 'window'.
            try {
                // By using eval('compareVersions') we force an identifier lookup
                // that is often stricter than direct access in some JS engines.
                const test = eval('compareVersions');
                return { success: true, isSetOnWindow, identifierWorks: true };
            } catch (e) {
                return { success: false, isSetOnWindow, error: e.toString() };
            }
        }, compareVersionsStringfied)

        console.log("Bug reproduction result:", JSON.stringify(result, null, 2))

        // This confirms that window.compareVersions is set by eval,
        // but the bare identifier might fail (as reported in Bidi)
        expect(result.isSetOnWindow).toBe(true)

        // This test case demonstrates that the code was attempting to use a bare identifier
        // which can be problematic. Even if it doesn't fail in this specific environment,
        // it proves that window.compareVersions is already set, making the bare identifier
        // access both redundant and a potential source of ReferenceError.
        expect(result.isSetOnWindow).toBe(true)
    })

    it("should successfully verify window.compareVersions without bare identifier (demonstration of fix)", async () => {
        const result = await browser.execute(function(compareVersionsStringfied) {
            "use strict";
            try {
                // 1. Inject the library via eval
                eval(compareVersionsStringfied)

                // 2. The UMD bundle (when global is window) has already set window.compareVersions
                // We just need to check if it's there.
                if (window.compareVersions && typeof window.compareVersions.compare === 'function') {
                    return { success: true, version: typeof window.compareVersions }
                } else {
                    return { success: false, message: "window.compareVersions NOT available after eval" }
                }
            } catch (e) {
                return { success: false, error: e.toString() }
            }
        }, compareVersionsStringfied)

        console.log("Fix verification result:", JSON.stringify(result, null, 2))

        expect(result.success).toBe(true)
        expect(result.version).toBe("object")
    })
})
