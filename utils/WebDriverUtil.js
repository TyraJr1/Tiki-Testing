const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config/config');

class WebDriverUtil {
    constructor() {
        this.driver = null;
    }

    // Khởi tạo WebDriver
    async initDriver() {
        this.driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options())
            .build();
        return this.driver;
    }

    // Truy cập URL
    async navigateTo(url) {
        await this.driver.get(url);
        await this.driver.wait(until.urlContains(url.split('/')[2]), config.timeout);
    }

    // Chờ và tìm phần tử
    async waitForElement(locator, timeout = config.timeout) {
        return await this.driver.wait(until.elementLocated(locator), timeout);
    }

    // Nhấp phần tử
    async clickElement(locator) {
        const element = await this.waitForElement(locator);
        await element.click();
    }

    // Nhập văn bản vào phần tử
    async sendKeys(locator, text) {
        const element = await this.waitForElement(locator);
        await element.sendKeys(text);
    }

    // Lấy văn bản của phần tử
    async getElementText(locator) {
        const element = await this.waitForElement(locator);
        return await element.getText();
    }

    // Sleep
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Đóng driver
    async quit() {
        if (this.driver) {
            await this.driver.quit();
        }
    }
}

module.exports = WebDriverUtil;