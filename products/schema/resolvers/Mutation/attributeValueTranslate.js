const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLAttributeById,
    getGraphQLAttributeValueById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "REQUIRED", null));

        let accessPermissions = ["MANAGE_TRANSLATIONS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await attributeValueTranslate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_TRANSLATIONS", "INVALID", null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributeValue) {
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
        attributeValue
    }
}

function attributeValueTranslate(authUser, args) {
    return new Promise(resolve => {
        let attributeValueId = args.id;
        let languageCode = args.languageCode;

        productQueries.getAttributeValue([attributeValueId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getAttributeValue", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getAttributeValue", "Attribute value not found", "NOT_FOUND", null));

            productQueries.getAttributeValueTranslation([attributeValueId, languageCode], "attribute_value_id=$1 AND language_code=$2", async result => {
                if (result.err) return resolve(getGraphQLOutput("getAttributeValueTranslation", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                if (result.res.length == 0) {
                    try {
                        await createAttributeValueTranslation(args);
                    } catch (err) {
                        return resolve(err);
                    }
                } else {
                    try {
                        let translationId = result.res[0].id;
                        await updateAttributeValueTranslation(translationId, args);
                    } catch (err) {
                        return resolve(err);
                    }
                }

                let graphQLAttributeValue = await getGraphQLAttributeValueById(attributeValueId);
                resolve({
                    errors: [],
                    translationErrors: [],
                    attributeValue: graphQLAttributeValue
                });
            });
        });
    });
}

function createAttributeValueTranslation(args) {
    return new Promise((resolve, reject) => {
        let attributeValueId = args.id;
        let languageCode = args.languageCode;
        let name = args.input.name;
        let richText = args.input.richText;

        let values = [
            languageCode,
            name,
            attributeValueId,
            richText
        ];

        productQueries.createAttributeValueTranslation(values, result => {
            if (result.err) return reject(getGraphQLOutput("createAttributeValueTranslation", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("createAttributeValueTranslation", "Failed to create attribute value translation", "GRAPHQL_ERROR", null));
            resolve();
        });
    });
}

function updateAttributeValueTranslation(translationId, args) {
    return new Promise((resolve, reject) => {
        let { values, set, whereClause } = getUpdateAttributeValueTranslationInput(translationId, args);
        productQueries.updateAttributeValueTranslation(values, set, whereClause, result => {
            if (result.err) return reject(getGraphQLOutput("updateAttributeValueTranslation", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttributeValueTranslation", "Failed to update attribute value translation", "GRAPHQL_ERROR", null));
            resolve();
        });
    });
}

function getUpdateAttributeValueTranslationInput(translationId, args) {
    let values = [translationId];
    let name = args.input.name;
    let richText = args.input.richText;
    let cursor = 0;
    let whereClause = `id=$${++cursor}`;
    let set = "";
    if (name) {
        values.push(name);
        set += `name=$${++cursor}`;
    }
    if (richText) {
        values.push(richText);
        if (set) set += ", ";
        set += `rich_text=$${++cursor}`;
    }
    return { values, set, whereClause };
}