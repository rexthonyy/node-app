const product = require("./product");
const products = require("./products");
const productType = require("./productType");
const productTypes = require("./productTypes");
const productVariant = require("./productVariant");
const productVariants = require("./productVariants");
const payment = require("./payment");
const warehouse = require("./warehouse");

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
        productTypes,
        productVariant,
        productVariants,
        payment,
        warehouse,
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