'use strict';

/**
 * stanza router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::stanza.stanza', {
    config: {
        create: {
            policies: ['api::stanza.has-auth-level-2'],
        },
        update: {
            policies: ['api::stanza.has-auth-level-2'],
        },
        delete: {
            policies: ['api::stanza.has-auth-level-2'],
        },
    },
});
