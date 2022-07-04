const {
    checkAuthorization,
    getGraphQLCategoryById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        resolve(getCategory(args));
    });
}

function getCategory(args) {
    return new Promise((resolve, reject) => {
        productQueries.getCategory([args.id], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve id: ${args.id}`);
            let category = result.res[0];
            resolve(await getGraphQLCategoryById(category.id));
        });
    });
}