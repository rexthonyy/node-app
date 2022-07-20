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
            resolve(await productMediaUpdate(authUser, args));
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

function productMediaUpdate(authUser, args) {
    return new Promise(resolve => {
        let id = args.id;
        productQueries.getProductMedia([id], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getProductMedia", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getProductMedia", `Cannot resolve productMedia:${id}`, "NOT_FOUND", null, null, null, null));

            let alt = args.input.alt;
            productQueries.updateProductMedia([id, alt], "alt=$2", "id=$1", result => {

            });
            let mediaUrl = args.input.mediaUrl;
            let image = args.input.image;
            let type = "IMAGE";
            let imageUrl = null;

            if (image) {
                try {
                    const { createReadStream, filename, mimetype, encoding } = await image;

                    const stream = createReadStream();
                    const pathname = path.join(__dirname, `../../../public/images/products/${filename}`);
                    let out = fs.createWriteStream(pathname);
                    await stream.pipe(out);
                    imageUrl = `products/${filename}`;
                } catch (err) {
                    return resolve(getGraphQLOutput("steam.pipe(out)", err, "GRAPHQL_ERROR", null, null, null, null));
                }
            }

            let values = [
                0,
                imageUrl,
                "0.5x0.5",
                alt,
                type,
                mediaUrl,
                JSON.stringify({}),
                productId,
                false
            ];

            productQueries.createProductMedia(values, async result => {
                if (result.err) return resolve(getGraphQLOutput("createProductMedia", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("createProductMedia", "Media not created", "GRAPHQL_ERROR", null, null, null, null));
                let productMedia_ = result.res[0];

                let product;
                let media;
                try {
                    product = await getGraphQLProductById(productId);
                } catch (err) {
                    product = null;
                }
                try {
                    media = await getGraphQLProductMediaById(productMedia_.id);
                } catch (err) {
                    media = null;
                }

                resolve({
                    product,
                    media,
                    errors: [],
                    productErrors: []
                });
            });
        });
    });
}