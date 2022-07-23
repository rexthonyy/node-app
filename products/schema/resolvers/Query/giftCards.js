const {
    checkAuthorization,
    getGraphQLStockById,
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
            resolve(await giftCards(args));
        } else {
            reject("You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_GIFT_CARD");
        }
    });
}

function giftCards(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllGiftCards(args.filter);
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

function getAllGiftCards(filter) {
    return new Promise((resolve, reject) => {
        let { values, whereClause } = getGiftCardsInput(filter);
        productQueries.getGiftCard(values, whereClause, result => {
            if (result.err) { console.log(JSON.stringify(result.err)); return reject(JSON.stringify(result.err)); }
            let giftCards_ = result.res;

            const numGiftCards = giftCards_.length;
            let cursor = -1;
            let edges = [];

            giftCards_.forEach(async giftcard => {
                let node = await getGraphQLGiftCardById(giftcard.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numGiftCards) {
                    resolve(edges);
                }
            }
        });
    })
}

function getGiftCardsInput(filter) {
    if (!filter) return { values: [-1], whereClause: "id<>$1" };

    let values = [];
    let whereClause = "";
    let cursor = 0;

    if (filter.isActive != null) {
        values.push(filter.isActive);
        whereClause += whereClause ? " AND " : "";
        whereClause += `is_active=$${++cursor}`;
    }
    if (filter.products != null) {
        let in_ = "";
        for (let i = 0; i < filter.products.length; i++) {
            if (i > 0) {
                in_ += ",";
            }
            in_ += `$${++cursor}`;
            values.push(filter.products[i]);
        }
        whereClause += whereClause ? " AND " : "";
        whereClause += `product_id IN (${in_})`;
    }
    if (filter.usedBy != null) {
        let in_ = "";
        for (let i = 0; i < filter.usedBy.length; i++) {
            if (i > 0) {
                in_ += ",";
            }
            in_ += `$${++cursor}`;
            values.push(filter.usedBy[i]);
        }
        whereClause += whereClause ? " AND " : "";
        whereClause += `used_by_id IN (${in_})`;
    }
    if (filter.used != null) {
        if (filter.used) {
            whereClause += whereClause ? " AND " : "";
            whereClause += "used_by_id is not null";
        } else {
            whereClause += whereClause ? " AND " : "";
            whereClause += "used_by_id is null";
        }
    }
    if (filter.currency != null) {
        values.push(filter.currency);
        whereClause += whereClause ? " AND " : "";
        whereClause += `currency=$${++cursor}`;
    }
    if (filter.currentBalance != null) {
        if (filter.currentBalance.gte) {
            values.push(filter.currentBalance.gte);
            whereClause += whereClause ? " AND " : "";
            whereClause += `current_balance_amount>=$${++cursor}`;
        }
        if (filter.currentBalance.lte) {
            values.push(filter.currentBalance.lte);
            whereClause += whereClause ? " AND " : "";
            whereClause += `current_balance_amount<=$${++cursor}`;
        }
    }
    if (filter.initialBalance != null) {
        if (filter.initialBalance.gte) {
            values.push(filter.initialBalance.gte);
            whereClause += whereClause ? " AND " : "";
            whereClause += `initial_balance_amount>=$${++cursor}`;
        }
        if (filter.initialBalance.lte) {
            values.push(filter.initialBalance.lte);
            whereClause += whereClause ? " AND " : "";
            whereClause += `initial_balance_amount<=$${++cursor}`;
        }
    }
    if (filter.code != null) {
        values.push(filter.code);
        whereClause += whereClause ? " AND " : "";
        whereClause += `code=$${++cursor}`;
    }

    return { values, whereClause };
}