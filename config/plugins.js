module.exports = () => ({
    'users-permissions': {
        config: {
            register: {
                allowedFields: ['nome', 'cognome', 'tipo_utente'],
            },
        },
    },
});
