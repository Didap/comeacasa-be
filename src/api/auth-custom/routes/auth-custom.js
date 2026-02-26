module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/auth-custom/send-otp',
            handler: 'auth-custom.sendOtp',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/auth-custom/verify-otp',
            handler: 'auth-custom.verifyOtp',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/auth-custom/cie-login',
            handler: 'auth-custom.cieLogin',
            config: {
                policies: [],
                middlewares: [],
                auth: false,
            },
        },
    ],
};
