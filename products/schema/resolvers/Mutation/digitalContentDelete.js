const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductById,
    getGraphQLProductVariantById
} = require('../lib');
const path = require('path');
const fs = require('fs');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await digitalContentDelete(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, variant) {
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
        variant
    }
}

function digitalContentDelete(authUser, args) {
    return new Promise(resolve => {
        let productVariantId = args.variantId;
        productQueries.getProductVariant([productVariantId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getProductVariant", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getProductVariant", `Cannot resolve variantId:${productVariantId}`, "NOT_FOUND", null, null, null));
            let productVariant_ = result.res[0];

            let variant;
            let errors = [];

            try {
                variant = await getGraphQLProductVariantById(productVariant_.id);
            } catch (err) {
                variant = null;
                errors.push(getGraphQLOutput("getGraphQLProductVariantById", err, "NOT_FOUND", null, null, null).errors[0]);
            }

            try {
                await deleteProductDigitalContentUrl(productVariant_.id);
            } catch (err) {
                errors.push(err.errors[0]);
            }

            try {
                await deleteDigitalContent(productVariant_.id);
            } catch (err) {
                errors.concat(err);
            }

            resolve({
                variant,
                errors,
                productErrors: errors
            });
        });
    });
}

function deleteProductDigitalContentUrl(variantId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteDigitalContentUrl([variantId], "content_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteDigitalContentUrl", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("deleteDigitalContentUrl", "Failed to delete product digital content url", "GRAPHQL_ERROR", null, null, null));
            resolve();
        });
    });
}

function deleteDigitalContent(variantId) {
    return new Promise((resolve, reject) => {
        productQueries.getDigitalContent([variantId], "product_variant_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("getDigitalContent", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            let digitalContents = result.res;
            const numDigitalContent = digitalContents.length;
            let cursor = -1;
            let errors = [];

            digitalContents.forEach(content => {
                productQueries.deleteDigitalContent([content.id], "id=$1", result => {
                    if (result.err) {
                        errors.push(getGraphQLOutput("deleteDigitalContent", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors[0]);
                    } else if (result.res.length == 0) {
                        errors.push(getGraphQLOutput("deleteDigitalContent", "Failed to delete digital content", "GRAPHQL_ERROR", null, null, null).errors[0]);
                    } else {
                        let digitalContent_ = result.res[0];
                        if (digitalContent_.content_file) {
                            const pathname = path.join(__dirname, `../../../public/images/${digitalContent_.content_file}`);
                            fs.unlinkSync(pathname);
                        }
                    }
                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numDigitalContent) {
                    if (errors.length > 0) return reject();
                    resolve();
                }
            }
        });
    });
}