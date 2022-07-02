const productQueries = require("../../../postgres/product-queries");
const getGraphQLOrderLineById = require("./getGraphQLOrderLineById");

let getGraphQLOrderFulfillmentById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getOrderFulfillment([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Order fulfillment not found");
            }

            let fulfillment = result.res[0];

            let lines;

            try {
                lines = await getFulfillmentLinesByFulfillmentId(fulfillment.id);
            } catch (err) {
                lines = null;
            }

            let res = {
                id: fulfillment.id,
                privateMetadata: fulfillment.private_metadata,
                privateMetafield: JSON.stringify(fulfillment.private_metadata),
                privateMetafields: null,
                metadata: fulfillment.metadata,
                metadatafield: JSON.stringify(fulfillment.metadata),
                metadatafields: null,
                fulfillmentOrder: fulfillment.order_id,
                status: fulfillment.status,
                trackingNumber: fulfillment.tracking_number,
                created: fulfillment.created,
                lines,
                statusDisplay: fulfillment.status,
                warehouse: null
            };

            resolve(res);
        });
    });
};

function getFulfillmentLinesByFulfillmentId(id) {
    return new Promise((resolve, reject) => {
        productQueries.getOrderFulfillmentLine([id], "fulfillment_id=$1", result => {
            if (result.err) {
                reject(JSON.stringify(result.err));
            } else {
                let orderFullfillmentLines = result.res;
                const numOrderFulfillmentLines = orderFullfillmentLines.length;
                let cursor = -1;
                let fullfillmentLines = [];

                orderFullfillmentLines.forEach(async line => {
                    let orderLine;
                    try {
                        orderLine = await getGraphQLOrderLineById(line.order_line_id);
                    } catch (err) {
                        orderLine = null;
                    }

                    fullfillmentLines.push({
                        id: line.id,
                        quantity: line.quantity,
                        orderLine
                    });
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numOrderFulfillmentLines) {
                        resolve(fullfillmentLines);
                    }
                }
            }
        });
    });
}

module.exports = getGraphQLOrderFulfillmentById;