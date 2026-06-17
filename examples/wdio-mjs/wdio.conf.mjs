import { baseConfig } from "../wdio.base.conf.cjs"

const _config = {
    specs: ["../ui5-demos/dist/esm/*.test.{js,mjs}"],
    baseUrl: "https://ui5.sap.com/1.136.19/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html"
}

export const config = { ...baseConfig, ..._config }
