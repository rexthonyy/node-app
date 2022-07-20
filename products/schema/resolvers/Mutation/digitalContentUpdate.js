const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductById,
    getGraphQLProductVariantById,
    getGraphQLDigitalContentById
} = require('../lib');
const path = require('path');
const fs = require('fs');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await digitalContentUpdate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, variant, content) {
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
        variant,
        content
    }
}

function digitalContentUpdate(authUser, args) {
    return new Promise(resolve => {
        let variantId = args.variantId;
        productQueries.getProductVariant([variantId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getProductVariant", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getProductVariant", `Cannot resolve productVariant:${id}`, "NOT_FOUND", null, null, null, null));

            let { values, set, whereClause } = getUpdateDigitalContentInput(args);
            productQueries.updateDigitalContent(values, set, whereClause, async result => {
                if (result.err) return resolve(getGraphQLOutput("updateDigitalContent", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("updateDigitalContent", "Digital content not updated", "GRAPHQL_ERROR", null, null, null, null));

                let digitalContent_ = result.res[0];

                let variant;
                let content;

                try {
                    variant = await getGraphQLProductVariantById(digitalContent_.product_variant_id);
                } catch (err) {
                    variant = null;
                }
                try {
                    content = await getGraphQLDigitalContentById(digitalContent_.id);
                } catch (err) {
                    content = null;
                }

                resolve({
                    variant,
                    content,
                    errors: [],
                    productErrors: []
                });
            });
        });
    });
}

function getUpdateDigitalContentInput(args) {
    let maxDownloads = null;
    let urlValidDays = null;
    let automaticFulfillment = null;

    maxDownloads = args.input.maxDownloads ? args.input.maxDownloads : null;
    urlValidDays = args.input.urlValidDays ? args.input.urlValidDays : null;
    automaticFulfillment = args.input.automaticFulfillment ? args.input.automaticFulfillment : null;

    let values = [args.variantId, args.input.useDefaultSettings];
    let whereClause = "product_variant_id=$1";
    let set = "use_default_settings=$2";
    let cursor = 2;

    if (maxDownloads != null) {
        values.push(maxDownloads);
        set += set ? ", " : "";
        set += `max_downloads=$${++cursor}`;
    }
    if (urlValidDays != null) {
        values.push(urlValidDays);
        set += set ? ", " : "";
        set += `url_valid_days=$${++cursor}`;
    }
    if (automaticFulfillment != null) {
        values.push(automaticFulfillment);
        set += set ? ", " : "";
        set += `automatic_fulfillment=$${++cursor}`;
    }

    return { values, set, whereClause };
}