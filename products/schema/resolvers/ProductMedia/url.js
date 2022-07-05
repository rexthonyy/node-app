const {
    getGraphQLSelectedAttributeByProductVariantId
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let productMediaId = parent.id;
        let size = args.size;
        resolve(getUrl(productMediaId, size));
    });
}

function getUrl(productMediaId, size) {
    return new Promise(async(resolve, reject) => {
        productQueries.getProductMedia([productMediaId], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return resolve(null);

            let productMedia = result.res[0];

            resolve(productMedia.external_url);
        });
    });
}