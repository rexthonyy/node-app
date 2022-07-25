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
    giftCardSettings,
    translations,
    translation,
    page,
    attribute,
    attributes,
    giftCard,
    giftCards,
    giftCardCurrencies,
    giftCardTags,
} = require('./Query');

const {
    productCreate,
    productDelete,
    productBulkDelete,
    productUpdate,
    productTranslate,
    productTypeCreate,
    productChannelListingUpdate,
    productMediaCreate,
    productVariantReorder,
    productTypeDelete,
    productTypeBulkDelete,
    productTypeUpdate,
    productTypeReorderAttributes,
    productReorderAttributeValues,
    productVariantCreate,
    productVariantDelete,
    productVariantBulkCreate,
    productVariantBulkDelete,
    productVariantStocksCreate,
    productVariantStocksDelete,
    productVariantStocksUpdate,
    productVariantUpdate,
    productVariantSetDefault,
    productVariantTranslate,
    productVariantChannelListingUpdate,
    productVariantReorderAttributeValues,
    productVariantPreorderDeactivate,
    attributeCreate,
    attributeUpdate,
    attributeDelete,
    attributeBulkDelete,
    pageCreate,
    pageTypeCreate,
    attributeTranslate,
    attributeValueCreate,
    attributeValueDelete,
    attributeValueBulkDelete,
    attributeValueUpdate,
    attributeValueTranslate,
    digitalContentCreate,
    digitalContentDelete,
    digitalContentUpdate,
    digitalContentUrlCreate,
    productMediaDelete,
    productMediaBulkDelete,
    productMediaReorder,
    productMediaUpdate,
    shippingPriceCreate,
    shippingZoneCreate,
    shippingZoneDelete,
    shippingZoneBulkDelete,
    shippingZoneUpdate,
    shippingPriceDelete,
    shippingPriceBulkDelete,
    shippingPriceUpdate,
    shippingPriceTranslate,
    shippingPriceExcludeProducts,
    shippingPriceRemoveProductFromExclude,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    assignWarehouseShippingZone,
    unassignWarehouseShippingZone,
    giftCardCreate,
    giftCardBulkCreate,
    giftCardActivate,
    giftCardDeactivate,
    giftCardUpdate,
    giftCardBulkActivate,
} = require('./Mutation');

const {
    collectionPrivateMetafield,
    collectionPrivateMetafields,
    collectionMetafield,
    collectionMetafields,
    collectionTranslation,
} = require('./Collection');

const {
    userPrivateMetafield,
    userPrivateMetafields,
    userMetafield,
    userMetafields,
    userGiftCards,
} = require('./User');

const {
    digitalContentPrivateMetafield,
    digitalContentPrivateMetafields,
    digitalContentMetafield,
    digitalContentMetafields,
} = require('./DigitalContent');

const {
    giftCardPrivateMetafield,
    giftCardPrivateMetafields,
    giftCardMetafield,
    giftCardMetafields,
    giftCardEvents,
} = require('./GiftCard');

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
    shippingZonePrivateMetafield,
    shippingZonePrivateMetafields,
    shippingZoneMetafield,
    shippingZoneMetafields,
} = require('./ShippingZone');

const {
    attributePrivateMetafield,
    attributePrivateMetafields,
    attributeMetafield,
    attributeMetafields,
    attributeTranslation,
    attributeChoices,
    attributeProductTypes,
    attributeProductVariantTypes,
} = require('./Attribute');

const {
    salePrivateMetafield,
    salePrivateMetafields,
    saleMetafield,
    saleMetafields,
    saleCategories,
    saleCollections,
    saleProducts,
    saleVariants,
    saleTranslation,
} = require('./Sale');

const {
    voucherPrivateMetafield,
    voucherPrivateMetafields,
    voucherMetafield,
    voucherMetafields,
    voucherCategories,
    voucherCollections,
    voucherProducts,
    voucherVariants,
    voucherTranslation,
} = require('./Voucher');

const {
    attributeValueTranslation
} = require('./AttributeValue');

const {
    attributeTranslatableContentTranslation
} = require('./AttributeTranslatableContent');

const {
    categoryTranslatableContentTranslation
} = require('./CategoryTranslatableContent');

const {
    menuitemTranslatableContentTranslation
} = require('./MenuItemTranslatableContent');

const {
    pageTranslatableContentTranslation
} = require('./PageTranslatableContent');

const {
    shippingMethodTranslatableContentTranslation
} = require('./ShippingMethodTranslatableContent');

