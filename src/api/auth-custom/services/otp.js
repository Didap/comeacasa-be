'use strict';
const crypto = require('crypto');

module.exports = () => ({
    generateOtp() {
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 5);
        return { otp, expiration };
    },

    verifyOtp(user, code) {
        if (!user.otp_code || !user.otp_expiration) {
            return false;
        }
        const isExpired = new Date() > new Date(user.otp_expiration);
        if (isExpired) {
            return false;
        }
        return user.otp_code === code.toString();
    },

    sendSms(phone, message) {
        console.log(`Simulazione SMS a ${phone}: ${message}`);
        return true;
    }
});
