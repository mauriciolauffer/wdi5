const { wdi5 } = require("wdio-ui5-service")
const Page = require("./Page")

class ComponentLocator extends Page {
    _viewName = "test.Sample.view.Calendar"

    async open() {
        await super.open(`#/Calendar`)
    }

    async getPlanningCalendar() {
        return await browser.asControl({
            selector: {
                controlType: "sap.m.PlanningCalendar",
                id: /PC1/
            }
        })
    }

    async getTodayButton() {
        return await browser.asControl({
            selector: {
                controlType: "sap.m.Button",
                id: /TodayBtn$/
            }
        })
    }

    async getCloseSummaryButton() {
        return await browser.asControl({
            selector: {
                controlType: "sap.m.Button",
                id: /closeSummaryButton$/
            }
        })
    }

    async getViewsMultiComboBox() {
        return await browser.asControl({
            selector: {
                controlType: "sap.m.MultiComboBox",
                viewName: this._viewName
            }
        })
    }
}

module.exports = new ComponentLocator()
