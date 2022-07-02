const productQueries = require('../../../postgres/product-queries');

let getGraphQLAppExtensionById = (id) => {
    return new Promise(resolve => {
        productQueries.getAppExtensions([id], "id=$1", result => {
            if (result.err || result.res.length == 0) {
                return resolve("App extension not found");
            }
            let extension = result.res[0];

            resolve({
                id: extension.codename,
                permissions: extension.name,
                label: extension.label,
                url: extension.url,
                mount: extension.mount,
                target: extension.target,
                app: null,
                accessToken: null
            });
        });
    });
};

module.exports = getGraphQLAppExtensionById;