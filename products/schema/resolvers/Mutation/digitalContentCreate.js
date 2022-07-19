const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLDigitalContentById,
    getGraphQLProductVariantById
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
            resolve(await digitalContentCreate(authUser, args));
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

function digitalContentCreate(authUser, args) {
    return new Promise(resolve => {
        let variantId = args.variantId;
        productQueries.getProductVariant([variantId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getProductVariant", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getProductVariant", `Cannot resolve variantId:${variantId}`, "NOT_FOUND", null, null, null, null));

            let useDefaultSettings = args.input.useDefaultSettings;
            let maxDownloads = args.input.maxDownloads;
            let urlValidDays = args.input.urlValidDays;
            let automaticFulfillment = args.input.automaticFulfillment;
            let contentFile = args.input.contentFile;
            let contentType;
            let contentFileUrl;

            try {
                const { createReadStream, filename, mimetype, encoding } = await contentFile;
                const stream = createReadStream();
                const pathname = path.join(__dirname, `../../../public/images/digitalcontent/${filename}`);
                let out = fs.createWriteStream(pathname);
                await stream.pipe(out);
                contentFileUrl = `digitalcontent/${filename}`;
                contentType = mimetype;
            } catch (err) {
                return resolve(getGraphQLOutput("steam.pipe(out)", err, "GRAPHQL_ERROR", null, null, null, null));
            }

            let values = [
                useDefaultSettings,
                automaticFulfillment,
                contentType,
                contentFileUrl,
                maxDownloads,
                urlValidDays,
                variantId,
                JSON.stringify({}),
                JSON.stringify({})
            ];

            productQueries.createDigitalContent(values, async result => {
                if (result.err) return resolve(getGraphQLOutput("createDigitalContent", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("createDigitalContent", "Digital content not created", "GRAPHQL_ERROR", null, null, null, null));
                let digitalContent_ = result.res[0];

                let variant;
                let content;
                try {
                    variant = await getGraphQLProductVariantById(variantId);
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