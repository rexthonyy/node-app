const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLAttributeById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", 0));

        let accessPermissions = ["MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await attributeBulkDelete(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES", "INVALID", 0));
        }
    });
}

function getGraphQLOutput(field, message, code, count) {
    return {
        errors: [{
            field,
            message,
            code,
        }],
        attributeErrors: [{
            field,
            message,
            code,
        }],
        count
    }
}

function attributeBulkDelete(authUser, args) {
    return new Promise(resolve => {
        let ids = args.ids;
        const numIds = ids.length;
        let cursor = -1;

        ids.forEach(async id => {
            await attributeDelete(id);
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numIds) {
                resolve({
                    errors: [],
                    attributeErrors: [],
                    count: numIds
                })
            }
        }
    });
}

function attributeDelete(id) {
    return new Promise(async resolve => {
        let errors = [];
        let attribute = null;

        try {
            attribute = await getGraphQLAttributeById(id);
        } catch (err) {
            console.log(err);
            errors.push(getGraphQLOutput("getGraphQLAttributeById", err, "NOT_FOUND", null).errors[0]);
        }

        try {
            await deleteAttributeValues(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteAttributeTranslations(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteAttributeVariant(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteAttributeProduct(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteAttributePage(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        try {
            await deleteAttribute(id);
        } catch (err) {
            console.log(err);
            errors.push(err.errors[0]);
        }

        let res = {
            errors,
            attributeErrors: errors,
            attribute
        };

        resolve(res);
    });
}


function deleteAttributeValues(attributeId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteAttributeValue([attributeId], "attribute_id=$1", async result => {
            if (result.err) { return resolve(); }
            if (result.res.length == 0) return resolve();
            let attributeValues = result.res;
            const numValues = attributeValues.length;
            let cursor = -1;

            attributeValues.forEach(async attributeValue => {
                try {
                    await deleteAssignedProductAttributeValue(attributeValue.id);
                    await deleteAttributeValueTranslation(attributeValue.id);
                    await deleteAssignedPageAttributeValue(attributeValue.id);
                    await deleteAssignedVariantAttributeValue(attributeValue.id);
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numValues) {
                    resolve();
                }
            }
        });
    });
}

function deleteAssignedProductAttributeValue(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAssignedProductAttributeValue([attributeValueId], "value_id=$1", result => {
            resolve();
        });
    });
}

function deleteAttributeValueTranslation(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAttributeValueTranslation([attributeValueId], "attribute_value_id=$1", result => {
            resolve();
        });
    });
}

function deleteAssignedPageAttributeValue(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAssignedPageAttributeValue([attributeValueId], "value_id=$1", async result => {
            resolve();
        });
    });
}



function deleteAssignedVariantAttributeValue(attributeValueId) {
    return new Promise(resolve => {
        productQueries.deleteAssignedVariantAttributeValue([attributeValueId], "value_id=$1", async result => {
            resolve();
        });
    });
}

function deleteAttributeTranslations(attributeId) {
    return new Promise(resolve => {
        productQueries.deleteAttributeTranslation([attributeId], "attribute_id=$1", async result => {
            resolve();
        });
    });
}




function deleteAttributeVariant(attributeId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteAttributeVariant([attributeId], "attribute_id=$1", result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            let attributeVariants = result.res;
            const numVariants = attributeVariants.length;
            let cursor = -1;

            attributeVariants.forEach(async attributeVariant => {
                try {
                    await deleteAssignedVariantAttribute(attributeVariant.id);
                } catch (err) {}
                checkComplete();
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
}

function deleteAssignedVariantAttribute(attributeVariantId) {
    return new Promise(resolve => {
        productQueries.deleteAssignedVariantAttribute([attributeVariantId], "assignment_id=$1", async result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            let assignedVariantAttributes = result.res;
            const numVariants = assignedVariantAttributes.length;
            let cursor = -1;

            assignedVariantAttributes.forEach(attributeVariant => {
                productQueries.deleteAssignedVariantAttributeValue([attributeVariant.id], "assignment_id=$1", async result => {
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

function deleteAttributeProduct(attributeId) {
    return new Promise(resolve => {
        productQueries.deleteAttributeProduct([attributeId], "attribute_id=$1", result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            let attributeProducts = result.res;
            const numProductAttrs = attributeProducts.length;
            let cursor = -1;

            attributeProducts.forEach(async attributeProduct => {
                try {
                    await deleteAssignedProductAttribute(attributeProduct.id);
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numProductAttrs) {
                    resolve();
                }
            }
        });
    });
}

function deleteAssignedProductAttribute(attributeProductId) {
    return new Promise(resolve => {
        productQueries.deleteAssignedProductAttribute([attributeProductId], "assignment_id=$1", result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            let attributeProducts = result.res;
            const numProductAttrs = attributeProducts.length;
            let cursor = -1;

            attributeProducts.forEach(async attributeProduct => {
                productQueries.deleteAssignedProductAttributeValue([attributeProduct.id], "assignment_id=$1", result => {
                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numProductAttrs) {
                    resolve();
                }
            }
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

function deleteAttributePage(attributeId) {
    return new Promise(resolve => {
        productQueries.deleteAttributePage([attributeId], "attribute_id=$1", result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            let attributePages = result.res;
            const numPageAttrs = attributePages.length;
            let cursor = -1;

            attributePages.forEach(async attributePage => {
                try {
                    await deleteAssignedPageAttribute(attributePage.id);
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numPageAttrs) {
                    resolve();
                }
            }
        });
    });
}

function deleteAssignedPageAttribute(pageAttributeId) {
    return new Promise(resolve => {
        productQueries.deleteAssignedPageAttribute([pageAttributeId], "assignment_id=$1", result => {
            if (result.err) { console.log(err); return resolve(); }
            if (result.res.length == 0) return resolve();
            let attributePages = result.res;
            const numPageAttrs = attributePages.length;
            let cursor = -1;

            attributePages.forEach(async attributePage => {
                productQueries.deleteAssignedPageAttributeValue([attributePage.id], "assignment_id=$1", result => {
                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numPageAttrs) {
                    resolve();
                }
            }
        });
    });
}



function deleteAttribute(attributeId) {
    return new Promise(resolve => {
        productQueries.deleteAttribute([attributeId], "id=$1", result => {
            resolve();
        });
    });
}