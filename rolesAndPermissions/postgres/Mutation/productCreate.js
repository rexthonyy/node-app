const {
    checkAuthorization,
    getGraphQLProductById,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

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
        let slug = args.input.slug;

        productQueries.getProductType([productTypeId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("producttype", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("producttype", "Product type not found", "INVALID", null, null, null));
            let productType = result.res[0];

            productQueries.getProduct([slug], "slug=$1", async result => {
                if (result.err) return resolve(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                if (result.res.length > 0) return resolve(getGraphQLOutput("product", "slug already being used", "GRAPHQL_ERROR", null, null, null));;

                try {
                    let product = await createProduct(args);
                    let productvariant = await createDefaultProductVariant(product);
                    await updateProductVariantId(product, productvariant);
                    await addProductToCollections(product, args.input.collections ? args.input.collections : null);
                    await addProductAttributes(product, args.input.attributes ? args.input.attributes : null);
                    let graphQLProduct = await getGraphQLProductById(product.id);
                    resolve({
                        errors: [],
                        productErrors: [],
                        product: graphQLProduct
                    });
                } catch (err) {
                    return resolve(getGraphQLOutput("product", err, "GRAPHQL_ERROR", null, null, null));
                }
            });
        });
    });
}

function createProduct(args) {
    return new Promise((resolve, reject) => {
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
        let taxCode = args.input.taxCode || "";
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

        let metadata = { "vatlayer.code": taxCode, "vatlayer.description": "standard" };
        let private_metadata = {};

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
            JSON.stringify(metadata),
            JSON.stringify(private_metadata),
            slug,
            null,
            description_plaintext,
            rating,
            slug.replace("-", " ")
        ];

        productQueries.createProduct(values, result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Failed to create product");
            let product = result.res[0];
            resolve(product);
        });
    });
}

function createDefaultProductVariant(product) {
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
            try {
                await addAttribute(product, attr);
            } catch (err) {}
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

function addAttribute(product, attr) {
    return new Promise(async(resolve, reject) => {
        if (attr.values == null) return reject();

        productQueries.getAttributeProduct([attr.id, product.product_type_id], "attribute_id=$1 AND product_type_id=$2", result => {
            if (result.err) return reject();
            if (result.res.length == 0) return reject();
            let attributeProduct = result.res[0];

            const numValues = attr.values.length;
            let cursor = -1;

            attr.values.forEach(async value => {
                try {
                    let attributeValue = await resolveAttributeValue(attr, value);
                    let assignedProductAttribute = await resolveAssignedProductAttribute(product.id, attributeProduct.id);
                    let assignedProductAttributeValue = await resolveAssignedProductAttributeValue(assignedProductAttribute.id, attributeValue.id);
                } catch (err) {
                    console.log(err);
                }
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numValues) {
                    resolve();
                }
            }
        });
    });
}

function resolveAttributeValue(attr, value) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValue([attr.id, value], "attribute_id=$1 AND (slug=$2 OR value=$2)", async result => {
            if (result.err) return reject();
            let attributeValue;
            if (result.res.length == 0) {
                try {
                    attributeValue = await createAttributeValue(attr, value);
                } catch (err) {
                    reject(err);
                }
            } else {
                attributeValue = result.res[0];
            }

            resolve(attributeValue);
        });
    });
}

function createAttributeValue(attr, value) {
    return new Promise((resolve, reject) => {
        let attributeId = attr.id;
        let file = attr.file;
        let contentType = attr.contentType;
        let references = attr.references;
        let richText = attr.richText;
        let boolean = attr.boolean;
        let date = attr.date;
        let dateTime = attr.dateTime;

        let input = [
            value,
            attributeId,
            value,
            0,
            value,
            contentType,
            file,
            richText,
            boolean,
            dateTime,
            null,
            null
        ];

        productQueries.createAttributeValue(input, async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Failed to create attribute value");
            resolve(result.res[0]);
        });
    });
}

function resolveAssignedProductAttribute(productId, attributeProductId) {
    return new Promise((resolve, reject) => {
        productQueries.getAssignedProductAttribute([productId, attributeProductId], "product_id=$1 AND assignment_id=$2", async result => {
            if (result.err) return reject();
            let assignedProductAttribute;
            if (result.res.length == 0) {
                assignedProductAttribute = await createAssignedProductAttribute(productId, attributeProductId);
            } else {
                assignedProductAttribute = result.res[0];
            }
            resolve(assignedProductAttribute);
        });
    });
}

function createAssignedProductAttribute(productId, attributeProductId) {
    return new Promise((resolve, reject) => {
        productQueries.createAssignedProductAttribute([productId, attributeProductId], async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Failed to create assigned product attribute");
            resolve(result.res[0]);
        });
    });
}

function resolveAssignedProductAttributeValue(assignedProductAttributeId, attributeValueId) {
    return new Promise((resolve, reject) => {
        productQueries.getAssignedProductAttributeValue([assignedProductAttributeId, attributeValueId], "assignment_id=$1 AND value_id=$2", async result => {
            if (result.err) return reject();
            let assignedProductAttributeValue;
            if (result.res.length == 0) {
                assignedProductAttributeValue = await createAssignedProductAttributeValue(assignedProductAttributeId, attributeValueId);
            } else {
                assignedProductAttributeValue = result.res[0];
            }
            resolve(assignedProductAttributeValue);
        });
    });
}

function createAssignedProductAttributeValue(assignedProductAttributeId, attributeValueId) {
    return new Promise((resolve, reject) => {
        productQueries.createAssignedProductAttributeValue([0, assignedProductAttributeId, attributeValueId], async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Failed to create assigned product attribute value");
            resolve(result.res[0]);
        });
    });
}