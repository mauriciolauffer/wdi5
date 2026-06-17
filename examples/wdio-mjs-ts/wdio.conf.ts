import { baseConfig } from "../wdio.base.conf.cjs"

const _config = {
    specs: ["../ui5-demos/*.test.{ts,mts}"],
    baseUrl: "https://ui5.sap.com/1.136.19/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html"
}

export const config = { ...baseConfig, ..._config }
