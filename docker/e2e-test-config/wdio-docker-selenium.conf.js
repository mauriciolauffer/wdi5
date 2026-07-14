import { baseConfig } from "./wdio.base.conf.js"
import { getBrowsers } from "../scripts/getBrowsers.js"

// TODO: use wdio.base.conf.js
const chrome = {
    maxInstances: 1,
    browserName: "chrome",
    browserVersion: "stable",
    acceptInsecureCerts: true,
    "goog:chromeOptions": {
        w3c: false,
        args: ["--headless", "--no-sandbox"]
    }
}

const firefox = {
    maxInstances: 1,
    browserName: "firefox",
    browserVersion: "stable",
    "moz:firefoxOptions": {
        // flag to activate Firefox headless mode (see https://github.com/mozilla/geckodriver/blob/master/README.md#firefox-capabilities for more details about moz:firefoxOptions)
        args: ["-headless"]
    }
}

const _config = {
    ...baseConfig,
    specs: ["../test/e2e/basic.test.js"],
    hostname: "selenium-standalone", // tests running inside the container should connect to the same network
    port: 4444,
    runner: "local",
    path: "/wd/hub",
    capabilities: [],
    wdi5: {
        screenshotPath: "report/screenshots",
        logLevel: "verbose" // error | verbose | silent
    },
    logLevel: "info",
    logLevels: {
        webdriver: "info"
    },
    baseUrl: "http://test-app:8888"
}

const browsers = getBrowsers()

if (browsers) {
    if (browsers.includes("chrome")) {
        _config.capabilities.push(chrome)
    }
    if (browsers.includes("firefox")) {
        _config.capabilities.push(firefox)
    }
} else {
    // nothing defined -> start all
    _config.capabilities.push(chrome)
    _config.capabilities.push(firefox)
}

export const config = _config
