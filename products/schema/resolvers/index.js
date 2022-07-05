const {
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
} = require('./Query');

const {
    productCreate,
    productDelete,
    productBulkDelete,
    productUpdate,
    productTranslate,
    productTypeCreate,
} = require('./Mutation');

const {
    collectionTranslation,
} = require('./Collection');

const {
    productPrivateMetafield,
    productPrivateMetafields,
    productMetafield,
    productMetafields,
    productTranslation,
    productMediaById,
} = require('./Product');

const {
    orderlineThumbnail,
} = require('./OrderLine');

const {
    warehousePrivateMetafield,
    warehousePrivateMetafields,
    warehouseMetafield,
    warehouseMetafields,
    warehouseShippingZones,
} = require('./Warehouse');

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
        privateMetafield: productPrivateMetafield,
        privateMetafields: productPrivateMetafields,
        metafield: productMetafield,
        metafields: productMetafields,
        translation: productTranslation,
        mediaById: productMediaById,
    },
    Collection: {
        translation: collectionTranslation,
    },
    OrderLine: {
        thumbnail: orderlineThumbnail
    },
    Warehouse: {
        privateMetafield: warehousePrivateMetafield,
        privateMetafields: warehousePrivateMetafields,
        metafield: warehouseMetafield,
        metafields: warehouseMetafields,
        shippingZones: warehouseShippingZones
    }
};