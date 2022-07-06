const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductById
} = require('../lib');
const kratosQueries = require("../../../postgres/kratos-queries");
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null, null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productChannelListingUpdate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, channels, variants, product) {
    return {
        errors: [{
            field,
            message,
            code,
            attributes,
            values,
            channels,
            variants
        }],
        productChannelListingErrors: [{
            field,
            message,
            code,
            attributes,
            values,
            channels,
            variants
        }],
        product
    }
}

function productChannelListingUpdate(authUser, args) {
    return new Promise(resolve => {
        let id = args.id;
        productQueries.getProduct([id], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("id", JSON.stringify(result.err), "GRAPHQL_ERROR", [], [], [], [], null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("id", `Cannot resolve id:${id}`, "NOT_FOUND", [], [], [], [], null));

            let updateChannels = args.input.updateChannels;
            let removeChannels = args.input.removeChannels;
            let errors = [];

            if (updateChannels) {
                try {
                    await iterateProductChannelListing(id, updateChannels);
                } catch (err) {
                    errors.concat(err);
                }
            }

            if (removeChannels) {
                try {
                    await removeProductChannelListingIterable(id, removeChannels);
                } catch (err) {
                    errors.concat(err);
                }
            }

            let product = await getGraphQLProductById(id);

            resolve({
                errors,
                productChannelListingErrors: errors,
                product
            });
        });
    });
}

function removeProductChannelListingIterable(productId, removeChannels) {
    return new Promise((resolve, reject) => {
        const numRemovedChannels = removeChannels.length;
        let cursor = -1;
        let errors = [];

        removeChannels.forEach(async channelId => {
            try {
                await removeProductChannelListing(productId, channelId);
            } catch (err) {
                errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numRemovedChannels) {
                if (errors.length > 0) return reject(errors)
                resolve();
            }
        }
    });
}

function removeProductChannelListing(productId, channelId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteProductChannelListing([productId, channelId], "product_id=$1 AND channel_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("removeChannel", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null, null).errors);

            productQueries.getProductVariant([productId], "product_id=$1", result => {
                if (result.err) return reject(getGraphQLOutput("removeChannel", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null, null).errors);
                let productVariants = result.res;
                const numVariants = productVariants.length;
                let cursor = -1;

                productVariants.forEach(variant => {
                    productQueries.deleteProductVariantChannelListing([channelId, variant.id], "channel_id=$1 AND variant_id=$2", result => {
                        checkComplete();
                    });
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numVariants) {
                        resolve();
                    }
                }
            });
        });
    });
}

function iterateProductChannelListing(productId, updateChannels) {
    return new Promise((resolve, reject) => {
        const numUpdateChannels = updateChannels.length;
        let cursor = -1;
        let errors = [];

        updateChannels.forEach(async updateChannel => {
            try {
                await assignOrUpdateProductChannelListing(productId, updateChannel);
            } catch (err) {
                errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numUpdateChannels) {
                if (errors.length > 0) return reject(errors)
                resolve();
            }
        }
    });
}

function assignOrUpdateProductChannelListing(productId, updateChannel) {
    return new Promise((resolve, reject) => {
        productQueries.getProductChannelListing([productId, updateChannel.channelId], "product_id=$1 AND channel_id=$2", async result => {
            if (result.err) return reject(getGraphQLOutput("channelId", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null, null).errors);
            if (result.res.length == 0) {
                try {
                    await assignProductChannelListing(productId, updateChannel);
                } catch (err) {
                    return reject(err);
                }
            } else {
                let listingId = result.res[0].id;
                try {
                    await updateProductChannelListing(listingId, productId, updateChannel);
                } catch (err) {
                    return reject(err);
                }
            }
            resolve();
        });
    });
}

function assignProductChannelListing(productId, updateChannel) {
    return new Promise((resolve, reject) => {
        kratosQueries.getChannel([updateChannel.channelId], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("channelId", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null, null).errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("channelId", "Channel not found", "NOT_FOUND", null, null, null, null, null).errors);

            let channel = result.res[0];

            let availableForPurchase = updateChannel.isAvailableForPurchase ? updateChannel.availableForPurchaseAt : null;

            let values = [
                updateChannel.publishedAt,
                updateChannel.isPublished,
                updateChannel.channelId,
                productId,
                null,
                channel.currency_code,
                updateChannel.visibleInListings,
                availableForPurchase
            ];
            productQueries.createProductChannelListing(values, async result => {
                if (result.err) return reject(getGraphQLOutput("updateChannel", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null, null).errors);

                let addVariants = updateChannel.addVariants;
                let removeVariants = updateChannel.removeVariants;
                let errors = [];

                if (addVariants) {
                    try {
                        await assignVariantsToChannelIterable(productId, updateChannel);
                    } catch (err) {
                        errors.concat(err);
                    }
                }

                if (removeVariants) {
                    try {
                        await removeVariantsFromChannelIterable(productId, updateChannel);
                    } catch (err) {
                        errors.concat(err);
                    }
                }

                if (errors.length > 0) return reject(errors);
                resolve();
            });
        });
    });
}

