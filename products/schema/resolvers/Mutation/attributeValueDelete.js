const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLAttributeById,
    getGraphQLAttributeValueById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null));

        let accessPermissions = ["MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await attributeValueDelete(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES", "INVALID", null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attribute, attributeValue) {
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
        attribute,
        attributeValue
    }
}

function attributeValueDelete(authUser, args) {
    return new Promise(resolve => {
        let id = args.id;

        productQueries.getAttributeValue([id], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getAttributeValue", JSON.stringify(resule.err), "GRAPHQL_ERROR", null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getAttributeValue", "Attribute value not found", "NOT_FOUND", null, null));
            let attributeValue_ = result.res[0];

            let errors = [];
            let attributeValue = null;
            let attribute = null;

            try {
                attributeValue = await getGraphQLAttributeValueById(attributeValue_.id);
            } catch (err) {
                console.log(err);
                errors.push(getGraphQLOutput("getGraphQLAttributeValueById", err, "NOT_FOUND", null).errors[0]);
            }

            try {
                attribute = await getGraphQLAttributeById(attributeValue_.attribute_id);
            } catch (err) {
                console.log(err);
                errors.push(getGraphQLOutput("getGraphQLAttributeById", err, "NOT_FOUND", null).errors[0]);
            }

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

            let res = {
                errors,
                attributeErrors: errors,
                attribute,
                attributeValue
            };

            resolve(res);
        });
    });
}


function deleteAssignedProductAttributeValue(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAssignedProductAttributeValue([attributeValueId], "value_id=$1", result => {
            resolve();
        });
    });
}

function deleteAttributeValueTranslation(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAttributeValueTranslation([attributeValueId], "attribute_value_id=$1", result => {
            resolve();
        });
    });
}

function deleteAssignedPageAttributeValue(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAssignedPageAttributeValue([attributeValueId], "value_id=$1", async result => {
            resolve();
        });
    });
}



function deleteAssignedVariantAttributeValue(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAssignedVariantAttributeValue([attributeValueId], "value_id=$1", async result => {
            resolve();
        });
    });
}