import { wdi5Selector, clientSide_ui5Response } from "../types/wdi5.types.js"

/**
 * find all UI5 controls by a given selector
 * @param controlSelector
 * @param browserInstance
 */
export async function clientSide_allControls(
    controlSelector: wdi5Selector,
    browserInstance: WebdriverIO.Browser
): Promise<clientSide_ui5Response> {
    return await browserInstance.execute(async (controlSelector) => {
        try {
            if (controlSelector._skipWaitForUI5 !== true) {
                const waitOptions = {
                    timeout: controlSelector.timeout || window.wdi5.waitForUI5Options.timeout,
                    interval: window.wdi5.waitForUI5Options.interval
                }
                await window.bridge.waitForUI5(waitOptions)
            }

            const selector = window.wdi5.createMatcher(controlSelector.selector)

            // manual resolution of ancestor and descendant
            // to avoid issues with declarative resolution in some UI5 versions/environments
            const resolveToControl = async (subSelector) => {
                if (
                    subSelector &&
                    typeof subSelector === "object" &&
                    !(subSelector instanceof (sap.ui as any).core.Control)
                ) {
                    const dom = await (window.bridge as any).findDOMElementByControlSelector({ selector: subSelector })
                    if (dom && !(dom instanceof Error)) {
                        return window.wdi5.getUI5CtlForWebObj(dom as HTMLElement)
                    }
                }
                return subSelector
            }

            if (selector.ancestor) {
                const control = await resolveToControl(selector.ancestor)
                if (control) {
                    const Ancestor = window.wdi5.matchers.Ancestor
                    selector.matchers = selector.matchers || []
                    ;(selector.matchers as any[]).push(new Ancestor(control))
                    delete selector.ancestor
                }
            }

            if (selector.descendant) {
                const control = await resolveToControl(selector.descendant)
                if (control) {
                    const Descendant = window.wdi5.matchers.Descendant
                    selector.matchers = selector.matchers || []
                    ;(selector.matchers as any[]).push(new Descendant(control))
                    delete selector.descendant
                }
            }

            // we use a custom replacer to avoid circular structure issues when logging
            // especially when the selector now contains UI5 control instances
            if (controlSelector.logging !== false) {
                window.wdi5.Log.info(
                    `[browser wdi5] locating all controls using: ${JSON.stringify(
                        selector,
                        window.wdi5.getCircularReplacer()
                    )}`
                )
            }

            const domAll = await (window.bridge as any).findAllDOMElementsByControlSelector({
                selector
            })
            if (domAll && !(domAll instanceof Error)) {
                return {
                    status: 0,
                    result: domAll.map((dom) => {
                        const ui5Control = window.wdi5.getUI5CtlForWebObj(dom as HTMLElement)
                        const id = ui5Control.getId()
                        const className = ui5Control.getMetadata().getName()
                        return {
                            id,
                            className,
                            aProtoFunctions: window.wdi5.retrieveControlMethods(ui5Control),
                            domElement: dom
                        }
                    })
                }
            }
            return {
                status: 1,
                message: domAll?.toString() || "Unknown error in findAllDOMElementsByControlSelector",
                result: domAll
            }
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }
    }, controlSelector)
}
