
module.exports = async ({ strapi }) => {
    console.log("--- DEBUG ROLES ---");
    const roles = await strapi.db.query("plugin::users-permissions.role").findMany();
    console.log(JSON.stringify(roles, null, 2));

    console.log("--- DEBUG PERMISSIONS (First 5) ---");
    const permissions = await strapi.db.query("plugin::users-permissions.permission").findMany({ limit: 5 });
    console.log(JSON.stringify(permissions, null, 2));
};
