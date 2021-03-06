const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", 0));

        let accessPermissions = ["MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await attributeValueBulkDelete(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES", "INVALID", 0));
        }
    });
}

function getGraphQLOutput(field, message, code, count) {
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
        count
    }
}

function attributeValueBulkDelete(authUser, args) {
    return new Promise(resolve => {
        let ids = args.ids;
        const numIds = ids.length;
        let cursor = -1;

        ids.forEach(async id => {
            await attributeValueDelete(id);
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numIds) {
                resolve({
                    errors: [],
                    attributeErrors: [],
                    count: numIds
                })
            }
        }
    });
}

function attributeValueDelete(id) {
    return new Promise(resolve => {
        productQueries.getAttributeValue([id], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getAttributeValue", JSON.stringify(resule.err), "GRAPHQL_ERROR", null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getAttributeValue", "Attribute value not found", "NOT_FOUND", null, null));
            let attributeValue_ = result.res[0];

            let errors = [];

            try {
                await deleteAssignedProductAttributeValue(attributeValue_.id);
            } catch (err) {
                console.log(err);
                errors.push(err.errors[0]);
            }

            try {
                await deleteAttributeValueTranslation(attributeValue_.id);
            } catch (err) {
                console.log(err);
                errors.push(err.errors[0]);
            }

            try {
                await deleteAssignedPageAttributeValue(attributeValue_.id);
            } catch (err) {
                console.log(err);
                errors.push(err.errors[0]);
            }

            try {
                await deleteAssignedVariantAttributeValue(attributeValue_.id);
            } catch (err) {
                console.log(err);
                errors.push(err.errors[0]);
            }


            try {
                await deleteAttributeValue(attributeValue_.id);
            } catch (err) {
                console.log(err);
                errors.push(err.errors[0]);
            }

            resolve();
        });
    });
}


function deleteAssignedProductAttributeValue(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAssignedProductAttributeValue([attributeValueId], "value_id=$1", result => {
            if (result.err) console.log(result.err);
            resolve();
        });
    });
}

function deleteAttributeValueTranslation(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAttributeValueTranslation([attributeValueId], "attribute_value_id=$1", result => {
            if (result.err) console.log(result.err);
            resolve();
        });
    });
}

function deleteAssignedPageAttributeValue(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAssignedPageAttributeValue([attributeValueId], "value_id=$1", async result => {
            if (result.err) console.log(result.err);
            resolve();
        });
    });
}



function deleteAssignedVariantAttributeValue(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAssignedVariantAttributeValue([attributeValueId], "value_id=$1", async result => {
            if (result.err) console.log(result.err);
            resolve();
        });
    });
}


function deleteAttributeValue(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAttributeValue([attributeValueId], "id=$1", async result => {
            resolve();
        });
    });
}