const { until } = require('selenium-webdriver');
const WebDriverUtil = require('../../../utils/WebDriverUtil');
const HomePage = require('../../../pages/Homepage');
const LoginPage = require('../../../pages/LoginPage');
const config = require('../../../config/config');

async function TC001() {
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

        await loginPage.enterPhoneNumber(config.credentials.phoneNumber);
        console.log('Bước 3: Đã nhập số điện thoại.');

        const loginStep = await loginPage.detectLoginStep();
        if (loginStep === 'password') {
            await loginPage.enterPassword(config.credentials.password);
            await loginPage.clickLoginButton();
            console.log('Bước 4-5: Nhập mật khẩu và đăng nhập.');
        } else if (loginStep === 'otp') {
            const otp = process.env.TIKI_OTP;
            if (!otp) throw new Error('Hãy set biến môi trường TIKI_OTP để đăng nhập bằng OTP.');
            await loginPage.enterOtp(otp);
            console.log('Bước 4: Nhập OTP và xác minh thành công.');
        } else {
            throw new Error('Không chuyển sang bước mật khẩu/OTP sau khi nhập số điện thoại.');
        }

        console.log('Bước 6: Nếu thấy captcha, vui lòng xác minh trong trình duyệt (tối đa 120 giây).');
        await loginPage.waitForCaptchaResolved();

        await driver.wait(until.urlContains('tiki.vn'), 15000).catch(() => {});
        if (await homePage.verifyLoginSuccess()) {
            console.log('Bước 7: Đăng nhập thành công, tên người dùng hiển thị.');
        } else {
            throw new Error('Đăng nhập thất bại: Tên người dùng không hiển thị.');
        }
    } catch (error) {
        console.error('Lỗi trong TC001:', error);
        process.exitCode = 1;
    } finally {
        await webDriverUtil.quit();
    }
}

TC001();
