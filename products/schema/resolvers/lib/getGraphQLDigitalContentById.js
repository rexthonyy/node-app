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
            let urls;

            try {
                productVariant = await getGraphQLProductVariantById(digitalContent.product_variant_id);
            } catch (err) {
                productVariant = null;
            }

            try {
                urls = await getUrlsByDigitalContentId(digitalContent.id);
            } catch (err) {
                urls = null;
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
                urls,
                productVariant
            };

            resolve(res);
        });
    });
};

function getUrlsByDigitalContentId(id) {
    return new Promise((resolve) => {
        productQueries.getDigitalContentUrl([id], "content_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let digitalContentUrls = result.res;
            const numDigitalContentUrls = digitalContentUrls.length;
            let cursor = -1;
            let urls = [];

            digitalContentUrls.forEach(async url => {
                try {
                    urls.push(await getDigitalContentUrl(url));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numDigitalContentUrls) {
                    resolve(urls);
                }
            }
        });
    });
}

function getDigitalContentUrl(url) {
    return new Promise((resolve, reject) => {
        let res = {
            id: url.id,
            created: url.created,
            downloadNum: url.download_num,
            token: url.token
        };

        resolve(res);
    });
}
module.exports = getGraphQLDigitalContentById;