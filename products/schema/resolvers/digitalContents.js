const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLDigitalContentById
} = require('./lib');
const productQueries = require("../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(getDigitalContents(args));
        } else {
            reject("You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS");
        }
    });
}


function getDigitalContents(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllDigitalContents();
            resolve({
                pageInfo: {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    startCursor: "",
                    endCursor: ""
                },
                edges,
                totalCount: edges.length
            });
        } catch (err) {
            reject(err);
        }
    });
}

function getAllDigitalContents() {
    return new Promise((resolve, reject) => {
        productQueries.getDigitalContent([-1], "id <> $1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let digitalContents = result.res;

            const numDigitalContents = digitalContents.length;
            let cursor = -1;
            let edges = [];

            digitalContents.forEach(async digitalContent => {
                let node = await getGraphQLDigitalContentById(digitalContent.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numDigitalContents) {
                    resolve(edges);
                }
            }
        });
    })
}