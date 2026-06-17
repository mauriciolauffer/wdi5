const { baseConfig } = require("../wdio.base.conf.cjs")

const _config = {
    specs: ["../ui5-demos/*.test.{js,cjs}"],
    baseUrl: "https://ui5.sap.com/1.136.19/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html"
}

exports.config = { ...baseConfig, ..._config }
