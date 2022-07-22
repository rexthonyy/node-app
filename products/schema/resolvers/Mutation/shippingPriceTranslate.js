const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLShippingMethodTypeById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "REQUIRED"));

        let accessPermissions = ["MANAGE_TRANSLATIONS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await shippingPriceTranslate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_TRANSLATIONS", "INVALID"));
        }
    });
}

function getGraphQLOutput(field, message, code, shippingMethod) {
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
        shippingMethod
    }
}

function shippingPriceTranslate(authUser, args) {
    return new Promise(resolve => {
        let shippingMethodId = args.id;
        let languageCode = args.languageCode;

        productQueries.getShippingMethod([shippingMethodId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getShippingMethod", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getShippingMethod", "Shipping price not found", "NOT_FOUND"));

            productQueries.getShippingMethodTranslation([shippingMethodId, languageCode], "shipping_method_id=$1 AND language_code=$2", async result => {
                if (result.err) return resolve(getGraphQLOutput("getShippingMethodTranslation", JSON.stringify(result.err), "GRAPHQL_ERROR"));
                if (result.res.length == 0) {
                    try {
                        await createShippingMethodTranslation(args);
                    } catch (err) {
                        return resolve(err);
                    }
                } else {
                    try {
                        let translationId = result.res[0].id;
                        await updateShippingMethodTranslation(translationId, args);
                    } catch (err) {
                        return resolve(err);
                    }
                }

                let graphQLShippingMethod = await getGraphQLShippingMethodTypeById(shippingMethodId);
                resolve({
                    errors: [],
                    translationErrors: [],
                    shippingMethod: graphQLShippingMethod
                });
            });
        });
    });
}

function createShippingMethodTranslation(args) {
    return new Promise((resolve, reject) => {
        let shippingMethodId = args.id;
        let languageCode = args.languageCode;
        let name = args.input.name;
        let description = args.input.description;

        let values = [
            languageCode,
            name,
            shippingMethodId,
            description
        ];

        productQueries.createShippingMethodTranslation(values, result => {
            if (result.err) return reject(getGraphQLOutput("createShippingMethodTranslation", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return reject(getGraphQLOutput("createShippingMethodTranslation", "Failed to create shipping method translation", "GRAPHQL_ERROR"));
            resolve();
        });
    });
}

function updateShippingMethodTranslation(translationId, args) {
    return new Promise((resolve, reject) => {
        let { values, set, whereClause } = getUpdateShippingMethodTranslationInput(translationId, args);
        productQueries.updateShippingMethodTranslation(values, set, whereClause, result => {
            if (result.err) return reject(getGraphQLOutput("updateShippingMethodTranslation", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateShippingMethodTranslation", "Failed to update shipping method translation", "GRAPHQL_ERROR"));
            resolve();
        });
    });
}

function getUpdateShippingMethodTranslationInput(translationId, args) {
    let values = [translationId];
    let name = args.input.name;
    let description = args.input.description;
    let cursor = 0;
    let whereClause = `id=$${++cursor}`;
    let set = "";
    if (name) {
        values.push(name);
        set += `name=$${++cursor}`;
    }
    if (description) {
        values.push(description);
        if (set) set += ", ";
        set += `description=$${++cursor}`;
    }
    return { values, set, whereClause };
}