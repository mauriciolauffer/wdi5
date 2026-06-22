const { baseConfig } = require("../wdio.root-base.conf.cjs")

exports.config = {
    ...baseConfig,
    specs: ["../reusable-test-scripts/ui5-remote-apps/*.test.{ts,cts}"],
    baseUrl: "https://ui5.sap.com/1.136.19/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html"
}
