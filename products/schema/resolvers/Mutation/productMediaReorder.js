const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductById
} = require('../lib');
const kratosQueries = require("../../../postgres/kratos-queries");
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID"));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            try {
                resolve(await productMediaReorder(authUser, args));
            } catch (err) {
                reject(err);
            }
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID"));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, product, media) {
    return {
        errors: [{
            field,
            message,
            code,
            attributes,
            values,
        }],
        productErrors: [{
            field,
            message,
            code,
            attributes,
            values,
        }],
        product,
        media
    }
}

function productMediaReorder(authUser, args) {
    return new Promise((resolve, reject) => {
        let productId = args.productId;
        let mediaIds = args.mediaIds;

        let positionOrder = [];

        for (let i = 0; i < mediaIds.length; i++) {
            positionOrder.push({
                id: mediaIds[i],
                position: (i + 1)
            });
        }

        const numPositions = positionOrder.length;
        let count = -1;
        let errors = [];
        let product = [];
        let media = [];

        positionOrder.forEach(order => {
            productQueries.updateProductMedia([order.id, order.position, productId], "sort_order=$2", "id=$1 AND product_id=$3", async result => {
                if (result.err) errors.push(getGraphQLOutput("updateProductMedia", JSON.stringify(result.err), "GRAPHQL_ERROR").errors[0]);
                if (result.res.length == 0) errors.push(getGraphQLOutput("updateProductMedia", "Failed to update product media", "GRAPHQL_ERROR").errors[0]);
                let productmedia_ = result.res[0];
                try {
                    product.push(await getGraphQLProductById(productmedia_.product_id));
                } catch (err) {
                    errors.push(getGraphQLOutput("getGraphQLProductById", err, "GRAPHQL_ERROR").errors[0]);
                }
                try {
                    media.push(await getGraphQLProductMediaById(productmedia_.id));
                } catch (err) {
                    errors.push(getGraphQLOutput("getGraphQLProductById", err, "GRAPHQL_ERROR").errors[0]);
                }
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete() {
            count++;
            if (numPositions == count) {

                resolve({
                    status: "success",
                    message: "Positions updated successfully!"
                });
            }
        }
    });
}

function reorderProductVariant(move) {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariant([move.id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Variant not found");
            let productVariant = result.res[0];
            productVariant.sort_order = productVariant.sort_order || 0;
            productVariant.sort_order += move.sortOrder;
            productQueries.updateProductVariant([productVariant.id, productVariant.sort_order, new Date().toUTCString()], "sort_order=$2, updated_at=$3", "id=$1", result => {
                resolve();
            });
        });
    });
}