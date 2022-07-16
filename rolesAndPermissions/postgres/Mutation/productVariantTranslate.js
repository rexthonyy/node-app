const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductVariantById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null));

        let accessPermissions = ["MANAGE_TRANSLATIONS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productVariantTranslate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_TRANSLATIONS", "INVALID", null));
        }
    });
}

function getGraphQLOutput(field, message, code, productVariant) {
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
        productVariant
    };
}

function productVariantTranslate(authUser, args) {
    return new Promise(async resolve => {
        productQueries.getProductVariant([args.id], "id=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("productvariant", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("productvariant", "Product variant not found", "NOT_FOUND", null));
            productQueries.getProductVariantTranslation([args.id, args.languageCode], "product_variant_id=$1 AND language_code=$2", async result => {
                if (result.err) return resolve(getGraphQLOutput("productvariant", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                if (result.res.length == 0) {
                    try {
                        await createProductVariantTranslation(args);
                    } catch (err) {
                        return resolve(getGraphQLOutput("productvariant", err, "GRAPHQL_ERROR", null));
                    }
                } else {
                    try {
                        let translationId = result.res[0].id;
                        await updateProductVariantTranslation(translationId, args);
                    } catch (err) {
                        return resolve(getGraphQLOutput("productvariant", err, "GRAPHQL_ERROR", null));
                    }
                }

                try {
                    let productVariant = await getGraphQLProductVariantById(args.id);
                    return resolve({
                        errors: [],
                        translationErrors: [],
                        productVariant
                    });
                } catch (err) {
                    return resolve(getGraphQLOutput("productvariant", err, "GRAPHQL_ERROR", null));
                }
            });
        });
    });
}

function createProductVariantTranslation(args) {
    return new Promise((resolve, reject) => {
        productQueries.createProductVariantTranslation([args.languageCode, args.input.name, args.id], result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Product variant translation not created");
            resolve();
        });
    });
}

function updateProductVariantTranslation(translationId, args) {
    return new Promise((resolve, reject) => {
        productQueries.updateProductVariantTranslation([translationId, args.languageCode, args.input.name], "language_code=$2, name=$3", "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return resolve("Product variant translation not updated");
            resolve();
        });
    });
}

function getCreateProductVariantInputValues(args) {
    let sku = null;
    let trackInventory;
    let weight = null;
    let preorderGlobalThreshold = null;
    let isPreorder = args.input.preorder != null;
    let preorderEndDate = null;
    let quantityLimitPerCustomer = null;
    let productId = args.input.product;
    let now = new Date().toUTCString();

    sku = args.input.sku ? args.input.sku : null;

    trackInventory = args.input.trackInventory ? args.input.trackInventory : true;

    weight = args.input.weight ? args.input.weight : null;

    if (isPreorder) {
        preorderGlobalThreshold = args.input.preorder.globalThreshold ? args.input.preorder.globalThreshold : null;
        preorderEndDate = args.input.preorder.endDate ? new Date(args.input.preorder.endDate).toUTCString() : null;
    }

    quantityLimitPerCustomer = args.input.quantityLimitPerCustomer ? args.input.quantityLimitPerCustomer : null;

    return [
        sku,
        sku,
        productId,
        trackInventory,
        weight,
        JSON.stringify({}),
        JSON.stringify({}),
        0,
        isPreorder,
        preorderEndDate,
        preorderGlobalThreshold,
        quantityLimitPerCustomer,
        now,
        now
    ];
}

function createProductVariantAttributes(args, product, productVariant) {
    return new Promise(resolve => {
        const numVariantAttributes = args.input.attributes.length;
        let variantAttributeCursor = -1;
        let errors = [];

        args.input.attributes.forEach(async attr => {
            try {
                await addAttribute(product, productVariant, attr);
            } catch (err) {
                console.log(err);
            }
            checkComplete();
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

function addAttribute(product, productVariant, attr) {
    return new Promise(async(resolve, reject) => {
        if (attr.values == null) return reject();

        productQueries.getAttributeVariant([attr.id, product.product_type_id], "attribute_id=$1 AND product_type_id=$2", result => {
            if (result.err) return reject();
            if (result.res.length == 0) return reject();
            let attributeVariant = result.res[0];

            const numValues = attr.values.length;
            let cursor = -1;

            attr.values.forEach(async value => {
                try {
                    let attributeValue = await resolveAttributeValue(attr, value);
                    let assignedVariantAttribute = await resolveAssignedVariantAttribute(productVariant.id, attributeVariant.id);
                    let assignedVariantAttributeValue = await resolveAssignedVariantAttributeValue(assignedVariantAttribute.id, attributeValue.id);
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

function resolveAssignedVariantAttribute(productVariantId, attributeVariantId) {
    return new Promise((resolve, reject) => {
        productQueries.getAssignedVariantAttribute([productVariantId, attributeVariantId], "variant_id=$1 AND assignment_id=$2", async result => {
            if (result.err) return reject();
            let assignedVariantAttribute;
            if (result.res.length == 0) {
                assignedVariantAttribute = await createAssignedVariantAttribute(productVariantId, attributeVariantId);
            } else {
                assignedVariantAttribute = result.res[0];
            }
            resolve(assignedVariantAttribute);
        });
    });
}

function createAssignedVariantAttribute(productVariantId, attributeVariantId) {
    return new Promise((resolve, reject) => {
        productQueries.createAssignedVariantAttribute([productVariantId, attributeVariantId], async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Failed to create assigned variant attribute");
            resolve(result.res[0]);
        });
    });
}

function resolveAssignedVariantAttributeValue(assignedVariantAttributeId, attributeValueId) {
    return new Promise((resolve, reject) => {
        productQueries.getAssignedVariantAttributeValue([assignedVariantAttributeId, attributeValueId], "assignment_id=$1 AND value_id=$2", async result => {
            if (result.err) return reject();
            let assignedVariantAttributeValue;
            if (result.res.length == 0) {
                assignedVariantAttributeValue = await createAssignedVariantAttributeValue(assignedVariantAttributeId, attributeValueId);
            } else {
                assignedVariantAttributeValue = result.res[0];
            }
            resolve(assignedVariantAttributeValue);
        });
    });
}

function createAssignedVariantAttributeValue(assignedVariantAttributeId, attributeValueId) {
    return new Promise((resolve, reject) => {
        productQueries.createAssignedVariantAttributeValue([0, assignedVariantAttributeId, attributeValueId], async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Failed to create assigned product attribute value");
            resolve(result.res[0]);
        });
    });
}

function createProductVariantStock(args, productVariantId) {
    return new Promise((resolve, reject) => {
        if (args.input.stocks == null) return resolve();
        let stocks = args.input.stocks;
        const numStock = stocks.length;
        let cursor = -1;

        stocks.forEach(async stock => {
            try {
                await createWarehouseStock(stock, productVariantId);
            } catch (err) {}
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numStock) {
                resolve();
            }
        }
    });
}

function createWarehouseStock(stock, productVariantId) {
    return new Promise((resolve, reject) => {
        productQueries.getWarehouse([stock.warehouse], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Warehouse not found");
            productQueries.createWarehouseStock([stock.quantity, productVariantId, stock.warehouse, 0], result => {
                if (result.err) return reject(JSON.stringify(result.err));
                if (result.res.length == 0) return reject("Warehouse stock not created");
                resolve();
            });
        });
    });
}