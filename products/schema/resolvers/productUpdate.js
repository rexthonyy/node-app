const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductById
} = require('./lib');
const productQueries = require("../../postgres/product-queries");
const getGraphQLProductTypeById = require('./lib/getGraphQLProductTypeById');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productUpdate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null));
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

function productUpdate(authUser, args) {
    return new Promise(async resolve => {
        let id = args.input.id;
        let name = args.input.name;
        let slug = args.input.slug;
        let chargeTaxes = args.input.chargeTaxes || "";
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
        let categoryId = args.input.category;
        let collections = args.input.collections;
        let attributes = args.input.attributes;

        let errors = [];

        try {
            if (name) await updateProductName(id, name);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (slug) await updateProductSlug(id, slug);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (chargeTaxes) await updateProductChargeTaxes(id, chargeTaxes);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (taxCode) await updateProductTaxCode(id, taxCode);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (seo_description) await updateProductSeoDescription(id, seo_description);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (seo_title) await updateProductSeoTitle(id, seo_title);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (weight) await updateProductWeight(id, weight);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (rating) await updateProductRating(id, rating);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (categoryId) await updateProductCategory(id, categoryId);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (collections) await updateProductCollections(id, collections);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (attributes) await updateProductAttributes(id, attributes);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        let product = await getGraphQLProductById(id);

        return {
            errors: errors,
            productErrors: errors,
            product
        };
    });
}

function updateProductName(id, name) {
    return new Promise((resolve, reject) => {
        productQueries.updateProduct([id, name], "name=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product name", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductSlug(id, slug) {
    return new Promise((resolve, reject) => {
        productQueries.updateProduct([id, slug], "slug=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product slug", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductChargeTaxes(id, chargeTaxes) {
    return new Promise((resolve, reject) => {
        productQueries.updateProduct([id, chargeTaxes], "charge_taxes=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product charge_taxes", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductTaxCode(id, taxCode) {
    return new Promise((resolve, reject) => {
        let private_metadata = [{
                key: "vatlayer.code",
                value: taxCode
            },
            {
                key: "vatlayer.description",
                value: "standard"
            }
        ];

        productQueries.updateProduct([id, JSON.stringify(private_metadata)], "private_metadata=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product private_metadata", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductSeoDescription(id, seo_description) {
    return new Promise((resolve, reject) => {
        productQueries.updateProduct([id, seo_description], "seo_description=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product seo_description", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductSeoTitle(id, seo_title) {
    return new Promise((resolve, reject) => {
        productQueries.updateProduct([id, seo_title], "seo_title=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product seo_title", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductWeight(id, weight) {
    return new Promise((resolve, reject) => {
        productQueries.updateProduct([id, weight], "weight=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product weight", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductRating(id, rating) {
    return new Promise((resolve, reject) => {
        productQueries.updateProduct([id, rating], "rating=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product rating", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductCategory(id, category_id) {
    return new Promise((resolve, reject) => {
        productQueries.updateProduct([id, category_id], "category_id=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product category_id", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductCollections(id, collectionIds) {
    return new Promise((resolve, reject) => {
        productQueries.deleteCollectionProductProduct([id], "product_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to delete collection product", "REQUIRED", null, null, null));

            const numCollections = collectionIds.length;
            let cursor = -1;

            collectionIds.forEach(collectionId => {
                productQueries.createCollectionProduct([collectionId, id, null], result => {
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
    });
}

function updateProductAttributes(id, attributes) {
    return new Promise((resolve, reject) => {
        if (attributes == null) return resolve();
        const numAttributes = attributes.length;
        let cursor = -1;

        attributes.forEach(async attr => {
            await addAttribute(id, attr);
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

function addAttribute(productId, attr) {
    return new Promise(async resolve => {

        let productAttributes = [];
        if (attr.id) {
            productAttributes = await getProductAttributesById(attr.id);
        } else if (attr.values) {
            productAttributes = await getProductAttributesByValues(attr.values);
        }

        productQueries.deleteAttributeValue([id], "reference_product_id=$1", result => {
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
                    productId
                ];

                productQueries.createAttributeValue(input, async result => {
                    try {
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
            resolve(result.res[0]);
        });
    });
}