'use strict';

// Servizio placeholder per integrazione con Resend
module.exports = () => ({
    async sendWelcomeEmail(user) {
        console.log(`[Resend Service] Invio email di benvenuto a ${user.email}`);
        // Tutto pronto per essere integrato con "const resend = new Resend('re_123456789')"
        return true;
    },
    async sendConfirmationEmail(user, confirmationLink) {
        console.log(`[Resend Service] Invio email di conferma a ${user.email} con link ${confirmationLink}`);
        // Logica resend.emails.send(...)
        return true;
    }
});
