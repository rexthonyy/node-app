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
    paymentPrivateMetafield,
    paymentPrivateMetafields,
    paymentMetafield,
    paymentMetafields,
} = require('./Payment');

const {
    productPrivateMetafield,
    productPrivateMetafields,
    productMetafield,
    productMetafields,
    productTranslation,
    productMediaById,
    productThumbnail,
    productPricing,
    productIsAvailable,
} = require('./Product');

const {
    productVariantPrivateMetafield,
    productVariantPrivateMetafields,
    productVariantMetafield,
    productVariantMetafields,
    productVariantPricing,
    productVariantAttributes,
    productVariantTranslation,
    productVariantRevenue,
    productVariantStocks,
    productVariantQuantityAvailable,
} = require('./ProductVariant');

const {
    productTypePrivateMetafield,
    productTypePrivateMetafields,
    productTypeMetafield,
    productTypeMetafields,
    productTypeAssignedVariantAttributes,
} = require('./ProductType');

const {
    productMediaUrl,
} = require('./ProductMedia');

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

const {
    attributeTranslation,
} = require('./Attribute');

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
    Attribute: {
        translation: attributeTranslation,
    },
    Payment: {
        privateMetafield: paymentPrivateMetafield,
        privateMetafields: paymentPrivateMetafields,
        metafield: paymentMetafield,
        metafields: paymentMetafields,
    },
    Product: {
        privateMetafield: productPrivateMetafield,
        privateMetafields: productPrivateMetafields,
        metafield: productMetafield,
        metafields: productMetafields,
        translation: productTranslation,
        mediaById: productMediaById,
        thumbnail: productThumbnail,
        pricing: productPricing,
        isAvailable: productIsAvailable,
    },
    ProductVariant: {
        privateMetafield: productVariantPrivateMetafield,
        privateMetafields: productVariantPrivateMetafields,
        metafield: productVariantMetafield,
        metafields: productVariantMetafields,
        pricing: productVariantPricing,
        attributes: productVariantAttributes,
        revenue: productVariantRevenue,
        stocks: productVariantStocks,
        quantityAvailable: productVariantQuantityAvailable,
        translation: productVariantTranslation,
    },
    ProductType: {
        privateMetafield: productTypePrivateMetafield,
        privateMetafields: productTypePrivateMetafields,
        metafield: productTypeMetafield,
        metafields: productTypeMetafields,
        assignedVariantAttributes: productTypeAssignedVariantAttributes,
    },
    ProductMedia: {
        url: productMediaUrl
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