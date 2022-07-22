const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLAddressById = require("./getGraphQLAddressById");
let getGraphQLWarehouseById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getWarehouse([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                reject(null);
            } else {
                let warehouse = result.res[0];
                let address;
                let companyName;

                try {
                    address = await getGraphQLAddressById(warehouse.address_id);
                    companyName = address.companyName;
                } catch (err) {
                    address = null;
                    companyName = "";
                }

                let res = {
                    id: warehouse.id,
                    privateMetadata: formatMetadata(warehouse.private_metadata),
                    metadata: formatMetadata(warehouse.metadata),
                    name: warehouse.name,
                    slug: warehouse.slug,
                    email: warehouse.email,
                    isPrivate: warehouse.is_private,
                    address,
                    clickAndCollectOption: warehouse.click_and_collect_option.toUpperCase(),
                    companyName
                };

                resolve(res);
            }
        });
    });
};

module.exports = getGraphQLWarehouseById;