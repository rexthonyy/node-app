const {

} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let productId = parent.id;
        let size = args.size;

        resolve(await getThumbnail(productId, size));
    });
}

function getThumbnail(productId, size) {
    return new Promise((resolve, reject) => {
        productQueries.getProductMedia([productId], "product_id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return resolve(null);

            let productMedia = result.res[0];

            resolve({
                url: productMedia.image,
                alt: productMedia.alt
            });
        });
    });
}