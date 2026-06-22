const { baseConfig } = require("../wdio.root-base.conf.cjs")

exports.config = {
    ...baseConfig,
    specs: ["../reusable-test-scripts/dist/cjs/ui5-remote-apps/*.test.{js,cjs}"],
    baseUrl: "https://ui5.sap.com/1.136.19/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html"
}
