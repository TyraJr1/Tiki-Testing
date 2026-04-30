const WebDriverUtil = require('../../../utils/WebDriverUtil');
const HomePage = require('../../../pages/Homepage');
const LoginPage = require('../../../pages/LoginPage');
const config = require('../../../config/config');


// Đăng nhập thất bại với số điện thoại không tồn tại
async function TC004() {
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

        // Bước 3: Nhập số điện thoại sai định dạng
        await loginPage.enterFakePhoneNumber(config.credentials.fakePhoneNumber);
        console.log('Bước 3: Nhập số điện thoại sai định dạng.');
        
        const hasError = await loginPage.checkPhoneNumberError();
        console.log('Bước 4: Kiểm tra lỗi số điện thoại không tồn tại.');

        if (hasError) {
            console.log('Bước 5: Đã có lỗi hiển thị: Số điện thoại không đúng định dạng.');
        }
        else {
            throw new Error('Lỗi không hiển thị: Số điện thoại không đúng định dạng.');
        }
        
    } catch (error) {
        console.error('Lỗi trong TC004:', error);
    } finally {
        await webDriverUtil.quit();
    }
}

// Chạy test
TC004();