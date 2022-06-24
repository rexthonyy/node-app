const {
    checkAuthorization,
    getGraphQLProductById,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('./lib');
const productQueries = require("../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let includeUnpublishedItems = false;
        let accessPermissions = ["MANAGE_ORDERS", "MANAGE_DISCOUNTS", "MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            includeUnpublishedItems = true;
        }
        resolve(await products(authUser, args, includeUnpublishedItems));
    });
}


function products(authUser, args, includeUnpublishedItems) {
    return new Promise(resolve => {
        let attributes = args.attributes;
        let categoryId = args.categoryId;
        let chargeTaxes = args.chargeTaxes;
        let description = args.description;
        let name = args.name;
        let slug = args.slug;
        let taxCode = args.taxCode;
        let seo = args.seo;
        let weight = args.weight;
        let rating = args.rating;
        let productTypeId = args.productTypeId;
        let now = new Date().toUTCString();

        productQueries.getProductType([productTypeId], "id=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("producttype", "Product type not found", "INVALID", null, null, null));

            let values = [
                name,
                description,
                now,
                productTypeId,
                categoryId,
                seo.description,
                seo.title,
                chargeTaxes,
                weight,
                JSON.stringify({}),
                JSON.stringify({ "vatlayer.code": taxCode, "vatlayer.description": "standard" }),
                slug,
                null,
                description.blocks[0].data.text,
                rating,
                slug.replace("-", " ")
            ];

            productQueries.createProduct(values, result => {
                if (result.err) return resolve(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                let product = result.res[0];
                const numAttributes = attributes.length;
                let attributeCursor = -1;

                attributes.forEach(attr => {
                    values = [
                        name,
                        attr.id,
                        slug,
                        null,
                        JSON.stringify(attr.values),
                        attr.contentType,
                        attr.file,
                        attr.richText,
                        attr.boolean,
                        attr.dateTime,
                        null,
                        product.id
                    ];

                    productQueries.createAttributeValue(values, result => {
                        if (result.err) return resolve(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                        let attributeValue = result.res[0];

                        productQueries.getAttributeProduct([attr.id, productTypeId], "attribute_id=$1 AND product_type_id=$2", result => {
                            if (result.err) return resolve(getGraphQLOutput("getattributeproduct", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                            if (result.res.length == 0) {
                                checkComplete();
                            } else {
                                productQueries.createAttributeProduct([attr.id, productTypeId, null], result => {
                                    if (result.err) return resolve(getGraphQLOutput("createattributeproduct", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                                    let attributeProduct = result.res[0];

                                    productQueries.createAssignedProductAttribute([product.id, attributeProduct.id], result => {
                                        if (result.err) return resolve(getGraphQLOutput("createattributeproduct", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                                        let assignedProductAttribute = result.res[0];

                                        productQueries.createAssignedProductAttributeValue([null, assignedProductAttribute.id, attributeValue.id], result => {
                                            if (result.err) return resolve(getGraphQLOutput("createattributeproduct", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                                            checkComplete();
                                        });
                                    });
                                });
                            }
                        });
                    });
                });

                checkComplete();
                async function checkComplete() {
                    attributeCursor++;
                    if (attributeCursor == numAttributes) {
                        let graphQLProduct = await getGraphQLProductById(product.id);
                        resolve(getGraphQLOutput("success", "Product created", "REQUIRED", null, null, graphQLProduct));
                    }
                }
            });
        });
    });
}