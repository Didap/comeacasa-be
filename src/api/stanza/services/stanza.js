'use strict';

/**
 * stanza service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::stanza.stanza');
