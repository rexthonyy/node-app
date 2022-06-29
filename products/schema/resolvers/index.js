const product = require("./product");
const products = require("./products");
const productType = require("./productType");
const productTypes = require("./productTypes");

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
        productType,
        productTypes
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