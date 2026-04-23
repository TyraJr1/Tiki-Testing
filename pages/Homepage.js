const { By } = require('selenium-webdriver');
const WebDriverUtil = require('../utils/WebDriverUtil');

class HomePage {
    constructor(driver) {
        this.driver = driver;
        this.webDriverUtil = new WebDriverUtil();
        this.webDriverUtil.driver = driver;
        // Định nghĩa các locator
        this.accountIcon = By.xpath("//span[contains(text(), 'Tài khoản')]");
        this.usernameLabel = By.xpath("//span[contains(text(), 'Tên người dùng')]");
        this.accountMenuItem = By.xpath("//p[@title='Thông tin tài khoản']");
    }

    // Truy cập trang chủ
    async open() {
        await this.webDriverUtil.navigateTo('https://tiki.vn');
    }

    // Nhấp biểu tượng "Tài khoản"
    async clickAccountIcon() {
        await this.webDriverUtil.clickElement(this.accountIcon);
    }

    // Kiểm tra đăng nhập thành công
    async verifyLoginSuccess() {
        // Nhấp lại biểu tượng "Tài khoản" để kiểm tra dropdown
        await this.clickAccountIcon();

        // Chờ và nhấp vào mục "Thông tin tài khoản" trong dropdown
        await this.webDriverUtil.clickElement(this.accountMenuItem);

        // Xác minh URL chuyển hướng đến trang thông tin tài khoản
        await this.driver.wait(
            until.urlIs('https://tiki.vn/customer/account/edit?src=header_my_account'),
            10000
        );
        const currentUrl = await this.driver.getCurrentUrl();
        return currentUrl === 'https://tiki.vn/customer/account/edit?src=header_my_account';
    }
}

module.exports = HomePage;