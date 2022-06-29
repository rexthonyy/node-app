const {
    checkAuthorization,
    getGraphQLProductById,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('./lib');
const productQueries = require("../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productBulkDelete(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, product) {
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
        product
    }
}

function productBulkDelete(authUser, args) {
    let ids = args.ids;
    const numIds = ids.length;
    let cursor = -1;

    ids.forEach(async id => {
        await productDelete(id);
        checkComplete();
    });

    checkComplete();

    function checkComplete() {
        cursor++;
        if (cursor == numIds) {
            resolve({
                errors: [],
                productErrors: [],
                count: numIds
            });
        }
    }
}

function productDelete(id) {
    return new Promise(async resolve => {

        let errors = [];
        let product = null;

        try {
            product = await getGraphQLProductById(id);
        } catch (err) {
            console.log(err);
            errors.push(getGraphQLOutput("product", err, "NOT_FOUND", null, null, null).errors[0]);
        }

        try {
            await deleteProductVariant(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteProductTranslation(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteAssignedProductAttribute(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteAttributeValue(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteProductMedia(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteDiscountVoucherProduct(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteDiscountSaleProduct(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteProductCollection(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteProductGiftcard(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteProduct(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        resolve(product);
    });
}

function deleteProductVariant(id) {
    return new Promise((resolve, reject) => {
        productQueries.deleteProductVariant([id], "product_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            try {
                let productVariantId = result.res[0].id;
                await deleteAssignedVariantAttribute(productVariantId);
            } catch (err) {
                console.log(err);
            }
            resolve();
        });
    });
}

function deleteAssignedVariantAttribute(id) {
    return new Promise(resolve => {
        productQueries.deleteAssignedVariantAttribute([id], "variant_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            try {
                let assignedVariantId = result.res[0].id;
                await deleteAssignedVariantAttributeValue(assignedVariantId);
            } catch (err) {
                console.log(err);
            }
            resolve();
        });
    });
}

function deleteAssignedVariantAttributeValue(id) {
    return new Promise(resolve => {
        productQueries.deleteAssignedVariantAttributeValue([id], "assignment_id=$1", async result => {
            if (result.err) { console.log(err); }
            resolve();
        });
    });
}

function deleteProductTranslation(id) {
    return new Promise((resolve, reject) => {
        productQueries.deleteProductTranslation([id], "product_id=$1", result => {
            if (result.err) { console.log(err); return resolve(); }
            resolve();
        });
    });
}

function deleteAssignedProductAttribute(id) {
    return new Promise(resolve => {
        productQueries.deleteAssignedProductAttribute([id], "product_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            try {
                let assignedProductAttributeId = result.res[0].id;
                await deleteAssignedProductAttributeValue(assignedProductAttributeId);
            } catch (err) {
                console.log(err);
            }
            resolve();
        });
    });
}

function deleteAssignedProductAttributeValue(id) {
    return new Promise(resolve => {
        productQueries.deleteAssignedProductAttributeValue([id], "assignment_id=$1", result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            resolve();
        });
    });
}

function deleteAttributeValue(id) {
    return new Promise(resolve => {
        productQueries.deleteAttributeValue([id], "reference_product_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            let attributeValueId = result.res[0].id;
            try {
                await deleteAttributeValueTranslation(attributeValueId);
            } catch (err) {
                console.log(err);
            }
            try {
                await deleteAssignedPageAttributeValue(attributeValueId);
            } catch (err) {
                console.log(err);
            }
            resolve();
        });
    });
}

function deleteAttributeValueTranslation(id) {
    return new Promise(resolve => {
        productQueries.deleteAttributeValueTranslation([id], "attribute_value_id=$1", result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            resolve();
        });
    });
}

function deleteAssignedPageAttributeValue(id) {
    return new Promise(resolve => {
        productQueries.deleteAssignedPageAttributeValue([id], "value_id=$1", result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            resolve();
        });
    });
}

function deleteProductMedia(id) {
    return new Promise(resolve => {
        productQueries.deleteProductMedia([id], "product_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            let productMediaId = result.res[0].id;
            try {
                await deleteProductVariantMedia(productMediaId);
            } catch (err) {
                console.log(err);
            }
            resolve();
        });
    });
}

function deleteProductVariantMedia(id) {
    return new Promise(resolve => {
        productQueries.deleteProductVariantMedia([id], "media_id=$1", result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            resolve();
        });
    });
}

function deleteDiscountVoucherProduct(id) {
    return new Promise(resolve => {
        productQueries.deleteDiscountVoucherProduct([id], "product_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            resolve();
        });
    });
}

function deleteDiscountSaleProduct(id) {
    return new Promise(resolve => {
        productQueries.deleteDiscountSaleProduct([id], "product_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            resolve();
        });
    });
}

function deleteProductCollection(id) {
    return new Promise(resolve => {
        productQueries.deleteProductCollectionProduct([id], "product_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            resolve();
        });
    });
}

function deleteProductGiftcard(id) {
    return new Promise((resolve, reject) => {
        productQueries.deleteGiftCard([id], "product_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            let giftCardId = result.res[0].id;
            try {
                await deleteGiftCardEvent(giftCardId);
            } catch (err) {
                console.log(err);
            }
            try {
                await deleteGiftCardTags(giftCardId);
            } catch (err) {
                console.log(err);
            }
            try {
                await deleteCheckoutGiftCards(giftCardId);
            } catch (err) {
                console.log(err);
            }
            resolve();
        });
    });
}

function deleteGiftCardEvent(id) {
    return new Promise(resolve => {
        productQueries.deleteGiftCardEvent([id], "gift_card_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            resolve();
        });
    });
}

function deleteGiftCardTags(id) {
    return new Promise(resolve => {
        productQueries.deleteGiftCardTags([id], "giftcard_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            resolve();
        });
    });
}


function deleteCheckoutGiftCards(id) {
    return new Promise((resolve, reject) => {
        productQueries.deleteCheckoutGiftCards([id], "giftcard_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            resolve();
        });
    });
}

function deleteProduct(id) {
    return new Promise((resolve, reject) => {
        productQueries.deleteProduct([id], "id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            resolve();
        });
    });
}