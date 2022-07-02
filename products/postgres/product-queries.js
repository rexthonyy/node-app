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

const deleteAttributeValue = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.attribute_attributevalue} WHERE ${whereClause}`, values, (err, res) => {
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
    client.query(`DELETE FROM ${db.attribute_assignedvariantattribute} WHERE ${whereClause}`, values, (err, res) => {
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

module.exports = {
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
    getDiscountSaleChannelListing,
    getPayment,
    getCheckout,
    getShippingMethod,
    getShippingMethodTranslationByShippingMethodId,
    getWarehouse,
    getGiftCardTags,
    getGiftCardTag,
    getAppExtensions,

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

    updateProduct,
    updateProductVariant,
    updateProductTranslation,

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
}