function assignVariantsToChannelIterable(productId, updateChannel) {
    return new Promise((resolve, reject) => {
        let addVariants = updateChannel.addVariants;
        const numVariants = addVariants.length;
        let cursor = -1;
        let errors = [];

        addVariants.forEach(async variantId => {
            try {
                await assignVariantToChannel(productId, updateChannel, variantId);
            } catch (err) {
                errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numVariants) {
                if (errors.length > 0) return reject(errors);
                resolve();
            }
        }
    });
}

function assignVariantToChannel(productId, updateChannel, variantId) {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariant([variantId, productId], "id=$1 AND product_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("addVariants", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null, null).errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("addVariants", "Invalid variant of product", "NOT_PRODUCTS_VARIANT", null, null, null, null, null).errors);

            let values = [
                variantId,
                updateChannel.channelId
            ];
            productQueries.updateProductVariantChannelListing(values, "channel_id=$2", "variant_id=$1", result => {
                if (result.err) return reject(getGraphQLOutput("addVariants", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null, null).errors);
                resolve();
            });
        });
    });
}

function removeVariantsFromChannelIterable(productId, updateChannel) {
    return new Promise((resolve, reject) => {
        let removeVariants = updateChannel.removeVariants;
        const numVariants = removeVariants.length;
        let cursor = -1;
        let errors = [];

        removeVariants.forEach(async variantId => {
            try {
                await removeVariantFromChannel(productId, updateChannel, variantId);
            } catch (err) {
                errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numVariants) {
                if (errors.length > 0) return reject(errors);
                resolve();
            }
        }
    });
}

function removeVariantFromChannel(productId, updateChannel, variantId) {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariant([variantId, productId], "id=$1 AND product_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("removeVariants", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null, null).errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("removeVariants", "Invalid variant of product", "NOT_PRODUCTS_VARIANT", null, null, null, null, null).errors);

            productQueries.deleteProductVariantChannelListing([updateChannel.channelId, variantId], "channel_id=$1 AND variant_id=$2", result => {
                if (result.err) return reject(getGraphQLOutput("removeVariants", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null, null).errors);
                resolve();
            });
        });
    });
}

function updateProductChannelListing(listingId, productId, updateChannel) {
    return new Promise((resolve, reject) => {
        kratosQueries.getChannel([updateChannel.channelId], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("channelId", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null, null).errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("channelId", "Channel not found", "NOT_FOUND", null, null, null, null, null).errors);

            let channel = result.res[0];

            let { values, set, whereClause } = getUpdateProductChannelListingValues(listingId, productId, channel, updateChannel);

            productQueries.updateProductChannelListing(values, set, whereClause, async result => {
                if (result.err) return reject(getGraphQLOutput("updateChannel", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null, null).errors);

                let addVariants = updateChannel.addVariants;
                let removeVariants = updateChannel.removeVariants;
                let errors = [];

                if (addVariants) {
                    try {
                        await assignVariantsToChannelIterable(productId, updateChannel);
                    } catch (err) {
                        errors.concat(err);
                    }
                }

                if (removeVariants) {
                    try {
                        await removeVariantsFromChannelIterable(productId, updateChannel);
                    } catch (err) {
                        errors.concat(err);
                    }
                }

                if (errors.length > 0) return reject(errors);
                resolve();
            });
        });
    });
}

function getUpdateProductChannelListingValues(listingId, productId, channel, updateChannel) {
    let values = [listingId, productId, channel.id, channel.currency_code];
    let whereClause = "id=$1";
    let set = "product_id=$2, channel_id=$3, currency=$4";
    let cursor = 4;

    if (updateChannel.isPublished != null) {
        values.push(isPublished);
        set += `, is_published=$${++cursor}`;
    }
    if (updateChannel.publishedAt != null) {
        values.push(publishedAt);
        set += `, publication_date=$${++cursor}`;
    }

    if (updateChannel.visibleInListings != null) {
        values.push(visibleInListings);
        set += `, visible_in_listings=$${++cursor}`;
    }

    if (updateChannel.isAvailableForPurchase) {
        let availableForPurchase = updateChannel.isAvailableForPurchase ? updateChannel.availableForPurchaseAt : null;
        values.push(availableForPurchase);
        set += `, available_for_purchase=$${++cursor}`;
    }

    return { values, set, whereClause };
}