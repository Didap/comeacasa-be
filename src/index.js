'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  async bootstrap({ strapi }) {
    console.log("🚀 Esecuzione dello script di seed (Bootstrap)...");

    // 1. Configurazione Permessi Ruoli Principali
    try {
      const roleService = strapi.service('plugin::users-permissions.role');

      // Creazione/Verifica Ruolo Admin API
      let adminRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'admin' } });
      if (!adminRole) {
        adminRole = await roleService.createRole({
          name: 'Admin',
          description: 'Ruolo Amministratore',
          type: 'admin',
        });
        console.log(`✅ Creato nuovo ruolo API: 'admin'`);
      } else {
        console.log(`✅ Ruolo API 'admin' già presente.`);
      }

      const rolePermissions = {
        public: [
          'api::stanza.stanza.find',
          'api::stanza.stanza.findOne',
          'api::specifica.specifica.find',
          'api::specifica.specifica.findOne',
          'api::users-permissions.user.find',
          'api::users-permissions.user.findOne',
          'api::auth-custom.auth-custom.cieLogin'
        ],
        authenticated: [
          // Stanze - CRUD completi
          'api::stanza.stanza.find',
          'api::stanza.stanza.findOne',
          'api::stanza.stanza.create',
          'api::stanza.stanza.update',
          'api::stanza.stanza.delete',
          // Specifiche - solo lettura
          'api::specifica.specifica.find',
          'api::specifica.specifica.findOne',
          // Accesso e gestione utente
          'plugin::users-permissions.user.me',
          'plugin::users-permissions.user.find',
          // Caricamento media
          'plugin::upload.content-api.upload',
          'plugin::upload.content-api.find',
          'plugin::upload.content-api.findOne',
          'plugin::upload.content-api.destroy',
          // Autenticazione Avanzata (OTP)
          'api::auth-custom.auth-custom.sendOtp',
          'api::auth-custom.auth-custom.verifyOtp'
        ],
        admin: [
          // Stanze
          'api::stanza.stanza.find',
          'api::stanza.stanza.findOne',
          'api::stanza.stanza.create',
          'api::stanza.stanza.update',
          'api::stanza.stanza.delete',
          // Specifiche
          'api::specifica.specifica.find',
          'api::specifica.specifica.findOne',
          'api::specifica.specifica.create',
          'api::specifica.specifica.update',
          'api::specifica.specifica.delete',
          // Utenti
          'plugin::users-permissions.user.find',
          'plugin::users-permissions.user.findOne',
          'plugin::users-permissions.user.create',
          'plugin::users-permissions.user.update',
          'plugin::users-permissions.user.destroy',
          'plugin::users-permissions.user.me',
          // Media
          'plugin::upload.content-api.upload',
          'plugin::upload.content-api.find',
          'plugin::upload.content-api.findOne',
          'plugin::upload.content-api.destroy'
        ]
      };

      for (const [roleType, actions] of Object.entries(rolePermissions)) {
        const role = await strapi.db.query('plugin::users-permissions.role').findOne({
          where: { type: roleType },
          populate: { permissions: true }
        });

        if (role) {
          const currentPermissions = role.permissions || [];
          const currentActions = currentPermissions.map(p => p.action);
          const newPermissions = [];

          for (const action of actions) {
            if (!currentActions.includes(action)) {
              newPermissions.push({ action, role: role.id });
            }
          }

          if (newPermissions.length > 0) {
            console.log(`⏳ Aggiunta di ${newPermissions.length} permessi al ruolo '${roleType}' in corso...`);
            let added = 0;
            for (const permData of newPermissions) {
              try {
                const exists = await strapi.db.query('plugin::users-permissions.permission').findOne({
                  where: { action: permData.action, role: permData.role }
                });

                if (!exists) {
                  await strapi.db.query('plugin::users-permissions.permission').create({
                    data: permData
                  });
                  added++;
                }
              } catch (permErr) {
                console.error(`❌ Errore permessi ${permData.action} per ${roleType}:`, permErr.message);
              }
            }
            if (added > 0) {
              console.log(`✅ Aggiunti ${added} permessi al ruolo '${roleType}'.`);
            }
          } else {
            console.log(`✅ Permessi per '${roleType}' già aggiornati.`);
          }
        } else {
          console.warn(`⚠️ Ruolo '${roleType}' non trovato, impossibile assegnare permessi.`);
        }
      }
    } catch (err) {
      console.error("❌ Errore configurazione ruoli e permessi:", err);
    }

    // 2. Setup specifiche di base (Servizi e Regole)
    try {
      const defaultSpecifiche = [
        { nome: 'WiFi', icona: 'wifi', tipologia: 'service' },
        { nome: 'Aria Condizionata', icona: 'snowflake', tipologia: 'service' },
        { nome: 'Riscaldamento', icona: 'thermometer', tipologia: 'service' },
        { nome: 'Cucina', icona: 'chef-hat', tipologia: 'service' },
        { nome: 'TV', icona: 'tv', tipologia: 'service' },
        { nome: 'Lavatrice', icona: 'washing-machine', tipologia: 'service' },
        { nome: 'Parcheggio', icona: 'car', tipologia: 'service' },
        { nome: 'Vietato Fumare', icona: 'cigarette-off', tipologia: 'rule' },
        { nome: 'Animali Permessi', icona: 'dog', tipologia: 'rule' },
        { nome: 'No Feste', icona: 'party-popper', tipologia: 'rule' }
      ];

      let addedCount = 0;
      for (const spec of defaultSpecifiche) {
        const exists = await strapi.db.query('api::specifica.specifica').findOne({ where: { nome: spec.nome } });
        if (!exists) {
          await strapi.db.query('api::specifica.specifica').create({ data: { ...spec, publishedAt: new Date() } });
          addedCount++;
        }
      }
      if (addedCount > 0) {
        console.log(`✅ Create ${addedCount} nuove Specifiche preimpostate.`);
      } else {
        console.log(`ℹ️ Le Specifiche preimpostate sono già presenti nel database.`);
      }
    } catch (err) {
      console.error("❌ Errore durante il caricamento delle specifiche:", err);
    }

    console.log("✨ Completato script di seed all'avvio!");
  },
};
