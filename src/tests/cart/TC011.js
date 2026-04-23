const WebDriverUtil = require("../../../utils/WebDriverUtil");
const HomePage = require("../../../pages/Homepage");
const LoginPage = require("../../../pages/LoginPage");
const config = require("../../../config/config");

const { By, until } = require("selenium-webdriver");

async function TC011() {
  const webDriverUtil = new WebDriverUtil();
  let driver;

  try {
    // Khởi tạo driver
    driver = await webDriverUtil.initDriver();
    const homePage = new HomePage(driver);
    const loginPage = new LoginPage(driver);

    // Bước 1: Truy cập trang chủ Tiki
    await homePage.open();
    console.log("Bước 1: Trang chủ Tiki load thành công.");
    await driver.sleep(2000); // 2 seconds cooldown

    const popUpCloseButton = await driver.wait(
      until.elementLocated(By.css('[data-view-id="popup-manager.close"]')),
      10000
    );
    await driver.executeScript("arguments[0].click();", popUpCloseButton); // Close the pop-up using JavaScript
    console.log("Pop-up closed.");
    await driver.sleep(2000); // 2 seconds cooldown

    // Bước 2: Nhấn biểu tượng "Tài khoản"
    await homePage.clickAccountIcon();
    console.log("Bước 2: Pop-up đăng nhập hiển thị.");
    await driver.sleep(2000); // 2 seconds cooldown

    // Bước 3: Nhập số điện thoại
    await loginPage.enterPhoneNumber(config.credentials.phoneNumber);
    console.log("Bước 3: Số điện thoại hợp lệ, chuyển đến form mật khẩu.");
    await driver.sleep(2000); // 2 seconds cooldown

    // Bước 4: Nhập mật khẩu
    await loginPage.enterPassword(config.credentials.password);
    console.log("Bước 4: Nhập mật khẩu thành công");
    await driver.sleep(2000); // 2 seconds cooldown

    // Bước 5: Nhấn nút "Đăng nhập"
    const loginButton = await driver.wait(
      until.elementLocated(By.xpath("/html/body/div[10]/div/div/div/div[1]/div/form/button")),
      10000 // Increase timeout to 10 seconds
    );
    await driver.wait(until.elementIsVisible(loginButton), 5000); // Wait until the button is visible
    await loginButton.click();

    await driver.sleep(2000); // 2 seconds cooldown

    // Check if login was successful
    const loginSuccess = await homePage.verifyLoginSuccess();
    await driver.sleep(6000); // 2 seconds cooldown

    if (loginSuccess) {
      console.log("Bước 5: Đăng nhập thành công, tên người dùng hiển thị.");
    } else {
      throw new Error("Đăng nhập thất bại: Tên người dùng không hiển thị.");
    }
  } catch (error) {
    console.error("Lỗi trong TC0011:", error);
  } finally {
    await webDriverUtil.quit();
  }
}

// Chạy test
TC011();
