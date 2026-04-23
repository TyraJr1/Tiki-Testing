const WebDriverUtil = require('../../../utils/WebDriverUtil');
const HomePage = require('../../../pages/Homepage');
const LoginPage = require('../../../pages/LoginPage');
const config = require('../../../config/config');


// Kiểm tra người dùng có thể đăng nhập thành công vào hệ thống với email đã đăng ký tài khoản ở Tiki từ trước
async function TC002() {
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

        // Bước 3: Nhấn nút "Đăng nhập bằng email"
        await loginPage.clickLoginEmail(config.credentials.phoneNumber);
        console.log('Bước 3: Click vào "Đăng nhập bằng email" thành công.');

        // Bước 4: Nhập email
        await loginPage.enterEmail(config.credentials.email);
        console.log('Bước 4: Nhập email thành công.');

        // Bước 5: Nhập mật khẩu
        await loginPage.enterPassword(config.credentials.password); 
        console.log('Bước 5: Nhập mật khẩu thành công.');

        // Bước 6: Nhấn nút "Đăng nhập"
        await loginPage.clickLoginButton();
        const loginSuccess = await homePage.verifyLoginSuccess();
        if (loginSuccess) {
            console.log('Bước 6: Đăng nhập thành công, tên người dùng hiển thị.');
        } else {
            throw new Error('Đăng nhập thất bại: Tên người dùng không hiển thị.');
        }
    } catch (error) {
        console.error('Lỗi trong TC002:', error);
    } finally {
        await webDriverUtil.quit();
    }
}

// Chạy test
TC002();