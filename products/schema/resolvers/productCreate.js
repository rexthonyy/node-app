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
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productCreate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, product) {
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
        product
    }
}

function productCreate(authUser, args) {
    return new Promise(resolve => {
        let productTypeId = args.input.productType;

        productQueries.getProductType([productTypeId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("producttype", "Product type not found", "INVALID", null, null, null));

            try {
                let product = await createProduct(args);
                let productvariant = await createProductVariant(product);
                await updateProductVariantId(product, productvariant);
                await addProductToCollections(product, args.input.collections ? args.input.collections : null);
                await addProductAttributes(product, args.input.attributes ? args.input.attributes : null);
                let graphQLProduct = await getGraphQLProductById(product.id);
                resolve(getGraphQLOutput("product", "Product type created", "GRAPHQL_ERROR", null, null, graphQLProduct));
            } catch (err) {
                return resolve(getGraphQLOutput("product", err, "GRAPHQL_ERROR", null, null, null));
            }
        });
    });
}

function createProduct(args) {
    return new Promise(resolve => {
        let categoryId = args.input.categoryId;
        let chargeTaxes = args.input.chargeTaxes;
        let description = args.input.description;
        let description_plaintext = "";
        if (description) {
            if (description.blocks) {
                let block = description.blocks[0];
                if (block.text) {
                    description_plaintext = block.text;
                }
            }
        }
        let name = args.input.name;
        let slug = args.input.slug;
        let taxCode = args.input.taxCode;
        let seo = args.input.seo;
        let seo_description = null;
        let seo_title = null;
        if (seo) {
            seo_description = seo.description;
            seo_title = seo.title;
        }
        let weight = args.input.weight;
        let rating = args.input.rating;
        let productTypeId = args.input.productType;
        let now = new Date().toUTCString();

        let values = [
            name,
            description,
            now,
            productTypeId,
            categoryId,
            seo_description,
            seo_title,
            chargeTaxes,
            weight,
            JSON.stringify({}),
            JSON.stringify({ "vatlayer.code": taxCode, "vatlayer.description": "standard" }),
            slug,
            null,
            description_plaintext,
            rating,
            slug.replace("-", " ")
        ];

        productQueries.createProduct(values, result => {
            if (result.err) return resolve(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("product", "Failed to create product", "REQUIRED", null, null, null));
            let product = result.res[0];
            console.log(product);
            resolve(product);
        });
    });
}

function createProductVariant(product) {
    return new Promise(resolve => {
        let now = new Date().toUTCString();
        let values = [
            null,
            product.name,
            product.id,
            true,
            product.weight,
            {},
            {},
            null,
            false,
            null,
            null,
            null,
            now,
            now
        ];

        productQueries.createProductVariant(values, result => {
            if (result.err) return resolve(getGraphQLOutput("productvariant", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("productvariant", "Failed to create product variant", "REQUIRED", null, null, null));
            let productvariant = result.res[0];
            resolve(productvariant);
        });
    });
}

function updateProductVariantId(product, productvariant) {
    return new Promise(resolve => {
        productQueries.updateProductVariant([product.id, productvariant.id], "default_variant_id=$2", "id=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("product", "Failed to update default variant id", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function addProductToCollections(product, collectionIds) {
    return new Promise(resolve => {
        if (collectionIds == null) return resolve();
        const numCollections = collectionIds.length;
        let cursor = -1;

        collectionIds.forEach(collectionId => {
            productQueries.createCollectionProduct([collectionId, product.id, null], result => {
                checkComplete();
            });
        })

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numCollections) {
                resolve();
            }
        }
    });
}

function addProductAttributes(product, attributes) {
    return new Promise(resolve => {
        if (attributes == null) return resolve();
        const numAttributes = attributes.length;
        let cursor = -1;

        attributes.forEach(async attr => {
            await addAttribute(attr);
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numAttributes) {
                resolve();
            }
        }
    });
}

function addAttribute(attr) {
    return new Promise(resolve => {
        let attributeId = attr.id;
        let values = attr.values;
        let file = attr.id;
        let contentType = attr.contentType;
        let references = attr.references;
        let richText = attr.richText;
        let boolean = attr.boolean;
        let date = attr.date;
        let dateTime = attr.dateTime;

        const numValues = values.length;
        let cursor = -1;

        values.forEach(value => {
            productQueries.getAttributeValue([value], "slug=$1", result => {
                if (!(result.err || result.res.length == 0)) {

                    let input = [
                        slug.replace("-", " "),
                        attributeId,
                        slug,
                        null,
                        value,
                        contentType,
                        file,
                        richText,
                        boolean,
                        dateTime,
                        null,
                        null
                    ];

                    productQueries.createAttributeValue(input, result => {
                        checkComplete();
                    });
                } else {
                    checkComplete();
                }
            });
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numValues) {
                resolve();
            }
        }

    });
}