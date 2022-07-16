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
            resolve(await productVariantUpdate(authUser, args));
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

function productVariantUpdate(authUser, args) {
    return new Promise(async resolve => {
        let errors = [];
        let res;

        try {
            res = await updateProductVariant(args);
        } catch (err) {
            errors.push(err);
        }

        try {
            await updateProductVariantAttributes(args, res.product, res.productVariant);
        } catch (err) {
            errors.concat(err);
        }

        try {
            let productVariant = await getGraphQLProductVariantById(args.id);
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

function updateProductVariant(args) {
    return new Promise((resolve, reject) => {
        let { values, set, whereClause } = getUpdateProductVariantInputValues(args);
        productQueries.updateProductVariant(values, set, whereClause, result => {
            if (result.err) return reject(getGraphQLOutput("productVariant", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors[0]);
            if (result.res.length == 0) return reject(getGraphQLOutput("productVariant", "ProductVariant not updated", "GRAPHQL_ERROR", null, null, null).errors[0]);
            let productVariant = result.res[0];

            productQueries.getProduct([productVariant.product_id], "id=$1", result => {
                if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors[0]);
                if (result.res.length == 0) return reject(getGraphQLOutput("product", "Product not found", "NOT_FOUND", null, null, null).errors[0]);
                let product = result.res[0];
                resolve({ product, productVariant });
            });
        });
    });
}

function getUpdateProductVariantInputValues(args) {
    let sku = null;
    let trackInventory;
    let weight = null;
    let preorderGlobalThreshold = null;
    let isPreorder = args.input.preorder != null;
    let preorderEndDate = null;
    let quantityLimitPerCustomer = null;
    let now = new Date().toUTCString();

    sku = args.input.sku ? args.input.sku : null;

    trackInventory = args.input.trackInventory ? args.input.trackInventory : true;

    weight = args.input.weight ? args.input.weight : null;

    if (isPreorder) {
        preorderGlobalThreshold = args.input.preorder.globalThreshold ? args.input.preorder.globalThreshold : null;
        preorderEndDate = args.input.preorder.endDate ? new Date(args.input.preorder.endDate).toUTCString() : null;
    }

    quantityLimitPerCustomer = args.input.quantityLimitPerCustomer ? args.input.quantityLimitPerCustomer : null;

    let values = [args.id];
    let whereClause = "id=$1";
    let cursor = 1;
    let set = "";

    if (sku != null) {
        values.push(sku);
        set += set ? ", " : "";
        set += `sku=$${++cursor}`;
    }
    if (trackInventory != null) {
        values.push(trackInventory);
        set += set ? ", " : "";
        set += `track_inventory=$${++cursor}`;
    }
    if (weight != null) {
        values.push(weight);
        set += set ? ", " : "";
        set += `weight=$${++cursor}`;
    }
    if (isPreorder) {
        values.push(isPreorder);
        set += set ? ", " : "";
        set += `is_preorder=$${++cursor}`;

        if (preorderGlobalThreshold != null) {
            values.push(preorderGlobalThreshold);
            set += set ? ", " : "";
            set += `preorder_global_threshold=$${++cursor}`;
        }

        if (preorderEndDate != null) {
            values.push(preorderEndDate);
            set += set ? ", " : "";
            set += `preorder_end_date=$${++cursor}`;
        }
    }
    if (quantityLimitPerCustomer != null) {
        values.push(quantityLimitPerCustomer);
        set += set ? ", " : "";
        set += `quantity_limit_per_customer=$${++cursor}`;
    }

    values.push(now);
    set += set ? ", " : "";
    set += `updated_at=$${++cursor}`;

    return { values, set, whereClause };
}

function updateProductVariantAttributes(args, product, productVariant) {
    return new Promise(resolve => {
        const numVariantAttributes = args.input.attributes.length;
        let variantAttributeCursor = -1;
        let errors = [];

        args.input.attributes.forEach(async attr => {
            try {
                await updateAttribute(product, productVariant, attr);
            } catch (err) {
                errors.push(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            variantAttributeCursor++;
            if (variantAttributeCursor == numVariantAttributes) {
                if (errors.length == 0) return resolve();
                reject(errors);
            }
        }
    });
}

function updateAttribute(product, productVariant, attr) {
    return new Promise((resolve, reject) => {
        if (attr.values == null) return resolve();

        productQueries.getAttributeVariant([attr.id, product.product_type_id], "attribute_id=$1 AND product_type_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("variantAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors[0]);
            if (result.res.length == 0) return reject();
            let attributeVariant = result.res[0];

            const numValues = attr.values.length;
            let cursor = -1;

            attr.values.forEach(async value => {
                try {
                    let attributeValue = await resolveAttributeValue(attr, value);
                    let assignedVariantAttribute = await resolveAssignedVariantAttribute(productVariant.id, attributeVariant.id);
                    await deleteAssignedVariantAttributeValue(assignedVariantAttribute.id);
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

function deleteAssignedVariantAttributeValue(assignedVariantAttributeId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteAssignedVariantAttributeValue([assignedVariantAttributeId], "assignment_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("assignedVariantAttributeValue", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors[0]);
            resolve();
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