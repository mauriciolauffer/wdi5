import type RecordReplay from "sap/ui/test/RecordReplay"

async function clientSide_checkForUI5Ready(browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(async () => {
        try {
            await (window.bridge as unknown as typeof RecordReplay).waitForUI5(window.wdi5.waitForUI5Options)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }
        window.wdi5.Log.info("[browser wdi5] UI5 is ready")
        return true
    })
}

export { clientSide_checkForUI5Ready }
