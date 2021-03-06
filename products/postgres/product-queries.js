const { Pool, Client } = require('pg');
const { db } = require('../libs/consts');

const pool = new Pool({
    user: process.env.POSTGRES_PRODUCTS_USER,
    host: process.env.POSTGRES_PRODUCTS_HOST,
    database: process.env.POSTGRES_PRODUCTS_DB,
    password: process.env.POSTGRES_PRODUCTS_PASSWORD,
    port: process.env.POSTGRES_PRODUCTS_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log(`${process.env.POSTGRES_PRODUCTS_DB} database initialization failed!!!`);
    } else {
        console.log(`${process.env.POSTGRES_PRODUCTS_DB} database initialized successfully!!!`);
    }
});

const client = new Client({
    user: process.env.POSTGRES_PRODUCTS_USER,
    host: process.env.POSTGRES_PRODUCTS_HOST,
    database: process.env.POSTGRES_PRODUCTS_DB,
    password: process.env.POSTGRES_PRODUCTS_PASSWORD,
    port: process.env.POSTGRES_PRODUCTS_PORT
});
client.connect();

const stop = () => {
    return new Promise(resolve => {
        client.end().then(() => {
            console.log(`${process.env.POSTGRES_PRODUCTS_DB} database disconnection successful!!!`);
            resolve();
        }).catch(err => {
            console.log(`${process.env.POSTGRES_PRODUCTS_DB} database disconnection failed!!!`);
            console.log(err);
            resolve();
        });
    });
};

