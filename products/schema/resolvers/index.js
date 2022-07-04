const product = require("./Query/product");
const products = require("./Query/products");
const productType = require("./Query/productType");
const productTypes = require("./Query/productTypes");
const productVariant = require("./Query/productVariant");
const productVariants = require("./Query/productVariants");
const payment = require("./Query/payment");
const warehouse = require("./Query/warehouse");
const warehouses = require("./Query/warehouses");
const stock = require("./Query/stock");
const stocks = require("./Query/stocks");
const shippingZone = require("./Query/shippingZone");
const shippingZones = require("./Query/shippingZones");
const digitalContent = require("./Query/digitalContent");
const digitalContents = require("./Query/digitalContents");
const categories = require("./Query/categories");
const category = require("./Query/category");
const collection = require("./Query/collection");
const collections = require("./Query/collections");
const orderSettings = require("./Query/orderSettings");
const collectionTranslation = require("./Collection/translation");
const productTranslation = require("./Product/translation");
const productMediaById = require("./Product/mediaById");
const orderlineThumbnail = require("./OrderLine/thumbnail");

const productCreate = require("./Mutation/productCreate");
const productDelete = require("./Mutation/productDelete");
const productBulkDelete = require("./Mutation/productBulkDelete");
const productUpdate = require("./Mutation/productUpdate");
const productTranslate = require("./Mutation/productTranslate");
const productTypeCreate = require("./Mutation/productTypeCreate");

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
        translation: productTranslation,
        mediaById: productMediaById,
    },
    Collection: {
        translation: collectionTranslation,
    },
    OrderLine: {
        thumbnail: orderlineThumbnail
    }
};