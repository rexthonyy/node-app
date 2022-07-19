const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductById
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
            resolve(await productMediaDelete(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, product, media) {
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
        product,
        media
    }
}

function productMediaDelete(authUser, args) {
    return new Promise(resolve => {
        let productMediaId = args.id;
        productQueries.getProductMedia([productMediaId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getProductMedia", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getProductMedia", `Cannot resolve id:${productMediaId}`, "NOT_FOUND", null, null, null, null));
            let productMedia_ = result.res[0];

            let product;
            let media;
            let errors = [];

            try {
                product = await getGraphQLProductById(productMedia_.product_id);
            } catch (err) {
                product = null;
                errors.push(getGraphQLOutput("getGraphQLProductById", err, "NOT_FOUND", null, null, null, null).errors[0]);
            }
            try {
                media = await getGraphQLProductMediaById(productMedia_.id);
            } catch (err) {
                media = null;
                errors.push(getGraphQLOutput("getGraphQLProductMediaById", err, "NOT_FOUND", null, null, null, null).errors[0]);
            }

            try {
                await deleteProductVariantMedia(productMedia_.id);
            } catch (err) {
                errors.push(err.errors[0]);
            }

            try {
                await deleteProductMedia(productMedia_.id);
            } catch (err) {
                errors.push(err.errors[0]);
            }

            resolve({
                product,
                media,
                errors,
                productErrors: errors
            });
        });
    });
}

function deleteProductVariantMedia(mediaId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteProductVariantMedia([mediaId], "media_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteProductVariantMedia", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("deleteProductVariantMedia", "Failed to delete product variant media", "GRAPHQL_ERROR", null, null, null, null));
            resolve();
        });
    });
}

function deleteProductMedia(mediaId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteProductMedia([mediaId], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteProductMedia", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("deleteProductMedia", "Failed to delete product media", "GRAPHQL_ERROR", null, null, null, null));
            let productMedia_ = result.res[0];
            if (productMedia_.image) {
                const pathname = path.join(__dirname, `../../../public/images/${productMedia_.image}`);
                fs.unlinkSync(pathname);
            }
            resolve();
        });
    });
}