const get = (table, columns, values, whereClause, response) => {
    pool.query(`SELECT ${columns} from ${table} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getProduct = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_product} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getProductType = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_producttype} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAttribute = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_attribute} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAttributeProduct = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_attributeproduct} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAttributeValue = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_attributevalue} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getCategory = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_category} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getCategoryTranslation = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_categorytranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getProductTranslation = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_producttranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getProductVariant = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_productvariant} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getOrderLine = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.order_orderline} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getProductVariantChannelListing = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_productvariantchannellisting} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAttributeAssignedVariantAttribute = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_assignedvariantattribute} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAttributeVariant = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_attributevariant} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAssignedVariantAttribute = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_assignedvariantattribute} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAssignedVariantAttributeValue = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_assignedvariantattributevalue} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountSaleVariants = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_sale_variants} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountSale = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_sale} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountSaleCategories = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_sale_categories} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountSaleChannelListing = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_salechannellisting} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getPayment = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.payment_payment} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getCheckout = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.checkout_checkout} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getShippingMethod = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.shipping_shippingmethod} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getShippingMethodTranslationByShippingMethodId = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.shipping_shippingmethodtranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getShippingMethodTranslation = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.shipping_shippingmethodtranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getWarehouse = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.warehouse_warehouse} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getGiftCard = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.giftcard_giftcard} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getGiftCardTags = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.giftcard_giftcard_tags} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getGiftCardTag = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.giftcard_giftcardtag} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAppExtensions = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.app_appextension} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getOrder = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.order_order} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getOrderFulfillment = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.order_fulfillment} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getOrderFulfillmentLine = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.order_fulfillmentline} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDigitalContentUrl = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_digitalcontenturl} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDigitalContent = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_digitalcontent} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getPaymentTransaction = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.payment_transaction} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getCheckoutGiftCardsByCheckoutId = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.checkout_checkout_gift_cards} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getStock = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.warehouse_stock} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getShippingZone = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.shipping_shippingzone} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getWarehouseShippingZones = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.warehouse_warehouse_shipping_zones} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getShippingZoneChannel = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.shipping_shippingzone_channels} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getShippingMethodPostalCodeRule = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.shipping_shippingmethodpostalcoderule} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getCollection = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_collection} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getCollectionChannelListing = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_collectionchannellisting} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getSiteSettings = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.site_sitesettings} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getCollectionTranslation = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_collectiontranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getProductMedia = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_productmedia} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getProductVariantTranslation = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_productvarianttranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getCollectionProduct = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_collectionproduct} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getProductChannelListing = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_productchannellisting} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAssignedProductAttribute = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_assignedproductattribute} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAssignedProductAttributeValue = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_assignedproductattributevalue} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAttributeValueTranslation = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_attributevaluetranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAttributeTranslation = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_attributetranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getMenu = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.menu_menu} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getMenuItem = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.menu_menuitem} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getMenuItemTranslation = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.menu_menuitemtranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getPage = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.page_page} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getPageTranslation = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.page_pagetranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getPageType = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.page_pagetype} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAttributePage = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_attributepage} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAssignedPageAttribute = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_assignedpageattribute} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountSaleTranslation = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_saletranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountSaleCollection = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_sale_collections} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountSaleProducts = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_sale_products} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountVoucher = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_voucher} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountVoucherTranslation = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_vouchertranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountVoucherChannelListing = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_voucherchannellisting} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountVoucherCategories = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_voucher_categories} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountVoucherCollection = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_voucher_collections} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountVoucherProduct = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_voucher_products} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDiscountVoucherVariant = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.discount_voucher_variants} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getShippingMethodExcludedProducts = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.shipping_shippingmethod_excluded_products} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};








const createProduct = (values, response) => {
    client.query(`INSERT INTO ${db.product_product} (name, description, updated_at, product_type_id, category_id, seo_description, seo_title, charge_taxes, weight, metadata, private_metadata, slug, default_variant_id, description_plaintext, rating, search_document) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createProductType = (values, response) => {
    client.query(`INSERT INTO ${db.product_producttype} (name, has_variant, is_shipping_required, weight, is_digital, metadata, private_metadata, slug, kind) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAttribute = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_attribute} (slug, name, metadata, private_metadata, input_type, available_in_grind, visible_in_storefront, filterable_in_dashboard, filterable_in_storefront, value_required, storefront_search_position, is_variant_only, type, entity_type, unit) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAttributeProduct = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_attributeproduct} (attribute_id, product_type_id, sort_order) VALUES($1, $2, $3) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAssignedProductAttribute = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_assignedproductattribute} (product_id, assignment_id) VALUES($1, $2) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAssignedProductAttributeValue = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_assignedproductattributevalue} (sort_order, assignment_id, value_id) VALUES($1, $2, $3) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAttributeVariant = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_attributevariant} (attribute_id, product_type_id, sort_order, variant_selection) VALUES($1, $2, $3, $4) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createProductVariant = (values, response) => {
    client.query(`INSERT INTO ${db.product_productvariant} (sku, name, product_id, track_inventory, weight, metadata, private_metadata, sort_order, is_preorder, preorder_end_date, preorder_global_threshold, quantity_limit_per_customer, created, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createCollectionProduct = (values, response) => {
    client.query(`INSERT INTO ${db.product_collectionproduct} (collection_id, product_id, sort_order) VALUES($1, $2, $3) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAttributeValue = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_attributevalue} (name, attribute_id, slug, sort_order, value, content_type, file_url, rich_text, boolean, date_time, reference_page_id, reference_product_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createProductTranslation = (values, response) => {
    client.query(`INSERT INTO ${db.product_producttranslation} (seo_title, seo_description, language_code, name, description, product_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createProductChannelListing = (values, response) => {
    client.query(`INSERT INTO ${db.product_productchannellisting} (publication_date, is_published, channel_id, product_id, discounted_price_amount, currency, visible_in_listings, available_for_purchase) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAssignedVariantAttribute = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_assignedvariantattribute} (variant_id, assignment_id) VALUES($1, $2) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAssignedVariantAttributeValue = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_assignedvariantattributevalue} (sort_order, assignment_id, value_id) VALUES($1, $2, $3) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createWarehouseStock = (values, response) => {
    client.query(`INSERT INTO ${db.warehouse_stock} (quantity, product_variant_id, warehouse_id, quantity_allocated) VALUES($1, $2, $3, $4) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createProductVariantTranslation = (values, response) => {
    client.query(`INSERT INTO ${db.product_productvarianttranslation} (language_code, name, product_variant_id) VALUES($1, $2, $3) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createProductVariantChannelListing = (values, response) => {
    client.query(`INSERT INTO ${db.product_productvariantchannellisting} (currency, price_amount, channel_id, variant_id, cost_price_amount, preorder_quantity_threshold) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAssignedPageAttribute = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_assignedpageattribute} (assignment_id, page_id) VALUES($1, $2) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAssignedPageAttributeValue = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_assignedpageattributevalue} (sort_order, assignment_id, value_id) VALUES($1, $2, $3) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAttributePage = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_attributepage} (sort_order, attribute_id, page_type_id) VALUES($1, $2, $3) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createPageType = (values, response) => {
    client.query(`INSERT INTO ${db.page_pagetype} (private_metadata, metadata, name, slug) VALUES($1, $2, $3, $4) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createPage = (values, response) => {
    client.query(`INSERT INTO ${db.page_page} (slug, title, content, created, is_published, publication_date, seo_description, seo_title, metadata, private_metadata, page_type_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAttributeTranslation = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_attributetranslation} (language_code, name, attribute_id) VALUES($1, $2, $3) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAttributeValueTranslation = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_attributevaluetranslation} (language_code, name, attribute_value_id, rich_text) VALUES($1, $2, $3, $4) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createProductMedia = (values, response) => {
    client.query(`INSERT INTO ${db.product_productmedia} (sort_order, image, ppoi, alt, type, external_url, oembed_data, product_id, to_remove) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createDigitalContent = (values, response) => {
    client.query(`INSERT INTO ${db.product_digitalcontent} (use_default_settings, automatic_fulfillment, content_type, content_file, max_downloads, url_valid_days, product_variant_id, metadata, private_metadata) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createDigitalContentUrl = (values, response) => {
    client.query(`INSERT INTO ${db.product_digitalcontenturl} (token, created, download_num, content_id, line_id) VALUES($1, $2, $3, $4, $5) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createShippingMethod = (values, response) => {
    client.query(`INSERT INTO ${db.shipping_shippingmethod} (name, maximum_order_weight, minimum_order_weight, type, shipping_zone_id, metadata, private_metadata, maximum_delivery_days, minimum_delivery_days, description) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createShippingMethodPostalCodeRule = (values, response) => {
    client.query(`INSERT INTO ${db.shipping_shippingmethodpostalcoderule} (start, end, shipping_method_id, inclusion_type) VALUES($1, $2, $3, $4) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createShippingZone = (values, response) => {
    client.query(`INSERT INTO ${db.shipping_shippingzone} (name, countries, "default", metadata, private_metadata, description) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createWarehouseShippingZone = (values, response) => {
    client.query(`INSERT INTO ${db.warehouse_warehouse_shipping_zones} (warehouse_id, shippingzone_id) VALUES($1, $2) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createShippingZoneChannel = (values, response) => {
    client.query(`INSERT INTO ${db.shipping_shippingzone_channels} (shippingzone_id, channel_id) VALUES($1, $2) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createShippingMethodTranslation = (values, response) => {
    client.query(`INSERT INTO ${db.shipping_shippingmethodtranslation} (language_code, name, shipping_method_id, description) VALUES($1, $2, $3, $4) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createShippingMethodExcludedProduct = (values, response) => {
    client.query(`INSERT INTO ${db.shipping_shippingmethod_excluded_products} (shippingmethod_id, product_id) VALUES($1, $2) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createWarehouse = (values, response) => {
    client.query(`INSERT INTO ${db.warehouse_warehouse} (id, name, email, address_id, slug, metadata, private_metadata, click_and_collect_option, is_private) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};






const updateProduct = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.product_product} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateProductVariant = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.product_productvariant} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateProductTranslation = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.product_producttranslation} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateProductChannelListing = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.product_productchannellisting} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateProductVariantChannelListing = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.product_productvariantchannellisting} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateProductType = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.product_producttype} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateAttributeProduct = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.attribute_attributeproduct} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateAttributeVariant = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.attribute_attributevariant} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateAttributeValue = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.attribute_attributevalue} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateStock = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.warehouse_stock} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateProductVariantTranslation = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.product_productvarianttranslation} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateAttribute = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.attribute_attribute} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateAttributeTranslation = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.attribute_attributetranslation} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateAttributeValueTranslation = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.attribute_attributevaluetranslation} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateProductMedia = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.product_productmedia} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateDigitalContent = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.product_digitalcontent} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateShippingZone = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.shipping_shippingzone} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateShippingMethod = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.shipping_shippingmethod} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateShippingMethodTranslation = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.shipping_shippingmethodtranslation} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateWarehouse = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.warehouse_warehouse} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};






const deleteAttributeValue = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_attributevalue} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteProductVariant = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.product_productvariant} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAssignedVariantAttribute = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_assignedvariantattribute} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAssignedVariantAttributeValue = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_assignedvariantattributevalue} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteProductTranslation = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.product_producttranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAssignedProductAttribute = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_assignedproductattribute} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAssignedProductAttributeValue = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_assignedproductattributevalue} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAttributeValueTranslation = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_attributevaluetranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAssignedPageAttributeValue = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_assignedpageattributevalue} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAttribute = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_attribute} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteDiscountVoucherProduct = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.discount_voucher_products} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteDiscountSaleProduct = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.discount_sale_products} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteProductCollectionProduct = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.product_collectionproduct} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteGiftCard = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.giftcard_giftcard} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteGiftCardEvent = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.giftcard_giftcardevent} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteGiftCardTags = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.giftcard_giftcard_tags} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteCheckoutGiftCards = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.checkout_checkout_gift_cards} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteProduct = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.product_product} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteProductMedia = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.product_productmedia} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteProductVariantChannelListing = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.product_productvariantchannellisting} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteProductChannelListing = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.product_productchannellisting} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteProductType = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.product_producttype} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAttributeVariant = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_attributevariant} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAttributeProduct = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_attributeproduct} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteProductVariantMedia = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.product_variantmedia} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteDigitalContentUrl = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.product_digitalcontenturl} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteDigitalContent = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.product_digitalcontent} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteDiscountVoucherVariants = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.discount_voucher_variants} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteDiscountSaleVariants = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.discount_sale_variants} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteWarehouseAllocation = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.warehouse_allocation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteWarehouseReservation = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.warehouse_reservation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteStock = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.warehouse_stock} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteCheckoutLine = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.checkout_checkoutline} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteProductVariantTranslation = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.product_productvarianttranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAttributeTranslation = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_attributetranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAttributePage = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_attributepage} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAssignedPageAttribute = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_assignedpageattribute} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteShippingMethodPostalCodeRule = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.shipping_shippingmethodpostalcoderule} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteShippingZoneWarehouse = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.warehouse_warehouse_shipping_zones} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteShippingMethodTranslation = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.shipping_shippingmethodtranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteShippingMethodChannelListing = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.shipping_shippingmethodchannellisting} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteShippingMethodExcludedProducts = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.shipping_shippingmethod_excluded_products} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteShippingZoneChannels = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.shipping_shippingzone_channels} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteShippingZone = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.shipping_shippingzone} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteShippingMethod = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.shipping_shippingmethod} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

module.exports = {
    stop,
    get,
    getProduct,
    getProductType,
    getAttribute,
    getAttributeProduct,
    getAttributeValue,
    getCategory,
    getCategoryTranslation,
    getProductTranslation,
    getProductVariant,
    getOrderLine,
    getProductVariantChannelListing,
    getAttributeAssignedVariantAttribute,
    getAttributeVariant,
    getAssignedVariantAttribute,
    getAssignedVariantAttributeValue,
    getDiscountSaleVariants,
    getDiscountSale,
    getDiscountSaleCategories,
    getDiscountSaleChannelListing,
    getDiscountSaleTranslation,
    getDiscountSaleCollection,
    getDiscountSaleProducts,
    getDiscountVoucher,
    getDiscountVoucherTranslation,
    getDiscountVoucherChannelListing,
    getDiscountVoucherCategories,
    getDiscountVoucherCollection,
    getDiscountVoucherProduct,
    getDiscountVoucherVariant,
    getPayment,
    getCheckout,
    getShippingMethod,
    getShippingMethodTranslationByShippingMethodId,
    getShippingMethodTranslation,
    getWarehouse,
    getGiftCardTags,
    getGiftCardTag,
    getGiftCard,
    getAppExtensions,
    getOrder,
    getOrderFulfillment,
    getOrderFulfillmentLine,
    getDigitalContentUrl,
    getDigitalContent,
    getPaymentTransaction,
    getCheckoutGiftCardsByCheckoutId,
    getStock,
    getShippingZone,
    getWarehouseShippingZones,
    getShippingZoneChannel,
    getShippingMethodPostalCodeRule,
    getCollection,
    getCollectionChannelListing,
    getSiteSettings,
    getCollectionTranslation,
    getProductMedia,
    getProductVariantTranslation,
    getCollectionProduct,
    getProductChannelListing,
    getAssignedProductAttribute,
    getAssignedProductAttributeValue,
    getAttributeValueTranslation,
    getAttributeTranslation,
    getMenu,
    getMenuItem,
    getMenuItemTranslation,
    getPage,
    getPageTranslation,
    getPageType,
    getAttributePage,
    getAssignedPageAttribute,
    getShippingMethodExcludedProducts,

    createPage,
    createProduct,
    createProductType,
    createAssignedProductAttribute,
    createAttribute,
    createAttributeProduct,
    createAssignedProductAttributeValue,
    createAttributeVariant,
    createProductVariant,
    createCollectionProduct,
    createAttributeValue,
    createProductTranslation,
    createProductChannelListing,
    createAssignedVariantAttribute,
    createAssignedVariantAttributeValue,
    createWarehouseStock,
    createProductVariantTranslation,
    createProductVariantChannelListing,
    createAssignedPageAttribute,
    createAssignedPageAttributeValue,
    createAttributePage,
    createPageType,
    createAttributeTranslation,
    createAttributeValueTranslation,
    createProductMedia,
    createDigitalContent,
    createDigitalContentUrl,
    createShippingMethod,
    createShippingMethodPostalCodeRule,
    createShippingZone,
    createWarehouseShippingZone,
    createShippingZoneChannel,
    createShippingMethodTranslation,
    createShippingMethodExcludedProduct,
    createWarehouse,

    updateProduct,
    updateProductVariant,
    updateProductTranslation,
    updateProductChannelListing,
    updateProductVariantChannelListing,
    updateProductType,
    updateAttributeProduct,
    updateAttributeVariant,
    updateAttributeValue,
    updateStock,
    updateProductVariantTranslation,
    updateAttribute,
    updateAttributeTranslation,
    updateAttributeValueTranslation,
    updateProductMedia,
    updateDigitalContent,
    updateShippingZone,
    updateShippingMethod,
    updateShippingMethodTranslation,
    updateWarehouse,

    deleteAttributeValue,
    deleteProductVariant,
    deleteAssignedVariantAttribute,
    deleteAssignedVariantAttributeValue,
    deleteProductTranslation,
    deleteAssignedProductAttribute,
    deleteAssignedProductAttributeValue,
    deleteAttributeValueTranslation,
    deleteAssignedPageAttributeValue,
    deleteDiscountVoucherProduct,
    deleteDiscountSaleProduct,
    deleteProductCollectionProduct,
    deleteGiftCard,
    deleteGiftCardEvent,
    deleteGiftCardTags,
    deleteCheckoutGiftCards,
    deleteProduct,
    deleteProductMedia,
    deleteProductVariantChannelListing,
    deleteProductChannelListing,
    deleteProductType,
    deleteAttributeVariant,
    deleteAttributeProduct,
    deleteProductVariantMedia,
    deleteDigitalContentUrl,
    deleteDigitalContent,
    deleteDiscountVoucherVariants,
    deleteDiscountSaleVariants,
    deleteWarehouseAllocation,
    deleteWarehouseReservation,
    deleteStock,
    deleteCheckoutLine,
    deleteProductVariantTranslation,
    deleteAttributeTranslation,
    deleteAttributePage,
    deleteAssignedPageAttribute,
    deleteAttribute,
    deleteShippingMethodPostalCodeRule,
    deleteShippingZoneWarehouse,
    deleteShippingMethodTranslation,
    deleteShippingMethodChannelListing,
    deleteShippingMethodExcludedProducts,
    deleteShippingZoneChannels,
    deleteShippingZone,
    deleteShippingMethod,
}