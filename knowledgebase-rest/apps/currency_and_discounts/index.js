const express = require("express");
const router = express.Router();
const pgQueries = require('../../postgres/currency-and-discounts-queries');
const voucher_codes = require('voucher-code-generator');

// previously called createChannel
router.post("/createCurrency", (req, res) => {
    let name = req.body.name ?? null;
    let slug = req.body.slug ?? null;
    let currency = req.body.currency ?? null;

    if(name == null) return res.json({ status: "error", message: "Please enter the name"});
    if(slug == null) return res.json({ status: "error", message: "Please enter the slug"});
    if(currency == null) return res.json({ status: "error", message: "Please enter the currency"});

    let values = [
        name,
        slug,
        true,
        currency
    ];

    pgQueries.createCurrency(values, result => {
        if(result.err){
            result.err.errorIndex = 3821;
            return res.status(500).json(result.err);
        }

        res.json(result.res);
    });
});

router.put("/updateCurrency", (req, res) => {
    let id = req.body.id ?? null;
    let name = req.body.name ?? null;
    let slug = req.body.slug ?? null;
    let is_active = req.body.is_active ? req.body.is_active == "true" : false;
    let currency = req.body.currency ?? null;

    if(id == null) return res.json({ status: "error", message: "Please enter the id"});
    if(name == null) return res.json({ status: "error", message: "Please enter the name"});
    if(slug == null) return res.json({ status: "error", message: "Please enter the slug"});
    if(currency == null) return res.json({ status: "error", message: "Please enter the currency"});

    let values = [
        id,
        name,
        slug,
        is_active,
        currency
    ];

    pgQueries.updateCurrency(values, result => {
        if(result.err){
            result.err.errorIndex = 38212;
            return res.status(500).json(result.err);
        }

        res.json({ status: "success", message: "Currency updated" });
    });
});

router.delete("/deleteCurrency/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id
    ];

    pgQueries.deleteCurrency(values, result => {
        if(result.err){
            result.err.errorIndex = 318212;
            return res.status(500).json(result.err);
        }

        res.json({status: "currency deleted"});
    });
});

router.get("/getCurrencies", (req, res) => {
    pgQueries.getCurrencies(result => {
        if(result.err){
            result.err.errorIndex = 318212;
            return res.status(500).json(result.err);
        }

        res.json(result.res);
    });
});








