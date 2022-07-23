const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLGiftCardById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let permissions = ["MANAGE_GIFT_CARD"];

        if (userHasAccess(authUser.userPermissions, permissions) || userPermissionGroupHasAccess(authUser.permissionGroups, permissions)) {
            resolve(await getGiftCardTags(args));
        } else {
            reject("You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_GIFT_CARD");
        }
    });
}

function getGiftCardTags(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllGiftCardTags(args.filter);
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

function getAllGiftCardTags(filter) {
    return new Promise((resolve, reject) => {
        let { values, whereClause } = getGiftCardTagsInput(filter);
        console.log(values, whereClause);
        productQueries.getGiftCardTag(values, whereClause, result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let giftCardTags_ = result.res;

            const numGiftCardTags = giftCardTags_.length;
            let cursor = -1;
            let edges = [];

            giftCardTags_.forEach(node => {
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numGiftCardTags) {
                    resolve(edges);
                }
            }
        });
    })
}

function getGiftCardTagsInput(filter) {
    if (!filter) return { values: [-1], whereClause: "id<>$1" };

    let values = [];
    let whereClause = "";
    let cursor = 0;

    if (filter.search != null) {
        values.push(filter.search);
        whereClause += whereClause ? " AND " : "";
        whereClause += `name ILIKE '%($${++cursor})%'`;
    }

    return { values, whereClause };
}