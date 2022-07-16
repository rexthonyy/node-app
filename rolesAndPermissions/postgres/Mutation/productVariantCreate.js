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
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productVariantCreate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, productVariant) {
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
        productVariant
    }
}

function productVariantCreate(authUser, args) {
    return new Promise(async resolve => {
        let errors = [];
        let res;

        try {
            res = await createProductVariant(args);
        } catch (err) {
            return resolve({
                errors: err,
                productErrors: err,
                productVariant: null
            });
        }

        try {
            await createProductVariantAttributes(args, res.product, res.productVariant);
        } catch (err) {
            errors.concat(err);
        }

        try {
            await createProductVariantStock(args, res.productVariant.id);
        } catch (err) {
            errors.concat(err);
        }

        try {
            let productVariant = await getGraphQLProductVariantById(res.productVariant.id);
            return resolve({
                errors,
                productErrors: errors,
                productVariant
            });
        } catch (err) {
            resolve(getGraphQLOutput("productVariant", err, "GRAPHQL_ERROR", null, null, null));
        }
    });
}

function createProductVariant(args) {
    return new Promise((resolve, reject) => {
        productQueries.getProduct([args.input.product], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Product not found", "NOT_FOUND", null, null, null).errors);
            let product = result.res[0];

            let values = getCreateProductVariantInputValues(args);
            productQueries.createProductVariant(values, result => {
                if (result.err) return reject(getGraphQLOutput("productVariant", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors);
                if (result.res.length == 0) return reject(getGraphQLOutput("productVariant", "ProductVariant not created", "GRAPHQL_ERROR", null, null, null).errors);
                let productVariant = result.res[0];
                resolve({ product, productVariant });
            });
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