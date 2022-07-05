const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductVariantById = require("./getGraphQLProductVariantById");

let getGraphQLDigitalContentById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getDigitalContent([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Digital content not found");
            }

            let digitalContent = result.res[0];

            let productVariant;

            try {
                productVariant = await getGraphQLProductVariantById(digitalContent.product_variant_id);
            } catch (err) {
                productVariant = null;
            }

            let res = {
                id: digitalContent.id,
                privateMetadata: formatMetadata(digitalContent.private_metadata),
                metadata: formatMetadata(digitalContent.metadata),
                useDefaultSettings: digitalContent.use_default_settings,
                automaticFulfillment: digitalContent.automatic_fulfillment,
                contentFile: digitalContent.content_file,
                maxDownloads: digitalContent.max_downloads,
                urlValidDays: digitalContent.url_valid_days,
                urls: null,
                productVariant
            };

            resolve(res);
        });
    });
};

module.exports = getGraphQLDigitalContentById;