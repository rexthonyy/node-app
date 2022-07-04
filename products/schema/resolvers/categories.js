const {
    checkAuthorization,
    getGraphQLCategoryById
} = require('./lib');
const productQueries = require("../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        resolve(getCategories(args));
    });
}


function getCategories(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllCategories();
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

function getAllCategories() {
    return new Promise((resolve, reject) => {
        productQueries.getCategory([-1], "id <> $1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let categories = result.res;

            const numCategories = categories.length;
            let cursor = -1;
            let edges = [];

            categories.forEach(async category => {
                let node = await getGraphQLCategoryById(category.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numCategories) {
                    resolve(edges);
                }
            }
        });
    })
}