const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductVariantById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, 0));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productVariantBulkDelete(args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, 0));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, count) {
    return {
        errors: [{
            field,
            message,
            code,
            attributes,
            values
        }],
        productErrors: [{
            field,
            message,
            code,
            attributes,
            values
        }],
        count
    }
}

function productVariantBulkDelete(args) {
    let ids = args.ids;
    let errors = [];

    const numIds = ids.length;
    let cursor = -1;

    ids.forEach(async id => {
        try {
            await productVariantDelete(id);
        } catch (err) {
            errors.concat(err);
        }
        checkComplete();
    });

    checkComplete();

    function checkComplete() {
        cursor++;
        if (cursor == numIds) {
            resolve({
                errors,
                productErrors: errors,
                count: numIds
            });
        }
    }
}

function productVariantDelete(productVariantId) {
    return new Promise(async(resolve, reject) => {
        let productVariant;

        try {
            productVariant = await getGraphQLProductVariantById(productVariantId);
        } catch (err) {
            return reject(getGraphQLOutput("productVariantId", err, "NOT_FOUND", null, null, null));
        }

        try {
            await deleteProductVariant(productVariant, productVariantId);
        } catch (err) {
            return reject(err);
        }

        try {
            await deleteProductVariantAttribute(productVariantId, productVariant);
        } catch (err) {
            return reject(err);
        }

        try {
            await deleteProductVariantTranslation(productVariantId, productVariant);
        } catch (err) {
            return reject(err);
        }

        try {
            await deleteProductVariantMedia(productVariantId, productVariant);
        } catch (err) {
            return reject(err);
        }

        try {
            await deleteProductVariantDigitalContent(productVariantId, productVariant);
        } catch (err) {
            return reject(err);
        }

        try {
            await deleteProductVariantDiscountVoucher(productVariantId, productVariant);
        } catch (err) {
            return reject(err);
        }

        try {
            await deleteProductVariantDiscountSale(productVariantId, productVariant);
        } catch (err) {
            return reject(err);
        }

        try {
            await deleteProductVariantChannelListing(productVariantId, productVariant);
        } catch (err) {
            return reject(err);
        }

        try {
            await deleteProductVariantWarehouseStock(productVariantId, productVariant);
        } catch (err) {
            return reject(err);
        }

        try {
            await deleteProductVariantCheckoutLine(productVariantId, productVariant);
        } catch (err) {
            return reject(err);
        }

        resolve({
            errors: [],
            productErrors: [],
            productVariant
        });
    });
}

function deleteProductVariant(productVariant, productVariantId) {
    return new Promise((resolve, reject) => {
        if (productVariant.product.defaultVariant.id == productVariantId) return reject(getGraphQLOutput("id", "Cannot delete default product variant", "CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT", null, null, productVariant));
        productQueries.getProductVariant([productVariantId], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("id", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, productVariant));
            if (result.res.length == 0) return reject(getGraphQLOutput("id", "Product variant not found", "NOT_FOUND", null, null, productVariant));
            let variant = result.res[0];
            if (variant.is_preorder) return reject(getGraphQLOutput("id", "Cannot delete pre order variant", "PREORDER_VARIANT_CANNOT_BE_DEACTIVATED", null, null, productVariant));
            productQueries.deleteProductVariant([productVariantId], "id=$1", result => {
                resolve();
            });
        });
    });
}

function deleteProductVariantAttribute(productVariantId, productVariant) {
    return new Promise((resolve, reject) => {
        productQueries.getAssignedVariantAttribute([productVariantId], "variant_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("id", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, productVariant));
            let assignedVariantAttributes = result.res;
            const numAssignedAttributes = assignedVariantAttributes.length;
            let cursor = -1;

            assignedVariantAttributes.forEach(variantAttribute => {
                productQueries.deleteAssignedVariantAttributeValue([variantAttribute.id], "assignment_id=$1", result => {
                    productQueries.deleteAssignedVariantAttribute([variantAttribute.id], "id=$1", result => {
                        checkComplete();
                    });
                });
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAssignedAttributes) {
                    resolve();
                }
            }
        });
    });
}

