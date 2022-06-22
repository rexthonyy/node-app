const product = require("./product");
const products = require("./products");
const service = require("./service");
const services = require("./services");

const productCreate = require("./productCreate");
const productDelete = require("./productDelete");
const productBulkDelete = require("./productBulkDelete");
const productUpdate = require("./productUpdate");
const productTranslate = require("./productTranslate");

module.exports = {
    Query: {
        product,
        products,
        service,
        services
    },
    Mutation: {
        productCreate,
        productDelete,
        productBulkDelete,
        productUpdate,
        productTranslate,
    }
};