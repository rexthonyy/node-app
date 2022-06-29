const product = require("./product");
const products = require("./products");
const productType = require("./productType");

const productCreate = require("./productCreate");
const productDelete = require("./productDelete");
const productBulkDelete = require("./productBulkDelete");
const productUpdate = require("./productUpdate");
const productTranslate = require("./productTranslate");
const productTypeCreate = require("./productTypeCreate");

module.exports = {
    Query: {
        product,
        products,
        productType
    },
    Mutation: {
        productCreate,
        productDelete,
        productBulkDelete,
        productUpdate,
        productTranslate,
        productTypeCreate,
    }
};