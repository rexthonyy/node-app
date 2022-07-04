const product = require("./product");
const products = require("./products");
const productType = require("./productType");
const productTypes = require("./productTypes");
const productVariant = require("./productVariant");
const productVariants = require("./productVariants");
const payment = require("./payment");
const warehouse = require("./warehouse");
const warehouses = require("./warehouses");
const stock = require("./stock");
const stocks = require("./stocks");
const shippingZone = require("./shippingZone");
const shippingZones = require("./shippingZones");
const digitalContent = require("./digitalContent");
const digitalContents = require("./digitalContents");
const categories = require("./categories");
const category = require("./category");
const collection = require("./collection");
const collections = require("./collections");
const orderSettings = require("./orderSettings");
const collectionTranslation = require("./collectionTranslation");
const productTranslation = require("./productTranslation");

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
        warehouses,
        stock,
        stocks,
        shippingZone,
        shippingZones,
        digitalContent,
        digitalContents,
        categories,
        category,
        collection,
        collections,
        orderSettings,
    },
    Mutation: {
        productCreate,
        productDelete,
        productBulkDelete,
        productUpdate,
        productTranslate,
        productTypeCreate,
    },
    Product: {
        translation: productTranslation
    },
    Collection: {
        translation: collectionTranslation,
    }
};