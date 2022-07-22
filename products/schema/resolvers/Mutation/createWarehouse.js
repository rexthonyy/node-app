const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLWarehouseById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");
const kratosQueries = require('../../../postgres/kratos-queries');
const { uuid } = require('uuidv4');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID"));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await createWarehouse(args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID"));
        }
    });
}

function getGraphQLOutput(field, message, code, warehouse) {
    return {
        errors: [{
            field,
            message,
            code
        }],
        warehouseErrors: [{
            field,
            message,
            code
        }],
        warehouse
    }
}

function createWarehouse(args) {
    return new Promise(resolve => {
        let name = args.input.name;
        let email = args.input.email || "";
        let slug = args.input.slug || name.toLowerCase().replace(" ", "-");
        productQueries.getWarehouse([slug], "slug=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length > 0) return resolve(getGraphQLOutput("getWarehouse", "Slug already assigned", "ALREADY_EXISTS"));

            let addressId;

            try {
                addressId = await createAccountAddress(args.input.address);
            } catch (err) {
                return resolve(getGraphQLOutput("createAccountAddress", err, "GRAPHQL_ERROR"));
            }

            let id = uuid();
            console.log(id);
            let values = [
                id,
                name,
                email,
                addressId,
                slug,
                JSON.stringify({}),
                JSON.stringify({}),
                "disabled",
                false
            ];

            productQueries.createWarehouse(values, async result => {
                if (result.err) return resolve(getGraphQLOutput("createWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR"));
                if (result.res.length == 0) return resolve(getGraphQLOutput("createWarehouse", "Warehouse not created", "GRAPHQL_ERROR"));
                let warehouseId = result.res[0].id;
                let shippingZones = args.input.shippingZones;
                let errors = [];
                if (shippingZones) {
                    try {
                        await addWarehouseShippingZones(warehouseId, shippingZones);
                    } catch (err) {
                        errors = err;
                    }
                }

                try {
                    let warehouse = await getGraphQLWarehouseById(warehouseId);
                    resolve({
                        errors,
                        warehouseErrors: errors,
                        warehouse
                    });
                } catch (err) {
                    return resolve(getGraphQLOutput("getWarehouseShippingZones", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                }
            });
        });
    });
}

function createAccountAddress(address) {
    return new Promise((resolve, reject) => {
        let firstName = address.firstName || "";
        let lastName = address.lastName || "";
        let companyName = address.companyName || "";
        let streetAddress1 = address.streetAddress1 || "";
        let streetAddress2 = address.streetAddress2 || "";
        let city = address.city || "";
        let cityArea = address.cityArea || "";
        let postalCode = address.postalCode || "";
        let country = address.country || "";
        let countryArea = address.countryArea || "";
        let phone = address.phone || "";

        let values = [
            firstName,
            lastName,
            companyName,
            streetAddress1,
            streetAddress2,
            city,
            postalCode,
            country,
            countryArea,
            phone,
            cityArea
        ];

        kratosQueries.createAccountAddress(values, result => {
            if (result.err) return reject(getGraphQLOutput("createAccountAddress", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return reject(getGraphQLOutput("createAccountAddress", "Warehouse address not created", "GRAPHQL_ERROR"));
            let address_ = result.res[0];
            resolve(address_.id);
        });
    });
}

function addWarehouseShippingZones(warehouseId, shippingZones) {
    return new Promise((resolve, reject) => {
        const numShippingZones = shippingZones.length;
        let cursor = -1;
        let errors = [];

        shippingZones.forEach(async shippingZoneId => {
            try {
                await addWarehouseShippingZone(warehouseId, shippingZoneId);
            } catch (err) {
                errors = errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numShippingZones) {
                if (errors.length > 0) return reject(errors);
                resolve();
            }
        }
    });
}

function addWarehouseShippingZone(warehouseId, shippingZoneId) {
    return new Promise(async(resolve, reject) => {
        productQueries.getWarehouseShippingZones([warehouseId, shippingZoneId], "warehouse_id=$1 AND shippingzone_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("getWarehouseShippingZones", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length > 0) return reject(getGraphQLOutput("getWarehouseShippingZones", `Warehouse shipping zone already exists: ${shippingZoneId}`, "ALREADY_EXISTS").errors);
            productQueries.createWarehouseShippingZone([warehouseId, shippingZoneId], result => {
                if (result.err) return reject(getGraphQLOutput("createWarehouseShippingZone", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                if (result.res.length == 0) return reject(getGraphQLOutput("createWarehouseShippingZone", `Warehouse shipping zone not created: ${shippingZoneId}`, "GRAPHQL_ERROR").errors);
                resolve();
            });
        });
    });
}