const {
    checkAuthorization,
    getGraphQLAttributeById,
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        resolve(await attributes(args));
    });
}

function attributes(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllAttributes();
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

function getAllAttributes() {
    return new Promise((resolve, reject) => {
        productQueries.getAttribute([-1], "id <> $1", result => {
            if (result.err) { console.log(JSON.stringify(result.err)); return reject(JSON.stringify(result.err)); }
            let attributes = result.res;

            const numAttributes = attributes.length;
            let cursor = -1;
            let edges = [];

            attributes.forEach(async attribute => {
                let node = await getGraphQLAttributeById(attribute.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAttributes) {
                    resolve(edges);
                }
            }
        });
    })
}