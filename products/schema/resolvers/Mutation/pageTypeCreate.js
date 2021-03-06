const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLPageTypeById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");
//.
module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PAGE_TYPES_AND_ATTRIBUTES"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await pageTypeCreate(args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PAGE_TYPES_AND_ATTRIBUTES", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, pageType) {
    return {
        errors: [{
            field,
            message,
            code,
            attributes,
            values
        }],
        pageErrors: [{
            field,
            message,
            code,
            attributes,
            values
        }],
        pageType
    }
}

function pageTypeCreate(args) {
    return new Promise(resolve => {
        let slug = args.input.slug;

        productQueries.getPageType([slug], "slug=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getPageType", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length > 0) return resolve(getGraphQLOutput("getPageType", "slug already being used", "INVALID", null, null, null));
            let name = args.input.name || "";
            let values = [
                JSON.stringify({}),
                JSON.stringify({}),
                name,
                slug
            ];
            productQueries.createPageType(values, async result => {
                if (result.err) return resolve(getGraphQLOutput("createPageType", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("createPageType", "Page type not created", "GRAPHQL_ERROR", null, null, null));
                let pageType_ = result.res[0];

                await addAttributes(pageType_.id, args);

                try {
                    let pageType = await getGraphQLPageTypeById(pageType_.id);
                    resolve({
                        errors: [],
                        pageErrors: [],
                        pageType
                    });
                } catch (err) {
                    return resolve(getGraphQLOutput("getGraphQLPageTypeById", err, "GRAPHQL_ERROR", null, null, null));
                }
            });
        });
    });
}

function addAttributes(pageTypeId, args) {
    return new Promise(resolve => {
        if (args == undefined) return resolve();
        let attributes = args.input.addAttributes ? args.input.addAttributes : [];
        const numPageAttributes = attributes.length;
        let cursor = -1;

        attributes.forEach(attributeId => {
            productQueries.getAttributePage([attributeId, pageTypeId], "attribute_id=$1 AND page_type_id=$2", async result => {
                if (!result.err) {
                    if (result.res.length == 0) {
                        try {
                            await createAttributePage(pageTypeId, attributeId);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }

                checkComplete();
            });
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numPageAttributes) {
                resolve();
            }
        }
    });
}

function createAttributePage(pageTypeId, attributeId) {
    return new Promise((resolve, reject) => {
        productQueries.createAttributePage([0, attributeId, pageTypeId], result => {
            if (result.err) return reject(JSON.stringify(result.err));
            resolve();
        });
    });
}