const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLAttributeById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "REQUIRED", null));

        let accessPermissions = ["MANAGE_TRANSLATIONS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await attributeTranslate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_TRANSLATIONS", "INVALID", null));
        }
    });
}

function getGraphQLOutput(field, message, code, attribute) {
    return {
        errors: [{
            field,
            message,
            code
        }],
        translationErrors: [{
            field,
            message,
            code
        }],
        attribute
    }
}

function attributeTranslate(authUser, args) {
    return new Promise(resolve => {
        let attributeId = args.id;
        let languageCode = args.languageCode;

        productQueries.getAttribute([attributeId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getAttribute", "Attribute not found", "NOT_FOUND", null));

            productQueries.getAttributeTranslation([attributeId, languageCode], "attribute_id=$1 AND language_code=$2", async result => {
                if (result.err) return resolve(getGraphQLOutput("getAttributeTranslation", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                if (result.res.length == 0) {
                    try {
                        await createAttributeTranslation(args);
                    } catch (err) {
                        return resolve(err);
                    }
                } else {
                    try {
                        let translationId = result.res[0].id;
                        await updateAttributeTranslation(translationId, args);
                    } catch (err) {
                        return resolve(err);
                    }
                }

                let graphQLAttribute = await getGraphQLAttributeById(attributeId);
                resolve({
                    errors: [],
                    translationErrors: [],
                    attribute: graphQLAttribute
                });
            });
        });
    });
}

function createAttributeTranslation(args) {
    return new Promise((resolve, reject) => {
        let attributeId = args.id;
        let languageCode = args.languageCode;
        let name = args.input.name;

        let values = [
            languageCode,
            name,
            attributeId
        ];

        productQueries.createAttributeTranslation(values, result => {
            if (result.err) return reject(getGraphQLOutput("createAttributeTranslation", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("createAttributeTranslation", "Failed to create attribute translation", "GRAPHQL_ERROR", null));
            resolve();
        });
    });
}

function updateAttributeTranslation(translationId, args) {
    return new Promise((resolve, reject) => {
        let attributeId = args.id;
        let languageCode = args.languageCode;
        let name = args.input.name;

        let values = [
            translationId,
            name
        ];

        productQueries.updateAttributeTranslation(values, "name=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttributeTranslation", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttributeTranslation", "Failed to update attribute translation", "GRAPHQL_ERROR", null));
            resolve();
        });
    });
}