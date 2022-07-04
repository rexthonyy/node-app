const {
    checkAuthorization
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "REQUIRED", null));

        let lineId = parent.id;
        let size = args.size;

        resolve(await getThumbnail(lineId, size));
    });
}

function getThumbnail(lineId, size) {
    return new Promise((resolve, reject) => {
        productQueries.getDigitalContentUrl([lineId], "line_id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return resolve(null);

            let digitalContentUrl = result.res[0];

            productQueries.getDigitalContent([digitalContentUrl.content_id], "id=$1", async result => {
                if (result.err) return reject(JSON.stringify(result.err));
                if (result.res.length == 0) return resolve(null);

                let digitalContent = result.res[0];

                resolve({
                    url: digitalContent.content_file,
                    alt: digitalContent.content_file
                });
            });
        });
    });
}