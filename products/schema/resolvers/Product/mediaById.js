const {
    checkAuthorization
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "REQUIRED", null));

        let productId = parent.id;
        let id = args.id;

        resolve(await getMedia(productId, id));
    });
}

function getMedia(productId, id) {
    return new Promise((resolve, reject) => {
        productQueries.getProductMedia([productId, id], "product_id=$1 AND id=$2", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return resolve(null);

            let productMedia = result.res[0];

            resolve({
                id: productMedia.id,
                sortOrder: productMedia.sort_order,
                alt: productMedia.id,
                type: productMedia.id,
                oembedData: productMedia.id
            });
        });
    });
}