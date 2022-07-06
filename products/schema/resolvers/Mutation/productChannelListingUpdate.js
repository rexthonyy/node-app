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
    return new Promise(async resolve => {
        let id = args.id;
        productQueries.getProduct([id], "id=$1", result => {
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
                    await removeProductChannelListing(id, updateChannels);
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
        productQueries.getProductChannelListing([updateChannel.channelId], "channel_id=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("channelId", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null, null, null).errors);
            if (result.res.length == 0) {
                try {
                    await assignProductChannelListing(productId, updateChannel);
                } catch (err) {
                    return reject(err);
                }
            } else {
                try {
                    await updateProductChannelListing(productId, updateChannel);
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

    });
}

function updateProductSeoTitle(id, seo_title) {
    return new Promise((resolve, reject) => {
        productQueries.updateProduct([id, seo_title], "seo_title=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product seo_title", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductWeight(id, weight) {
    return new Promise((resolve, reject) => {
        productQueries.updateProduct([id, weight], "weight=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product weight", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductRating(id, rating) {
    return new Promise((resolve, reject) => {
        productQueries.updateProduct([id, rating], "rating=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product rating", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductCategory(id, category_id) {
    return new Promise((resolve, reject) => {
        productQueries.updateProduct([id, category_id], "category_id=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to update product category_id", "REQUIRED", null, null, null));
            resolve();
        });
    });
}

function updateProductCollections(id, collectionIds) {
    return new Promise((resolve, reject) => {
        productQueries.deleteCollectionProductProduct([id], "product_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("product", "Failed to delete collection product", "REQUIRED", null, null, null));

            const numCollections = collectionIds.length;
            let cursor = -1;

            collectionIds.forEach(collectionId => {
                productQueries.createCollectionProduct([collectionId, id, null], result => {
                    checkComplete();
                });
            })

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numCollections) {
                    resolve();
                }
            }
        });
    });
}

function updateProductAttributes(id, attributes) {
    return new Promise((resolve) => {
        if (attributes == null) return resolve();
        const numAttributes = attributes.length;
        let cursor = -1;

        attributes.forEach(async attr => {
            await addAttribute(id, attr);
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numAttributes) {
                resolve();
            }
        }
    });
}

function addAttribute(productId, attr) {
    return new Promise(async resolve => {

        let productAttributes = [];
        if (attr.id) {
            productAttributes = await getProductAttributesById(attr.id);
        } else if (attr.values) {
            productAttributes = await getProductAttributesByValues(attr.values);
        }

        productQueries.deleteAttributeValue([productId], "reference_product_id=$1", result => {
            const numAttributes = productAttributes.length;
            let cursor = -1;

            productAttributes.forEach(attribute => {
                let attributeId = attribute.id;
                let file = attr.file;
                let contentType = attr.contentType;
                let references = attr.references;
                let richText = attr.richText;
                let boolean = attr.boolean;
                let date = attr.date;
                let dateTime = attr.dateTime;

                let input = [
                    attribute.name,
                    attributeId,
                    attribute.slug,
                    null,
                    "",
                    contentType,
                    file,
                    richText,
                    boolean,
                    dateTime,
                    null,
                    productId
                ];

                productQueries.createAttributeValue(input, async result => {
                    try {
                        checkComplete();
                    } catch (err) {
                        console.log(err);
                        checkComplete();
                    }
                });
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAttributes) {
                    resolve();
                }
            }
        });
    });
}


function getProductAttributesById(attributeId) {
    return new Promise(resolve => {
        productQueries.getAttribute([attributeId], "id=$1", result => {
            if (result.err || result.res.length == 0) return resolve([]);
            resolve(result.res);
        });
    });
}

function getProductAttributesByValues(values) {
    return new Promise(resolve => {
        const numValues = values.length;
        let cursor = -1;
        let productAttributes = [];

        values.forEach(value => {
            productQueries.getProduct([value], "slug=$1", async result => {
                if (result.err || result.res.length == 0) {
                    try {
                        let attribute = await createProductAttribute(value);
                        productAttributes.push(attribute);
                        checkComplete();
                    } catch (err) {
                        console.log(err);
                        checkComplete();
                    }
                } else {
                    productAttributes.push(result.res[0]);
                    checkComplete();
                }
            });
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numValues) {
                resolve(productAttributes);
            }
        }
    });
}

function createProductAttribute(value) {
    return new Promise((resolve, reject) => {
        let metadata = [{
            key: "",
            value: ""
        }];
        let private_metadata = [{
            key: "",
            value: ""
        }];

        let values = [
            value,
            value.replace("-", " "),
            JSON.stringify(metadata),
            JSON.stringify(private_metadata),
            "DROPDOWN",
            false,
            false,
            false,
            false,
            false,
            1,
            false,
            "PRODUCT_TYPE",
            "PRODUCT",
            null
        ];
        productQueries.createAttribute(values, result => {
            if (result.err || result.res.length == 0) { console.log(result.err); return reject("Failed to create attribute") };
            resolve(result.res[0]);
        });
    });
}