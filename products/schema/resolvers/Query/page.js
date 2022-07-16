const {
    checkAuthorization,
    getGraphQLPageById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let id = args.id;
        let slug = args.slug;
        try {
            if (id) {
                return resolve(await getPageById(id));
            } else if (slug) {
                return resolve(await getPageBySlug(slug));
            } else {
                reject("Please enter either the page id or product slug");
            }
        } catch (err) {
            reject(err);
        }
    });
}

function getPageById(id) {
    return new Promise((resolve, reject) => {
        productQueries.getPage([id], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve id: ${id}`);
            let page = result.res[0];
            resolve(await getGraphQLPageById(page.id));
        });
    });
}

function getPageBySlug(slug) {
    return new Promise((resolve, reject) => {
        productQueries.getPage([slug], "slug=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve slug: ${slug}`);
            let page = result.res[0];
            resolve(await getGraphQLPageById(page.id));
        });
    });
}