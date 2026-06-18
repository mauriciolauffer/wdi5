import type Button from "sap/m/Button"
import type List from "sap/m/List"
import type StandardListItem from "sap/m/StandardListItem"
import Main from "./pageObjects/Main.js"
import Other from "./pageObjects/Other.js"
import { wdi5 } from "wdio-ui5-service"

describe("ui5 eval on control", () => {
    before(async () => {
        await Main.open()
    })

    it("should have the right title", async () => {
        const title = await browser.getTitle()
        expect(title).toEqual("Sample UI5 Application")
    })

    it("should be able to propagate a browserside error", async () => {
        //Log Output during this test should be 3 times: [wdi5] call of exec failed because of: TypeError: this.getTex is not a function
        //Can't be reasonably verified programatically, only that returned result should be null
        const button = (await browser.asControl({
            selector: {
                id: "openDialogButton",
                viewName: "test.Sample.view.Main"
            }
        })) as any

        //regular function
        const resultRegularFunction = await button.exec(function () {
            return (this as any).getTex()
        })
        expect(resultRegularFunction).toBeNull()

        //arrow functions
        const resultArrowFunction1 = await button.exec(() => (this as any)?.getTex?.() ?? null)
        expect(resultArrowFunction1).toBeNull()
        const resultArrowFunction2 = await button.exec(() => {
            return (this as any)?.getTex?.() ?? null
        })
        expect(resultArrowFunction2).toBeNull()
    })

    it("execute function browserside on button to get its text, basic return type", async () => {
        const button = (await browser.asControl({
            selector: {
                id: "openDialogButton",
                viewName: "test.Sample.view.Main"
            }
        })) as unknown as Button

        const regularBtnText = await button.getText()
        //regular function
        const buttonText = await (button as any).exec(function () {
            return (this as any).getText()
        })
        expect(buttonText).toEqual("open Dialog")
        expect(buttonText).toEqual(regularBtnText)

        //arrow functions
        const buttonTextArrow1 = await (button as any).exec(() => (this as any)?.getText?.() ?? null)
        expect(buttonTextArrow1).toEqual("open Dialog")
        expect(buttonTextArrow1).toEqual(regularBtnText)
        const buttonTextArrow2 = await (button as any).exec(() => {
            return (this as any)?.getText?.() ?? null
        })
        expect(buttonTextArrow2).toEqual("open Dialog")
        expect(buttonTextArrow2).toEqual(regularBtnText)
    })

    it("execute function browserside on button to get its text with fluent sync api, basic return type", async () => {
        const buttonText = await (
            browser.asControl({
                selector: {
                    id: "openDialogButton",
                    viewName: "test.Sample.view.Main"
                }
            }) as any
        ).exec(function () {
            return (this as any).getText()
        })
        expect(buttonText).toEqual("open Dialog")
    })

    it("execute function browserside on button and compare text there, boolean return type", async () => {
        const button = (await browser.asControl({
            selector: {
                id: "openDialogButton",
                viewName: "test.Sample.view.Main"
            }
        })) as unknown as Button

        const regularBtnText = await button.getText()
        //regular function
        const textIsEqual = await (button as any).exec(
            function (dialogTextHardcoded, dialogTextFromUI) {
                return (this as any).getText() === dialogTextHardcoded && (this as any).getText() === dialogTextFromUI
            },
            "open Dialog",
            regularBtnText
        )
        expect(textIsEqual).toEqual(true)

        //arrow functions
        const textIsEqualArrow1 = await (button as any).exec(
            (dialogTextHardcoded, dialogTextFromUI) =>
                (this as any)?.getText?.() === dialogTextHardcoded && (this as any)?.getText?.() === dialogTextFromUI,
            "open Dialog",
            regularBtnText
        )
        expect(textIsEqualArrow1).toEqual(true)
        const textIsEqualArrow2 = await (button as any).exec(
            (dialogTextHardcoded, dialogTextFromUI) => {
                return (
                    (this as any)?.getText?.() === dialogTextHardcoded &&
                    (this as any)?.getText?.() === dialogTextFromUI
                )
            },
            "open Dialog",
            regularBtnText
        )
        expect(textIsEqualArrow2).toEqual(true)
    })

    it("nav to other view and get people list names, array return type", async () => {
        // click webcomponent button to trigger navigation
        const navButton = await browser.asControl({
            selector: {
                id: "NavFwdButton",
                viewName: "test.Sample.view.Main"
            }
        })
        await navButton.press()

        const listSelector = {
            selector: {
                id: "PeopleList",
                viewName: "test.Sample.view.Other",
                interaction: "root" as const
            }
        }
        const list = (await browser.asControl(listSelector)) as unknown as List

        /**
         * need to set
         * wdi5: {logLevel: "verbose"}
         * in config.js
         */

        // *********
        // new approach -> run code in browser scope via wdi5/node-wormhole
        performance.mark("execForListItemTitles_start")
        const peopleListNames = await (list as any).exec(function () {
            return (this as any).getItems().map((item) => item.getTitle())
        })
        performance.mark("execForListItemTitles_end")
        const measure1 = performance.measure(
            "execForListItemTitles",
            "execForListItemTitles_start",
            "execForListItemTitles_end"
        )
        wdi5.getLogger().info(measure1 as unknown as string)
        // *********

        Other.allNames.forEach((name) => {
            expect(peopleListNames).toContain(name)
        })

        performance.mark("regularGetAllItemTitles_start")

        // UI5 API straight forward approach -> takes ~8.1sec
        const listItems = (await list.getItems()) as StandardListItem[]
        const regularPeopleListNames = []
        for (const item of listItems) {
            regularPeopleListNames.push(await item.getTitle())
        }
        performance.mark("regularGetAllItemTitles_end")
        const measure2 = performance.measure(
            "regularGetAllItemTitles",
            "regularGetAllItemTitles_start",
            "regularGetAllItemTitles_end"
        )
        wdi5.getLogger().info(measure2 as unknown as string)

        Other.allNames.forEach((name) => {
            expect(regularPeopleListNames).toContain(name)
        })

        // compare results
        regularPeopleListNames.forEach((name) => {
            expect(peopleListNames).toContain(name)
        })
    })

    it("get people list title and people names, object return type", async () => {
        const listSelector = {
            selector: {
                id: "PeopleList",
                viewName: "test.Sample.view.Other",
                interaction: "root" as const
            }
        }
        // @ts-expect-error
        const peopleListData = await browser.asControl(listSelector).exec(function () {
            return {
                tableTitle: (this as any).getHeaderText(),
                peopleListNames: (this as any).getItems().map((item) => item.getTitle())
            }
        })

        expect(peopleListData.tableTitle).toEqual("...bites the dust!")
        Other.allNames.forEach((name) => {
            expect(peopleListData.peopleListNames).toContain(name)
        })
    })
})
