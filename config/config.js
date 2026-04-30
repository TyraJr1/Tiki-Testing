require('dotenv').config();

module.exports = {
    baseUrl: 'https://tiki.vn',
    timeout: 10000, // 10 giây
    credentials: {
        email: process.env.EMAIL,
        phoneNumber: '0964667291',
        password: '123456789t',
        fakePhoneNumber: '0123',
        fakeOtp: '000000',
        facebookEmail: process.env.FACEBOOK_EMAIL || '',
        facebookPassword: process.env.FACEBOOK_PASSWORD || '',
    }
};
