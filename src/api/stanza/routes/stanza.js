'use strict';

/**
 * stanza router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::stanza.stanza');
