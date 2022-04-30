const express = require("express");
const router = express.Router();
const pgQueries = require('../../postgres/configurations-queries');
const voucher_codes = require('voucher-code-generator');

router.get("/generateDiscountCode", (req, res) => {
    let code = voucher_codes.generate({
        length: 10,
        count: 1
    });

    res.json({ status: "success", code: code[0].toUpperCase() });
});

router.post("/createLocale", (req, res) => {
    let locale = req.body.locale ?? null;
    let name = req.body.name ?? null;

    if(locale == null) return res.json({ status: "error", message: "Please enter the locale"});
    if(name == null) return res.json({ status: "error", message: "Please enter the name"});
    let values = [
        locale,
        name
    ];

    pgQueries.createLocale(values, result => {
        if(result.err){
            result.err.errorIndex = 1;
            return res.status(500).json(result.err);
        }

        res.json({ status: "success", message: "Locale created successfully"});
    });
});

router.put("/updateLocale/:id", (req, res) => {
    let locale_id = req.params.id;
    let locale = req.body.locale ?? null;
    let name = req.body.name ?? null;

    if(locale == null) return res.json({ status: "error", message: "Please enter the locale"});
    if(name == null) return res.json({ status: "error", message: "Please enter the name"});
    let values = [
        locale_id,
        locale,
        name
    ];

    pgQueries.updateLocale(values, result => {
        if(result.err){
            result.err.errorIndex = 2;
            return res.status(500).json(result.err);
        }

        res.json({ status: "success", message: "Locale updated successfully"});
    });
});

router.get("/getLocales", (req, res) => {
    pgQueries.getLocales(result => {
        if(result.err){
            result.err.errorIndex = 3;
            return res.status(500).json(result.err);
        }

        res.json(result.res);
    });
});












router.get("/getLanguageTranslations/locale_id/:locale_id", (req, res) => {
    let values = [
        req.params.locale_id
    ];
    pgQueries.getLanguageTranslations(values, result => {
        if(result.err){
            result.err.errorIndex = 0;
            return res.status(500).json(result.err);
        }

        res.json(result.res);
    });
});

router.post("/createLanguage", (req, res) => {
    let locale_id = req.body.locale_id ?? null;
    let language_id = req.body.language_id ?? null;
    let name = req.body.name ?? null;
    let locale = req.body.locale ?? null;
    let position = req.body.position ?? 0;

    if(locale_id == null) return res.json({ status: "error", message: "Please enter the locale_id"});
    if(locale == null) return res.json({ status: "error", message: "Please enter the locale"});
    if(name == null) return res.json({ status: "error", message: "Please enter the name"});
    
    if(language_id == null){
        let values = [
            position
        ];
    
        pgQueries.createLanguage(values, result => {
            if(result.err){
                result.err.errorIndex = 6;
                return res.status(500).json(result.err);
            }
    
            req.body.language_id = result.res.id;

            createLanguageTranslation(req, res);
        });
    }else{
        createLanguageTranslation(req, res);
    }
});

function createLanguageTranslation(req, res){
    let locale_id = req.body.locale_id ?? null;
    let language_id = req.body.language_id ?? null;
    let name = req.body.name ?? null;
    let locale = req.body.locale ?? null;

    let values = [
        language_id,
        locale_id,
        name,
        locale
    ];

    pgQueries.createLanguageTranslation(values, result => {
        if(result.err){
            result.err.errorIndex = 5;
            return res.status(500).json(result.err);
        }

        res.json(result.res);
    });
}

router.delete("/deleteLanguage/:id", (req, res) => {
    let values = [
        req.params.id
    ];

    pgQueries.deleteLanguageTranslations(values, result => {
        if(result.err){
            result.err.errorIndex = 7;
            return res.status(500).json(result.err);
        }

        pgQueries.deleteLanguage(values, result => {
            if(result.err){
                result.err.errorIndex = 8;
                return res.status(500).json(result.err);
            }

            res.json({ status: "success", message: "Language deleted successfully"});
        });
    });
});











router.get("/getCurrencyTranslations/locale_id/:locale_id", (req, res) => {
    let values = [
        req.params.locale_id
    ];
    pgQueries.getCurrencyTranslations(values, result => {
        if(result.err){
            result.err.errorIndex = -1;
            return res.status(500).json(result.err);
        }

        res.json(result.res);
    });
});

router.post("/createCurrency", (req, res) => {
    let locale_id = req.body.locale_id ?? null;
    let currency_id = req.body.currency_id ?? null;
    let name = req.body.name ?? null;
    let symbol = req.body.symbol ?? null;
    let code = req.body.code ?? null;
    let exchange_rate = req.body.exchange_rate ?? null;
    let position = req.body.position ?? 0;

    if(locale_id == null) return res.json({ status: "error", message: "Please enter the locale_id"});
    if(name == null) return res.json({ status: "error", message: "Please enter the name"});
    if(symbol == null) return res.json({ status: "error", message: "Please enter the symbol"});
    if(code == null) return res.json({ status: "error", message: "Please enter the code"});
    if(exchange_rate == null) return res.json({ status: "error", message: "Please enter the exchange_rate"});
    
    if(currency_id == null){
        let values = [
            position
        ];
    
        pgQueries.createCurrency(values, result => {
            if(result.err){
                result.err.errorIndex = 10;
                return res.status(500).json(result.err);
            }
    
            req.body.currency_id = result.res.id;

            createCurrencyTranslation(req, res);
        });
    }else{
        createCurrencyTranslation(req, res);
    }
});

