const {
    checkAuthorization
} = require('./lib');
const productQueries = require("../../postgres/product-queries");
const getGraphQLProductTypeById = require('./lib/getGraphQLProductTypeById');

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        try {
            resolve(await productTypes(authUser, args));
        } catch (err) {
            reject(err);
        }
    });
}


function productTypes(authUser, args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllProductTypes();
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

function getAllProductTypes() {
    return new Promise((resolve, reject) => {
        productQueries.getProductType([-1], "id <> $1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let productTypes = result.res;

            const numProducts = productTypes.length;
            let cursor = -1;
            let edges = [];

            productTypes.forEach(async product => {
                let node = await getGraphQLProductTypeById(product.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numProducts) {
                    resolve(edges);
                }
            }
        });
    })
}