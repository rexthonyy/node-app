const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductVariantById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");
const kratosQueries = require("../../../postgres/kratos-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productVariantChannelListingUpdate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, channels, variants) {
    return {
        errors: [{
            field,
            message,
            code,
            attributes,
            values,
            channels
        }],
        productChannelListingErrors: [{
            field,
            message,
            code,
            attributes,
            values,
            channels
        }],
        variants
    }
}

function productVariantChannelListingUpdate(authUser, args) {
    return new Promise(async resolve => {
        let variantId = args.id;
        let inputs = args.input;
        const numInputs = inputs.length;
        let cursor = -1;
        let errors = [];

        inputs.forEach(async input => {
            try {
                await updateProductVariantChannelListing(variantId, input);
            } catch (err) {
                errors.push(err);
            }
            checkComplete();
        });

        checkComplete();

        async function checkComplete() {
            cursor++;
            if (cursor == numInputs) {
                try {
                    let productVariant = await getGraphQLProductVariantById(variantId);
                    let res = {
                        errors,
                        productChannelListingErrors: errors,
                        variant: productVariant
                    };
                    return resolve(res);
                } catch (err) {
                    resolve(getGraphQLOutput("productVariant", err, "GRAPHQL_ERROR", null, null, null, null));
                }
            }
        }
    });
}

function updateProductVariantChannelListing(variantId, input) {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariant([variantId], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("variantId", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null).errors[0]);
            if (result.res.length == 0) return reject(getGraphQLOutput("variantId", "Product variant not found", "NOT_FOUND", null, null, null, null).errors[0]);
            kratosQueries.getChannel([input.channelId], "id=$1", result => {
                if (result.err) return reject(getGraphQLOutput("input.channelId", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null).errors[0]);
                if (result.res.length == 0) return reject(getGraphQLOutput("input.channelId", "Channel not found", "NOT_FOUND", null, null, null, null).errors[0]);
                let channel = result.res[0];
                productQueries.getProductVariantChannelListing([variantId, input.channelId], "variant_id=$1 AND channel_id=$2", async result => {
                    if (result.err) return reject(getGraphQLOutput("getProductVariantChannelListing", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null).errors[0]);
                    if (result.res.length == 0) {
                        let values = getProductVariantChannelListingCreateValues(variantId, channel, input);
                        productQueries.createProductVariantChannelListing(values, result => {
                            if (result.err) return reject(getGraphQLOutput("createProductVariantChannelListing", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null).errors[0]);
                            if (result.res.length == 0) return reject(getGraphQLOutput("createProductVariantChannelListing", "Product Variant Channel Listing not created", "GRAPHQL_ERROR", null, null, null, null).errors[0]);
                            resolve();
                        });
                    } else {
                        let { values, set, whereClause } = getProductVariantChannelListingUpdateValues(variantId, input);
                        console.log(values);
                        console.log(set);
                        console.log(whereClause);
                        productQueries.updateProductVariantChannelListing(values, set, whereClause, result => {
                            if (result.err) return reject(getGraphQLOutput("updateProductVariantChannelListing", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null).errors[0]);
                            if (result.res.length == 0) return reject(getGraphQLOutput("updateProductVariantChannelListing", "Product Variant Channel Listing not updated", "GRAPHQL_ERROR", null, null, null, null).errors[0]);
                            resolve();
                        });
                    }
                });
            });
        });
    });
}

function getProductVariantChannelListingCreateValues(variantId, channel, input) {
    let costPrice = input.costPrice ? input.costPrice : null;
    let preorderThreshold = input.preorderThreshold ? input.preorderThreshold : true;

    return [
        channel.currency_code,
        input.price,
        channel.id,
        variantId,
        costPrice,
        preorderThreshold
    ];
}

function getProductVariantChannelListingUpdateValues(variantId, input) {
    console.log(input);
    let costPrice = null;
    let preorderThreshold;

    costPrice = input.costPrice ? input.costPrice : null;

    preorderThreshold = input.preorderThreshold ? input.preorderThreshold : true;

    let values = [variantId, input.channelId, input.price];
    let whereClause = "variant_id=$1 AND channel_id=$2";
    let cursor = 2;
    let set = `price_amount=$${++cursor}`;

    if (costPrice != null) {
        values.push(costPrice);
        set += set ? ", " : "";
        set += `cost_price_amount=$${++cursor}`;
    }
    if (preorderThreshold != null) {
        values.push(preorderThreshold);
        set += set ? ", " : "";
        set += `preorder_quantity_threshold=$${++cursor}`;
    }

    return { values, set, whereClause };
}