function createCurrencyTranslation(req, res){
    let currency_id = req.body.currency_id ?? null;
    let locale_id = req.body.locale_id ?? null;
    let name = req.body.name ?? null;
    let symbol = req.body.symbol ?? null;
    let code = req.body.code ?? null;
    let exchange_rate = req.body.exchange_rate ?? null;

    let values = [
        currency_id,
        locale_id,
        name,
        symbol,
        code,
        exchange_rate
    ];

    pgQueries.createCurrencyTranslation(values, result => {
        if(result.err){
            result.err.errorIndex = 11;
            return res.status(500).json(result.err);
        }

        res.json(result.res);
    });
}

router.delete("/deleteCurrency/:id", (req, res) => {
    let values = [
        req.params.id
    ];

    pgQueries.deleteCurrencyTranslations(values, result => {
        if(result.err){
            result.err.errorIndex = 7;
            return res.status(500).json(result.err);
        }

        pgQueries.deleteCurrency(values, result => {
            if(result.err){
                result.err.errorIndex = 8;
                return res.status(500).json(result.err);
            }

            res.json({ status: "success", message: "Currency deleted successfully"});
        });
    });
});

router.put("/updateCurrencyTranslation/currency_translation_id/:id", (req, res) => {
    let currency_translation_id = req.params.id;
    let name = req.body.name ?? null;
    let symbol = req.body.symbol ?? null;
    let code = req.body.code ?? null;

    if(name == null) return res.json({ status: "error", message: "Please enter the name"});
    if(symbol == null) return res.json({ status: "error", message: "Please enter the symbol"});
    if(code == null) return res.json({ status: "error", message: "Please enter the code"});

    let values = [
        currency_translation_id,
        name,
        symbol,
        code
    ];

    pgQueries.updateCurrencyTranslation(values, result => {
        if(result.err){
            result.err.errorIndex = 2;
            return res.status(500).json(result.err);
        }

        res.json({ status: "success", message: "Currency update successfully"});
    });
});

router.put("/updateCurrencyTranslationExchangeRate/currency_translation_id/:id", (req, res) => {
    let currency_translation_id = req.params.id;
    let user_id = req.body.user_id ?? null;
    let exchange_rate = req.body.exchange_rate ?? null;

    if(user_id == null) return res.json({ status: "error", message: "Please enter the user_id"});
    if(exchange_rate == null) return res.json({ status: "error", message: "Please enter the exchange_rate"});

    let values = [
        currency_translation_id,
        "update",
        exchange_rate,
        user_id
    ];

    pgQueries.createExchangeRateUpdateLogs(values, result => {
        if(result.err){
            result.err.errorIndex = 14;
            return res.status(500).json(result.err);
        }

        values = [
            currency_translation_id,
            exchange_rate
        ];

        pgQueries.updateCurrencyTranslationExchangeRate(values, result => {
            if(result.err){
                result.err.errorIndex = 13;
                return res.status(500).json(result.err);
            }
    
            res.json({ status: "success", message: "Exchange rate updated successfully"});
        });
    });
});


router.post("/setAdminReferralVoucher", (req, res) => {
    let voucher_id = req.body.voucher_id ?? null;
    if(voucher_id == null) res.json({ status: "error", message: "Please enter the voucher id"});
    pgQueries.getConfigForSlug(["discount"], result => {
        if(result.err){
            result.err.errorIndex = 14;
            return res.status(500).json(result.err);
        }

        let discountConfig = result.res[0].metadata;

        if(discountConfig){
            discountConfig = JSON.parse(discountConfig);
            discountConfig.referralVoucherId = voucher_id;
        }else{
            discountConfig = {
                referralVoucherId: voucher_id
            };
        }

        let values = [
            "discount",
            JSON.stringify(discountConfig)
        ];

        pgQueries.updateConfigForSlug(values, result => {
            if(result.err){
                result.err.errorIndex = 15;
                return res.status(500).json(result.err);
            }

            res.json({status: "success", message: "referral voucher updated"});
        });
    });
});

router.post("/setAdminRewardVoucher", (req, res) => {
    let voucher_id = req.body.voucher_id ?? null;
    if(voucher_id == null) res.json({ status: "error", message: "Please enter the voucher id"});
    pgQueries.getConfigForSlug(["discount"], result => {
        if(result.err){
            result.err.errorIndex = 14;
            return res.status(500).json(result.err);
        }

        let discountConfig = result.res[0].metadata;

        if(discountConfig){
            discountConfig = JSON.parse(discountConfig);
            discountConfig.rewardVoucherId = voucher_id;
        }else{
            discountConfig = {
                rewardVoucherId: voucher_id
            };
        }

        let values = [
            "discount",
            JSON.stringify(discountConfig)
        ];

        pgQueries.updateConfigForSlug(values, result => {
            if(result.err){
                result.err.errorIndex = 15;
                return res.status(500).json(result.err);
            }

            res.json({status: "success", message: "reward voucher updated"});
        });
    });
});

module.exports = router;