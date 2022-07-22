const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductById,
    getGraphQLWarehouseById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");
const kratosQueries = require("../../../postgres/kratos-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID"));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await updateWarehouse(authUser, args));
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

function updateWarehouse(authUser, args) {
    return new Promise(resolve => {
        let warehouseId = args.id;
        productQueries.getWarehouse([warehouseId], "id=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("getWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return reject(getGraphQLOutput("getWarehouse", "Warehouse not found", "NOT_FOUND"));
            let warehouse_ = result.res[0];

            let slug = args.input.slug;
            let name = args.input.name;
            let email = args.input.email;
            let clickAndCollectOption = args.input.clickAndCollectOption;
            let isPrivate = args.input.isPrivate;
            let address = args.input.address;

            let errors = [];
            let warehouse;

            try {
                if (slug) await updateWarehouseSlug(warehouseId, slug);
            } catch (err) {
                errors = errors.concat(err);
            }
            try {
                if (name) await updateWarehouseName(warehouseId, name);
            } catch (err) {
                errors = errors.concat(err);
            }
            try {
                if (email) await updateWarehouseEmail(warehouseId, email);
            } catch (err) {
                errors = errors.concat(err);
            }
            try {
                if (clickAndCollectOption) await updateWarehouseClickAndCollectOption(warehouseId, clickAndCollectOption);
            } catch (err) {
                errors = errors.concat(err);
            }
            try {
                if (isPrivate) await updateWarehouseIsPrivate(warehouseId, isPrivate);
            } catch (err) {
                errors = errors.concat(err);
            }
            try {
                if (address) await updateWarehouseAddress(warehouse_, address);
            } catch (err) {
                errors = errors.concat(err);
            }

            try {
                warehouse = await getGraphQLWarehouseById(warehouseId);
            } catch (err) {
                errors.push(getGraphQLOutput("getGraphQLWarehouseById", err, "NOT_FOUND").errors[0]);
            }

            resolve({
                errors,
                warehouseErrors: errors,
                warehouse
            });
        });
    });
}

