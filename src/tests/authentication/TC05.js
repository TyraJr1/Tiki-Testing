const WebDriverUtil = require('../../../utils/WebDriverUtil');
const HomePage = require('../../../pages/Homepage');
const LoginPage = require('../../../pages/LoginPage');
const config = require('../../../config/config');

// Đăng nhập thất bại với OTP sai quá số lần cho phép
async function TC005() {
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

        // Bước 3: Nhấn số điện thoại
        await loginPage.enterPhoneNumber(config.credentials.phoneNumber);
        console.log('Bước 3: Nhập số điện thoại.');

        // Bước 4: Nhấn đăng nhập bằng SMS
        await loginPage.clickLoginWithSMS();
        console.log('Bước 4: Nhấn đăng nhập bằng SMS.');

        await webDriverUtil.sleep(5000); // Đợi 2 giây để chắc chắn rằng trang đã tải xong

        // Bước 5: Nhập mã OTP không tồn tại 5 lần, với mỗi lần xác mình xem có thẻ span có hiển thị không
        for (let i = 0; i < 5; i++) {
            await loginPage.enterFakeOtp(config.credentials.fakeOtp);
            console.log(`Bước 5: Nhập mã OTP không hợp lệ lần ${i + 1}.`);

            const hasError = await loginPage.checkOTPError();
            if (hasError) {
                console.log('Bước 6: Kiểm tra mã OTP không hợp lệ.');
            }
        }
        

        // Bước 7: Sau 5 lần mã OTP không hợp lệ, ô nhập mã OTP sẽ không cho phép nhập nữa
        await webDriverUtil.sleep(2000); // Đợi 2 giây để chắc chắn rằng ô nhập mã OTP đã bị vô hiệu hóa
        const isDisabled = await loginPage.enterFakeOtp(config.credentials.fakeOtp);
        console.log('Bước 7: Kiểm tra ô nhập mã OTP có bị vô hiệu hóa không.');
        if( isDisabled) {
            console.log('Bước 8: Ô nhập mã OTP đã bị vô hiệu hóa.');
        }
    } catch (error) {
        console.error('Lỗi trong TC005:', error);
    } finally {
        await webDriverUtil.quit();
    }
}

// Chạy test
TC005();