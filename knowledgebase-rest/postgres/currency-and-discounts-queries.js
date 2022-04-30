const { Pool, Client } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'knowledgebase',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.log("currency_and_discounts database initialization failed!!!");
    }else{
        console.log("currency_and_discounts database initialized successfully!!!");
    }
});

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'currency_and_discounts',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});
client.connect();


const createCurrency = (values, response) => {
    client.query('INSERT INTO currency (name, slug, is_active, currency_code) VALUES($1, $2, $3, $4) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 11
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateCurrency = (values, response) => {
    client.query('UPDATE currency SET name=$2, slug=$3, is_active=$4, currency_code=$5 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 12
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteCurrency = (values, response) => {
    client.query('DELETE FROM currency WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 19
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getCurrencies = (response) => {
    pool.query("SELECT * from currency", (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 3844
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getCurrencyById = (id, response) => {
    pool.query(`SELECT * from currency WHERE id=${id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 3
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};





const createDiscountVoucher = (values, response) => {
    client.query('INSERT INTO discount_voucher (type, name, code, usage_limit, used, start_date, end_date, discount_value_type, apply_once_per_order, countries, min_checkout_items_quantity, apply_once_per_customer, only_for_staff, metadata, private_metadata) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 11
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createDiscountVoucherCurrencyListing = (values, response) => {
    client.query('INSERT INTO discount_vouchercurrencylisting (discount_value, currency, min_spent_amount, currency_id, voucher_id) VALUES($1, $2, $3, $4, $5) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 42
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getVoucherDiscounts = (response) => {
    pool.query("SELECT * from discount_voucher", (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 318414
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateDiscountVoucher = (values, response) => {
    client.query('UPDATE discount_voucher SET type=$2, name=$3, code=$4, usage_limit=$5, used=$6, start_date=$7, end_date=$8, discount_value_type=$9, apply_once_per_order=$10, countries=$11, min_checkout_items_quantity=$12, apply_once_per_customer=$13, only_for_staff=$14, metadata=$15, private_metadata=$16 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 202
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteAllDiscountVoucherCurrencyListing = (values, response) => {
    client.query('DELETE FROM discount_vouchercurrencylisting WHERE voucher_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 201
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteAllDiscountVoucherCategories = (values, response) => {
    client.query('DELETE FROM discount_voucher_categories WHERE voucher_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 23422
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteAllDiscountVoucherCollections = (values, response) => {
    client.query('DELETE FROM discount_voucher_collections WHERE voucher_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 2342
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteAllDiscountVoucherProducts = (values, response) => {
    client.query('DELETE FROM discount_voucher_products WHERE voucher_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 2341
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createDiscountVoucherCategory = (values, response) => {
    client.query('INSERT INTO discount_voucher_categories (voucher_id, category_id) VALUES($1, $2) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 71
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createDiscountVoucherCollection = (values, response) => {
    client.query('INSERT INTO discount_voucher_collections (voucher_id, collection_id) VALUES($1, $2) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 71
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createDiscountVoucherProduct = (values, response) => {
    client.query('INSERT INTO discount_voucher_products (voucher_id, product_id) VALUES($1, $2) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 71
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteDiscountVoucher = (values, response) => {
    client.query('DELETE FROM discount_voucher WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 109
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getUserGeneratedVouchersByUserId = (values, response) => {
    pool.query("SELECT * from user_generated_vouchers WHERE user_id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 3114
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createUserGeneratedVoucher = (values, response) => {
    client.query('INSERT INTO user_generated_vouchers (user_id, code) VALUES($1, $2) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 72
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

module.exports = {
    createCurrency,
    updateCurrency,
    deleteCurrency,
    getCurrencies,
    getCurrencyById,

    createDiscountVoucher,
    createDiscountVoucherCurrencyListing,
    getVoucherDiscounts,
    updateDiscountVoucher,
    deleteAllDiscountVoucherCurrencyListing,
    deleteAllDiscountVoucherCategories,
    deleteAllDiscountVoucherCollections,
    deleteAllDiscountVoucherProducts,

    createDiscountVoucherCategory,
    createDiscountVoucherCollection,
    createDiscountVoucherProduct,
    deleteDiscountVoucher,

    getUserGeneratedVouchersByUserId,
    createUserGeneratedVoucher
}