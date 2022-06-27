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
                resolve(getGraphQLOutput("product", "Product created", "GRAPHQL_ERROR", null, null, graphQLProduct));
            } catch (err) {
                return resolve(getGraphQLOutput("product", err, "GRAPHQL_ERROR", null, null, null));
            }
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

        productQueries.getProduct([slug], "slug=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length > 0) return reject("slug already being used");

            let metadata = [{
                key: "",
                value: ""
            }];

            let private_metadata = [{
                    key: "vatlayer.code",
                    value: taxCode
                },
                {
                    key: "vatlayer.description",
                    value: "standard"
                }
            ];

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
            await addAttribute(product, attr);
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
    return new Promise(async resolve => {

        let productAttributes = [];
        if (attr.id) {
            productAttributes = await getProductAttributesById(attr.id);
        } else if (attr.values) {
            productAttributes = await getProductAttributesByValues(attr.values);
        }

        const numAttributes = productAttributes.length;
        let cursor = -1;

        productAttributes.forEach(attribute => {
            let attributeId = attribute.id;
            let file = attr.file;
            let contentType = attr.contentType;
            let references = attr.references;
            let richText = attr.richText;
            let boolean = attr.boolean;
            let date = attr.date;
            let dateTime = attr.dateTime;

            let input = [
                attribute.name,
                attributeId,
                attribute.slug,
                null,
                "",
                contentType,
                file,
                richText,
                boolean,
                dateTime,
                null,
                product.id
            ];

            productQueries.createAttributeValue(input, async result => {
                try {
                    let attributeProduct = await produceAttributeProductAssignment(attribute, product);
                    await assignAttributesToProduct(product, attributeProduct);
                    checkComplete();
                } catch (err) {
                    console.log(err);
                    checkComplete();
                }
            });
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

function getProductAttributesById(attributeId) {
    return new Promise(resolve => {
        productQueries.getAttribute([attributeId], "id=$1", result => {
            if (result.err || result.res.length == 0) return resolve([]);
            resolve(result.res);
        });
    });
}

function getProductAttributesByValues(values) {
    return new Promise(resolve => {
        const numValues = values.length;
        let cursor = -1;
        let productAttributes = [];

        values.forEach(value => {
            productQueries.getProduct([value], "slug=$1", async result => {
                if (result.err || result.res.length == 0) {
                    try {
                        let attribute = await createProductAttribute(value);
                        productAttributes.push(attribute);
                        checkComplete();
                    } catch (err) {
                        console.log(err);
                        checkComplete();
                    }
                } else {
                    productAttributes.push(result.res[0]);
                    checkComplete();
                }
            });
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numValues) {
                resolve(productAttributes);
            }
        }
    });
}

function createProductAttribute(value) {
    return new Promise((resolve, reject) => {
        let metadata = [{
            key: "",
            value: ""
        }];
        let private_metadata = [{
            key: "",
            value: ""
        }];

        let values = [
            value,
            value.replace("-", " "),
            JSON.stringify(metadata),
            JSON.stringify(private_metadata),
            "DROPDOWN",
            false,
            false,
            false,
            false,
            false,
            1,
            false,
            "PRODUCT_TYPE",
            "PRODUCT",
            null
        ];
        productQueries.createAttribute(values, result => {
            if (result.err || result.res.length == 0) { console.log(result.err); return reject("Failed to create attribute") };
            console.log(result.res);
            console.log(result.res[0]);
            resolve(result.res[0]);
        });
    });
}

function produceAttributeProductAssignment(attribute, product) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeProduct([attribute.id, product.product_type_id], "attribute_id=$1 AND product_type_id=$2", result => {
            if (result.err) return reject("Failed to fetch product attributes");
            if (result.res.length == 0) {
                productQueries.createAttributeProduct([attribute.id, product.product_type_id], result => {
                    if (result.err) return reject("Failed to create product attribute");
                    resolve(result.res[0]);
                });
            } else {
                resolve(result.res[0]);
            }
        });
    });
}

function assignAttributesToProduct(product, attributeProduct) {
    return new Promise((resolve, reject) => {
        if (attributeProduct == null) return resolve();
        productQueries.createAssignedProductAttribute([product.id, attributeProduct.id], result => {
            if (result.err) { console.log(result.err); return reject("Failed to create assigned product attribute"); }
            console.log("assigned attribute created");
            resolve(result.res[0]);
        });
    });
}