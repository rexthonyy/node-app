const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductTypeById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");
const { formatMetadata } = require('../../../libs/util');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productTypeUpdate(args));
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

function productTypeUpdate(args) {
    return new Promise(async resolve => {
        let pType;
        try {
            pType = await getGraphQLProductTypeById(args.id);
            args.productType = pType;
        } catch (err) {
            return resolve(getGraphQLOutput("productTypeId", err, "GRAPHQL_ERROR", null, null, null));
        }

        let { values, set, whereClause } = getUpdateProductTypeValues(args);

        console.log(values);
        console.log(set);
        console.log(whereClause);

        productQueries.updateProductType(values, set, whereClause, async result => {
            if (result.err) return resolve(getGraphQLOutput("producttype", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("producttype", "Failed to update product type", "GRAPHQL_ERROR", null, null, null));
            let productType = result.res[0];
            let errors = [];
            if (args.input.productAttributes) {
                try {
                    await updateProductAttributes(args);
                } catch (err) {
                    errors.concat(err);
                }
            }
            if (args.input.variantAttributes) {
                try {
                    await updateVariantAttributes(args);
                } catch (err) {
                    errors.concat(err);
                }
            }
            try {
                let graphQLProductType = await getGraphQLProductTypeById(productType.id);
                resolve({
                    errors: errors,
                    productErrors: errors,
                    productType: graphQLProductType
                });
            } catch (err) {
                resolve(getGraphQLOutput("producttype", err, "NOT_FOUND", null, null, null));
            }
        });

    });
}

function getUpdateProductTypeValues({ id, input, productType }) {
    let values = [id];
    let whereClause = "id=$1";
    let set = "";
    let cursor = 1;

    if (input.name != null) {
        values.push(input.name);
        set += set ? ", " : "";
        set += `name=$${++cursor}`;
    }
    if (input.slug != null) {
        values.push(input.slug);
        set += set ? ", " : "";
        set += `slug=$${++cursor}`;
    }
    if (input.kind != null) {
        values.push(input.kind);
        set += set ? ", " : "";
        set += `kind=$${++cursor}`;
    }
    if (input.hasVariants != null) {
        values.push(input.hasVariants);
        set += set ? ", " : "";
        set += `has_variants=$${++cursor}`;
    }
    if (input.isShippingRequired != null) {
        values.push(input.isShippingRequired);
        set += set ? ", " : "";
        set += `is_shipping_required=$${++cursor}`;
    }
    if (input.isDigital != null) {
        values.push(input.isDigital);
        set += set ? ", " : "";
        set += `is_digital=$${++cursor}`;
    }
    if (input.weight != null) {
        values.push(input.weight);
        set += set ? ", " : "";
        set += `weight=$${++cursor}`;
    }
    if (input.taxCode != null) {
        let metadata = addToMetadata(productType.metadata, input.taxCode);
        values.push(JSON.stringify(metadata));
        set += set ? ", " : "";
        set += `metadata=$${++cursor}`;
    }

    return { values, set, whereClause };
}

function addToMetadata(data, taxCode) {
    let pm = {};
    let isAdded = false;
    data = formatMetadata(data);
    for (let metadata of data) {
        if (metadata.key == "vatlayer.code") {
            metadata.value = taxCode;
            isAdded = true;
        }
        pm[metadata.key] = metadata.value;
    }
    if (!isAdded) {
        pm["vatlayer.code"] = taxCode;
    }
    return pm;
}

function updateProductAttributes({ id, input }) {
    return new Promise(resolve => {
        const numProductAttributes = input.productAttributes.length;
        let cursor = -1;

        input.productAttributes.forEach(async attributeId => {
            try {
                await createProductAttribute(id, attributeId);
            } catch (err) {}
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numProductAttributes) {
                resolve();
            }
        }
    });
}

function createProductAttribute(productTypeId, attributeId) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeProduct([attributeId, productTypeId], "attribute_id=$1 AND product_type_id=$2", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length > 0) return resolve();
            productQueries.getAttribute([attributeId], "id=$1", result => {
                if (result.err) return reject(JSON.stringify(result.err));
                if (result.res.length == 0) return reject("Attribute not found");
                productQueries.createAttributeProduct([attributeId, productTypeId, 0], result => {
                    if (result.err) return reject(JSON.stringify(result.err));
                    resolve();
                });
            });
        });
    });
}

function updateVariantAttributes({ id, input }) {
    return new Promise(resolve => {
        const numVariantAttributes = input.variantAttributes.length;
        let cursor = -1;

        input.variantAttributes.forEach(async attributeId => {
            try {
                await createProductVariant(id, attributeId);
            } catch (err) {}
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numVariantAttributes) {
                resolve();
            }
        }
    });
}

function createProductVariant(productTypeId, attributeId) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeVariant([attributeId, productTypeId], "attribute_id=$1 AND product_type_id=$2", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length > 0) return resolve();
            productQueries.getAttribute([attributeId], "id=$1", result => {
                if (result.err) return reject(JSON.stringify(result.err));
                if (result.res.length == 0) return reject("Attribute not found");
                productQueries.createAttributeVariant([attributeId, productTypeId, 0, false], result => {
                    if (result.err) return reject(JSON.stringify(result.err));
                    resolve();
                });
            });
        });
    });
}