const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLAttributeById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null));

        let accessPermissions = ["MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await attributeUpdate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES", "INVALID", null));
        }
    });
}

function getGraphQLOutput(field, message, code, attribute) {
    return {
        errors: [{
            field,
            message,
            code,
        }],
        attributeErrors: [{
            field,
            message,
            code,
        }],
        attribute
    }
}

function attributeUpdate(authUser, args) {
    return new Promise(async resolve => {
        let id = args.id;
        let name = args.input.name;
        let slug = args.input.slug;
        let unit = args.input.unit;
        let removeValues = args.input.removeValues;
        let addValues = args.input.addValues;
        let valueRequired = args.input.valueRequired;
        let isVariantOnly = args.input.isVariantOnly;
        let visibleInStorefront = args.input.visibleInStorefront;
        let filterableInStorefront = args.input.filterableInStorefront;
        let filterableInDashboard = args.input.filterableInDashboard;
        let storefrontSearchPosition = args.input.storefrontSearchPosition;
        let availableInGrid = args.input.availableInGrid;

        let errors = [];
        let attribute = null;

        try {
            if (name) await updateAttributeName(id, name);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (slug) await updateAttributeSlug(id, slug);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (unit) await updateAttributeUnit(id, unit);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (removeValues) await removeAttributeValues(id, removeValues);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (addValues) await addAttributeValues(id, addValues);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (valueRequired) await updateAttributeValueRequired(id, valueRequired);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (isVariantOnly) await updateAttributeIsVariantOnly(id, isVariantOnly);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (visibleInStorefront) await updateAttributeVisibleInStorefront(id, visibleInStorefront);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (filterableInStorefront) await updateAttributeFilterableInStorefront(id, filterableInStorefront);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (filterableInDashboard) await updateAttributeFilterableInDashboard(id, filterableInDashboard);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (storefrontSearchPosition) await updateAttributeStorefrontSearchPosition(id, storefrontSearchPosition);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            if (availableInGrid) await updateAttributeAvailableInGrid(id, availableInGrid);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            attribute = await getGraphQLAttributeById(id);
        } catch (err) {
            console.log(err);
            errors.push(getGraphQLOutput("attribute", err, "NOT_FOUND", null).errors[0]);
        }

        resolve({
            errors: errors,
            attributeErrors: errors,
            attribute
        });
    });
}

function updateAttributeName(id, name) {
    return new Promise((resolve, reject) => {
        productQueries.updateAttribute([id, name], "name=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttribute", "Failed to update attribute name", "REQUIRED", null));
            resolve();
        });
    });
}

function updateAttributeSlug(id, slug) {
    return new Promise((resolve, reject) => {
        productQueries.getAttribute([slug], "slug=$1", result => {
            if (result.err) return reject(getGraphQLOutput("getAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length > 0) return reject(getGraphQLOutput("getAttribute", "Attribute slug already being used", "INVALID", null));
            productQueries.updateAttribute([id, slug], "slug=$2", "id=$1", result => {
                if (result.err) return reject(getGraphQLOutput("updateAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                if (result.res.length == 0) return reject(getGraphQLOutput("updateAttribute", "Failed to update attribute slug", "REQUIRED", null));
                resolve();
            });
        });
    });
}

function updateAttributeUnit(id, unit) {
    return new Promise((resolve, reject) => {
        productQueries.updateAttribute([id, unit], "unit=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttribute", "Failed to update attribute unit", "REQUIRED", null));
            resolve();
        });
    });
}

function removeAttributeValues(id, removeValues) {
    return new Promise((resolve, reject) => {
        let { values, whereClause } = getDeleteAttributeValues(id, removeValues);
        console.log(values);
        console.log(whereClause);
        productQueries.deleteAttributeValue(values, whereClause, result => {
            if (result.err) return reject(getGraphQLOutput("deleteAttributeValue", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("deleteAttributeValue", "Failed to remove attribute values", "GRAPHQL_ERROR", null));
            resolve();
        });
    });
}

function getDeleteAttributeValues(id, removeValues) {
    let values = [id, ...removeValues];
    let whereClause = "attribute_id=$1 AND id IN (";
    for (let i = 1; i < values.length; i++) {
        if (i > 1) {
            whereClause += ",";
        }
        whereClause += `$${i+1}`;
    }
    whereClause += ")";
    return { values, whereClause };
}

function addAttributeValues(id, addValues) {
    return new Promise((resolve, reject) => {
        let cursor = -1;
        const numValues = addValues.length;
        let error;

        addValues.forEach(async value => {
            try {
                await createAttributeValue(id, value);
            } catch (err) {
                error = err;
            }
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numValues) {
                if (error) return reject(error);
                resolve();
            }
        }
    });
}

function createAttributeValue(attributeId, value) {
    return new Promise((resolve, reject) => {
        let file = value.fileUrl;
        let contentType = value.contentType;
        let richText = value.richText || null;
        let name = value.name;

        let input = [
            name,
            attributeId,
            name,
            0,
            value.value,
            contentType,
            file,
            richText,
            null,
            null,
            null,
            null
        ];

        productQueries.createAttributeValue(input, async result => {
            if (result.err) return reject(getGraphQLOutput("createAttributeValue", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttribute", "Failed to create attribute value", "REQUIRED", null));
            resolve(result.res[0]);
        });
    });
}

function updateAttributeValueRequired(id, valueRequired) {
    return new Promise((resolve, reject) => {
        productQueries.updateAttribute([id, valueRequired], "value_required=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttribute", "Failed to update attribute value_required", "REQUIRED", null));
            resolve();
        });
    });
}

function updateAttributeIsVariantOnly(id, isVariantOnly) {
    return new Promise((resolve, reject) => {
        productQueries.updateAttribute([id, isVariantOnly], "is_variant_only=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttribute", "Failed to update attribute is_variant_only", "REQUIRED", null));
            resolve();
        });
    });
}

function updateAttributeVisibleInStorefront(id, visibleInStorefront) {
    return new Promise((resolve, reject) => {
        productQueries.updateAttribute([id, visibleInStorefront], "visible_in_storefront=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttribute", "Failed to update attribute visible_in_storefront", "REQUIRED", null));
            resolve();
        });
    });
}

function updateAttributeFilterableInStorefront(id, filterableInStorefront) {
    return new Promise((resolve, reject) => {
        productQueries.updateAttribute([id, filterableInStorefront], "filterable_in_storefront=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttribute", "Failed to update attribute filterable_in_storefront", "REQUIRED", null));
            resolve();
        });
    });
}

function updateAttributeFilterableInDashboard(id, filterableInDashboard) {
    return new Promise((resolve, reject) => {
        productQueries.updateAttribute([id, filterableInDashboard], "filterable_in_dashboard=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttribute", "Failed to update attribute filterable_in_dashboard", "REQUIRED", null));
            resolve();
        });
    });
}

function updateAttributeStorefrontSearchPosition(id, storefrontSearchPosition) {
    return new Promise((resolve) => {
        productQueries.updateAttribute([id, storefrontSearchPosition], "storefront_search_position=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttribute", "Failed to update attribute storefront_search_position", "REQUIRED", null));
            resolve();
        });
    });
}

function updateAttributeAvailableInGrid(id, availableInGrid) {
    return new Promise(async resolve => {
        productQueries.updateAttribute([id, availableInGrid], "available_in_grid=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttribute", "Failed to update attribute available_in_grid", "REQUIRED", null));
            resolve();
        });
    });
}