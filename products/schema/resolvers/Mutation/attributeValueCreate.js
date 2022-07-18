const {
    checkAuthorization,
    getGraphQLPageById,
    getGraphQLAttributeById,
    getGraphQLAttributeValueById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await attributeValueCreate(args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributeValue) {
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
        attributeValue
    }
}

function attributeValueCreate(args) {
    return new Promise(resolve => {
        let slug = args.input.name.toLowerCase();

        productQueries.getAttributeValue([slug], "slug=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getAttributeValue", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length > 0) return resolve(getGraphQLOutput("getAttributeValue", "Attribute value slug already exists", "ALREADY_EXISTS", null));

            let attribute;
            let attributeValue;
            try {
                attribute = await getGraphQLAttributeById(args.attribute);
            } catch (err) {
                return resolve(getGraphQLOutput("getGraphQLAttributeById", err, "GRAPHQL_ERROR", null));
            }

            try {
                attributeValue = await createAttributeValue(args.attribute, args.input);
            } catch (err) {
                return resolve(getGraphQLOutput("createAttributeValue", err, "GRAPHQL_ERROR", null));
            }

            resolve({
                attribute,
                attributeValue,
                errors: [],
                attributeErrors: []
            });
        });
    });
}

function createAttributeValue(attributeId, value) {
    return new Promise((resolve, reject) => {
        let file = value.fileUrl;
        let contentType = value.contentType;
        let richText = value.richText || null;
        let name = value.name;
        let slug = value.slug;

        let input = [
            name,
            attributeId,
            slug,
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
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Failed to create attribute value");
            resolve(await getGraphQLAttributeValueById(result.res[0].id));
        });
    });
}