const {
    pageTypePrivateMetafield,
    pageTypePrivateMetafields,
    pageTypeMetafield,
    pageTypeMetafields,
    pageTypeAvailableAttributes
} = require('./PageType');

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
        giftCardSettings,
        translations,
        translation,
        page,
        attribute,
        attributes,
        giftCard,
        giftCards,
        giftCardCurrencies,
        giftCardTags,
    },
    Mutation: {
        productCreate,
        productDelete,
        productBulkDelete,
        productUpdate,
        productTranslate,
        productTypeCreate,
        productChannelListingUpdate,
        productMediaCreate,
        productVariantReorder,
        productTypeDelete,
        productTypeBulkDelete,
        productTypeUpdate,
        productTypeReorderAttributes,
        productReorderAttributeValues,
        productVariantCreate,
        productVariantDelete,
        productVariantBulkCreate,
        productVariantBulkDelete,
        productVariantStocksCreate,
        productVariantStocksDelete,
        productVariantStocksUpdate,
        productVariantUpdate,
        productVariantSetDefault,
        productVariantTranslate,
        productVariantChannelListingUpdate,
        productVariantReorderAttributeValues,
        productVariantPreorderDeactivate,
        attributeCreate,
        attributeUpdate,
        attributeDelete,
        attributeBulkDelete,
        pageCreate,
        pageTypeCreate,
        attributeTranslate,
        attributeValueCreate,
        attributeValueDelete,
        attributeValueBulkDelete,
        attributeValueUpdate,
        attributeValueTranslate,
        digitalContentCreate,
        digitalContentDelete,
        digitalContentUpdate,
        digitalContentUrlCreate,
        productMediaDelete,
        productMediaBulkDelete,
        productMediaReorder,
        productMediaUpdate,
        shippingPriceCreate,
        shippingZoneCreate,
        shippingZoneDelete,
        shippingZoneBulkDelete,
        shippingZoneUpdate,
        shippingPriceDelete,
        shippingPriceBulkDelete,
        shippingPriceUpdate,
        shippingPriceTranslate,
        shippingPriceExcludeProducts,
        shippingPriceRemoveProductFromExclude,
        createWarehouse,
        updateWarehouse,
        deleteWarehouse,
        assignWarehouseShippingZone,
        unassignWarehouseShippingZone,
        giftCardCreate,
        giftCardBulkCreate,
        giftCardActivate,
        giftCardDeactivate,
        giftCardUpdate,
        giftCardBulkActivate,
    },
    Attribute: {
        privateMetafield: attributePrivateMetafield,
        privateMetafields: attributePrivateMetafields,
        metafield: attributeMetafield,
        metafields: attributeMetafields,
        translation: attributeTranslation,
        choices: attributeChoices,
        productTypes: attributeProductTypes,
        productVariantTypes: attributeProductVariantTypes,
    },
    AttributeValue: {
        translation: attributeValueTranslation,
    },
    AttributeValueTranslatableContent: {
        translation: attributeValueTranslation,
    },
    AttributeTranslatableContent: {
        translation: attributeTranslatableContentTranslation,
    },
    CategoryTranslatableContent: {
        translation: categoryTranslatableContentTranslation,
    },
    CollectionTranslatableContent: {
        translation: collectionTranslation,
    },
    MenuItemTranslatableContent: {
        translation: menuitemTranslatableContentTranslation,
    },
    PageTranslatableContent: {
        translation: pageTranslatableContentTranslation,
    },
    ProductTranslatableContent: {
        translation: productTranslation,
    },
    ProductVariantTranslatableContent: {
        translation: productVariantTranslation,
    },
    DigitalContent: {
        privateMetafield: digitalContentPrivateMetafield,
        privateMetafields: digitalContentPrivateMetafields,
        metafield: digitalContentMetafield,
        metafields: digitalContentMetafields,
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
        privateMetafield: collectionPrivateMetafield,
        privateMetafields: collectionPrivateMetafields,
        metafield: collectionMetafield,
        metafields: collectionMetafields,
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
    },
    ShippingZone: {
        privateMetafield: shippingZonePrivateMetafield,
        privateMetafields: shippingZonePrivateMetafields,
        metafield: shippingZoneMetafield,
        metafields: shippingZoneMetafields,
    },
    User: {
        privateMetafield: userPrivateMetafield,
        privateMetafields: userPrivateMetafields,
        metafield: userMetafield,
        metafields: userMetafields,
        giftCards: userGiftCards,
    },
    Sale: {
        privateMetafield: salePrivateMetafield,
        privateMetafields: salePrivateMetafields,
        metafield: saleMetafield,
        metafields: saleMetafields,
        categories: saleCategories,
        collections: saleCollections,
        products: saleProducts,
        variants: saleVariants,
        translation: saleTranslation,
    },
    SaleTranslatableContent: {
        translation: saleTranslation,
    },
    ShippingMethodTranslatableContent: {
        translation: shippingMethodTranslatableContentTranslation,
    },
    Voucher: {
        privateMetafield: voucherPrivateMetafield,
        privateMetafields: voucherPrivateMetafields,
        metafield: voucherMetafield,
        metafields: voucherMetafields,
        categories: voucherCategories,
        collections: voucherCollections,
        products: voucherProducts,
        variants: voucherVariants,
        translation: voucherTranslation,
    },
    VoucherTranslatableContent: {
        translation: voucherTranslation,
    },
    TranslatableItem: {
        __resolveType: parent => {
            return parent.__typename;
        }
    },
    PageType: {
        privateMetafield: pageTypePrivateMetafield,
        privateMetafields: pageTypePrivateMetafields,
        metafield: pageTypeMetafield,
        metafields: pageTypeMetafields,
        availableAttributes: pageTypeAvailableAttributes,
    },
    GiftCard: {
        privateMetafield: giftCardPrivateMetafield,
        privateMetafields: giftCardPrivateMetafields,
        metafield: giftCardMetafield,
        metafields: giftCardMetafields,
        events: giftCardEvents,
    }
};