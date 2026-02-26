'use strict';

/**
 * `has-auth-level-2` policy.
 */

module.exports = (policyContext, config, { strapi }) => {
    const user = policyContext.state.user;

    if (!user) {
        return false;
    }

    // Admin access
    if (user.tipo_utente === 'admin') {
        return true;
    }

    // Verifica livello auth
    if (user.livello_auth >= 2) {
        return true;
    }

    // Altrimenti rifiuta
    return false;
};
