const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLGiftCardById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");
const voucher_codes = require('voucher-code-generator');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID"));

        let accessPermissions = ["MANAGE_GIFT_CARD"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await giftCardBulkCreate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_GIFT_CARD", "INVALID"));
        }
    });
}

function getGraphQLOutput(field, message, code, tags, giftCards, count = 0) {
    return {
        errors: [{
            field,
            message,
            code,
            tags
        }],
        giftCards,
        count
    }
}

function giftCardBulkCreate(authUser, args) {
    return new Promise(async resolve => {
        let giftCards = [];
        let errors = [];
        for (let i = 0; i < args.input.count; i++) {
            try {
                let { err, giftCard_ } = await giftCardCreate(authUser, args);
                errors = errors.concat(err);
                giftCard.push(giftCard_);
            } catch (err) {
                errors = errors.concat(err);
            }
        }
        resolve({
            errors,
            giftCards,
            count: giftCards.length
        });
    });
}

function giftCardCreate(authUser, args) {
    return new Promise(async resolve => {
        let { values, entry, holder } = await getGiftCardCreateInput(authUser, args.input);
        productQueries.createGiftCard(values, entry, holder, async result => {
            if (result.err) return resolve(getGraphQLOutput("createGiftCard", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return resolve(getGraphQLOutput("createGiftCard", "GiftCard not created", "GRAPHQL_ERROR"));
            let giftCard_ = result.res[0];
            let tags = args.input.tags;
            let giftCard;
            let errors = [];
            try {
                await addTags(giftCard_.id, tags);
            } catch (err) {
                errors = errors.concat(err);
            }
            try {
                await addEvent(authUser, giftCard_.id, args);
            } catch (err) {
                errors = errors.concat(err);
            }

            try {
                giftCard = await getGraphQLGiftCardById(giftCard_.id);
            } catch (err) {
                errors.push(getGraphQLOutput("getGraphQLGiftCardById", err, "NOT_FOUND", tags).errors[0]);
            }

            resolve({
                errors,
                giftCard
            });
        });
    });
}

function getGiftCardCreateInput(authUser, input) {
    return new Promise(async resolve => {
        let expiryDate = input.expiryDate;
        let startDate = input.startDate || new Date().toUTCString();
        let currency = input.balance.currency;
        let amount = input.balance.amount;
        let isActive = input.isActive;
        let code;

        let values = [];
        let entry = "";
        let holder = "";
        let cursor = 0;

        if (expiryDate != null) {
            values.push(expiryDate);
            entry += entry ? ", " : "";
            holder += holder ? ", " : "";
            entry += "expiry_date";
            holder += `$${++cursor}`;
        }
        if (startDate != null) {
            values.push(startDate);
            entry += entry ? ", " : "";
            holder += holder ? ", " : "";
            entry += "created";
            holder += `$${++cursor}`;
        }
        if (amount != null) {
            values.push(amount);
            entry += entry ? ", " : "";
            holder += holder ? ", " : "";
            entry += "initial_balance_amount";
            holder += `$${++cursor}`;
        }
        if (amount != null) {
            values.push(amount);
            entry += entry ? ", " : "";
            holder += holder ? ", " : "";
            entry += "current_balance_amount";
            holder += `$${++cursor}`;
        }
        if (currency != null) {
            values.push(currency);
            entry += entry ? ", " : "";
            holder += holder ? ", " : "";
            entry += "currency";
            holder += `$${++cursor}`;
        }
        if (isActive != null) {
            values.push(isActive);
            entry += entry ? ", " : "";
            holder += holder ? ", " : "";
            entry += "is_active";
            holder += `$${++cursor}`;
        }

        do {
            try {
                code = await getGiftCardCode();
                break;
            } catch (err) {
                continue;
            }
        } while (true);

        values.push(code);
        entry += entry ? ", " : "";
        holder += holder ? ", " : "";
        entry += "code";
        holder += `$${++cursor}`;

        values.push(authUser.id);
        entry += entry ? ", " : "";
        holder += holder ? ", " : "";
        entry += "created_by_id";
        holder += `$${++cursor}`;

        values.push(JSON.stringify({}));
        entry += entry ? ", " : "";
        holder += holder ? ", " : "";
        entry += "metadata";
        holder += `$${++cursor}`;

        values.push(JSON.stringify({}));
        entry += entry ? ", " : "";
        holder += holder ? ", " : "";
        entry += "private_metadata";
        holder += `$${++cursor}`;

        return resolve({ values, entry, holder });
    });
}

function getGiftCardCode() {
    return new Promise((resolve, reject) => {
        let code = voucher_codes.generate({
            length: 10,
            count: 1
        })[0].toUpperCase();

        productQueries.getGiftCard([code], "code=$1", result => {
            if (result.err) return reject(code);
            if (result.res.length > 0) return reject(code);
            resolve(code);
        });
    });
}

function addTags(giftCardId, giftCardTags) {
    return new Promise((resolve, reject) => {
        if (!giftCardTags) return resolve();
        const numTags = giftCardTags.length;
        let errors = [];
        let cursor = -1;

        giftCardTags.forEach(async tag => {
            try {
                await resolveGiftCardTag(giftCardId, tag);
            } catch (err) {
                errors = errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numTags) {
                if (errors.length > 0) return reject(errors);
                resolve();
            }
        }
    });
}

function resolveGiftCardTag(giftCardId, tag) {
    return new Promise((resolve, reject) => {
        productQueries.getGiftCardTag([tag], "name=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("getGiftCardTag", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            let giftCardTag_;
            if (result.res.length == 0) {
                try {
                    giftCardTag_ = await createGiftCardTag(tag);
                } catch (err) {
                    return reject(getGraphQLOutput("getGiftCardTag", err, "GRAPHQL_ERROR").errors);
                }
            } else {
                giftCardTag_ = result.res[0];
            }

            productQueries.getGiftCardTags([giftCardId, giftCardTag_.id], "giftcard_id=$1 AND giftcardtag_id=$2", result => {
                if (result.err) return reject(getGraphQLOutput("getGiftCardTag", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                if (result.res.length > 0) return reject(getGraphQLOutput("getGiftCardTag", `Gift card already exists: ${tag}`, "ALREADY_EXISTS").errors);
                productQueries.createGiftCardTags([giftCardId, giftCardTag_.id], "giftcard_id, giftcardtag_id", "$1, $2", result => {
                    if (result.err) return reject(getGraphQLOutput("createGiftCardTags", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                    if (result.res.length == 0) return reject(getGraphQLOutput("createGiftCardTags", `Gift card tag not assigned : ${tag}`, "GRAPHQL_ERROR").errors);
                    resolve();
                });
            });
        });
    });
}

function createGiftCardTag(tag) {
    return new Promise(async(resolve, reject) => {
        productQueries.createGiftCardTag([tag], "name", "$1", result => {
            if (result.err) return reject(getGraphQLOutput("createGiftCardTag", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("createGiftCardTag", `gift card tag not created: ${tag}`, "GRAPHQL_ERROR").errors);
            resolve(result.res[0]);
        });
    });
}

function addEvent(authUser, giftCardId, args) {
    return new Promise(async(resolve, reject) => {
        let { values, entry, holder } = getGiftCardCreateEventInput(authUser, giftCardId, args.input);
        productQueries.createGiftCardEvent(values, entry, holder, async result => {
            if (result.err) return reject(getGraphQLOutput("createGiftCardEvent", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("createGiftCardEvent", "GiftCard event not created", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}


function getGiftCardCreateEventInput(authUser, giftCardId, input) {

    let expiryDate = input.expiryDate;
    let endDate = input.endDate;

    expiryDate = expiryDate ? expiryDate : endDate;

    let parameters = {
        balance: {
            currency: input.balance.currency,
            current_balance: input.balance.amount,
            initial_balance: input.balance.amount
        },
        expiry_date: expiryDate
    };

    let values = [
        new Date().toUTCString(),
        "ISSUED",
        JSON.stringify(parameters),
        giftCardId,
        authUser.id
    ];
    let entry = `"date",type,parameters,gift_card_id,user_id`;
    let holder = "$1,$2,$3,$4,$5";
    return { values, entry, holder };
}