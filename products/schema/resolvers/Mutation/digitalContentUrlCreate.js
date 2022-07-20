const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLDigitalContentUrlById,
} = require('../lib');
const jwt = require('jsonwebtoken');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await digitalContentUrlCreate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, digitalContentUrl) {
    return {
        errors: [{
            field,
            message,
            code,
            attributes,
            values,
        }],
        productErrors: [{
            field,
            message,
            code,
            attributes,
            values,
        }],
        digitalContentUrl
    }
}

function digitalContentUrlCreate(authUser, args) {
    return new Promise(resolve => {
        let content = args.content;
        productQueries.getDigitalContent([content], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getDigitalContent", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getDigitalContent", `Cannot resolve content:${content}`, "NOT_FOUND", null, null, null));
            let digitalContent = result.res[0];
            let now = new Date().toUTCString();
            let token = jwt.sign(digitalContent.content_file, digitalContent.id + "");

            let values = [
                token,
                now,
                0,
                content,
                null
            ];

            productQueries.createDigitalContentUrl(values, async result => {
                if (result.err) return resolve(getGraphQLOutput("createDigitalContentUrl", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("createDigitalContentUrl", "Digital content url not created", "GRAPHQL_ERROR", null, null, null));
                let digitalContent_ = result.res[0];

                let digitalContentUrl;
                try {
                    digitalContentUrl = await getGraphQLDigitalContentUrlById(digitalContent_.id);
                } catch (err) {
                    digitalContentUrl = null;
                }

                resolve({
                    errors: [],
                    productErrors: [],
                    digitalContentUrl
                });
            });
        });
    });
}