function updateWarehouseSlug(warehouseId, slug) {
    return new Promise((resolve, reject) => {
        productQueries.getWarehouse([slug], "slug=$1", result => {
            if (result.err) return reject(getGraphQLOutput("getWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length > 0) return reject(getGraphQLOutput("getWarehouse", "Warehouse slug already assigned", "ALREADY_EXISTS").errors);
            productQueries.updateWarehouse([warehouseId, slug], "slug=$2", "id=$1", result => {
                if (result.err) return reject(getGraphQLOutput("updateWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                if (result.res.length == 0) return reject(getGraphQLOutput("updateWarehouse", "Warehouse slug not updated", "GRAPHQL_ERROR").errors);
                resolve();
            });
        });
    });
}

function updateWarehouseName(warehouseId, name) {
    return new Promise((resolve, reject) => {
        productQueries.updateWarehouse([warehouseId, name], "name=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateWarehouse", "Warehouse name not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseEmail(warehouseId, email) {
    return new Promise((resolve, reject) => {
        productQueries.updateWarehouse([warehouseId, email], "email=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateWarehouse", "Warehouse email not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseClickAndCollectOption(warehouseId, clickAndCollectOption) {
    return new Promise((resolve, reject) => {
        productQueries.updateWarehouse([warehouseId, clickAndCollectOption], "click_and_collect_option=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateWarehouse", "Warehouse clickAndCollectOption not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseIsPrivate(warehouseId, isPrivate) {
    return new Promise((resolve, reject) => {
        productQueries.updateWarehouse([warehouseId, isPrivate], "is_private=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateWarehouse", "Warehouse isPrivate not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseAddress(warehouse, address) {
    return new Promise(async(resolve, reject) => {

        let firstName = address.firstName;
        let lastName = address.lastName;
        let companyName = address.companyName;
        let streetAddress1 = address.streetAddress1;
        let streetAddress2 = address.streetAddress2;
        let city = address.city;
        let cityArea = address.cityArea;
        let postalCode = address.postalCode;
        let country = address.country;
        let countryArea = address.countryArea;
        let phone = address.phone;

        let errors = [];

        try {
            if (firstName) await updateWarehouseAddressFirstName(warehouse.address_id, firstName);
        } catch (err) {
            errors = errors.concat(err);
        }
        try {
            if (lastName) await updateWarehouseAddressLastName(warehouse.address_id, lastName);
        } catch (err) {
            errors = errors.concat(err);
        }
        try {
            if (companyName) await updateWarehouseAddressCompanyName(warehouse.address_id, companyName);
        } catch (err) {
            errors = errors.concat(err);
        }
        try {
            if (streetAddress1) await updateWarehouseAddressStreetAddress1(warehouse.address_id, streetAddress1);
        } catch (err) {
            errors = errors.concat(err);
        }
        try {
            if (streetAddress2) await updateWarehouseAddressStreetAddress2(warehouse.address_id, streetAddress2);
        } catch (err) {
            errors = errors.concat(err);
        }
        try {
            if (city) await updateWarehouseAddressCity(warehouse.address_id, city);
        } catch (err) {
            errors = errors.concat(err);
        }
        try {
            if (cityArea) await updateWarehouseAddressCityArea(warehouse.address_id, cityArea);
        } catch (err) {
            errors = errors.concat(err);
        }
        try {
            if (postalCode) await updateWarehouseAddressPostalCode(warehouse.address_id, postalCode);
        } catch (err) {
            errors = errors.concat(err);
        }
        try {
            if (country) await updateWarehouseAddressCountry(warehouse.address_id, country);
        } catch (err) {
            errors = errors.concat(err);
        }
        try {
            if (countryArea) await updateWarehouseAddressCountryArea(warehouse.address_id, countryArea);
        } catch (err) {
            errors = errors.concat(err);
        }
        try {
            if (phone) await updateWarehouseAddressPhone(warehouse.address_id, phone);
        } catch (err) {
            errors = errors.concat(err);
        }

        if (errors.length > 0) return reject(errors);
        resolve();
    });
}

function updateWarehouseAddressFirstName(addressId, firstName) {
    return new Promise((resolve, reject) => {
        kratosQueries.updateAccountAddress([addressId, firstName], "first_name=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAccountAddress", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAccountAddress", "Warehouse address firstName not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseAddressLastName(addressId, lastName) {
    return new Promise((resolve, reject) => {
        kratosQueries.updateAccountAddress([addressId, lastName], "last_name=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAccountAddress", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAccountAddress", "Warehouse address lastName not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseAddressCompanyName(addressId, companyName) {
    return new Promise((resolve, reject) => {
        kratosQueries.updateAccountAddress([addressId, companyName], "company_name=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAccountAddress", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAccountAddress", "Warehouse address companyName not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseAddressStreetAddress1(addressId, streetAddress1) {
    return new Promise((resolve, reject) => {
        kratosQueries.updateAccountAddress([addressId, streetAddress1], "street_address_1=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAccountAddress", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAccountAddress", "Warehouse address streetAddress1 not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseAddressStreetAddress2(addressId, streetAddress2) {
    return new Promise((resolve, reject) => {
        kratosQueries.updateAccountAddress([addressId, streetAddress2], "street_address_2=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAccountAddress", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAccountAddress", "Warehouse address streetAddress2 not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseAddressCity(addressId, city) {
    return new Promise((resolve, reject) => {
        kratosQueries.updateAccountAddress([addressId, city], "city=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAccountAddress", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAccountAddress", "Warehouse address city not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseAddressCityArea(addressId, cityArea) {
    return new Promise((resolve, reject) => {
        kratosQueries.updateAccountAddress([addressId, cityArea], "city_area=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAccountAddress", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAccountAddress", "Warehouse address cityArea not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseAddressPostalCode(addressId, postalCode) {
    return new Promise((resolve, reject) => {
        kratosQueries.updateAccountAddress([addressId, postalCode], "postal_code=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAccountAddress", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAccountAddress", "Warehouse address postalCode not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseAddressCountry(addressId, country) {
    return new Promise((resolve, reject) => {
        kratosQueries.updateAccountAddress([addressId, country], "country=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAccountAddress", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAccountAddress", "Warehouse address country not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseAddressCountryArea(addressId, countryArea) {
    return new Promise((resolve, reject) => {
        kratosQueries.updateAccountAddress([addressId, countryArea], "country_area=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAccountAddress", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAccountAddress", "Warehouse address countryArea not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function updateWarehouseAddressPhone(addressId, phone) {
    return new Promise((resolve, reject) => {
        kratosQueries.updateAccountAddress([addressId, phone], "phone=$2", "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("updateAccountAddress", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateAccountAddress", "Warehouse address phone not updated", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}