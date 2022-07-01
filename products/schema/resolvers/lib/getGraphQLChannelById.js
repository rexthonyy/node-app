const kratosQueries = require("../../../postgres/kratos-queries");
let getGraphQLChannelById = (id) => {
    return new Promise((resolve, reject) => {
        kratosQueries.getChannel([id], "id=$1", result => {
            if (result.err || result.res.length == 0) {
                reject(null);
            } else {
                let channel = result.res[0];

                resolve({
                    id: channel.id,
                    name: channel.name,
                    isActive: channel.is_active,
                    currencyCode: channel.currency_code,
                    slug: channel.slug,
                    hasOrders: false,
                    defaultCountry: channel.default_country
                });
            }
        });
    });
};

module.exports = getGraphQLChannelById;