function deleteProductVariantTranslation(productVariantId, productVariant) {
    return new Promise((resolve, reject) => {
        productQueries.deleteProductVariantTranslation([productVariantId], "product_variant_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("id", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, productVariant));
            resolve();
        });
    });
}

function deleteProductVariantMedia(productVariantId, productVariant) {
    return new Promise((resolve, reject) => {
        productQueries.deleteProductVariantMedia([productVariantId], "variant_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("id", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, productVariant));
            resolve();
        });
    });
}

function deleteProductVariantDigitalContent(productVariantId, productVariant) {
    return new Promise((resolve, reject) => {
        productQueries.getDigitalContent([productVariantId], "product_variant_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("id", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, productVariant));
            let digitalContents = result.res;
            const numDigitalContents = digitalContents.length;
            let cursor = -1;

            digitalContents.forEach(digitalContent => {
                productQueries.deleteDigitalContentUrl([digitalContent.id], "content_id=$1", result => {
                    productQueries.deleteDigitalContent([digitalContent.id], "id=$1", result => {
                        checkComplete();
                    });
                });
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numDigitalContents) {
                    resolve();
                }
            }
        });
    });
}

function deleteProductVariantDiscountVoucher(productVariantId, productVariant) {
    return new Promise((resolve, reject) => {
        productQueries.deleteDiscountVoucherVariants([productVariantId], "productvariant_id=$1", result => {
            resolve();
        });
    });
}

function deleteProductVariantDiscountSale(productVariantId, productVariant) {
    return new Promise((resolve, reject) => {
        productQueries.deleteDiscountSaleVariants([productVariantId], "productvariant_id=$1", result => {
            resolve();
        });
    });
}

function deleteProductVariantChannelListing(productVariantId, productVariant) {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariantChannelListing([productVariantId], "variant_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("id", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, productVariant));
            let productVariantChannelListings = result.res;
            const numVariantChannelListings = productVariantChannelListings.length;
            let cursor = -1;

            productVariantChannelListings.forEach(async channelListing => {
                try {
                    await deleteWarehousePreorderAllocation(channelListing.id);
                } catch (err) {
                    console.log(err);
                }
                try {
                    await deleteWarehousePreorderReservation(channelListing.id);
                } catch (err) {
                    console.log(err);
                }

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numVariantChannelListings) {
                    productQueries.deleteProductVariantChannelListing([productVariantId], "variant_id=$1", result => {
                        resolve();
                    });
                }
            }
        });
    });
}

function deleteWarehousePreorderAllocation(channelListingId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteWarehousePreorderAllocation([channelListingId], "product_variant_channel_listing_id=$1", result => {
            resolve();
        });
    });
}

function deleteWarehousePreorderReservation(channelListingId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteWarehousePreorderReservation([channelListingId], "product_variant_channel_listing_id=$1", result => {
            resolve();
        });
    });
}

function deleteProductVariantWarehouseStock(productVariantId, productVariant) {
    return new Promise((resolve, reject) => {
        productQueries.getStock([productVariantId], "product_variant_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("id", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, productVariant));
            let stocks = result.res;
            const numStocks = stocks.length;
            let cursor = -1;

            stocks.forEach(async stock => {
                try {
                    await deleteWarehouseAllocation(stock.id);
                } catch (err) {
                    console.log(err);
                }
                try {
                    await deleteWarehouseReservation(stock.id);
                } catch (err) {
                    console.log(err);
                }

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numStocks) {
                    productQueries.deleteStock([productVariantId], "product_variant_id=$1", result => {
                        resolve();
                    });
                }
            }
        });
    });
}

function deleteWarehouseAllocation(stockId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteWarehouseAllocation([stockId], "stock_id=$1", result => {
            resolve();
        });
    });
}

function deleteWarehouseReservation(stockId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteWarehouseReservation([stockId], "stock_id=$1", result => {
            resolve();
        });
    });
}

function deleteProductVariantCheckoutLine(productVariantId, productVariant) {
    return new Promise((resolve, reject) => {
        productQueries.deleteCheckoutLine([productVariantId], "variant_id=$1", result => {
            resolve();
        });
    });
}