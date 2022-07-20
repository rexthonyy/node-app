const productQueries = require("../../../postgres/product-queries");
const getGraphQLDigitalContentById = require("./getGraphQLDigitalContentById");

let getGraphQLDigitalContentUrlById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getDigitalContentUrl([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Digital content url not found");
            }

            let digitalContentUrl = result.res[0];

            let digitalContent;
            let url;

            try {
                digitalContent = await getGraphQLDigitalContentById(digitalContentUrl.content_id);
            } catch (err) {
                digitalContent = null;
            }
            try {
                url = await getUrlByContentId(digitalContentUrl.content_id);
            } catch (err) {
                url = null;
            }

            let res = {
                id: digitalContentUrl.id,
                content: digitalContent,
                created: digitalContentUrl.created,
                downloadNum: digitalContentUrl.download_num,
                url,
                token: digitalContentUrl.token
            };

            resolve(res);
        });
    });
};

function getUrlByContentId(id) {
    return new Promise((resolve) => {
        productQueries.getDigitalContent([id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Digital content not found");
            let digitalContent = result.res[0];
            resolve(digitalContent.content_file);
        });
    });
}

module.exports = getGraphQLDigitalContentUrlById;