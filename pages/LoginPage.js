const { By, until } = require("selenium-webdriver");
const WebDriverUtil = require("../utils/WebDriverUtil");

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.webDriverUtil = new WebDriverUtil();
    this.webDriverUtil.driver = driver;
    // Định nghĩa các locator
    this.phoneInput = By.xpath("//input[@placeholder='Số điện thoại']");
    this.continueButton = By.xpath("//button[contains(text(),'Tiếp Tục')]");
    this.passwordInput = By.xpath("//input[@placeholder='Mật khẩu']");
    this.otpInputDigits = [
      By.xpath(
        "//input[@aria-label='Please enter verification code. Digit 1']"
      ),
      By.xpath("//input[@aria-label='Digit 2']"),
      By.xpath("//input[@aria-label='Digit 3']"),
      By.xpath("//input[@aria-label='Digit 4']"),
      By.xpath("//input[@aria-label='Digit 5']"),
      By.xpath("//input[@aria-label='Digit 6']"),
    ];
    this.loginButton = By.xpath("//button[contains(text(),'Đăng nhập')]");
    this.verifyButton = By.xpath("//button[normalize-space()='Xác Minh']");
    this.loginEmail = By.xpath("//p[@class='login-with-email']");
    this.loginSMS = By.xpath("//p[@class='login-with-sms']");
    this.emailInput = By.xpath("//input[@placeholder='acb@email.com']");
    this.facebookIcon = By.xpath(
      "//li[@class='social__item']//img[@alt='facebook']/.."
    );
    this.facebookEmailInput = By.xpath("//input[@id='email']");
    this.facebookPasswordInput = By.xpath("//input[@id='pass']");
    this.facebookLoginButton = By.id("loginbutton");
    this.facebookContinueButton = By.xpath("//button[@name='__CONFIRM__']");
    this.errorPhoneNumberError = By.xpath("//span[@class='error-mess']");
    this.errorOTPError = By.xpath("//span[@class='error-mess']");
  }

  // Nhập số điện thoại
  async enterPhoneNumber(phoneNumber) {
    await this.webDriverUtil.sendKeys(this.phoneInput, phoneNumber);
    await this.webDriverUtil.clickElement(this.continueButton);
  }

  // Nhập số điện thoại không tồn tại
  async enterFakePhoneNumber(fakeNumber) {
    await this.webDriverUtil.sendKeys(this.phoneInput, fakeNumber);
    await this.webDriverUtil.clickElement(this.continueButton);
  }

  // Nhập mật khẩu
  async enterPassword(password) {
    await this.webDriverUtil.sendKeys(this.passwordInput, password);
  }

  // Nhập email
  async enterEmail(email) {
    await this.webDriverUtil.sendKeys(this.emailInput, email);
  }

  // Nhập OTP
  async enterOtp(otp) {
    if (otp.length !== 6) {
      throw new Error("OTP phải có 6 chữ số");
    }
    for (let i = 0; i < 6; i++) {
      const digitLocator = this.otpInputDigits[i];
      await this.driver.findElement(digitLocator).sendKeys(otp[i]);
      await this.webDriverUtil.clic;
    }
  }

  // Nhập mã OTP không tồn tại
  async enterFakeOtp(fakeOtp) {
    if (fakeOtp.length !== 6) {
      throw new Error("OTP phải có 6 chữ số");
    }
    for (let i = 0; i < 6; i++) {
      const digitLocator = this.otpInputDigits[i];
      await this.driver.findElement(digitLocator).sendKeys(fakeOtp[i]);
      await this.webDriverUtil.clickElement(this.verifyButton);
      await this.webDriverUtil.sleep(2000); // Đợi 1 giây giữa các lần nhập
    }
  }

  // Nhấn nút "Đăng nhập"
  async clickLoginButton() {
    await this.webDriverUtil.clickElement(this.loginButton);
  }

  // Nhấn nút "Đăng nhập" với thời gian chờ
  async clickLoginButtonTimeout() {
    const loginButton = await this.webDriverUtil.driver.wait(
      until.elementIsVisible(this.loginButton),
      15000 
    );

    await this.webDriverUtil.driver.wait(
      until.elementIsClickable(this.loginButton),
      15000 
    );

    await this.webDriverUtil.clickElement(this.loginButton);
  }

  // Nhấn nút đăng nhập bằng SMS
  async clickLoginWithSMS() {
    await this.webDriverUtil.clickElement(this.loginSMS);
  }

  // Nhấn nút xác minh()
  async clickVerifyButton() {
    await this.webDriverUtil.clickElement(this.verifyButton);
  }

  // Nhấn nút "Đăng nhập bằng email"
  async clickLoginEmail() {
    await this.webDriverUtil.clickElement(this.loginEmail);
  }

  // Nhấn biểu tượng Facebook
  async clickFacebookIcon() {
    const element = await this.webDriverUtil.waitForElement(this.facebookIcon);
    console.log("Tag:", await element.getTagName());
    console.log("Class:", await element.getAttribute("class"));
    console.log("Is displayed:", await element.isDisplayed());
    console.log("Is enabled:", await element.isEnabled());
    try {
      await this.webDriverUtil.clickElement(this.facebookIcon);
    } catch (error) {
      console.warn("Không thể nhấp trực tiếp, thử JavaScript...");
      await this.driver.executeScript("arguments[0].click();", element);
    }
  }

  // Kiểm tra lỗi số điện thoại không tồn tại
  async checkPhoneNumberError() {
    const errorElement = await this.webDriverUtil.waitForElement(
      this.errorPhoneNumberError
    );

    const errorMessage = await errorElement.getText();

    return errorMessage === "Số điện thoại không đúng định dạng";
  }

  // Kiểm tra mã lỗi OTP xác thực
  async checkOTPError() {
    const errorElement = await this.webDriverUtil.waitForElement(
      this.errorOTPError
    );

    const errorMessage = await errorElement.getText();

    return errorMessage === "Mã xác thực không hợp lệ.";
  }
}

module.exports = LoginPage;
