const WebDriverUtil = require("../../../utils/WebDriverUtil");
const HomePage = require("../../../pages/Homepage");
const LoginPage = require("../../../pages/LoginPage");
const config = require("../../../config/config");

const { By, until } = require("selenium-webdriver");

async function navigateTo(driver, url) {
  await driver.get(url);
  await driver.wait(until.urlContains(url.split("/")[2]), config.timeout);
}

async function TC028() {
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
    await driver.sleep(2000); // 5 seconds cooldown

    // Đóng pop-up nếu có
    try {
      const popUpCloseButton = await driver.wait(
        until.elementLocated(By.css('[data-view-id="popup-manager.close"]')),
        10000
      );
      await driver.executeScript("arguments[0].click();", popUpCloseButton);
      console.log("Pop-up closed.");
      await driver.sleep(2000);
    } catch (popupErr) {
      console.log("Không tìm thấy pop-up, tiếp tục...");
    }

    // Điều hướng đến danh mục Nhà Sách Tiki
    await navigateTo(driver, "https://tiki.vn/nha-sach-tiki/c8322");
    await driver.sleep(1000);

    // Cuộn trang bằng JavaScript
    await driver.executeScript("window.scrollBy(0, 500);");
    await driver.manage().window().maximize();
    await driver.sleep(2000);

    // Click the button to open the form
    const openFormButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[2]/div/div[1]/div[2]/button'
        )
      ),
      10000
    );
    await driver.executeScript("arguments[0].click();", openFormButton);
    await driver.sleep(1000);

    // Tick Uu dai
    const checkbox2 = await driver.findElement(
      By.xpath(
        '//*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[3]/div[2]/div[2]/div[3]/div/div[1]/div/div[1]/span'
      )
    );
    await driver.executeScript("arguments[0].click();", checkbox2);
    await driver.sleep(1000);

    // Tick Danh gia
    const checkbox3 = await driver.findElement(
      By.xpath(
        '//*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[3]/div[2]/div[2]/div[4]/div/div[3]/div/div[1]/span'
      )
    );
    await driver.executeScript("arguments[0].click();", checkbox3);
    await driver.sleep(1000);

    const scrollContainer = await driver.findElement(
      By.xpath(
        '//*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[3]/div[2]/div[2]'
      )
    );

    // Wait until visible (optional)
    await driver.wait(until.elementIsVisible(scrollContainer), 3000);

    // Scroll to bottom
    await driver.executeScript(
      `
      arguments[0].scrollTop = arguments[0].scrollHeight;
    `,
      scrollContainer
    );

    await driver.sleep(2000);

    // Tick Thuong hieu
    const checkbox4 = await driver.findElement(
      By.xpath(
        '//*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[3]/div[2]/div[2]/div[6]/div/label[2]/div/div[1]/span'
      )
    );
    await driver.executeScript("arguments[0].click();", checkbox4);
    await driver.sleep(1000);

    // Tick Nha cung cap
    const checkbox5 = await driver.findElement(
      By.xpath(
        '//*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[3]/div[2]/div[2]/div[7]/div/label[5]/div/div[1]/span'
      )
    );
    await driver.executeScript("arguments[0].click();", checkbox5);
    await driver.sleep(1000);

    // Fill the input with "ab"
    const inputField = await driver.findElement(
      By.xpath(
        '//*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[3]/div[2]/div[2]/div[5]/div[3]/div[1]/input'
      )
    );
    await inputField.sendKeys("ab");

    await driver.sleep(2000);

    //*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[3]/div[2]/div[2]/div[5]/div[3]/div[2]/input
    // 100000
    const inputField2 = await driver.findElement(
        By.xpath(
          '//*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[3]/div[2]/div[2]/div[5]/div[3]/div[2]/input'
        )
      );
      await inputField2.sendKeys("100000");
  
      await driver.sleep(2000);
    // Press the button (after filling the form)
    // const submitButton = await driver.findElement(
    //   By.xpath(
    //     '//*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[3]/div[2]/div[3]/div[2]'
    //   )
    // );
    // await driver.executeScript("arguments[0].click();", submitButton); // Click the button
    // console.log("Button clicked.");

    await driver.sleep(5000); // Give it time to process (optional)
  } catch (error) {
    console.error("Lỗi trong TC028:", error);
  } finally {
    await webDriverUtil.quit();
  }
}

// Chạy test
TC028();
