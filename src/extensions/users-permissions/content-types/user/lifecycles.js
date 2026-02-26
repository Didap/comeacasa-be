module.exports = {
    async beforeUpdate(event) {
        const { data, where } = event.params;

        // Controlla se 'confirmed' sta passando a true
        if (data.confirmed === true) {
            // Verifica lo stato precedente dell'utente
            const previousData = await strapi.db.query('plugin::users-permissions.user').findOne({
                where
            });

            if (previousData && !previousData.confirmed) {
                // L'utente è appena stato confermato! Promuovilo al Livello 1
                data.livello_auth = 1;

                // Esempio: inviamo la welcome email con il nuovo servizio (se registrato)
                try {
                    const resendService = strapi.service('api::common.email-resend');
                    if (resendService) {
                        resendService.sendWelcomeEmail(previousData).catch(err => console.error(err));
                    }
                } catch (e) {
                    // ignore if service not loaded
                }
            }
        }
    }
};
