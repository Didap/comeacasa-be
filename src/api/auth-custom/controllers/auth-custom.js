'use strict';

module.exports = {
    async sendOtp(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized('Utente non autenticato');
        }

        if (user.livello_auth < 1) {
            return ctx.badRequest('Devi prima confermare la tua email (Livello 1)');
        }

        const { otp, expiration } = await strapi.service('api::auth-custom.otp').generateOtp();

        await strapi.db.query('plugin::users-permissions.user').update({
            where: { id: user.id },
            data: {
                otp_code: otp,
                otp_expiration: expiration,
            }
        });

        if (user.telefono) {
            await strapi.service('api::auth-custom.otp').sendSms(user.telefono, otp);
        }

        return ctx.send({
            message: 'OTP inviato con successo',
            test_otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
    },

    async verifyOtp(ctx) {
        const user = ctx.state.user;
        const { code } = ctx.request.body;

        if (!user) {
            return ctx.unauthorized('Utente non autenticato');
        }

        if (!code) {
            return ctx.badRequest('Codice OTP mancante');
        }

        const fullUser = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { id: user.id }
        });

        const isValid = await strapi.service('api::auth-custom.otp').verifyOtp(fullUser, code);

        if (!isValid) {
            return ctx.badRequest('Codice OTP non valido o scaduto');
        }

        await strapi.db.query('plugin::users-permissions.user').update({
            where: { id: user.id },
            data: {
                livello_auth: 2,
                otp_code: null,
                otp_expiration: null,
            }
        });

        return ctx.send({ message: 'Autenticazione di Livello 2 completata', livello_auth: 2 });
    },

    async cieLogin(ctx) {
        const cieAuthUrl = 'https://idserver.servizicie.interno.gov.it/idp/profile/SAML2/Redirect/SSO';
        return ctx.send({ message: 'Inizializzazione flusso CIE', redirectUrl: cieAuthUrl });
    }
};
