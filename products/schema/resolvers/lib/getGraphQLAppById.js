const productQueries = require("../../../postgres/product-queries");
const kratosQueries = require("../../../postgres/kratos-queries");
const permissionQueries = require("../../../postgres/permissionsdb-queries");
const getGraphQLAppPermissionById = require("./getGraphQLAppPermissionById");
const getGraphQLAppExtensionById = require("./getGraphQLAppExtensionById");
let getGraphQLAppById = (id) => {
    return new Promise((resolve, reject) => {
        kratosQueries.getApp([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                reject("App not found");
            } else {
                let app = result.res[0];
                let permissions;
                let tokens;
                let extensions;

                try {
                    permissions = await getAppPermissionsByAppId(id);
                } catch (err) {
                    permissions = null;
                }

                try {
                    extensions = await getAppExtensionsByAppId(id);
                } catch (err) {
                    extensions = null;
                }

                try {
                    tokens = await getAppTokensByAppId(id);
                } catch (err) {
                    tokens = null;
                }

                resolve({
                    id: app.id,
                    privateMetadata: app.private_metadata,
                    privateMetafield: JSON.stringify(app.private_metadata),
                    privateMetafields: null,
                    metadata: [app.metadata],
                    metadatafield: JSON.stringify(app.metadata),
                    metadatafields: null,
                    permissions,
                    created: app.created,
                    isActive: app.is_active,
                    name: app.name,
                    type: app.type,
                    tokens,
                    webhooks: null,
                    aboutApp: app.about_app,
                    dataPrivacy: app.data_privacy,
                    dataPrivacyUrl: app.data_privacy_url,
                    homepageUrl: app.homepage_url,
                    supportUrl: app.support_url,
                    configurationUrl: app.configuration_url,
                    appUrl: app.app_url,
                    version: app.version,
                    accessToken: null,
                    extensions
                });
            }
        });
    });
};

function getAppPermissionsByAppId(id) {
    return new Promise((resolve, reject) => {
        permissionQueries.getAppPermissions([id], "app_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let permissions = result.res;
            const numPermissions = permissions.length;
            let cursor = -1;
            let graphQLPermissions = [];

            permissions.forEach(async permission => {
                try {
                    graphQLPermissions.push(await getGraphQLAppPermissionById(permission.permission_id));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numPermissions) {
                    resolve(graphQLPermissions);
                }
            }
        });
    });
}

function getAppTokensByAppId(id) {
    return new Promise((resolve, reject) => {
        productQueries.getAppToken([id], "app_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let appTokens = result.res;
            const numAppTokens = appTokens.length;
            let cursor = -1;
            let graphQLAppTokens = [];

            appTokens.forEach(token => {
                graphQLAppTokens.push({
                    id: token.id,
                    name: token.name,
                    authToken: token.auth_token
                });
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAppTokens) {
                    resolve(graphQLAppTokens);
                }
            }
        });
    });
}

function getAppExtensionsByAppId(id) {
    return new Promise((resolve, reject) => {
        productQueries.getAppExtensions([id], "app_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let extensions = result.res;
            const numExtensions = extensions.length;
            let cursor = -1;
            let graphQLExtensions = [];

            extensions.forEach(async extension => {
                try {
                    graphQLExtensions.push(await getGraphQLAppExtensionById(extension.id));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numExtensions) {
                    resolve(graphQLExtensions);
                }
            }
        });
    });
}
module.exports = getGraphQLAppById;