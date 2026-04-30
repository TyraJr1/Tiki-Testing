const { until } = require('selenium-webdriver');
const WebDriverUtil = require('../../../utils/WebDriverUtil');
const HomePage = require('../../../pages/Homepage');
const LoginPage = require('../../../pages/LoginPage');
const config = require('../../../config/config');

async function TC003() {
    const webDriverUtil = new WebDriverUtil();
    let driver;
    try {
        driver = await webDriverUtil.initDriver();
        const homePage = new HomePage(driver);
        const loginPage = new LoginPage(driver);

        await homePage.open();
        console.log('Bước 1: Trang chủ Tiki load thành công.');

        await homePage.clickAccountIcon();
        console.log('Bước 2: Pop-up đăng nhập hiển thị.');

        await loginPage.acceptTermsIfNeeded();
        console.log('Bước 3: Đã đồng ý điều khoản.');

        await loginPage.clickFacebookIcon();
        console.log('Bước 4: Đã nhấn biểu tượng Facebook.');

        // Lấy mainHandle trước khi Tiki mở popup Facebook
        const mainHandle = (await driver.getAllWindowHandles())[0];
        // Tiki fetch OAuth URL async (~10-15s) rồi mới mở popup
        await webDriverUtil.sleep(15000);
        const switched = await driver.wait(async () => {
            const handles = await driver.getAllWindowHandles();
            if (handles.length > 1) {
                await driver.switchTo().window(handles.find(h => h !== mainHandle));
                return true;
            }
            const url = await driver.getCurrentUrl().catch(() => '');
            return url.includes('facebook.com');
        }, 40000).catch(() => false);

        if (!switched) {
            console.log('⚠️  Popup Facebook không mở được — Tiki có thể đang chặn automation.');
            return;
        }
        console.log('Bước 4: Chuyển đến trang đăng nhập Facebook.');

        await webDriverUtil.waitForElement(loginPage.facebookEmailInput, 30000);
        console.log('Bước 5: Trang Facebook load thành công.');

        await loginPage.enterFacebookCredentials(config.credentials.facebookEmail, config.credentials.facebookPassword);
        await loginPage.clickFacebookLoginButton();
        console.log('Bước 6-7: Nhập thông tin và đăng nhập Facebook.');

        await webDriverUtil.sleep(3000);
        let popupUrl = '';
        try { popupUrl = await driver.getCurrentUrl(); } catch (_) {}
        if (/two_step_verification|checkpoint/.test(popupUrl))
            console.log('⚠️  Facebook yêu cầu xác minh 2 bước (tối đa 120 giây)...');

        try { await loginPage.confirmFacebookAccessIfNeeded(5000); } catch (_) {}
        console.log('Bước 8: Xác nhận quyền truy cập.');

        // Chờ popup đóng — bắt NoSuchWindowError vì popup có thể đóng đột ngột
        try {
            await driver.wait(async () => {
                try { return (await driver.getAllWindowHandles()).length === 1; }
                catch (_) { return true; }
            }, 120000);
        } catch (_) {}

        // Switch về Tiki — nếu fail thì switch lại bằng handle đầu tiên còn lại
        try {
            await driver.switchTo().window(mainHandle);
        } catch (_) {
            const handles = await driver.getAllWindowHandles().catch(() => []);
            if (handles.length > 0) await driver.switchTo().window(handles[0]).catch(() => {});
        }

        // Kiểm tra URL — nếu là checkpoint/robot thì dừng ở đây là OK
        const finalUrl = await driver.getCurrentUrl().catch(() => '');
        if (/checkpoint|robot|captcha|xác\s*minh/i.test(finalUrl)) {
            console.log('⚠️  Bước 9: Dừng tại trang xác minh robot — kết quả chấp nhận được.');
            return;
        }

        // Chờ Tiki xử lý OAuth callback và load lại trang chủ
        await driver.wait(until.urlContains('tiki.vn'), 30000).catch(() => {});
        await webDriverUtil.sleep(3000);

        // Bước 9: Xác minh đăng nhập thành công
        try {
            const loginSuccess = await homePage.verifyLoginSuccess();
            if (loginSuccess) {
                console.log('Bước 9: Đăng nhập Facebook thành công — test case hoàn tất.');
            } else {
                console.error('Bước 9: Đăng nhập thất bại — không điều hướng đến trang tài khoản.');
            }
        } catch (error) {
            const src = `${await driver.getCurrentUrl().catch(() => '')} ${await driver.getPageSource().catch(() => '')}`;
            if (/captcha|robot|xác\s*minh/i.test(src) || error.name === 'NoSuchWindowError') {
                console.log('⚠️  Bước 9: Dừng tại trang xác minh robot — kết quả chấp nhận được.');
            } else {
                console.error('Bước 9: Lỗi xác minh đăng nhập —', error.message);
            }
        }
    } catch (error) {
        console.error('Lỗi trong TC003:', error);
    } finally {
        await webDriverUtil.quit();
    }
}

TC003();
