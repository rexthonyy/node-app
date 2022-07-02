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
                privateMetadata: digitalContent.private_metadata,
                privateMetafield: JSON.stringify(digitalContent.private_metadata),
                privateMetafields: null,
                metadata: digitalContent.metadata,
                metadatafield: JSON.stringify(digitalContent.metadata),
                metadatafields: null,
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

function getDigitalContentUrlByLineId(id) {
    return new Promise((resolve, reject) => {
        productQueries.getDigitalContentUrl([id], "line_id=$1", result => {
            if (result.err) {
                reject(JSON.stringify(result.err));
            } else {
                let digitalContentUrls = result.res;
                const numDigitalContentUrls = digitalContentUrls.length;
                let cursor = -1;
                let graphQLDigitalContentUrls = [];

                digitalContentUrls.forEach(async digitalContentUrl => {
                    let digitalContent;
                    try {
                        digitalContent = await getGraphQLDigitalContentById(digitalContentUrl.content_id);
                    } catch (err) {
                        digitalContent = null;
                    }

                    graphQLDigitalContentUrls.push({
                        id: digitalContentUrl.id,
                        content: digitalContent,
                        created: digitalContentUrl.created,
                        downloadNum: digitalContentUrl.download_num,
                        url: "",
                        token: digitalContentUrl.token
                    });
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numDigitalContentUrls) {
                        resolve(graphQLDigitalContentUrls);
                    }
                }
            }
        });
    });
}

module.exports = getGraphQLDigitalContentById;