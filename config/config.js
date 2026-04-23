require('dotenv').config();

module.exports = {
    baseUrl: 'https://tiki.vn',
    timeout: 10000, // 10 giây
    credentials: {
        email: process.env.EMAIL,
        phoneNumber: '0328619994',
        password: '123456789A@',
        facebookPassword: '',
    }
};