router.post("/createVoucherDiscount", (req, res) => {
    let type = req.body.type ?? null;
    let name = req.body.name ?? null;
    let code = req.body.code ?? null;
    let usage_limit = req.body.usage_limit ?? null;
    let used = req.body.used ?? null;
    let start_date = req.body.start_date ?? null;
    let end_date = req.body.end_date ?? null;
    let discount_value_type = req.body.discount_value_type ?? null;
    let apply_once_per_order = req.body.apply_once_per_order ?? null;
    let countries = req.body.countries ?? null;
    let min_checkout_items_quantity = req.body.min_checkout_items_quantity ?? null;
    let apply_once_per_customer = req.body.apply_once_per_customer ?? null;
    let only_for_staff = req.body.only_for_staff ?? null;
    let currency_discount_values = req.body.currency_discount_values ?? [];
    let metadata = req.body.metadata ?? {};
    let private_metadata = req.body.private_metadata ?? {};

    if(type == null) return res.json({ status: "error", message: "Please enter the type"});
    if(code == null) return res.json({ status: "error", message: "Please enter the code"});
    if(used == null) return res.json({ status: "error", message: "Please enter the used"});
    if(start_date == null) return res.json({ status: "error", message: "Please enter the start_date"});
    if(discount_value_type == null) return res.json({ status: "error", message: "Please enter the discount_value_type"});
    if(apply_once_per_order == null) return res.json({ status: "error", message: "Please enter the apply_once_per_order"});
    if(countries == null) return res.json({ status: "error", message: "Please enter the countries"});
    if(apply_once_per_customer == null) return res.json({ status: "error", message: "Please enter the apply_once_per_customer"});
    if(only_for_staff == null) return res.json({ status: "error", message: "Please enter the only_for_staff"});
    if(!["percentage","fixed"].find(type => type == discount_value_type)) return res.json({ status: "error", message: "Please specify either percentage or fixed for the discount value type"});
    if(currency_discount_values.length == 0) return res.json({ status: "error", message: "Please specify the currencies that you will like to provide discounts"});

    let start_date_utcstring = new Date(start_date).toUTCString()
    let end_date_utcstring = end_date ? new Date(end_date).toUTCString() : null;

    let values = [
        type,
        name,
        code,
        usage_limit,
        used,
        start_date_utcstring,
        end_date_utcstring,
        discount_value_type,
        apply_once_per_order == "true",
        countries,
        min_checkout_items_quantity,
        apply_once_per_customer == "true",
        only_for_staff == "true",
        metadata,
        private_metadata
    ];

    pgQueries.createDiscountVoucher(values, result => {
        if(result.err){
            result.err.errorIndex = 3821;
            return res.status(500).json(result.err);
        }

        let voucher = result.res;
        let voucher_id = voucher.id;

        let numDiscountCurrencyValues = currency_discount_values.length;
        let count = -1;

        currency_discount_values.forEach(discount => {
            pgQueries.getCurrencyById(discount.currency_id, result => {
                if(result.err){
                    result.err.errorIndex = 1;
                    return res.status(500).json(result.err);
                }

                if(result.res.length == 0) return res.status(401).json({ status: "error", message: "Malformed request: currency_id does not exist" });

                let currency_code = result.res[0].currency_code;

                values = [
                    discount.discount_value,
                    currency_code,
                    null,
                    discount.currency_id,
                    voucher_id
                ];

                pgQueries.createDiscountVoucherCurrencyListing(values, result => {
                    if(result.err){
                        result.err.errorIndex = 18;
                        return res.status(500).json(result.err);
                    }

                    checkComplete();
                });
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numDiscountCurrencyValues){
                res.json({ status: "success", voucher });
            }
        }
    });
});

router.get("/getVoucherDiscounts", (req, res) => {
    pgQueries.getVoucherDiscounts(result => {
        if(result.err){
            result.err.errorIndex = 319821;
            return res.status(500).json(result.err);
        }

        res.json(result.res);
    });
});

router.put("/updateVoucherDiscount/:voucher_id", (req, res) => {
    let voucher_id = req.params.voucher_id;
    let type = req.body.type ?? null;
    let name = req.body.name ?? null;
    let code = req.body.code ?? null;
    let usage_limit = req.body.usage_limit ?? null;
    let used = req.body.used ?? null;
    let start_date = req.body.start_date ?? null;
    let end_date = req.body.end_date ?? null;
    let discount_value_type = req.body.discount_value_type ?? null;
    let apply_once_per_order = req.body.apply_once_per_order ?? null;
    let countries = req.body.countries ?? null;
    let min_checkout_items_quantity = req.body.min_checkout_items_quantity ?? null;
    let apply_once_per_customer = req.body.apply_once_per_customer ?? null;
    let only_for_staff = req.body.only_for_staff ?? null;
    let currency_discount_values = req.body.currency_discount_values ?? [];
    let category_discount_values = req.body.category_discount_values ?? [];
    let collection_discount_values = req.body.collection_discount_values ?? [];
    let product_discount_values = req.body.product_discount_values ?? [];
    let metadata = req.body.metadata ?? {};
    let private_metadata = req.body.private_metadata ?? {};

    if(type == null) return res.json({ status: "error", message: "Please enter the type"});
    if(code == null) return res.json({ status: "error", message: "Please enter the code"});
    if(used == null) return res.json({ status: "error", message: "Please enter the used"});
    if(start_date == null) return res.json({ status: "error", message: "Please enter the start_date"});
    if(discount_value_type == null) return res.json({ status: "error", message: "Please enter the discount_value_type"});
    if(apply_once_per_order == null) return res.json({ status: "error", message: "Please enter the apply_once_per_order"});
    if(countries == null) return res.json({ status: "error", message: "Please enter the countries"});
    if(apply_once_per_customer == null) return res.json({ status: "error", message: "Please enter the apply_once_per_customer"});
    if(only_for_staff == null) return res.json({ status: "error", message: "Please enter the only_for_staff"});
    if(!["percentage","fixed"].find(type => type == discount_value_type)) return res.json({ status: "error", message: "Please specify either percentage or fixed for the discount value type"});
    if(currency_discount_values.length == 0) return res.json({ status: "error", message: "Please specify the currencies that you will like to provide discounts"});

    let start_date_utcstring = new Date(start_date).toUTCString()
    let end_date_utcstring = end_date ? new Date(end_date).toUTCString() : null;

    let values = [
        voucher_id,
        type,
        name,
        code,
        usage_limit,
        used,
        start_date_utcstring,
        end_date_utcstring,
        discount_value_type,
        apply_once_per_order == "true",
        countries,
        min_checkout_items_quantity,
        apply_once_per_customer == "true",
        only_for_staff == "true",
        metadata,
        private_metadata
    ];


    pgQueries.updateDiscountVoucher(values, result => {
        if(result.err){
            result.err.errorIndex = 3821;
            return res.status(500).json(result.err);
        }

        values = [
            voucher_id
        ];

        pgQueries.deleteAllDiscountVoucherCurrencyListing(values, result => {
            if(result.err){
                result.err.errorIndex = 31;
                return res.status(500).json(result.err);
            }

            pgQueries.deleteAllDiscountVoucherCategories(values, result => {
                if(result.err){
                    result.err.errorIndex = 23;
                    return res.status(500).json(result.err);
                }

                pgQueries.deleteAllDiscountVoucherCollections(values, result => {
                    if(result.err){
                        result.err.errorIndex = 238;
                        return res.status(500).json(result.err);
                    }

                    pgQueries.deleteAllDiscountVoucherProducts(values, result => {
                        if(result.err){
                            result.err.errorIndex = 113;
                            return res.status(500).json(result.err);
                        }

                        let numDiscountCurrencyValues = currency_discount_values.length;
                        let count = -1;
            
                        currency_discount_values.forEach(discount => {
                            pgQueries.getCurrencyById(discount.currency_id, result => {
                                if(result.err){
                                    result.err.errorIndex = 41;
                                    return res.status(500).json(result.err);
                                }
            
                                if(result.res.length == 0) return res.status(401).json({ status: "error", message: "Malformed request: currency_id does not exist" });
            
                                let currency_code = result.res[0].currency_code;
            
                                values = [
                                    discount.discount_value,
                                    currency_code,
                                    null,
                                    discount.currency_id,
                                    voucher_id
                                ];
            
                                pgQueries.createDiscountVoucherCurrencyListing(values, result => {
                                    if(result.err){
                                        result.err.errorIndex = 212;
                                        return res.status(500).json(result.err);
                                    }
            
                                    checkComplete();
                                });
                            });
                        });
            
                        checkComplete();
            
                        function checkComplete(){
                            count++;
                            if(count == numDiscountCurrencyValues){
                                let numDiscountCategoryValues = category_discount_values.length;
                                count = -1;
            
                                category_discount_values.forEach(category_id => {
                                    values = [
                                        voucher_id,
                                        category_id
                                    ];
                
                                    pgQueries.createDiscountVoucherCategory(values, result => {
                                        if(result.err){
                                            result.err.errorIndex = 22;
                                            return res.status(500).json(result.err);
                                        }
                
                                        checkComplete1();
                                    });
                                });
            
                                checkComplete1();
            
                                function checkComplete1(){
                                    count++;
                                    if(count == numDiscountCategoryValues){
                                        let numDiscountCollectionValues = collection_discount_values.length;
                                        count = -1;
                    
                                        collection_discount_values.forEach(collection_id => {
                                            values = [
                                                voucher_id,
                                                collection_id
                                            ];
                        
                                            pgQueries.createDiscountVoucherCollection(values, result => {
                                                if(result.err){
                                                    result.err.errorIndex = 2222;
                                                    return res.status(500).json(result.err);
                                                }
                        
                                                checkComplete2();
                                            });
                                        });
                    
                                        checkComplete2();
                    
                                        function checkComplete2(){
                                            count++;
                                            if(count == numDiscountCollectionValues){
                                                
                                                let numDiscountProductValues = product_discount_values.length;
                                                count = -1;
                            
                                                product_discount_values.forEach(product_id => {
                                                    values = [
                                                        voucher_id,
                                                        product_id
                                                    ];
                                
                                                    pgQueries.createDiscountVoucherProduct(values, result => {
                                                        if(result.err){
                                                            result.err.errorIndex = 2022;
                                                            return res.status(500).json(result.err);
                                                        }
                                
                                                        checkComplete3();
                                                    });
                                                });
                            
                                                checkComplete3();
                            
                                                function checkComplete3(){
                                                    count++;
                                                    if(count == numDiscountProductValues){
                                                        res.json({ status: "success", message: "Voucher discount successfully updated" });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                });
            });
        });
    });
});

router.delete("/deleteVoucherDiscount", (req, res) => {
    let voucher_ids = req.body.voucher_ids ?? [];

    let numVoucherIds = voucher_ids.length;
    let count = -1;

    let values = [];

    voucher_ids.forEach(voucher_id => {
        values = [
            voucher_id
        ];

        pgQueries.deleteAllDiscountVoucherCurrencyListing(values, result => {
            if(result.err){
                result.err.errorIndex = 3;
                return res.status(500).json(result.err);
            }

            pgQueries.deleteAllDiscountVoucherCategories(values, result => {
                if(result.err){
                    result.err.errorIndex = 23;
                    return res.status(500).json(result.err);
                }

                pgQueries.deleteAllDiscountVoucherCollections(values, result => {
                    if(result.err){
                        result.err.errorIndex = 238;
                        return res.status(500).json(result.err);
                    }

                    pgQueries.deleteAllDiscountVoucherProducts(values, result => {
                        if(result.err){
                            result.err.errorIndex = 113;
                            return res.status(500).json(result.err);
                        }

                        pgQueries.deleteDiscountVoucher(values, result => {
                            if(result.err){
                                result.err.errorIndex = 921;
                                return res.status(500).json(result.err);
                            }
                            checkComplete();
                        });
                    });
                });
            });
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(count == numVoucherIds){
            res.json({ status: "success", message: "Voucher discount deleted successfully "});
        }
    }
});



router.get("/generateUserDiscountCode/:user_id", (req, res) => {
    // if admin has enabled the discount code
    // how to check if a user has access to a discount code
    let user_id = req.params.user_id;

    // first check if user_id already has a code
    let values = [
        user_id
    ];

    pgQueries.getUserGeneratedVouchersByUserId(values, result => {
        if(result.err){
            result.err.errorIndex = 31821;
            return res.status(500).json(result.err);
        }

        if(result.res.length > 0) return res.json({ status: "success", code: result.res[0].code});

        let code = voucher_codes.generate({
            length: 10,
            count: 1
        })[0].toUpperCase();
        
        values = [
            user_id,
            code
        ]

        pgQueries.createUserGeneratedVoucher(values, result => {
            if(result.err){
                result.err.errorIndex = 3121;
                return res.status(500).json(result.err);
            }

            res.json({ status: "success", code});
        });
    });
});

module.exports = router;