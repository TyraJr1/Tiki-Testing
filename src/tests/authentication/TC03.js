const WebDriverUtil = require('../../../utils/WebDriverUtil');
const HomePage = require('../../../pages/Homepage');
const LoginPage = require('../../../pages/LoginPage');
const config = require('../../../config/config');


// Kiểm tra người dùng có thể đăng nhập thành công vào hệ thống với tài khoản Facebook
async function TC003() {
    const webDriverUtil = new WebDriverUtil();
    let driver;

    try {
        // Khởi tạo driver
        driver = await webDriverUtil.initDriver();
        const homePage = new HomePage(driver);
        const loginPage = new LoginPage(driver);

        // Bước 1: Truy cập trang chủ Tiki
        await homePage.open();
        console.log('Bước 1: Trang chủ Tiki load thành công.');

        // Bước 2: Nhấn biểu tượng "Tài khoản"
        await homePage.clickAccountIcon();
        console.log('Bước 2: Pop-up đăng nhập hiển thị.');

        // Bước 3: Nhấn biểu tượng Facebook
        await loginPage.clickFacebookIcon();
        console.log('Bước 3: Chuyển hướng đến trang đăng nhập Facebook.');

        // Bước 4: Chờ trang đăng nhập Facebook load
        await webDriverUtil.waitForElement(loginPage.facebookEmailInput, config.timeout);
        console.log('Bước 4: Trang đăng nhập Facebook load thành công.');

        // Bước 5: Nhập email và mật khẩu Facebook
        await loginPage.enterFacebookCredentials(
            config.credentials.facebookEmail,
            config.credentials.facebookPassword
        );
        console.log('Bước 5: Thông tin đăng nhập Facebook được nhập.');

        // Bước 6: Nhấn nút "Đăng nhập" trên trang Facebook
        await loginPage.clickFacebookLoginButton();
        console.log('Bước 6: Đăng nhập vào Facebook thành công.');

        // Bước 7: Xác nhận quyền truy cập
        await loginPage.confirmFacebookAccess();
        console.log('Bước 7: Quyền truy cập được cấp.');

        // Bước 8: Xác minh chuyển hướng về Tiki và đăng nhập thành công
        await driver.wait(until.urlContains('tiki.vn'), config.timeout);
        const loginSuccess = await homePage.verifyLoginSuccess();
        if (loginSuccess) {
            console.log('Bước 8: Đăng nhập thành công, chuyển hướng đến trang thông tin tài khoản.');
        } else {
            throw new Error('Đăng nhập thất bại: Không chuyển hướng đến trang thông tin tài khoản.');
        }
    } catch (error) {
        console.error('Lỗi trong TC003:', error);
    } finally {
        await webDriverUtil.quit();
    }
}

// Chạy test
TC003();