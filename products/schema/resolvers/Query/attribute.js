const {
    checkAuthorization,
    getGraphQLAttributeById
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
                return resolve(await getAttributeById(id));
            } else if (slug) {
                return resolve(await getAttributeBySlug(slug));
            } else {
                reject("Please enter either the attribute id or slug");
            }
        } catch (err) {
            reject(err);
        }
    });
}

function getAttributeById(id) {
    return new Promise((resolve, reject) => {
        productQueries.getAttribute([id], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve id: ${id}`);
            let attribute = result.res[0];
            resolve(await getGraphQLAttributeById(attribute.id));
        });
    });
}

function getAttributeBySlug(slug) {
    return new Promise((resolve, reject) => {
        productQueries.getAttribute([slug], "slug=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve slug: ${slug}`);
            let attribute = result.res[0];
            resolve(await getGraphQLAttributeById(attribute.id));
        });
    });
}