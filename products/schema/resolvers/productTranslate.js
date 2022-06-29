const {
    checkAuthorization,
    getGraphQLProductById,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('./lib');
const productQueries = require("../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "REQUIRED", null));

        let accessPermissions = ["MANAGE_TRANSLATIONS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productTranslate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_TRANSLATIONS", "INVALID", null));
        }
    });
}

function getGraphQLOutput(field, message, code, product) {
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
        product
    }
}

function productTranslate(authUser, args) {
    return new Promise(resolve => {
        let productId = args.id;
        let languageCode = args.languageCode;

        productQueries.getProduct([productId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("product", "Product not found", "NOT_FOUND", null));

            productQueries.getProductTranslation([productId, languageCode], "product_id=$1 AND language_code=$2", async result => {
                if (result.err) return resolve(getGraphQLOutput("product translation", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                if (result.res.length == 0) {
                    try {
                        await createProductTranslation(args);
                    } catch (err) {
                        return resolve(err);
                    }
                } else {
                    try {
                        let translationId = result.res[0].id;
                        await updateProductTranslation(translationId, args);
                    } catch (err) {
                        return resolve(err);
                    }
                }

                let graphQLProduct = await getGraphQLProductById(productId);
                resolve({
                    errors: [],
                    translationErrors: [],
                    product: graphQLProduct
                });
            });
        });
    });
}

function createProductTranslation(args) {
    return new Promise((resolve, reject) => {
        let productId = args.id;
        let languageCode = args.languageCode;
        let seoTitle = args.input.seoTitle;
        let seoDescription = args.input.seoDescription;
        let name = args.input.name;
        let description = args.input.description;

        let values = [
            seoTitle,
            seoDescription,
            languageCode,
            name,
            description,
            productId
        ];

        productQueries.createProductTranslation(values, result => {
            if (result.err) return reject(getGraphQLOutput("product translation", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product translation", "Failed to create product translation", "GRAPHQL_ERROR", null));
            resolve();
        });
    });
}

function updateProductTranslation(translationId, args) {
    return new Promise((resolve, reject) => {
        let productId = args.id;
        let languageCode = args.languageCode;
        let seoTitle = args.input.seoTitle;
        let seoDescription = args.input.seoDescription;
        let name = args.input.name;
        let description = args.input.description;

        let values = [
            translationId,
            seoTitle,
            seoDescription,
            languageCode,
            name,
            description
        ];

        productQueries.updateProductTranslation(values, "seo_title=$2, seo_description=$3, language_code=$4, name=$5, description=$6", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product translation", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product translation", "Failed to update product translation", "GRAPHQL_ERROR", null));
            resolve();
        });
    });
}