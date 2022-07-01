const productQueries = require("../../../postgres/product-queries");
const getGraphQLAddressById = require("./getGraphQLAddressById");
let getGraphQLWarehouseById = (id) => {
    return new Promise(async(resolve, reject) => {
        productQueries.getWarehouse([id], "id=$1", result => {
            if (result.err || result.res.length == 0) {
                reject(null);
            } else {
                let warehouse = result.res[0];
                let address;
                let companyName;

                try {
                    address = await getGraphQLAddressById(warehouse.address_id);
                    companyName = address.company_name;
                } catch (err) {
                    address = null;
                    companyName = "";
                }

                let res = {
                    id: warehouse.id,
                    privateMetadata: warehouse.private_metadata,
                    privateMetafield: JSON.stringify(warehouse.private_metadata),
                    privateMetafields: null,
                    metadata: warehouse.metadata,
                    metadatafield: JSON.stringify(warehouse.metadata),
                    metadatafields: null,
                    name: warehouse.name,
                    slug: warehouse.slug,
                    email: warehouse.email,
                    isPrivate: warehouse.is_private,
                    address,
                    clickAndCollectionOption: warehouse.click_and_collection_option,
                    shippingZones: null,
                    companyName
                };

                resolve(res);
            }
        });
    });
};

module.exports = getGraphQLWarehouseById;