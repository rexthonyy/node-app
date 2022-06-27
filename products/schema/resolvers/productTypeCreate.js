const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('./lib');
const productQueries = require("../../postgres/product-queries");
const getGraphQLProductTypeById = require('./lib/getGraphQLProductTypeById');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productTypeCreate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, productType) {
    return {
        errors: [{
            field,
            message,
            code,
            attributes,
            values
        }],
        productErrors: [{
            field,
            message,
            code,
            attributes,
            values
        }],
        productType
    }
}

function productTypeCreate(authUser, args) {
    return new Promise(resolve => {
        let name = args.input.name;
        let slug = args.input.slug;
        let kind = args.input.kind;
        let hasVariants = args.input.hasVariants;
        let productAttributes = args.input.productAttributes || [];
        let variantAttributes = args.input.variantAttributes || [];
        let isShippingRequired = args.input.isShippingRequired;
        let isDigital = args.input.isDigital || false;
        let weight = args.input.weight;
        let taxCode = args.input.taxCode || "";

        let values = [
            name,
            hasVariants,
            isShippingRequired,
            weight,
            isDigital,
            null, [{ taxCode }],
            slug,
            kind
        ];

        productQueries.createProductType(values, async result => {
            if (result.err) return resolve(getGraphQLOutput("producttype", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("producttype", "Failed to create product type", "INVALID", null, null, null));
            let productType = result.res[0];
            await addProductAttributes(productType, productAttributes);
            await addVariantAttributes(productType, variantAttributes);
            let graphQLProductType = await getGraphQLProductTypeById(productType.id);
            resolve(getGraphQLOutput("producttype", "Product type created", "GRAPHQL_ERROR", null, null, graphQLProductType));
        });

    });
}

function addProductAttributes(productType, productAttributes) {
    return new Promise(resolve => {
        const numProductAttributes = productAttributes.length;
        let productAttributeCursor = -1;

        productAttributes.forEach(attributeId => {
            let values = [
                attributeId,
                productType.id,
                null
            ];

            productQueries.createAttributeProduct(values, result => {
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete() {
            productAttributeCursor++;
            if (productAttributeCursor == numProductAttributes) {
                resolve();
            }
        }
    });
}

function addVariantAttributes(productType, variantAttributes) {
    return new Promise(resolve => {
        const numVariantAttributes = variantAttributes.length;
        let variantAttributeCursor = -1;

        variantAttributes.forEach(attributeId => {
            let values = [
                attributeId,
                productType.id,
                null,
                false
            ];

            productQueries.createAttributeVariant(values, result => {
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete() {
            variantAttributeCursor++;
            if (variantAttributeCursor == numVariantAttributes) {
                resolve();
            }
        }
    });
}