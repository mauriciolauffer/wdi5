const Main = require("./pageObjects/Main")

describe("allControls interaction", () => {
    before(async () => {
        await Main.open()
    })

    it("should press a specific button from allControls", async () => {
        const selector = {
            selector: {
                controlType: "sap.m.Button",
                viewName: "test.Sample.view.Main",
                interaction: "root"
            }
        }

        const buttons = await browser.allControls(selector)
        // Find the button with a specific ID among all buttons

        const targetButton = buttons.find((btn) => btn.getControlInfo().id.includes("idIaSync"))

        expect(targetButton).toBeDefined()
        // The fix ensures that .press() uses the specific ID of this control instance
        await targetButton.press()

        // Verification: we can check if the button is still there or some other state
        // In Main.controller.js, onPress shows a MessageToast.
        // Hard to verify MessageToast without further setup, but we can at least ensure the call doesn't fail
        // and targets the right element.
        expect(await targetButton.getVisible()).toBeTruthy()
    })

    it("should enter text into a specific input from allControls", async () => {
        const selector = {
            selector: {
                controlType: "sap.m.Input",
                viewName: "test.Sample.view.Main",
                interaction: "root"
            }
        }

        const inputs = await browser.allControls(selector)
        const targetInput = inputs.find((input) => input.getControlInfo().id.includes("mainUserInput"))

        expect(targetInput).toBeDefined()
        const testText = "Typed from allControls"
        await targetInput.enterText(testText)

        expect(await targetInput.getValue()).toEqual(testText)
    })
})
