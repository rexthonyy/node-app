const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLAttributeById,
    getGraphQLAttributeValueById,
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null));

        let accessPermissions = ["MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await attributeValueUpdate(authUser, args));
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

function attributeValueUpdate(authUser, args) {
    return new Promise(async resolve => {
        let id = args.id;
        let name = args.input.name;
        let slug;
        if (name) slug = name.toLowerCase();
        let richText = args.input.richText;
        let fileUrl = args.input.fileUrl;
        let contentType = args.input.contentType;
        let value = args.input.value;

        productQueries.getAttributeValue([id], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getAttributeValue", JSON.stringify(resule.err), "GRAPHQL_ERROR", null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getAttributeValue", "Attribute value not found", "NOT_FOUND", null, null));

            let attributeValue_ = result.res[0];
            let errors = [];
            let attribute = null;
            let attributeValue = null;

            try {
                if (name) await updateAttributeValueName(id, name);
            } catch (err) {
                console.log(err);
                errors.push(err.errors[0]);
            }

            try {
                if (slug) await updateAttributeValueSlug(id, slug);
            } catch (err) {
                console.log(err);
                errors.push(err.errors[0]);
            }

            try {
                if (richText) await updateAttributeValueRichText(id, richText);
            } catch (err) {
                console.log(err);
                errors.push(err.errors[0]);
            }

            try {
                if (fileUrl) await updateAttributeValueFileUrl(id, fileUrl);
            } catch (err) {
                console.log(err);
                errors.push(err.errors[0]);
            }

            try {
                if (contentType) await updateAttributeValueContentType(id, contentType);
            } catch (err) {
                console.log(err);
                errors.push(err.errors[0]);
            }

            try {
                if (value) await updateAttributeValueValue(id, value);
            } catch (err) {
                console.log(err);
                errors.push(err.errors[0]);
            }

            try {
                attribute = await getGraphQLAttributeById(attributeValue_.attribute_id);
            } catch (err) {
                console.log(err);
                errors.push(getGraphQLOutput("getGraphQLAttributeById", err, "NOT_FOUND", null, null).errors[0]);
            }

            try {
                attributeValue = await getGraphQLAttributeValueById(attributeValue_.id);
            } catch (err) {
                console.log(err);
                errors.push(getGraphQLOutput("getGraphQLAttributeValueById", err, "NOT_FOUND", null, null).errors[0]);
            }

            resolve({
                errors: errors,
                attributeErrors: errors,
                attribute,
                attributeValue
            });
        });
    });
}

function updateAttributeValueName(id, name) {
    return new Promise((resolve, reject) => {
        productQueries.updateAttributeValue([id, name], "name=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttributeValue", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttributeValue", "Failed to update attribute value name", "REQUIRED", null, null));
            resolve();
        });
    });
}

function updateAttributeValueSlug(id, slug) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValue([slug], "slug=$1", result => {
            if (result.err) return reject(getGraphQLOutput("getAttributeValue", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null));
            if (result.res.length > 0) return reject(getGraphQLOutput("getAttributeValue", "Attribute value slug already being used", "INVALID", null, null));
            productQueries.updateAttributeValue([id, slug], "slug=$2", "id=$1", result => {
                if (result.err) return reject(getGraphQLOutput("updateAttributeValue", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null));
                if (result.res.length == 0) return reject(getGraphQLOutput("updateAttributeValue", "Failed to update attribute value slug", "REQUIRED", null, null));
                resolve();
            });
        });
    });
}

function updateAttributeValueRichText(id, richText) {
    return new Promise((resolve, reject) => {
        productQueries.updateAttributeValue([id, richText], "rich_text=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttributeValue", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttributeValue", "Failed to update attribute value rich_text", "REQUIRED", null, null));
            resolve();
        });
    });
}

function updateAttributeValueFileUrl(id, fileUrl) {
    return new Promise((resolve, reject) => {
        productQueries.updateAttributeValue([id, fileUrl], "file_url=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttributeValue", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttributeValue", "Failed to update attribute value file_url", "REQUIRED", null, null));
            resolve();
        });
    });
}

function updateAttributeValueContentType(id, contentType) {
    return new Promise((resolve, reject) => {
        productQueries.updateAttributeValue([id, contentType], "content_type=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttributeValue", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttributeValue", "Failed to update attribute value content_type", "REQUIRED", null, null));
            resolve();
        });
    });
}

function updateAttributeValueValue(id, value) {
    return new Promise((resolve, reject) => {
        productQueries.updateAttributeValue([id, value], "value=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAttributeValue", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAttributeValue", "Failed to update attribute value value", "REQUIRED", null, null));
            resolve();
        });
    });
}